# FELIS Local Development Docker Compose Plan

## Overview
This document specifies the local development database infrastructure for FELIS using Docker Compose.

## Service Specification

```yaml
version: '3.9'

services:
  postgres:
    image: postgres:16-alpine
    container_name: felis-postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: felis
      POSTGRES_USER: felis
      POSTGRES_PASSWORD: felis_dev
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U felis -d felis"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
    driver: local
```

## Configuration Details
- **Container Name:** `felis-postgres`
- **PostgreSQL Version:** 16 (Alpine-based)
- **Database:** `felis`
- **User:** `felis`
- **Password:** `felis_dev`
- **Exposed Port:** `5432` mapped to host `5432`
- **Volume:** `postgres_data` persistent named volume
- **Healthcheck:** Evaluates readiness via `pg_isready` before downstream services or migrations run

## Usage Commands
- **Start database:** `docker compose up -d postgres`
- **Stop database:** `docker compose down`
- **Reset database & volume:** `docker compose down -v`
- **View logs:** `docker compose logs -f postgres`
