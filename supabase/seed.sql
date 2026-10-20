insert into organization (id, name) values
  ('11111111-1111-1111-1111-111111111111', '강남 클리닉'),
  ('22222222-2222-2222-2222-222222222222', '홍대 스튜디오');

-- 손님
insert into customer (org_id, name, phone, kakao_id, preferred_channel) values
  ('11111111-1111-1111-1111-111111111111', '김민수', '+821011112222', 'kakao_minsu', 'kakao'),
  ('11111111-1111-1111-1111-111111111111', '이영희', '+821033334444', null, 'sms'),
  ('11111111-1111-1111-1111-111111111111', '정하늘', '+821077778888', null, 'sms'),
  ('22222222-2222-2222-2222-222222222222', '박지훈', '+821055556666', null, 'sms');

-- 예약 대상
insert into resource (org_id, name) values
  ('11111111-1111-1111-1111-111111111111', '1번룸'),
  ('11111111-1111-1111-1111-111111111111', '2번룸'),
  ('22222222-2222-2222-2222-222222222222', 'A 스튜디오');

-- 예약. 한국 시각 기준 "오늘 0시에서 몇 시간 뒤"로 시작 시각을 정한다.
with today as (
  select date_trunc('day', now() at time zone 'Asia/Seoul') at time zone 'Asia/Seoul' as midnight
)
insert into reservation (org_id, customer_id, resource_id, starts_at, ends_at)
select c.org_id, c.id, r.id,
       today.midnight + v.offset_from_midnight,
       today.midnight + v.offset_from_midnight + interval '1 hour'
from (values
  ('김민수', '1번룸',      interval '8 hours'),          -- 오늘 오전 8시
  ('이영희', '2번룸',      interval '15 hours'),         -- 오늘 오후 3시
  ('김민수', '1번룸',      interval '1 day 11 hours'),   -- 내일 오전 11시
  ('박지훈', 'A 스튜디오', interval '10 hours')          -- 오늘 오전 10시, 홍대 스튜디오
) as v(customer_name, resource_name, offset_from_midnight)
join customer c on c.name = v.customer_name
join resource r on r.name = v.resource_name and r.org_id = c.org_id
cross join today;
