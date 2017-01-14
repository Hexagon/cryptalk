#!/bin/bash
set -e

if [ ! -e '/usr/src/app/external-public/index.html' ]; then
	cp -R /usr/src/app/public /usr/src/app/external-public
	chown -R www-data /usr/src/app/external-public
fi

exec "$@"