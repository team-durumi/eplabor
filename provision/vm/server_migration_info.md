# 🚀 Ubuntu Bionic 서버 이전 정보 리포트
생성 일시: \2026-\10-\07 \07:\57:\58

## 1. 기본 OS 및 시스템 정보
```text
Distributor ID:	Ubuntu
Description:	Ubuntu 18.04.6 LTS
Release:	18.04
Codename:	bionic
Linux ip-172-31-47-252 5.4.0-1103-aws #111~18.04.1-Ubuntu SMP Tue May 23 20:04:10 UTC 2023 x86_64 x86_64 x86_64 GNU/Linux
```

## 2. 패키지 및 버전을 포함한 주요 서비스
- **Apache2**: Server version: Apache/2.4.29 (Ubuntu)
Server built:   2023-03-08T17:34:33
- **MySQL**: mysql  Ver 15.1 Distrib 10.2.40-MariaDB, for debian-linux-gnu (x86_64) using readline 5.2
- **PHP**: PHP 7.2.24-0ubuntu0.18.04.17 (cli) (built: Feb 23 2023 13:29:25) ( NTS )
Copyright (c) 1997-2018 The PHP Group
Zend Engine v3.2.0, Copyright (c) 1998-2018 Zend Technologies
    with Zend OPcache v7.2.24-0ubuntu0.18.04.17, Copyright (c) 1999-2018, by Zend Technologies
- **Git**: git version 2.17.1
- **Node.js**: v12.18.3
- **NPM**: 6.14.6
- **PM2**: ./collect_info.sh: line 23: pm2: command not found

## 3. Apache2 설정 정보
### Enable된 VirtualHost 목록
```text
total 8
drwxr-xr-x 2 root root 4096 Aug 31  2020 .
drwxr-xr-x 8 root root 4096 Mar  5  2024 ..
lrwxrwxrwx 1 root root   32 Aug 31  2020 directus.conf -> ../sites-available/directus.conf
```
### VirtualHost 파일 내용 모음
#### 설정 파일: /etc/apache2/sites-enabled/directus.conf
```apache
<VirtualHost *:80>
        ServerAdmin mozodev@users.noreply.github.com
        DocumentRoot /home/ubuntu/eplabor/directus/public

        <Directory /home/ubuntu/eplabor/directus/public/>
            Options Indexes FollowSymLinks
            AllowOverride All
            Require all granted
        </Directory>

        SetEnv BOT_TOKEN 'kfd3pv_$>qJfZLa@2t9ONl6j'

        ErrorLog /home/ubuntu/eplabor/directus/logs/apache2-error.log
        CustomLog /home/ubuntu/eplabor/directus/logs/apache2-access.log combined

        <IfModule mod_dir.c>
            DirectoryIndex index.php index.pl index.cgi index.html index.xhtml index.htm
        </IfModule>
</VirtualHost>```

## 4. PHP 설정 및 모듈 목록
### 활성화된 PHP 모듈
```text
[PHP Modules]
calendar
Core
ctype
curl
date
dom
exif
fileinfo
filter
ftp
gd
gettext
hash
iconv
json
libxml
mbstring
mysqli
mysqlnd
openssl
pcntl
pcre
PDO
pdo_mysql
Phar
posix
readline
Reflection
session
shmop
SimpleXML
sockets
sodium
SPL
standard
sysvmsg
sysvsem
sysvshm
tokenizer
wddx
xml
xmlreader
xmlwriter
xsl
Zend OPcache
zlib

[Zend Modules]
Zend OPcache

```
### php.ini 주요 경로
```text
Loaded Configuration File => /etc/php/7.2/cli/php.ini
```

## 5. MySQL 데이터베이스 및 사용자 정보
### 존재하는 데이터베이스 목록
```text
Database
eplabor
information_schema
```
### MySQL 사용자 목록
```text
```

## 6. Directus 및 실행 중인 프로세스 정보
### PM2 프로세스 목록 (PM2 사용 시)
```text
```
### Systemd 등록 서비스 중 사용자 정의/Directus 관련 서비스
```text
apparmor.service                               enabled  
apport-autoreport.service                      static   
apport-forward@.service                        static   
apport.service                                 generated
kmod-static-nodes.service                      static   
snapd.apparmor.service                         enabled  
```
### Directus 디렉터리 탐색 후보 (.env 확인용)
```text
```

## 7. Cron 작업 (정기 실행 스크립트)
### 현재 계정 Crontab
```text
```
### System Crontab (/etc/crontab)
```text
# /etc/crontab: system-wide crontab
# Unlike any other crontab you don't have to run the `crontab'
# command to install the new version when you edit this file
# and files in /etc/cron.d. These files also have username fields,
# that none of the other crontabs do.

SHELL=/bin/sh
PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin

# m h dom mon dow user	command
17 *	* * *	root    cd / && run-parts --report /etc/cron.hourly
25 6	* * *	root	test -x /usr/sbin/anacron || ( cd / && run-parts --report /etc/cron.daily )
47 6	* * 7	root	test -x /usr/sbin/anacron || ( cd / && run-parts --report /etc/cron.weekly )
52 6	1 * *	root	test -x /usr/sbin/anacron || ( cd / && run-parts --report /etc/cron.monthly )
#
```

## 8. 네트워크 및 오픈된 포트 정보
```text
```
