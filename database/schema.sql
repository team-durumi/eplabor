-- TABLE: eplabor_consultings
-- 은평구노동자종합지원센터 상담 요청자 인적 정보 및 노동 환경, 문의 답변 정보

CREATE OR REPLACE TABLE `eplabor_consultings` (
  `id` int(15) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '상담 아이디',
  `status` varchar(20) NOT NULL DEFAULT 'published' COMMENT '상태 (draft, published, deleted)',
  `owner` int(10) UNSIGNED DEFAULT NULL COMMENT '작성자',
  `created_on` datetime DEFAULT NULL COMMENT '작성시간',
  `modified_by` int(10) UNSIGNED DEFAULT NULL COMMENT '수정자',
  `modified_on` datetime DEFAULT NULL COMMENT '수정시간',
  `consultee_gender` varchar(6) NOT NULL COMMENT '상담요청자 성별 (남성, 여성)',
  `consultee_age` varchar(15) NOT NULL COMMENT '상담요청자 연령대 (10대부터 각각 70대 이상)',
  `consultee_residence` varchar(15) COMMENT '상담요청자 거주지 (은평구, 은평구 외, 서울 외)',
  `consultee_name` varchar(100) NOT NULL COMMENT '상담요청자 성명 (최대 길이 30자)',
  `consultee_email` varchar(345) NOT NULL COMMENT '상담요청자 이메일 (id@domain.com)',
  `consultee_phone` varchar(14) NOT NULL COMMENT '상담요청자 휴대폰 혹은 전화번호 (0100-0000-0000)',
  `consultee_password` varchar(60) NOT NULL COMMENT '상담요청자 비밀번호 해시 (수정/삭제 시 필요)',
  `labor_company_name` varchar(100) NOT NULL COMMENT '사업장명 (최대 길이 30자)',
  `labor_company_owner` varchar(100) NOT NULL COMMENT '사업장대표 (최대 길이 30자)',
  `labor_company_contact` varchar(100) NOT NULL COMMENT '사업장연락처 (최대 길이 30자)',
  `labor_employment_type` varchar(15) NOT NULL COMMENT '고용형태 정규직/무기계약직/임시일용직/기간제/단시간 근로/특수고용/기타)',
  `labor_employment_subject` varchar(15) NOT NULL COMMENT '사용주체 (직접고용/파견/용역/기타)',
  `labor_number_of_workers` varchar(15) NOT NULL COMMENT '근로자수 (5인 미만/5~10인/10~30인/30~100인/100인 이상)',
  `labor_location` varchar(10) COMMENT '사업장소재지 (종로구, 중구, 용산구, 성동구, 광진구, 동대문구, 중랑구, 성북구, 강북구, 도봉구, 노원구, 은평구, 서대문구, 마포구, 양천구, 강서구, 구로구, 금천구, 영등포구, 동작구, 관악구, 서초구, 강남구, 송파구, 강동구, 서울 외)',
  `labor_sector` varchar(50) COMMENT '업종',
  `labor_occupation` varchar(255) COMMENT '직종',
  `labor_longevity` varchar(20) COMMENT '근속기간 (년 개월)',
  `labor_working_days_per_week` TINYINT(1) UNSIGNED COMMENT '근로일 (주 일)',
  `labor_working_hours_per_week` TINYINT(1) UNSIGNED COMMENT '근로시간 (주 시간)',
  `labor_average_monthly_wage` int(11) UNSIGNED COMMENT '월 평균임금 ( 만원)',
  `labor_contracts` varchar(15) COMMENT '근로계약서 작성여부',
  `labor_contracts_shared` varchar(15) COMMENT '근로계약서 공유여부',
  `labor_rules` varchar(15) COMMENT '취업규칙 작성여부',
  `labor_rules_published` varchar(15) COMMENT '취업규칙 게시여부',
  `labor_insurances` varchar(15) COMMENT '4대보험 가입여부',
  `consulting_category` varchar(30) NOT NULL COMMENT '상담 유형 (임금체불/징계·해고 등/퇴직금/실업급여/근로시간,휴일,휴가/근로계약/최저임금/산업재해/성희 롱, 폭언, 폭행/노조/기타)',
  `consulting_title` varchar(255) NOT NULL COMMENT '상담 제목',
  `consulting_inquiry` text NOT NULL COMMENT '상담 문의',
  `consulting_answer` text COMMENT '상담 답변'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE `eplabor_consultings` COMMENT = "은평구노동자종합지원센터 상담 요청자 인적 정보 및 노동 환경, 문의 답변 정보";
ALTER TABLE `eplabor_consultings` AUTO_INCREMENT = 1;


-- TABLE: eplabor_workshop_participants
-- 은평구노동자종합지원센터 교육 참여자 인적 정보

CREATE OR REPLACE TABLE `eplabor_workshop_participants` (
  `id` int(15) UNSIGNED PRIMARY KEY AUTO_INCREMENT COMMENT '교육 참여자 아이디',
  `status` varchar(20) NOT NULL DEFAULT "public" COMMENT '상태 (draft, published, deleted)',
  `owner` int(10) UNSIGNED NOT NULL COMMENT '작성자',
  `created_on` datetime NOT NULL COMMENT '작성시간',
  `modified_by` int(10) UNSIGNED COMMENT '수정자',
  `modified_on` datetime COMMENT '수정시간',
  `participant_name` varchar(100) NOT NULL COMMENT '교육 참여자 성명 (최대 길이 30자)',
  `participant_gender` varchar(6) NOT NULL COMMENT '교육 참여자 성별 (남성, 여성)',
  `participant_age` varchar(15) NOT NULL COMMENT '교육 참여자 연령대 (10대부터 각각 70대 이상)',
  `participant_residence` varchar(15) COMMENT '교육 참여자 거주지 (은평구, 은평구 외, 서울 외)',
  `participant_email` varchar(255) NOT NULL COMMENT '교육 참여자 이메일 (id@domain.com)',
  `participant_phone` varchar(14) NOT NULL COMMENT '교육 참여자 휴대폰 혹은 전화번호 (0100-0000-0000)',
  `participant_password` varchar(60) NOT NULL COMMENT '교육 참여자 비밀번호 (수정/삭제 시 필요)',
  `participant_comment` text COMMENT '교육 참여자 하고 싶은 말',
  `participant_privacy_agreement` TINYINT(1) UNSIGNED NOT NULL COMMENT '개인정보수집 및 이용 동의',
  `participant_portrait_agreement` TINYINT(1) UNSIGNED NOT NULL COMMENT '초상권 활용 동의',
  `workshop_name` varchar(255) COMMENT '참여 교육 프로그램'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE `eplabor_workshop_participants` COMMENT = "은평구노동자종합지원센터 교육 참여자 인적 정보";
ALTER TABLE `eplabor_workshop_participants` AUTO_INCREMENT = 1;
ALTER TABLE `eplabor_workshop_participants` ADD UNIQUE `unique_index`(`workshop_name`, `participant_email`);
