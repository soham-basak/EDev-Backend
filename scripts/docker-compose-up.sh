#!/bin/bash

for dir in apps/backend/*/
do
  echo "checking $dir"

  if [ -f "$dir/docker-compose.yml" ]
  then
    sudo docker-compose -f "$dir/docker-compose.yml" up -d --build
  fi
done