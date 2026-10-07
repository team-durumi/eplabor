#!/bin/bash
set -euo pipefail
WEBROOT=/srv/eplabor/directus
mkdir -p $WEBROOT/logs
echo "bind mount used; skip copy"
chmod -R 777 $WEBROOT/logs

source /root/.eplabor_db
sed -i "s/'username' => 'vagrant'/'username' => 'eplabor'/" $WEBROOT/config/eplabor.php
sed -i "s/'password' => 'vagrant'/'password' => '${DB_PASS}'/" $WEBROOT/config/eplabor.php

a2enmod rewrite proxy_fcgi setenvif
a2enconf php7.2-fpm
cat > /etc/apache2/sites-available/directus.conf <<EOF
<VirtualHost *:80>
    ServerAdmin mozodev@users.noreply.github.com
    DocumentRoot $WEBROOT/public
    <Directory $WEBROOT/public/>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    ErrorLog $WEBROOT/logs/apache2-error.log
    CustomLog $WEBROOT/logs/apache2-access.log combined
</VirtualHost>
EOF
a2dissite 000-default
a2ensite directus
systemctl reload apache2
echo "=== 02-app done ==="
