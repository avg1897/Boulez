#!/bin/bash
set -e

mongosh <<EOF
use $MONGO_INITDB_DATABASE
db.createUser({
  user: "$MONGODB_USERNAME",
  pwd: "$MONGODB_PASSWORD",
  roles: [{
    role: "dbOwner",
    db: "$MONGO_INITDB_DATABASE"
  }]
})
EOF
