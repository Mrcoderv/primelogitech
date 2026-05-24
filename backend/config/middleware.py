"""
Health-check middleware for Render free-tier deployments.

Render's internal proxy sends periodic requests to both ``/`` and ``/api/``
using an internal IP address (e.g. 10.x.x.x) as the ``Host`` header.  Django's
:class:`~django.middleware.common.CommonMiddleware` (or the internal
``ALLOWED_HOSTS`` validation) rejects these requests with a ``400 Bad Request``,
which causes Render to think the health check has failed and eventually time
out the deploy.

This middleware catches those requests **before** the host validation runs
(by being placed **first** in ``MIDDLEWARE``) and returns a trivial ``200 OK``
so that Render's health probe succeeds.
"""

from django.http import HttpResponse


class HealthCheckMiddleware:
    """Respond with ``200 OK`` to Render's internal health probes.

    Render free-tier sends probes with ``User-Agent: Render/1.0`` to paths
    like ``/api/`` and ``/`` using an internal IP as the ``Host`` header.
    This middleware returns ``200`` for those requests **before** Django's
    ``ALLOWED_HOSTS`` validation rejects them (which would produce a ``400``
    that Render interprets as a failed health check).

    Legitimate client requests (without the Render user-agent) pass through
    to the normal Django pipeline untouched.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Only intercept Render health probes on known health-check paths.
        if request.path in ("/", "/api/", "/api/site-content/"):
            user_agent = request.META.get("HTTP_USER_AGENT", "")
            if "Render" in user_agent:
                return HttpResponse("OK", status=200)
        return self.get_response(request)