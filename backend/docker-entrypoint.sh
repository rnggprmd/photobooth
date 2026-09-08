#!/bin/bash
set -e

# ─────────────────────────────────────────────────────────────────
#  docker-entrypoint.sh – Laravel Bootstrap Script
# ─────────────────────────────────────────────────────────────────

echo "🚀 Starting Photobooth Backend..."

# ── 1. Copy .env jika belum ada ───────────────────────────────────
if [ ! -f ".env" ]; then
    echo "📋 .env not found, copying from .env.example..."
    cp .env.example .env
fi

# ── 2. Generate APP_KEY jika belum ada ───────────────────────────
if grep -q "APP_KEY=$" .env; then
    echo "🔑 Generating APP_KEY..."
    php artisan key:generate --force
fi

# ── 3. Tunggu MySQL siap (max 60 detik) ──────────────────────────
echo "⏳ Waiting for MySQL to be ready..."
MAX_TRIES=30
TRIES=0
until php -r "
    \$pdo = new PDO(
        'mysql:host=' . getenv('DB_HOST') . ';port=' . getenv('DB_PORT'),
        getenv('DB_USERNAME'),
        getenv('DB_PASSWORD')
    );
    echo 'connected';
" 2>/dev/null | grep -q "connected"; do
    TRIES=$((TRIES + 1))
    if [ $TRIES -ge $MAX_TRIES ]; then
        echo "❌ MySQL not ready after ${MAX_TRIES} attempts. Exiting."
        exit 1
    fi
    echo "   MySQL not ready yet... (attempt $TRIES/$MAX_TRIES)"
    sleep 2
done

echo "✅ MySQL is ready!"

# ── 4. Jalankan migrasi ───────────────────────────────────────────
echo "🗄️  Running migrations..."
php artisan migrate --force

# ── 5. Clear & cache config ──────────────────────────────────────
echo "⚙️  Caching config..."
php artisan config:clear
php artisan route:clear

# ── 6. Buat symlink storage ──────────────────────────────────────
echo "🔗 Creating storage symlink..."
php artisan storage:link || true

# ── 7. Start Laravel dev server ──────────────────────────────────
echo ""
echo "═══════════════════════════════════════"
echo "  ✅ Photobooth Backend ready!"
echo "  🌐 http://localhost:8000"
echo "═══════════════════════════════════════"
echo ""

exec php artisan serve --host=0.0.0.0 --port=8000
