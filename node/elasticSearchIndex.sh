#!/bin/bash

curl -XPUT "localhost:9200/_river/mongodb/_meta" -d '
{
  "type": "mongodb",
  "mongodb": {
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
    "db": "openInclude",
    "collection": "modules"
  },
  "index": {
    "name": "mongomodules",
    "type": "module"
  }
}'
