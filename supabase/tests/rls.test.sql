begin;
select plan(3);   -- 이 파일의 테스트는 3개다

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

select * from finish();
rollback;