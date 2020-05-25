---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
draft: true
type: workshop
status: open
workshop:
  이미지: https://i.vimeocdn.com/video/855288847.webp?mw=960&mh=540
  대상: 누구나
  강사: 홍길동
  일시: 2020년 6월 4일(목), 5일(금) 10:00~11:00
  장소: {{ .Site.Title }}
  신청기간: 시작 - 마감
  문의: {{ .Site.Data.eplabor.대표전화 }}

---

## 교육 프로그램 상세

본문 내용

{{< forms/workshop >}}