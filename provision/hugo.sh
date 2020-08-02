#!/bin/bash

function install_latest_hugo() {
    curl -s https://api.github.com/repos/gohugoio/hugo/releases/latest \
    | grep browser_download_url \
    | grep Linux-64bit \
    | grep extended \
    | grep deb \
    | cut -d '"' -f 4 \
    | xargs -n 1 curl -s -L -o /home/vagrant/hugo.deb
    sudo dpkg -i /home/vagrant/hugo.deb && rm hugo.deb
}

install_latest_hugo
