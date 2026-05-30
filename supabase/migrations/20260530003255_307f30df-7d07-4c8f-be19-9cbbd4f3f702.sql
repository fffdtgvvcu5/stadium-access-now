
insert into storage.buckets (id, name, public) values ('ticket-images', 'ticket-images', true)
on conflict (id) do nothing;

create policy "Ticket images are publicly viewable"
on storage.objects for select
using (bucket_id = 'ticket-images');

create policy "Authenticated users can upload ticket images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'ticket-images' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can update their own ticket images"
on storage.objects for update
to authenticated
using (bucket_id = 'ticket-images' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can delete their own ticket images"
on storage.objects for delete
to authenticated
using (bucket_id = 'ticket-images' and auth.uid()::text = (storage.foldername(name))[1]);

alter table public.ticket_listings add column if not exists image_url text;
