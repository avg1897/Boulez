FROM php:8.2-apache

WORKDIR /var/www/html

RUN usermod -u 1000 www-data

RUN groupmod -g 1000 www-data

#RUN chown -R www-data:www-data /var/www/html