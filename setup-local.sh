#!/bin/bash

# Clean up Turbopack cache and invalid symlinks
echo "🧹 Cleaning up..."
rm -rf .next
rm -rf node_modules
rm -rf pnpm-lock.yaml
rm -rf package-lock.json

# Install dependencies fresh
echo "📦 Installing dependencies..."
if command -v pnpm &> /dev/null; then
  pnpm install
elif command -v npm &> /dev/null; then
  npm install
else
  echo "Error: Neither pnpm nor npm found. Please install Node.js."
  exit 1
fi

echo "✅ Setup complete! You can now run: npm run dev"
