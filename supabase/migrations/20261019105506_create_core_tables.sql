-- 회사
create table organization (
  id       uuid primary key default gen_random_uuid(),
  name     text not null,
  timezone text not null default 'Asia/Seoul'
);

-- 직원: 로그인 사용자(auth.users)와 회사를 잇는 중간 테이블
create type app_role as enum ('owner', 'admin', 'staff', 'viewer');

create table member (
  user_id uuid not null references auth.users (id) on delete cascade,
  org_id  uuid not null references organization (id),
  role    app_role not null default 'staff',
  primary key (user_id, org_id)
);

-- 예약 대상: 방, 직원, 장비
create table resource (
  id     uuid primary key default gen_random_uuid(),
  org_id uuid not null references organization (id),
  name   text not null
);

-- 손님
create type channel as enum ('kakao', 'sms', 'email');

create table customer (
  id                uuid primary key default gen_random_uuid(),
  org_id            uuid not null references organization (id),
  name              text not null,
  phone             text,
  email             text,
  kakao_id          text,
  preferred_channel channel not null default 'sms',
  unique (org_id, phone),   -- 같은 회사에 전화번호가 같은 손님은 한 명만
  unique (org_id, id)       -- 아래 복합 외래키가 참조할 수 있게
);

-- 예약
create type reservation_status as enum ('booked', 'cancelled', 'completed');

create table reservation (
  id          uuid primary key default gen_random_uuid(),
  org_id      uuid not null references organization (id),
  customer_id uuid not null,
  resource_id uuid not null references resource (id),
  starts_at   timestamptz not null,
  ends_at     timestamptz not null,
  status      reservation_status not null default 'booked',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  check (ends_at > starts_at),
  -- 예약의 회사와 손님의 회사가 같아야 한다
  constraint reservation_customer_fk
    foreign key (org_id, customer_id) references customer (org_id, id)
);

-- 알림
create type notification_status as enum ('pending', 'sent', 'failed');

create table notification (
  id             uuid primary key default gen_random_uuid(),
  org_id         uuid not null references organization (id),
  reservation_id uuid not null references reservation (id) on delete cascade,
  kind           text not null,
  status         notification_status not null default 'pending',
  created_at     timestamptz not null default now()
);

-- 변경 기록
create table audit_log (
  id         uuid primary key default gen_random_uuid(),
  org_id     uuid not null references organization (id),
  actor_id   uuid,
  action     text not null,
  before     jsonb,
  after      jsonb,
  created_at timestamptz not null default now()
);

-- 외래키 컬럼 인덱스
create index on member (org_id);
create index on resource (org_id);
create index on reservation (org_id, starts_at);   -- 회사별로 날짜 범위를 조회할 때도 쓴다
create index on reservation (customer_id);
create index on reservation (resource_id);
create index on notification (org_id);
create index on notification (reservation_id);
create index on audit_log (org_id);