from django.urls import re_path

from . import views

urlpatterns = [
    re_path(
        ".*", views.index
    ),  # regex matches, then lets routing be handled by the frontend. Still needs a / at end.
]
