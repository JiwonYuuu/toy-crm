-- before 트리거
create function set_updated_at() returns trigger
  language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end $$;

create trigger reservation_set_updated_at
  before update on reservation
  for each row execute function set_updated_at();

--after 트리거
create function log_change() returns trigger
  language plpgsql security definer set search_path = '' as $$
begin
  insert into public.audit_log (org_id, actor_id, action, before, after)
  values (coalesce(new.org_id, old.org_id), auth.uid(), tg_op,
          to_jsonb(old), to_jsonb(new));
  return coalesce(new, old);
end $$;

create trigger reservation_audit
  after insert or update or delete on reservation
  for each row execute function log_change();

--customer 트리거
create trigger customer_audit
  after insert or update or delete on customer
  for each row execute function log_change();