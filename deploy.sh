#!/usr/bin/env bash
set -e

# Variables
REMOTE_HOST="dvk.co"
REMOTE_USER="danny"
SERVER_DIR="/var/www/pull-app.dvk.co"

# Computed vars
DATE=$(date +%Y%m%d%H%M)
REMOTE="$REMOTE_USER@$REMOTE_HOST"
DIR_DEPLOY="$SERVER_DIR"
DIR_TEMP="/tmp/pull-app.dvk.co-$DATE"

# Bump version in cache.manifest
sed -i.bak "s/Version .*/Version $DATE/g"  client/public/cache.manifest

# copy to local release directory
echo "-- building application for production"
mkdir "$DIR_TEMP"
rsync -r ./ "$DIR_TEMP" --exclude='/.git' --filter="dir-merge,- .gitignore"
cd "$DIR_TEMP"

# build client assets
cd client
npm install
NODE_ENV=production npm run build
sed -i.bak "s/%DATE%/$DATE/g"  build/index.html 

# deploy to server
echo "-- deploying to $REMOTE_HOST"

# uploading application files
rsync -qru "$DIR_TEMP/." "$REMOTE:$DIR_DEPLOY" --exclude="client/node_modules" --no-perms --no-owner --no-group

# prepare application & switch symlinks
echo "-- finalising deployment"
ssh -t "$REMOTE" "\
	cd $DIR_DEPLOY \
	npm install
  sudo systemctl restart pull-app
    "


