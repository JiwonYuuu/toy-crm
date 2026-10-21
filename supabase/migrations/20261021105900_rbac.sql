-- 권한 목록
create type app_permission as enum ('reservation.create', 'reservation.delete', 'member.manage');

-- 역할마다 가진 권한. 행 하나가 "이 역할은 이 권한을 가진다"는 뜻이다.
create table role_permissions (
  role       app_role not null,
  permission app_permission not null,
  primary key (role, permission)
);

insert into role_permissions (role, permission) values
  ('owner', 'reservation.create'), ('owner', 'reservation.delete'), ('owner', 'member.manage'),
  ('admin', 'reservation.create'), ('admin', 'reservation.delete'), ('admin', 'member.manage'),
  ('staff', 'reservation.create');
-- viewer에는 행이 없다. 어떤 쓰기 작업도 할 수 없다는 뜻이다.