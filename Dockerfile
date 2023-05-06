ARG BASE=builder

FROM python:3.10-slim-bullseye AS builder
MAINTAINER Cesar Richard <cesar.richard2@gmail.com>

ENV PYTHONUNBUFFERED 1

# Setup working directory
RUN mkdir -p /code /home/laughingpotato/.ssh /static
WORKDIR /code

# Setup user
RUN groupadd -r laughingpotato && useradd -r -g laughingpotato laughingpotato

# Install tmate for shells
RUN apt-get update && apt-get install -y git gcc default-libmysqlclient-dev --no-install-recommends && rm -r /var/lib/apt/lists/*

RUN chown laughingpotato:laughingpotato -R /home/laughingpotato

# Install uwsgi
RUN pip install --no-cache-dir uwsgi

# Install laughingpotato requirements (doing this before copying code improves caching)
ADD requirements.txt /code/
RUN pip install --no-cache-dir -r requirements.txt

# Uwsgi runs on port 8000
EXPOSE 8000

#COPY --from=front_builder /code/node_modules.bin.txt /code/node_modules.bin.txt

# Add code
ADD . /code/

# Collect static files
RUN LAUGHINGPOTATO_DJANGO_SECRET=whatever python manage.py collectstatic --noinput --clear

# Switch to unprivileged user
USER laughingpotato

# Run uwsgi
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
