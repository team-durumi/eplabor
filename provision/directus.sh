#!/bin/bash

function download_latest_directus() {
    rm -rf directus
    curl -s https://api.github.com/repos/directus/directus/releases/latest \
    | grep tarball_url \
    | cut -d '"' -f 4 \
    | xargs -n 1 curl -sL \
    | tar zxf - 
    mv directus-* /vagrant/directus
    rm /vagrant/directus/.gitignore
    git checkout -- ./
    cp /vagrant/provision/directus-config-eplabor.php /vagrant/directus/config/eplabor.php
}

download_latest_directus
