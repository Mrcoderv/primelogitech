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
    """Respond with ``200 OK`` to Render's internal health probes."""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Render free-tier probes hit these paths with an invalid Host header.
        # Return 200 *before* Django's ALLOWED_HOSTS check.
        if request.path in ("/", "/api/", "/api/site-content/"):
            return HttpResponse("OK", status=200)
        return self.get_response(request)