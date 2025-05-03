#!/bin/bash

# Stop and remove Docker containers, networks, etc.
docker compose down

# Remove the postgres_data directory
rm -rf postgres_data

# Start the Docker containers in detached mode
docker compose up -d
