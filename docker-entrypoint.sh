#!/bin/sh

set -e

cp -R /usr/src/app/public/* /usr/src/app/external-public/

exec "$@"
