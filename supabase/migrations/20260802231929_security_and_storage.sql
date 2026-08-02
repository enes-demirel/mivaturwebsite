-- Mivatur security policies and storage configuration

-- -----------------------------------------------------------------------------
-- Secure admin membership check
-- -----------------------------------------------------------------------------

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_users
    where public.admin_users.user_id = auth.uid()
  );
$$;

revoke execute on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.is_admin() to service_role;

-- -----------------------------------------------------------------------------
-- Public read access for published content
-- -----------------------------------------------------------------------------

create policy "Published destinations are publicly readable"
on public.destinations
for select
to anon, authenticated
using (status = 'published');

create policy "Published tours are publicly readable"
on public.tours
for select
to anon, authenticated
using (status = 'published');

create policy "Published tour departures are publicly readable"
on public.tour_departures
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.tours
    where public.tours.id = public.tour_departures.tour_id
      and public.tours.status = 'published'
  )
);

create policy "Published tour gallery is publicly readable"
on public.tour_gallery
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.tours
    where public.tours.id = public.tour_gallery.tour_id
      and public.tours.status = 'published'
  )
);

create policy "Published tour itinerary is publicly readable"
on public.tour_itinerary_days
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.tours
    where public.tours.id = public.tour_itinerary_days.tour_id
      and public.tours.status = 'published'
  )
);

create policy "Published tour services are publicly readable"
on public.tour_service_items
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.tours
    where public.tours.id = public.tour_service_items.tour_id
      and public.tours.status = 'published'
  )
);

create policy "Published tour notes are publicly readable"
on public.tour_important_notes
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.tours
    where public.tours.id = public.tour_important_notes.tour_id
      and public.tours.status = 'published'
  )
);

create policy "Published tour FAQs are publicly readable"
on public.tour_faqs
for select
to anon, authenticated
using (
  public.tour_faqs.published = true
  and exists (
    select 1
    from public.tours
    where public.tours.id = public.tour_faqs.tour_id
      and public.tours.status = 'published'
  )
);

create policy "Published tour destinations are publicly readable"
on public.tour_destinations
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.tours
    where public.tours.id = public.tour_destinations.tour_id
      and public.tours.status = 'published'
  )
  and exists (
    select 1
    from public.destinations
    where public.destinations.id = public.tour_destinations.destination_id
      and public.destinations.status = 'published'
  )
);

create policy "Published tour hotels are publicly readable"
on public.tour_hotels
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.tours
    where public.tours.id = public.tour_hotels.tour_id
      and public.tours.status = 'published'
  )
);

create policy "Published blog posts are publicly readable"
on public.blog_posts
for select
to anon, authenticated
using (
  status = 'published'
  and published_at is not null
  and published_at <= now()
);

-- No public policies are created for admin_users, reservation_requests, or
-- site_settings. Reservation submissions will use a future server endpoint.

-- -----------------------------------------------------------------------------
-- Admin CRUD access
-- -----------------------------------------------------------------------------

create policy "Admins can manage destinations"
on public.destinations
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can manage tours"
on public.tours
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can manage tour departures"
on public.tour_departures
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can manage tour gallery"
on public.tour_gallery
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can manage tour itinerary"
on public.tour_itinerary_days
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can manage tour services"
on public.tour_service_items
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can manage tour notes"
on public.tour_important_notes
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can manage tour FAQs"
on public.tour_faqs
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can manage tour destinations"
on public.tour_destinations
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can manage tour hotels"
on public.tour_hotels
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can manage blog posts"
on public.blog_posts
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can manage reservation requests"
on public.reservation_requests
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can manage site settings"
on public.site_settings
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- admin_users intentionally has no browser-facing policies. Membership is
-- managed through trusted dashboard, SQL editor, or server-only operations.

-- -----------------------------------------------------------------------------
-- Public storage buckets
-- -----------------------------------------------------------------------------

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values
  (
    'tour-images',
    'tour-images',
    true,
    10485760,
    array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
  ),
  (
    'blog-images',
    'blog-images',
    true,
    10485760,
    array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
  ),
  (
    'tour-pdfs',
    'tour-pdfs',
    true,
    20971520,
    array['application/pdf']
  )
on conflict (id) do update
set
  name = excluded.name,
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- -----------------------------------------------------------------------------
-- Admin-only storage mutations
-- Public bucket reads use Supabase public object URLs.
-- -----------------------------------------------------------------------------

create policy "Admins can upload Mivatur files"
on storage.objects
for insert
to authenticated
with check (
  bucket_id in ('tour-images', 'blog-images', 'tour-pdfs')
  and public.is_admin()
);

create policy "Admins can update Mivatur files"
on storage.objects
for update
to authenticated
using (
  bucket_id in ('tour-images', 'blog-images', 'tour-pdfs')
  and public.is_admin()
)
with check (
  bucket_id in ('tour-images', 'blog-images', 'tour-pdfs')
  and public.is_admin()
);

create policy "Admins can delete Mivatur files"
on storage.objects
for delete
to authenticated
using (
  bucket_id in ('tour-images', 'blog-images', 'tour-pdfs')
  and public.is_admin()
);
