#!/bin/bash
echo "[ubuntu bionic64]"
lsb_release -a

echo "[house keeping]"
apt-get -y -qq update && apt-get -y -qq upgrade && apt-get -y -qq autoremove
timedatectl set-timezone Asia/Seoul && date
