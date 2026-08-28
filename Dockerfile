FROM php:8.3.22-cli-alpine

RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"

# RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories \
#   && apk update --no-cache \
#   && docker-php-source extract

# install extensions
RUN docker-php-ext-install pdo pdo_mysql -j$(nproc) pcntl
# enable opcache and pcntl
RUN docker-php-ext-enable opcache pcntl


RUN mkdir -p /app
WORKDIR /app

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# COPY composer.json composer.lock ./
COPY . .
RUN composer install --no-dev

# buat beberesin file sisa instalasi biar image lebih kecil
RUN docker-php-source delete && rm -rf /var/cache/apk/*


EXPOSE 8787

CMD ["php", "start.php", "start"]
