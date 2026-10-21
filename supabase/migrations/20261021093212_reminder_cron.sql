-- 같은 예약에 같은 종류의 알림은 한 번만
alter table notification
  add constraint notification_once unique (reservation_id, kind);

-- pg_cron 확장 켜기
create extension if not exists pg_cron;

-- 1분마다 곧 시작할 예약의 알림을 쌓는다
select cron.schedule('enqueue-reminders', '* * * * *', $$
  insert into public.notification (org_id, reservation_id, kind, status)
  select r.org_id, r.id, 'reminder_1h', 'pending'
  from public.reservation r
  where r.status = 'booked'                         -- 취소된 예약은 제외
    and r.starts_at >= now()
    and r.starts_at <  now() + interval '1 hour'
  on conflict (reservation_id, kind) do nothing;    -- 이미 있으면 추가하지 않음
$$);