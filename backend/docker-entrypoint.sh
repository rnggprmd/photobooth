#!/bin/bash

# ─────────────────────────────────────────────────────────────────
#  docker-entrypoint.sh – Laravel Bootstrap Script
# ─────────────────────────────────────────────────────────────────

echo "🚀 Starting Photobooth Backend..."

# ── 1. Pastikan direktori storage & bootstrap/cache ada dan writable ─
mkdir -p \
    storage/app/public \
    storage/framework/cache/data \
    storage/framework/sessions \
    storage/framework/views \
    storage/logs \
    bootstrap/cache

chmod -R 777 storage bootstrap/cache 2>/dev/null || true

# ── 2. Copy .env jika belum ada ───────────────────────────────────
# Prioritas: .env.docker (Docker-specific, DB_HOST=db)
# Fallback  : .env.example
if [ ! -f ".env" ]; then
    if [ -f ".env.docker" ]; then
        echo "📋 .env not found, copying from .env.docker..."
        cp .env.docker .env
    else
        echo "📋 .env not found, copying from .env.example..."
        cp .env.example .env
    fi
fi

# ── 3. Generate APP_KEY jika belum ada ───────────────────────────
if grep -qE "^APP_KEY=\s*$" .env || ! grep -q "^APP_KEY=" .env; then
    echo "🔑 Generating APP_KEY..."
    php artisan key:generate --force
fi

# ── 4. Tunggu MySQL & Database siap (max 60 detik) ───────────────
echo "⏳ Waiting for MySQL and database to be ready..."
MAX_TRIES=30
TRIES=0

until php -r "
    \$host = getenv('DB_HOST') ?: 'db';
    \$port = getenv('DB_PORT') ?: '3306';
    \$db   = getenv('DB_DATABASE') ?: 'photobooth';
    \$user = getenv('DB_USERNAME') ?: 'root';
    \$pass = (getenv('DB_PASSWORD') !== false) ? getenv('DB_PASSWORD') : '';
    try {
        new PDO('mysql:host=' . \$host . ';port=' . \$port . ';dbname=' . \$db, \$user, \$pass);
        echo 'connected';
    } catch (Exception \$e) {
        exit(1);
    }
" 2>/dev/null | grep -q "connected"; do
    TRIES=$((TRIES + 1))
    if [ $TRIES -ge $MAX_TRIES ]; then
        echo "❌ MySQL/database not ready after ${MAX_TRIES} attempts. Exiting."
        exit 1
    fi
    echo "   MySQL not ready yet... (attempt $TRIES/$MAX_TRIES)"
    sleep 2
done

echo "✅ MySQL is ready and connected to database!"

# ── 5. Jalankan migrasi & seed demo data ──────────────────────────
echo "🗄️  Running migrations..."
php artisan migrate --force || {
    echo "⚠️  Migration encountered an issue, continuing..."
}

echo "🌱 Seeding initial demo data (roles, superadmin, packages, templates)..."
php artisan db:seed --force || {
    echo "⚠️  Seeding encountered an issue, continuing..."
}

# ── 6. Clear config & route ──────────────────────────────────────
echo "⚙️  Clearing config & route cache..."
php artisan config:clear
php artisan route:clear

# ── 7. Buat symlink storage ──────────────────────────────────────
echo "🔗 Creating storage symlink..."
php artisan storage:link 2>/dev/null || true

# ── 8. Start Laravel dev server ──────────────────────────────────
echo ""
echo "══════════════════════════════════════════════════════════"
echo "  ✅ Photobooth Backend is Ready!"
echo "  🌐 Backend API : http://localhost:8000"
echo "  🌐 Frontend    : http://localhost:5173"
echo "  🗄️  phpMyAdmin  : http://localhost:8080 (root / no pass)"
echo ""
echo "  🔑 Akun Demo Siap Pakai (Password: password):"
echo "     - Super Admin : superadmin@photobooth.test"
echo "     - Tenant Admin: tenant@photobooth.test"
echo "     - Operator    : operator@photobooth.test"
echo "     - Management  : management@photobooth.test"
echo "══════════════════════════════════════════════════════════"
echo ""

exec php artisan serve --host=0.0.0.0 --port=8000
