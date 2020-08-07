#!/bin/bash

echo "[mariadb] install 10.2"
apt-key adv --fetch-keys 'https://mariadb.org/mariadb_release_signing_key.asc'
add-apt-repository 'deb [arch=amd64,arm64,ppc64el] http://sgp1.mirrors.digitalocean.com/mariadb/repo/10.2/ubuntu bionic main'
export DEBIAN_FRONTEND=noninteractive
echo "mariadb-server-10.2 mysql-server/root_password password root" | debconf-set-selections
echo "mariadb-server-10.2 mysql-server/root_password_again password root" | debconf-set-selections
apt-get install -y -qq mariadb-server

echo "[mariadb] create user and database - vagrant"
mysql --password=root -e "CREATE DATABASE eplabor CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql --password=root -e "GRANT ALL ON eplabor.* TO vagrant@localhost IDENTIFIED BY 'vagrant'; FLUSH PRIVILEGES;"
cp /vagrant/provision/my.cnf /home/vagrant/.my.cnf

FILE=/vagrant/database/0804.sql.gz
if [ -f "$FILE" ]; then
    echo "[mariadb] $FILE exists and restoring eplabor database..."
    gunzip -c $FILE | mysql eplabor
else 
    echo "[mariadb] $FILE does not exist."
fi

echo "[php] install apache2, php 7.2"
apt-get install -y -qq zip unzip apache2 php-{apcu,cli,gd,xml,curl,mbstring,zip,opcache,mysql,fpm}
a2enmod rewrite proxy_fcgi && a2enconf php7.2-fpm
cp /vagrant/provision/directus.conf /etc/apache2/sites-available/
echo 'memory_limit=-1' >> /etc/php/7.2/fpm/php.ini 
echo 'memory_limit=-1' >> /etc/php/7.2/cli/php.ini
echo 'date.timezone=Asia/Seoul' >> /etc/php/7.2/fpm/php.ini
echo 'date.timezone=Asia/Seoul' >> /etc/php/7.2/cli/php.ini
echo 'php_admin_value[error_log] = /home/vagrant/fpm-php.www.log' >> /etc/php/7.2/fpm/pool.d/www.conf

FILE=/vagrant/provision/.env
if [ -f "$FILE" ]; then
    echo "[php] $FILE exists and adding to /etc/php/7.2/fpm/pool.d/www-conf config"
    cat $FILE >> /etc/php/7.2/fpm/pool.d/www.conf
else 
    echo "[php] $FILE does not exist. you must add environment variables"
fi

a2dissite 000-default && a2ensite directus && service apache2 reload
