#!/bin/bash

set -e

if [ -z "$DATABASE_URL" ]; then
  export $(cat .env | grep DATABASE_URL)
fi

echo "Running migrations..."

for migration in migrations/*.sql; do
  echo "Running $migration..."
  psql "$DATABASE_URL" -f "$migration"
done

echo "Migrations completed!"
