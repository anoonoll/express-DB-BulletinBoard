#!/usr/bin/env bash

docker network remove sample-net
docker network create sample-net

docker volume remove sample-dbdata
docker volume create sample-dbdata

docker-compose up -d

cd dynamo

sh create_tables.sh

popd
