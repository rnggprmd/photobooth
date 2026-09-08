# ─────────────────────────────────────────────
#  Photobooth Frontend – React + Vite (Node 20)
#  Mode: Development (dengan HMR)
# ─────────────────────────────────────────────
FROM node:20-alpine

WORKDIR /app

# Copy package files dulu (leverage Docker cache)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

EXPOSE 5173

# --host agar bisa diakses dari luar container
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
