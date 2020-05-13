#!/bin/bash
apt-get -y -qq update && apt-get -y -qq upgrade && apt-get -y -qq autoremove
apt-get -y -qq install build-essential curl file git
timedatectl set-timezone Asia/Seoul
