import os
import logging

from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import HttpResponse
from django.template import loader
from django.conf import settings

DIR = os.path.dirname(__file__)

logger = logging.getLogger(__name__)

login_maybe_required = (
    (lambda func: func) if settings.ANONYMOUS_USER else login_required
)


@login_maybe_required
@ensure_csrf_cookie
def specify(request):
    resp = loader.get_template("specify.html").render(
        {
            "use_raven": settings.RAVEN_CONFIG is not None,
        }
    )
    return HttpResponse(resp)


@login_maybe_required
def api_schema(request):
    return render(
        request,
        "swagger-ui.html",
        dict(
            open_api_schema_endpoint="/api/specify_schema/openapi.json",
        ),
    )


@login_maybe_required
def api_endpoints(request):
    return render(
        request,
        "swagger-ui.html",
        dict(
            open_api_schema_endpoint="/context/api_endpoints.json",
        ),
    )

@login_maybe_required
def api_endpoints_all(request):
    return render(
        request,
        "swagger-ui.html",
        dict(
            open_api_schema_endpoint="/context/api_endpoints_all.json",
        ),
    )
