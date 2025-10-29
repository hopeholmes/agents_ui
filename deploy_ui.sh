#!/bin/bash
set -e

echo "📦 Building Vite app..."
cd /srv/agents_ui/app
npm install --silent
npm run build

echo "🚚 Copying build to dist..."
cp -r dist/* ../dist/

echo "🔁 Restarting nginx container..."
cd /srv/agents_ui
docker compose down
docker compose up -d

echo "✅ Deploy complete!  Visit https://agents.americanaamplified.com"
