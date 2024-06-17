#!/bin/bash

for dir in apps/backend/*/ ; do
  echo "checking $dir"
  if [ -f "$dir/docker-compose.yml" ]; then
    service_name=$(basename "$dir")
    docker compose -f "$dir/docker-compose.prod.yml" up -d
  fi
done