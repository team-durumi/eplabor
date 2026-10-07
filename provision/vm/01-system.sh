#!/bin/bash
set -euo pipefail
export DEBIAN_FRONTEND=noninteractive

DB_NAME=eplabor
DB_USER=eplabor
DB_PASS=$(openssl rand -hex 16)
echo "DB_PASS=$DB_PASS" > /root/.eplabor_db

apt-get update && apt-get -y upgrade
timedatectl set-timezone Asia/Seoul

# MariaDB
apt-get install -y mariadb-server mariadb-client
systemctl enable --now mariadb
mysql -e "CREATE DATABASE eplabor CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -e "CREATE USER 'eplabor'@'localhost' IDENTIFIED BY '${DB_PASS}'; GRANT ALL ON eplabor.* TO 'eplabor'@'localhost'; FLUSH PRIVILEGES;"
zcat /srv/eplabor/.vagrant/261007.sql.gz | mysql eplabor

# sury PHP repo + PHP 7.2
apt-get install -y curl gnupg2 ca-certificates lsb-release apt-transport-https unzip
curl -sSLo /usr/share/keyrings/deb.sury.org-php.gpg https://packages.sury.org/php/apt.gpg
echo "deb [signed-by=/usr/share/keyrings/deb.sury.org-php.gpg] https://packages.sury.org/php/ bookworm main" > /etc/apt/sources.list.d/php.list
apt-get update
apt-get install -y apache2 \
  php7.2-fpm php7.2-cli php7.2-mysql php7.2-gd php7.2-xml php7.2-mbstring \
  php7.2-curl php7.2-zip php7.2-opcache php7.2-apcu php7.2-xsl php7.2-exif \
  php7.2-ftp php7.2-gettext

for conf in /etc/php/7.2/fpm/php.ini /etc/php/7.2/cli/php.ini; do
  printf 'memory_limit=-1\ndate.timezone=Asia/Seoul\n' >> $conf
done
sed -i 's/^;clear_env = no/clear_env = no/' /etc/php/7.2/fpm/pool.d/www.conf
grep -q 'env\[BOT_TOKEN\]' /etc/php/7.2/fpm/pool.d/www.conf || \
  echo "env[BOT_TOKEN] = 'kfd3pv_\$>qJfZLa@2t9ONl6j'" >> /etc/php/7.2/fpm/pool.d/www.conf

systemctl restart php7.2-fpm
echo "=== 01-system done ==="
