"""
Health-check & Host-header middleware for Render free-tier deployments.

Render's internal proxy forwards **all** requests to the container with
an internal IP address (e.g. 10.x.x.x) as the ``Host`` header.  Django's
:class:`~django.middleware.common.CommonMiddleware` (or the internal
``ALLOWED_HOSTS`` validation) then rejects **every** request with a
``400 Bad Request``, including legitimate API calls from the frontend.


This middleware does two things, both **before** the host validation runs
(by being placed **first** in ``MIDDLEWARE``):

1. **Short-circuits health probes** – paths ``/`` and ``/api/`` (which are
   *only* used by Render's internal proxy, never by the frontend) always
   return ``200 OK`` so the deploy health check succeeds.

2. **Rewrites the Host header** – for every other request passing through,
   the internal ``Host`` header is replaced with the real public hostname
   (``RENDER_EXTERNAL_HOSTNAME``, an env-var that Render sets
   automatically).  Subsequent middleware then see a hostname that matches
   ``ALLOWED_HOSTS`` and let the request through.
"""

import os

from django.http import HttpResponse


class HealthCheckMiddleware:
    """Respond with ``200 OK`` to health probes **and** rewrite the ``Host``
    header for all other requests proxied through Render.

    Without the Host rewrite, **every** API call from the frontend would be
    rejected with ``400`` because Render's proxy replaces the original
    ``Host`` with an internal IP address (e.g. ``127.0.0.1`` or ``10.x.x.x``).
    """

    #: Set of internal hosts / prefixes that indicate the request arrived
    #: through Render's proxy and needs its Host header rewritten.
    _INTERNAL_HOSTS = frozenset(("127.0.0.1", "0.0.0.0", "localhost"))

    def __init__(self, get_response):
        self.get_response = get_response
        # Resolve the public hostname once at startup (it won't change).
        self._public_host = os.environ.get(
            "RENDER_EXTERNAL_HOSTNAME",
            "",  # empty when running locally
        )

    def __call__(self, request):
        # ── 1. Health-check paths (short-circuit) ──────────────────────
        if request.path in ("/", "/api/"):
            return HttpResponse("OK", status=200)

        # ── /api/site-content/ is a real endpoint but Render also probes it ──
        if request.path == "/api/site-content/":
            user_agent = request.META.get("HTTP_USER_AGENT", "")
            if "Render" in user_agent:
                return HttpResponse("OK", status=200)

        # ── 2. Rewrite Host header (production only) ──────────────────
        if self._public_host:
            host = request.META.get("HTTP_HOST", "")
            # Strip port number (e.g. "127.0.0.1:8000" → "127.0.0.1")
            host_without_port = host.split(":")[0] if ":" in host else host

            if (
                host_without_port in self._INTERNAL_HOSTS
                or host_without_port.startswith("10.")
            ):
                request.META["HTTP_HOST"] = self._public_host

        return self.get_response(request)