#!/bin/bash

echo "[mariadb] install 10.2"
apt-key adv --fetch-keys 'https://mariadb.org/mariadb_release_signing_key.asc'
add-apt-repository 'deb [arch=amd64,arm64,ppc64el] http://sgp1.mirrors.digitalocean.com/mariadb/repo/10.2/ubuntu bionic main'
export DEBIAN_FRONTEND=noninteractive
echo "mariadb-server-10.2 mysql-server/root_password password root" | debconf-set-selections
echo "mariadb-server-10.2 mysql-server/root_password_again password root" | debconf-set-selections
apt-get install -y -qq mariadb-server

echo "[mariadb] create user and database - vagrant"
mysql -e "CREATE DATABASE eplabor_admin CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -e "GRANT ALL ON eplabor_admin.* TO vagrant@localhost IDENTIFIED BY 'vagrant'; FLUSH PRIVILEGES;"
cp /vagrant/provision/my.cnf /home/vagrant/.my.cnf

FILE=/vagrant/database/dump.sql.gz
if [ -f "$FILE" ]; then
    echo "[mariadb] $FILE exists and restoring eplabor_admin database..."
    gunzip -c $FILE | mysql eplabor_admin
else 
    echo "[mariadb] $FILE does not exist. Search slack."
fi

echo "[php] install apache2, php 7.2"
apt-get install -y -qq zip unzip apache2 php-{apcu,cli,gd,xml,curl,mbstring,zip,opcache,mysql,fpm}
a2enmod rewrite proxy_fcgi && a2enconf php7.2-fpm
cp /vagrant/provision/directus.conf /etc/apache2/sites-available/
a2dissite 000-default && a2ensite directus && service apache2 reload
