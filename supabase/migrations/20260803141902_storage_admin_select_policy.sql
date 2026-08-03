create policy "Admins can select Mivatur files"
on storage.objects
for select
to authenticated
using (
  public.is_admin()
  and bucket_id in ('tour-images', 'tour-pdfs', 'blog-images')
);
