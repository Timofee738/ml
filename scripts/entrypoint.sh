#!/bin/bash
set -e

echo "Waiting for PostgreSQL..."
while ! pg_isready -h postgres -U ${DB_USER:-postgres} > /dev/null 2>&1; do
  sleep 1
done

echo "PostgreSQL is up!"

echo "Running Alembic migrations..."
alembic upgrade head

echo "Starting FastAPI application..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
