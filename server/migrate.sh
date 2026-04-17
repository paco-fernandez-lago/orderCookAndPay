#!/bin/sh

set -e

if [ -z "$DATABASE_URL" ]; then
  export $(cat .env | grep DATABASE_URL)
fi

echo "Running migrations..."
echo "Database URL: $DATABASE_URL"

# Wait for database to be ready
until psql "$DATABASE_URL" -c "\q" 2>/dev/null; do
  echo "Waiting for database..."
  sleep 1
done

echo "Database is ready. Running migrations..."

for migration in migrations/*.sql; do
  echo "Running $migration..."
  psql "$DATABASE_URL" -f "$migration" || echo "Migration $migration completed with status $?"
done

echo "Migrations completed!"
