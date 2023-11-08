import os

import dj_database_url
import environ
import getconf

env = environ.Env(
    LAUGHINGPOTATO_DB_DEFAULT=(str, ""),
    LAUGHINGPOTATO_DJANGO_SECRET=(str, "whatever"),
)
# Set the project base directory
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# Take environment variables from .env file
environ.Env.read_env(os.path.join(BASE_DIR, ".env"))
config = getconf.ConfigGetter("laughingpotato", ["./local_settings.ini"])
if env("LAUGHINGPOTATO_DJANGO_SECRET") != "whatever":
    database = None
    if env("LAUGHINGPOTATO_DJANGO_SECRET") != "":
        database = dj_database_url.parse(env("LAUGHINGPOTATO_DB_DEFAULT"))
    DATABASES = {
        "default": database
        if database
        else dj_database_url.parse(env("LAUGHINGPOTATO_DB_DEFAULT"))
    }
    DATABASES["default"]["ENGINE"] = "django.db.backends.postgresql"
