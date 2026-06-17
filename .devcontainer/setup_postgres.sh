#!/bin/bash
set -e

echo "🔧 Installing PostgreSQL client..."

# Add PostgreSQL repository key
curl -fsSL https://www.postgresql.org/media/keys/ACCC4CF8.asc | \
  sudo gpg --dearmor -o /etc/apt/trusted.gpg.d/postgresql.gpg

# Add repository
echo "deb http://apt.postgresql.org/pub/repos/apt/ $(lsb_release -cs)-pgdg main" | \
  sudo tee /etc/apt/sources.list.d/pgdg.list

# Update and install packages
sudo apt update
sudo apt install -y postgresql-client libpq-dev

echo "✅ PostgreSQL client installation complete!"