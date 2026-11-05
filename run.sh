#!/usr/bin/env bash
# Run the portfolio.
#   ./run.sh            dev server with hot reload (default)
#   ./run.sh prod       production build + start
#   ./run.sh check      lint + typecheck + build
#   ./run.sh deploy     deploy to Vercel production
# Port: PORT=4000 ./run.sh
set -euo pipefail
cd "$(dirname "$0")"

MODE="${1:-dev}"
PORT="${PORT:-3000}"

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is required (v20+). Install it from https://nodejs.org" >&2
  exit 1
fi

if [ ! -d node_modules ] || [ package-lock.json -nt node_modules ]; then
  echo "→ installing dependencies"
  npm ci --no-audit --no-fund
fi

case "$MODE" in
  dev)
    echo "→ dev server on http://localhost:$PORT"
    exec npx next dev -p "$PORT"
    ;;
  prod)
    echo "→ building"
    npx next build
    echo "→ production server on http://localhost:$PORT"
    exec npx next start -p "$PORT"
    ;;
  check)
    npm run lint
    npm run typecheck
    npx next build
    ;;
  deploy)
    command -v vercel >/dev/null 2>&1 || { echo "Install the Vercel CLI: npm i -g vercel" >&2; exit 1; }
    npm run lint && npm run typecheck
    exec vercel deploy --prod --yes
    ;;
  *)
    echo "Usage: ./run.sh [dev|prod|check|deploy]" >&2
    exit 1
    ;;
esac
