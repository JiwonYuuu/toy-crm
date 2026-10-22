-- 토큰의 역할이 이 권한을 가졌는지 role_permissions에서 확인한다
create function authorize(perm public.app_permission) returns boolean
  language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.role_permissions
    where role = (auth.jwt() -> 'app_metadata' ->> 'role')::public.app_role
      and permission = perm
  );
$$;

-- 같은 회사의 예약이면서 삭제 권한이 있을 때만 지울 수 있다
create policy reservation_delete on reservation
  for delete using (
    org_id in (select public.my_org_ids())
    and authorize('reservation.delete')
  );