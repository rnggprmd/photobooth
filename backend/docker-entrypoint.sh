#!/bin/bash

# ─────────────────────────────────────────────────────────────────
#  docker-entrypoint.sh – Laravel Bootstrap Script
# ─────────────────────────────────────────────────────────────────

echo "🚀 Starting Photobooth Backend..."

# ── 1. Copy .env jika belum ada ───────────────────────────────────
# Prioritas: .env.docker (Docker-specific, DB_HOST=db)
# Fallback  : .env.example (DB_HOST=127.0.0.1, tidak cocok untuk Docker)
if [ ! -f ".env" ]; then
    if [ -f ".env.docker" ]; then
        echo "📋 .env not found, copying from .env.docker..."
        cp .env.docker .env
    else
        echo "📋 .env not found, copying from .env.example..."
        cp .env.example .env
    fi
fi

# ── 2. Generate APP_KEY jika belum ada ───────────────────────────
# Regex: APP_KEY= diikuti akhir baris atau whitespace
if grep -qE "^APP_KEY=\s*$" .env; then
    echo "🔑 Generating APP_KEY..."
    php artisan key:generate --force
fi

# ── 3. Tunggu MySQL siap (max 60 detik) ──────────────────────────
echo "⏳ Waiting for MySQL to be ready..."
MAX_TRIES=30
TRIES=0

until php -r "
    \$host = getenv('DB_HOST') ?: 'db';
    \$port = getenv('DB_PORT') ?: '3306';
    \$user = getenv('DB_USERNAME') ?: 'root';
    \$pass = (getenv('DB_PASSWORD') !== false) ? getenv('DB_PASSWORD') : '';
    try {
        new PDO('mysql:host=' . \$host . ';port=' . \$port, \$user, \$pass);
        echo 'connected';
    } catch (Exception \$e) {
        exit(1);
    }
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
php artisan migrate --force || {
    echo "❌ Migration failed!"
    exit 1
}

# ── 5. Clear config & route ──────────────────────────────────────
echo "⚙️  Clearing config & route cache..."
php artisan config:clear
php artisan route:clear

# ── 6. Buat symlink storage ──────────────────────────────────────
echo "🔗 Creating storage symlink..."
php artisan storage:link 2>/dev/null || true

# ── 7. Start Laravel dev server ──────────────────────────────────
echo ""
echo "═══════════════════════════════════════"
echo "  ✅ Photobooth Backend ready!"
echo "  🌐 http://localhost:8000"
echo "═══════════════════════════════════════"
echo ""

exec php artisan serve --host=0.0.0.0 --port=8000
