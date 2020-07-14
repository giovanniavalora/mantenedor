cd /home/ohl/controlCamionesApi/mantenedor
git checkout develop
git pull https://github.com/giovanniavalora/mantenedor.git develop
cd /home/ohl/controlCamionesApi/
# docker-compose -f docker-compose.prod.yml stop mantenedor
# docker-compose -f docker-compose.prod.yml build mantenedor
# docker-compose -f docker-compose.prod.yml up -d mantenedor

# docker-compose -f docker-compose.prod.yml exec web python manage.py migrate --noinput
# docker-compose -f docker-compose.prod.yml exec web python manage.py makemigrations --noinput
# docker-compose -f docker-compose.prod.yml exec web python manage.py collectstatic --no-input --clear
