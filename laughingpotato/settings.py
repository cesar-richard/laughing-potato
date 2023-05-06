import getconf
from split_settings.tools import include

config = getconf.ConfigGetter("laughingpotato", ["./local_settings.ini"])

include(
    "config/*.py",
)
