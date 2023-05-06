from django.urls import include, path
from django.contrib import admin


urlpatterns = [
    path("api/", include("laughingpotato.api.urls")),
    path("admin/", admin.site.urls),
    # re_path(r"", include("laughingpotato.frontend.urls")),
]
