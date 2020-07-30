# 은평구 노동자종합지원센터 정보 구조

## 노동 상담 consulting

### 인적 사항 consultee

- *성별 (남성/여성) | consultee_gender
- *연령대 (10대/.../70대 이상) | consultee_age
- 거주지 (은평구, 은평구 외, 서울 외) | consultee_residence
- *작성자 (이름) | consultee_name
- *이메일 | consultee_email
- *휴대폰 번호 | consultee_mobile
- *비밀번호 (수정/삭제시 필요합니다) | consultee_password

### 노동 환경 labor

- *고용형태 (정규직/무기계약직/임시일용직/기간제/단시간 근로/특수고용/기타) | labor_employment_type
- *사용주체 (직접고용/파견/용역/기타) | labor_employment_subject
- *근로자수 (5인 미만/5~10인/10~30인/30~100인/100인 이상) | labor_number_of_workers
- 사업장소재지 (서울시 자치구~/서울 외) | labor_location
- 업종 | labor_sector
- 직종 | labor_occupation
- 근속기간 ( 년 개월) | labor_longevity
- 근로일 (주 일) | labor_working_days_per_week
- 근로시간 (주 시간) | labor_working_hours_per_week
- 월 평균임금 ( 만원) | labor_average_monthly_wage

### 상담 정보 consulting

- *분류 (임금체불/징계·해고 등/퇴직금/실업급여/근로시간,휴일,휴가/근로계약/최저임금/산업재해/성희 롱, 폭언, 폭행/노조/기타) | consulting_category
- *문의 | consulting_inquiry
- 답변 | consulting_answer


### 필드

```
// 인적 사항 consultee

상담요청자 성별 (남성, 여성)
상담요청자 연령대 (10대부터 각각 70대 이상)
상담요청자 거주지 (은평구, 은평구 외, 서울 외)
상담요청자 성명 (최대 길이 30자)
상담요청자 이메일 (id@domain.com)
상담요청자 휴대폰 혹은 전화번호 (0100-0000-0000)
상담요청자 비밀번호 (수정/삭제 시 필요)

consultee_gender
consultee_age
consultee_residence
consultee_name
consultee_email
consultee_mobile
consultee_password

// 노동 환경 labor

고용형태 (정규직/무기계약직/임시일용직/기간제/단시간 근로/특수고용/기타)
사용주체 (직접고용/파견/용역/기타)
근로자수 (5인 미만/5~10인/10~30인/30~100인/100인 이상)
사업장소재지 (서울시 자치구, 서울 외)
업종
직종
근속기간 (년 개월)
근로일 (주 일)
근로시간 (주 시간)
월 평균임금 ( 만원)
근로계약서 작성여부
취업규칙 작성여부
4대보험 가입여부

labor_employment_type
labor_employment_subject
labor_number_of_workers
labor_location
labor_sector
labor_occupation
labor_longevity
labor_working_days_per_week
labor_working_hours_per_week
labor_average_monthly_wage
labor_contracts
labor_rules
labor_insurances

// 상담 consulting

상담 유형 (임금체불/징계·해고 등/퇴직금/실업급여/근로시간,휴일,휴가/근로계약/최저임금/산업재해/성희롱,폭언,폭행/노조/기타)
상담 문의
상담 답변

consulting_category
consulting_inquiry
consulting_answer
```

## 필드 속성

```
consultee_gender:
남성
여성

consultee_age:
10대
20대
30대
40대
50대
60대
70대 이상

consultee_residence:
은평구
은평구 외
서울 외

labor_employment_type:
정규직
무기계약직
임시일용직
기간제
단시간 근로
특수고용
기타

labor_employment_subject:
직접고용
파견
용역
기타

labor_number_of_workers:
5인 미만
5인이상 10인 미만
10인 이상 30인 미만
30인 이상 100인 미만
100인 이상

labor_location:
강남구
강동구
강북구
강서구
관악구
광진구
구로구
금천구
노원구
도봉구
동대문구
동작구
마포구
서대문구
서울 외
서초구
성동구
성북구
송파구
양천구
영등포구
은평구
중랑구

labor_sector:
제조업
건설업
도매 및 소매업
운수업 및 창고업
숙박 및 음식점업
출판.영상.방송통신 및 정보서비스
금융 및 보험업
전문.과학 및 기술 서비스업
사업시설관리 및 사업지원서비스업
공공행정.국방 및 사회보장 행정
교육서비스업
보건업 및 사회복지서비스업
협회 및 단체.기타 개인 서비스업
부동산업 및 임대업
예술.스포츠 및 여가관련 서비스업

labor_contracts:
작성
미작성
일부작성
교부
미교부

labor_rules:
작성
미작성
일부작성
교부
미교부

labor_insurances:
가입
미가입
일부가입

consulting_category:
임금
퇴직금
근로시간
휴일/휴가/휴직
해고/징계/인사등
근로계약/취업규칙등
4대보험 직장내괴롭힘/성희롱/폭행등
노조
산업재해
기타
```