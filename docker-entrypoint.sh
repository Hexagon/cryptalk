#!/bin/sh

set -e

mkdir /usr/src/app/external-public/
cp -R /usr/src/app/public/* /usr/src/app/external-public/

exec "$@"
