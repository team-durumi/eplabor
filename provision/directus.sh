#!/bin/bash

function download_latest_directus() {
    rm -rf directus
    curl -s https://api.github.com/repos/directus/directus/releases/latest \
    | grep tarball_url \
    | cut -d '"' -f 4 \
    | xargs -n 1 curl -sL \
    | tar zxf - 
    mv directus-* /vagrant/directus
}

download_latest_directus

rm /vagrant/directus/.gitignorea
git stash && git checkout -- ./
cp /vagrant/provision/directus-config-eplabor.php /vagrant/directus/config/eplabor.php
chmod -R 777 /vagrant/directus/logs
