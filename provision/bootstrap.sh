#!/bin/bash
echo "[ubuntu bionic64]"
lsb_release -a

echo "[house keeping]"
apt-get -y -qq update && apt-get -y -qq upgrade && apt-get -y -qq autoremove
timedatectl set-timezone Asia/Seoul && date

echo "install latest hugo"
chmod +x /vagrant/provision/hugo.sh && /vagrant/provision/hugo.sh

echo "install rclone"
curl https://rclone.org/install.sh | sudo bash

echo "install git-sync"
curl -L https://raw.githubusercontent.com/simonthum/git-sync/master/git-sync -o /usr/local/bin/git-sync
chmod +x /usr/local/bin/git-sync

su - vagrant -c "git config --bool branch.master.sync true"
su - vagrant -c "git config --bool branch.master.syncNewFiles true"
