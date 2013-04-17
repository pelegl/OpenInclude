#!/bin/bash

curl -XPUT "localhost:9200/_river/mongodb/_meta" -d '
{
  "type": "mongodb",
  "mongodb": {
    "host": "ec2-50-16-22-207.compute-1.amazonaws.com:27017",
    "db": "openInclude",
    "collection": "language_names"
  },
  "index": {
    "name": "mongolang",
    "type": "language"
  }
}'

curl -XPUT "localhost:9200/_river/mongodb2/_meta" -d '
{
  "type": "mongodb",
  "mongodb": {
    "host": "ec2-50-16-22-207.compute-1.amazonaws.com:27017",
    "db": "openInclude",
    "collection": "modules"
  },
  "index": {
    "name": "mongomodules",
    "type": "module"
  }
}'
