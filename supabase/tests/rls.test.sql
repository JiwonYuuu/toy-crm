begin;
select plan(6);   -- 이 파일의 테스트는 6개다

-- 강남 관리자로 로그인한 상태를 만든다
select set_config('request.jwt.claims',
  json_build_object('sub', (select id from auth.users where email = 'gangnam-admin@example.com'),
                    'role', 'authenticated')::text,
  true);
set local role authenticated;

select is(
  (select count(*) from reservation where org_id = '22222222-2222-2222-2222-222222222222'),
  0::bigint,
  '강남 직원은 홍대 예약을 볼 수 없다'
);

select isnt(
  (select count(*) from reservation where org_id = '11111111-1111-1111-1111-111111111111'),
  0::bigint,
  '강남 직원은 강남 예약을 볼 수 있다'
);

select throws_ok(
  $$insert into customer (org_id, name) values ('22222222-2222-2222-2222-222222222222', '테스트 손님')$$,
  '42501',
  null,
  '강남 직원은 홍대 손님을 추가할 수 없다'
);

-- 강남 조회자로 바꾼다
reset role;
select set_config('request.jwt.claims',
  json_build_object('sub', (select id from auth.users where email = 'gangnam-viewer@example.com'),
                    'role', 'authenticated',
                    'app_metadata', json_build_object('role', 'viewer'))::text,
  true);
set local role authenticated;

delete from reservation;   -- 모두 지우기를 시도한다
select isnt(
  (select count(*) from reservation),
  0::bigint,
  '조회자는 예약을 지울 수 없다'
);

-- 강남 관리자로 바꾼다
reset role;
select set_config('request.jwt.claims',
  json_build_object('sub', (select id from auth.users where email = 'gangnam-admin@example.com'),
                    'role', 'authenticated',
                    'app_metadata', json_build_object('role', 'admin'))::text,
  true);
set local role authenticated;

delete from reservation;   -- 모두 지우기를 시도한다
select is(
  (select count(*) from reservation),
  0::bigint,
  '관리자는 자기 회사 예약을 지울 수 있다'
);

reset role;   -- 데이터베이스 관리자로 돌아와서 모든 회사의 예약을 센다
select isnt(
  (select count(*) from reservation where org_id = '22222222-2222-2222-2222-222222222222'),
  0::bigint,
  '관리자도 다른 회사 예약은 지울 수 없다'
);

select * from finish();
rollback;