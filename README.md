# 은평구 노동자종합지원센터

## 개발 참고

- https://gohugo.io/documentation/
- https://zwbetz.com/make-a-hugo-blog-from-scratch/
- https://github.com/spech66/hugo-best-practices
- https://www.forsure.dev/-/2019/09/03/add-search-functionality-to-your-hugo-static-site/
- https://timpittman.co/posts/how-to-setup-a-hugo-blog-with-netlify-cms/

- https://www.mapolabor.org/
- https://docs.google.com/document/d/1LuQgBZcU-SZJGGiHAENHVwLJ5w7jwUc02IMLzats6uw/edit#

## 홈페이지 메뉴(Front)

```
메인

상시노출 / 
    센터정보, 공지사항, 노동상당, 변호사 법률상담, 교육신청 바로가기, 알아두면 도움되는 제도(연차계산기, 퇴직금 자동계산), 노동 관련 기관
교체노출 /
    시기별 진행사업 및 지원제도 홍보

메뉴
센터소개 / 센터소개 - 인사말 - 주요사업 - 오시는 길
알림마당 / 공지사항 - 센터소식 - 자료실 - 발간자료
교육신청 / 이용안내 - 교육신청
노동상담 / 이용안내 - 무료상담 - 주요사례

about
- _index.md
- about.md
- greeting.md
- projects.md
- location.md

allim
- _index.md
- notices/_index.md
- news/_index.md
- downloads/_index.md
- publications/_index.md

workshop
- _index.md
- info.md
- request.md

consulting
- _index.md
- info.md
- request.md
- references.md

그외 홈페이지에서 제공하고 싶은 것
표준근로계약서, 노동 관련 지원제도, 노동 관련 기관별 주요 기능, 직장 내 괴롭힘 금지법의 내용 및 주요 사례, 최저임금에 따른 월 급여 계산, 주휴수당 계산방법, 산재 바로 알기, 실업급여, 임금체불 시 대응방법 등
참고 사이트  http://www.nodong.or.kr/
```

```
menu:
  main:
    - name: 센터소개
      url: /about/
      identifier: about
    - name: 소개
      url: /about/
      parent: about
    - name: 알림마당
      url: /notices
      identifier: notices
    - name: 교육신청
      url: /workshop
      identifier: workshop
    - name: 노동상담
      url: /consulting
      identifier: consulting
```

      
센터정보
공지사항
노동상당
변호사 법률상담
교육신청 바로가기
알아두면 도움되는 제도(연차계산기, 퇴직금 자동계산)
노동 관련 기관

---
blocks:
  - 센터정보
  - 공지사항
  - 노동상담
  - 변호사 법률상담
  - 교육신청 바로가기
  - 알아두면 도움되는 제도(연차계산기, 퇴직금 자동계산)
  - 노동 관련 기관
---

## SERVER

```
Distributor ID:	Ubuntu
Description:	Ubuntu 18.04.4 LTS
Release:	18.04
Codename:	bionic

Server version: Apache/2.4.29 (Ubuntu)
PHP 7.2.24-0ubuntu0.18.04.6 (cli) (built: May 26 2020 13:09:11) ( NTS )
mysql  Ver 15.1 Distrib 10.2.32-MariaDB

/dev/xvdb        22G   45M   21G   1% /data
```

## rclone

```
mkdir -p /vagrant/data
rclone config
rclone mount --daemon team-durumi-drive:/eplabor /vagrant/data
# 언마운트 에러 시 아래
sudo umount -l /vagrant/data
```

## git 

```
sudo git config --system --add safe.directory /home/ubuntu/eplabor
```