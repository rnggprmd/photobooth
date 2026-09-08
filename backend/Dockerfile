# ─────────────────────────────────────────────
#  Photobooth Backend – Laravel 13 (PHP 8.3)
#  Mode: Development
# ─────────────────────────────────────────────
FROM php:8.3-cli

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    unzip \
    git \
    libzip-dev \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    && docker-php-ext-install \
        pdo \
        pdo_mysql \
        mbstring \
        zip \
        bcmath \
        xml \
        tokenizer \
        ctype \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

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

# Make entrypoint executable
RUN chmod +x /var/www/backend/docker-entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["/var/www/backend/docker-entrypoint.sh"]
