#!/bin/bash

COMPOSE="/usr/local/bin/docker-compose --no-ansi"
DOCKER="/usr/bin/docker"

cd /home/ohl/controlCamionesApi/
$COMPOSE -f "docker-compose.prod.yml" run certbot renew && $COMPOSE -f "docker-compose.prod.yml" kill -s SIGHUP webserver
$DOCKER system prune -af
