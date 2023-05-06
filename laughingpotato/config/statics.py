import os

import environ

# Set the project base directory

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
env = environ.Env(
    LAUGHINGPOTATO_BASE_URL=(str, "/"),
    LAUGHINGPOTATO_STATIC_URL=(str, "static/"),
    LAUGHINGPOTATO_STATIC_ROOT=(str, os.path.join(BASE_DIR, "static")),
    LAUGHINGPOTATO_MEDIA_ROOT=(str, os.path.join(BASE_DIR, "tmp/media")),
    LAUGHINGPOTATO_MEDIA_URL=(str, "media/"),
)

# Take environment variables from .env file
environ.Env.read_env(os.path.join(BASE_DIR, ".env"))
BASE_URL = ("/" + env("LAUGHINGPOTATO_BASE_URL").strip("/")).strip("/").replace("//", "/")
STATIC_URL = (
        "/"
        + env("LAUGHINGPOTATO_BASE_URL").strip("/")
        + "/"
        + env("LAUGHINGPOTATO_STATIC_URL").strip("/")
        + "/"
).replace("//", "/")
MEDIA_URL = (
        "/"
        + env("LAUGHINGPOTATO_BASE_URL").strip("/")
        + "/"
        + env("LAUGHINGPOTATO_MEDIA_URL").strip("/")
        + "/"
).replace("//", "/")
STATIC_ROOT = env("LAUGHINGPOTATO_STATIC_ROOT")
STATICFILES_DIRS = (os.path.join(BASE_DIR, "laughingpotato", "frontend", "dist"),)
MEDIA_ROOT = env("LAUGHINGPOTATO_MEDIA_ROOT")
