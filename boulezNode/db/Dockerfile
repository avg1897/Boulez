FROM mongo:latest

RUN usermod -u 1000 mongodb

COPY mongodb-setup.sh /docker-entrypoint-initdb.d/
