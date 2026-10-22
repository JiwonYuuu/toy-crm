create function my_org_ids() returns setof uuid
  language sql stable security definer set search_path = '' as $$
  select org_id from public.member where user_id = auth.uid();
$$;

-- 예약: 내 회사 것만 조회, 추가, 수정. 삭제는 13번에서 만든다.
alter table reservation enable row level security;
create policy reservation_select on reservation
  for select using (org_id in (select public.my_org_ids()));
create policy reservation_insert on reservation
  for insert with check (org_id in (select public.my_org_ids()));
create policy reservation_update on reservation
  for update using (org_id in (select public.my_org_ids()))
  with check (org_id in (select public.my_org_ids()));

-- 손님: 내 회사 것만 조회, 추가, 수정
alter table customer enable row level security;
create policy customer_select on customer
  for select using (org_id in (select public.my_org_ids()));
create policy customer_insert on customer
  for insert with check (org_id in (select public.my_org_ids()));
create policy customer_update on customer
  for update using (org_id in (select public.my_org_ids()))
  with check (org_id in (select public.my_org_ids()));

-- 예약 대상, 회사, 직원, 알림, 변경 기록: 내 회사 것만 조회
alter table resource enable row level security;
create policy resource_select on resource
  for select using (org_id in (select public.my_org_ids()));

alter table organization enable row level security;
create policy organization_select on organization
  for select using (id in (select public.my_org_ids()));

alter table member enable row level security;
create policy member_select on member
  for select using (org_id in (select public.my_org_ids()));

alter table notification enable row level security;
create policy notification_select on notification
  for select using (org_id in (select public.my_org_ids()));

alter table audit_log enable row level security;
create policy audit_log_select on audit_log
  for select using (org_id in (select public.my_org_ids()));

-- 권한 표: 로그인한 사용자는 누구나 읽을 수 있다
alter table role_permissions enable row level security;
create policy role_permissions_select on role_permissions
  for select to authenticated using (true);