insert into organization (id, name) values
  ('11111111-1111-1111-1111-111111111111', '강남 클리닉'),
  ('22222222-2222-2222-2222-222222222222', '홍대 스튜디오');

insert into customer (id, org_id, name)
values ('cccccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222', '홍대 손님');

insert into resource (id, org_id, name)
values ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '11111111-1111-1111-1111-111111111111', '1번룸');

insert into reservation (org_id, customer_id, resource_id, starts_at, ends_at)
values ('11111111-1111-1111-1111-111111111111', 'cccccccc-cccc-cccc-cccc-cccccccccccc',
        'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', now(), now() + interval '1 hour');