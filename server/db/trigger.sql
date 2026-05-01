-- AFTER INSERT on auth.users:
--   → insert (user_id, user_email) into public.profiles
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (user_id, user_email)
  values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Auto-create profile for new authenticated users
-- Supabase Auth stores users in the internal table `auth.users`.
-- This trigger ensures that whenever a new user is created
-- in `auth.users`, a corresponding row is automatically inserted
-- into `profiles`.