#!/bin/bash

echo "  Creating database '$POSTGRES_DB_TEST'"
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE DATABASE "$POSTGRES_DB_TEST";
    CREATE EXTENSION unaccent;
EOSQL

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB_TEST" <<-EOSQL
    CREATE EXTENSION unaccent;
EOSQL
