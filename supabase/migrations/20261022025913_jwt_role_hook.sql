create function custom_access_token_hook(event jsonb) returns jsonb
  language plpgsql stable set search_path = '' as $$
declare
  claims jsonb;
  user_role public.app_role;
begin
  select role into user_role
  from public.member
  where user_id = (event ->> 'user_id')::uuid
  limit 1;

  claims := jsonb_set(event -> 'claims', '{app_metadata,role}',
                      coalesce(to_jsonb(user_role), 'null'::jsonb));   -- 회사가 없는 사용자도 로그인할 수 있게
  return jsonb_set(event, '{claims}', claims);
end $$;

-- 훅은 supabase_auth_admin 역할로 실행된다. 이 역할에 필요한 권한만 준다.
grant usage on schema public to supabase_auth_admin;
grant execute on function public.custom_access_token_hook to supabase_auth_admin;
revoke execute on function public.custom_access_token_hook from authenticated, anon, public;
grant select on public.member to supabase_auth_admin;

-- 12번에서 member에 RLS를 켰으므로, 훅이 member를 읽을 수 있게 정책을 추가한다
create policy member_auth_admin_read on public.member
  for select to supabase_auth_admin using (true);