import os
from pathlib import Path

import environ
import getconf

env = environ.Env(
    LAUGHINGPOTATO_DJANGO_DEBUG=(bool, False),
    LAUGHINGPOTATO_DJANGO_ALLOWED_HOSTS=(list, ["*"]),
)

config = getconf.ConfigGetter("laughingpotato", ["./local_settings.ini"])
BASE_DIR = Path(__file__).resolve().parent.parent
# Take environment variables from .env file
environ.Env.read_env(os.path.join(BASE_DIR, ".env"))

SECRET_KEY = env("LAUGHINGPOTATO_DJANGO_SECRET")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env.bool("LAUGHINGPOTATO_DJANGO_DEBUG")

ALLOWED_HOSTS = env.list("LAUGHINGPOTATO_DJANGO_ALLOWED_HOSTS")

CSRF_TRUSTED_ORIGINS = ["http://localhost:8003", "https://assos.utc.fr"]
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "corsheaders",
    "storages",
    "webpack_loader",
    "laughingpotato.api",
    "laughingpotato.frontend",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

if DEBUG:
    import socket  # only if you haven't already imported this

    hostname, _, ips = socket.gethostbyname_ex(socket.gethostname())
    INTERNAL_IPS = [ip[:-1] + "1" for ip in ips] + ["127.0.0.1", "10.0.2.2"]

CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        "LOCATION": "unique-snowflake",
    }
}

ROOT_URLCONF = "laughingpotato.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [os.path.join(BASE_DIR, "templates")],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "laughingpotato.wsgi.application"

REST_FRAMEWORK = {
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 100,
}

CORS_ORIGIN_ALLOW_ALL = True

SESSION_ENGINE = "django.contrib.sessions.backends.signed_cookies"

AUTH_USER_MODEL = 'api.CustomUser'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
