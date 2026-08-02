-- Mivatur initial production schema
-- RLS policies and storage configuration are intentionally deferred.

-- -----------------------------------------------------------------------------
-- Administration
-- -----------------------------------------------------------------------------

create table public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  created_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- Destinations and tours
-- -----------------------------------------------------------------------------

create table public.destinations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  country_code text,
  type text not null,
  short_description text,
  content text,
  map_longitude numeric,
  map_latitude numeric,
  map_order integer not null default 0,
  map_featured boolean not null default false,
  mobile_visible boolean not null default true,
  seo_title text,
  seo_description text,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint destinations_type_check
    check (type in ('country', 'city', 'region')),
  constraint destinations_status_check
    check (status in ('draft', 'published')),
  constraint destinations_map_order_check
    check (map_order >= 0)
);

create table public.tours (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  type text not null,
  region text,
  short_description text not null,
  long_description text,
  duration_days integer not null,
  duration_nights integer not null default 0,
  transportation_type text,
  visa_status text,
  cover_image_path text,
  pdf_path text,
  room_occupancy_label text,
  single_room_supplement numeric,
  single_room_supplement_currency text,
  featured_home boolean not null default false,
  featured_order integer not null default 0,
  status text not null default 'draft',
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tours_type_check
    check (type in ('international', 'domestic')),
  constraint tours_status_check
    check (status in ('draft', 'published', 'archived')),
  constraint tours_supplement_currency_check
    check (
      single_room_supplement_currency is null
      or single_room_supplement_currency in ('TRY', 'EUR', 'USD')
    ),
  constraint tours_duration_days_check
    check (duration_days > 0),
  constraint tours_duration_nights_check
    check (duration_nights >= 0 and duration_nights <= duration_days),
  constraint tours_single_room_supplement_check
    check (single_room_supplement is null or single_room_supplement >= 0),
  constraint tours_featured_order_check
    check (featured_order >= 0)
);

create table public.tour_departures (
  id uuid primary key default gen_random_uuid(),
  tour_id uuid not null,
  start_date date not null,
  end_date date not null,
  departure_city text not null,
  arrival_point text,
  price numeric not null,
  currency text not null,
  previous_price numeric,
  airline text,
  transportation_note text,
  status text not null default 'planned',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tour_departures_tour_id_fkey
    foreign key (tour_id) references public.tours (id) on delete cascade,
  constraint tour_departures_date_range_check
    check (end_date >= start_date),
  constraint tour_departures_price_check
    check (price > 0),
  constraint tour_departures_previous_price_check
    check (previous_price is null or previous_price >= 0),
  constraint tour_departures_currency_check
    check (currency in ('TRY', 'EUR', 'USD')),
  constraint tour_departures_status_check
    check (status in ('available', 'planned', 'sold-out')),
  constraint tour_departures_tour_dates_city_key
    unique (tour_id, start_date, end_date, departure_city)
);

create table public.tour_gallery (
  id uuid primary key default gen_random_uuid(),
  tour_id uuid not null,
  storage_path text not null,
  alt_text text not null,
  sort_order integer not null default 0,
  is_cover boolean not null default false,
  created_at timestamptz not null default now(),
  constraint tour_gallery_tour_id_fkey
    foreign key (tour_id) references public.tours (id) on delete cascade,
  constraint tour_gallery_sort_order_check
    check (sort_order >= 0)
);

create table public.tour_itinerary_days (
  id uuid primary key default gen_random_uuid(),
  tour_id uuid not null,
  day_number integer not null,
  title text not null,
  route text,
  summary text,
  description text,
  image_path text,
  image_alt text,
  highlights jsonb not null default '[]'::jsonb,
  transportation text,
  accommodation text,
  meals text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tour_itinerary_days_tour_id_fkey
    foreign key (tour_id) references public.tours (id) on delete cascade,
  constraint tour_itinerary_days_day_number_check
    check (day_number > 0),
  constraint tour_itinerary_days_highlights_array_check
    check (jsonb_typeof(highlights) = 'array'),
  constraint tour_itinerary_days_tour_day_key
    unique (tour_id, day_number)
);

create table public.tour_service_items (
  id uuid primary key default gen_random_uuid(),
  tour_id uuid not null,
  type text not null,
  content text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  constraint tour_service_items_tour_id_fkey
    foreign key (tour_id) references public.tours (id) on delete cascade,
  constraint tour_service_items_type_check
    check (type in ('included', 'excluded')),
  constraint tour_service_items_sort_order_check
    check (sort_order >= 0)
);

create table public.tour_important_notes (
  id uuid primary key default gen_random_uuid(),
  tour_id uuid not null,
  title text,
  content text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tour_important_notes_tour_id_fkey
    foreign key (tour_id) references public.tours (id) on delete cascade,
  constraint tour_important_notes_sort_order_check
    check (sort_order >= 0)
);

create table public.tour_faqs (
  id uuid primary key default gen_random_uuid(),
  tour_id uuid not null,
  question text not null,
  answer text not null,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tour_faqs_tour_id_fkey
    foreign key (tour_id) references public.tours (id) on delete cascade,
  constraint tour_faqs_sort_order_check
    check (sort_order >= 0)
);

create table public.tour_destinations (
  tour_id uuid not null,
  destination_id uuid not null,
  sort_order integer not null default 0,
  primary key (tour_id, destination_id),
  constraint tour_destinations_tour_id_fkey
    foreign key (tour_id) references public.tours (id) on delete cascade,
  constraint tour_destinations_destination_id_fkey
    foreign key (destination_id) references public.destinations (id) on delete cascade,
  constraint tour_destinations_sort_order_check
    check (sort_order >= 0)
);

create table public.tour_hotels (
  id uuid primary key default gen_random_uuid(),
  tour_id uuid not null,
  city text not null,
  night_count integer not null,
  hotel_name text not null,
  stars integer,
  sort_order integer not null default 0,
  constraint tour_hotels_tour_id_fkey
    foreign key (tour_id) references public.tours (id) on delete cascade,
  constraint tour_hotels_night_count_check
    check (night_count >= 0),
  constraint tour_hotels_stars_check
    check (stars is null or stars between 1 and 5),
  constraint tour_hotels_sort_order_check
    check (sort_order >= 0)
);

-- -----------------------------------------------------------------------------
-- Editorial content
-- -----------------------------------------------------------------------------

create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text not null,
  content text,
  cover_image_path text,
  cover_image_alt text,
  category text,
  published_at timestamptz,
  reading_time integer,
  featured boolean not null default false,
  sort_order integer not null default 0,
  status text not null default 'draft',
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint blog_posts_status_check
    check (status in ('draft', 'published', 'archived')),
  constraint blog_posts_reading_time_check
    check (reading_time is null or reading_time > 0),
  constraint blog_posts_sort_order_check
    check (sort_order >= 0)
);

-- -----------------------------------------------------------------------------
-- Leads and site settings
-- -----------------------------------------------------------------------------

create table public.reservation_requests (
  id uuid primary key default gen_random_uuid(),
  tour_id uuid,
  departure_id uuid,
  full_name text not null,
  phone text not null,
  note text,
  status text not null default 'new',
  admin_note text,
  source text not null default 'website',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint reservation_requests_tour_id_fkey
    foreign key (tour_id) references public.tours (id) on delete set null,
  constraint reservation_requests_departure_id_fkey
    foreign key (departure_id) references public.tour_departures (id) on delete set null,
  constraint reservation_requests_status_check
    check (status in ('new', 'contacted', 'completed', 'cancelled')),
  constraint reservation_requests_source_check
    check (source in ('website', 'whatsapp', 'manual'))
);

create table public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid,
  constraint site_settings_updated_by_fkey
    foreign key (updated_by) references auth.users (id) on delete set null
);

-- -----------------------------------------------------------------------------
-- Query indexes
-- Unique constraints and primary keys already provide their own indexes.
-- -----------------------------------------------------------------------------

create index destinations_status_idx
  on public.destinations (status);
create index destinations_map_featured_order_idx
  on public.destinations (map_featured, map_order)
  where map_featured = true;

create index tours_status_idx
  on public.tours (status);
create index tours_type_status_idx
  on public.tours (type, status);
create index tours_featured_home_order_idx
  on public.tours (featured_home, featured_order)
  where featured_home = true;

create index tour_departures_start_date_idx
  on public.tour_departures (start_date);
create index tour_departures_status_start_date_idx
  on public.tour_departures (status, start_date);

create index tour_gallery_tour_id_idx
  on public.tour_gallery (tour_id);
create index tour_service_items_tour_id_idx
  on public.tour_service_items (tour_id);
create index tour_important_notes_tour_id_idx
  on public.tour_important_notes (tour_id);
create index tour_faqs_tour_id_idx
  on public.tour_faqs (tour_id);
create index tour_destinations_destination_id_idx
  on public.tour_destinations (destination_id);
create index tour_hotels_tour_id_idx
  on public.tour_hotels (tour_id);

create index blog_posts_status_idx
  on public.blog_posts (status);
create index blog_posts_featured_order_idx
  on public.blog_posts (featured, sort_order)
  where featured = true;
create index blog_posts_published_at_idx
  on public.blog_posts (published_at desc)
  where published_at is not null;

create index reservation_requests_tour_id_idx
  on public.reservation_requests (tour_id);
create index reservation_requests_departure_id_idx
  on public.reservation_requests (departure_id);
create index reservation_requests_status_created_at_idx
  on public.reservation_requests (status, created_at desc);
create index site_settings_updated_by_idx
  on public.site_settings (updated_by);

-- -----------------------------------------------------------------------------
-- Automatic updated_at maintenance
-- -----------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger destinations_set_updated_at
before update on public.destinations
for each row execute function public.set_updated_at();

create trigger tours_set_updated_at
before update on public.tours
for each row execute function public.set_updated_at();

create trigger tour_departures_set_updated_at
before update on public.tour_departures
for each row execute function public.set_updated_at();

create trigger tour_itinerary_days_set_updated_at
before update on public.tour_itinerary_days
for each row execute function public.set_updated_at();

create trigger tour_important_notes_set_updated_at
before update on public.tour_important_notes
for each row execute function public.set_updated_at();

create trigger tour_faqs_set_updated_at
before update on public.tour_faqs
for each row execute function public.set_updated_at();

create trigger blog_posts_set_updated_at
before update on public.blog_posts
for each row execute function public.set_updated_at();

create trigger reservation_requests_set_updated_at
before update on public.reservation_requests
for each row execute function public.set_updated_at();

create trigger site_settings_set_updated_at
before update on public.site_settings
for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Row Level Security
-- Policies will be added in a later migration.
-- -----------------------------------------------------------------------------

alter table public.admin_users enable row level security;
alter table public.destinations enable row level security;
alter table public.tours enable row level security;
alter table public.tour_departures enable row level security;
alter table public.tour_gallery enable row level security;
alter table public.tour_itinerary_days enable row level security;
alter table public.tour_service_items enable row level security;
alter table public.tour_important_notes enable row level security;
alter table public.tour_faqs enable row level security;
alter table public.tour_destinations enable row level security;
alter table public.tour_hotels enable row level security;
alter table public.blog_posts enable row level security;
alter table public.reservation_requests enable row level security;
alter table public.site_settings enable row level security;
