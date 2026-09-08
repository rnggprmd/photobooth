# ─────────────────────────────────────────────
#  Photobooth Backend – Laravel 13 (PHP 8.3)
#  Mode: Development
# ─────────────────────────────────────────────
FROM php:8.3-cli

# Install system dependencies & PHP extensions
RUN apt-get update && apt-get install -y \
    curl \
    unzip \
    git \
    libzip-dev \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libonig-dev \
    libxml2-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install \
        pdo \
        pdo_mysql \
        mbstring \
        zip \
        bcmath \
        xml \
        gd \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Configure Git safe directory & PHP settings for photobooth uploads
RUN git config --global --add safe.directory '*' && \
    echo "memory_limit = 512M\nupload_max_filesize = 50M\npost_max_size = 50M\nmax_execution_time = 300" > /usr/local/etc/php/conf.d/photobooth.ini

# Install Composer
COPY --from=composer:2.7 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/backend

# Copy composer files first (leverage Docker cache)
COPY composer.json composer.lock ./

# Install PHP dependencies
RUN composer install --no-scripts --no-autoloader --no-interaction

# Copy application files
COPY . .

# Generate optimized autoloader
RUN composer dump-autoload --optimize

# Clean CRLF if checked out on Windows and make entrypoint executable
RUN sed -i 's/\r$//' /var/www/backend/docker-entrypoint.sh && \
    chmod +x /var/www/backend/docker-entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["/var/www/backend/docker-entrypoint.sh"]
