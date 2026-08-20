PRAGMA foreign_keys = ON;

CREATE TABLE admin_users (id TEXT PRIMARY KEY, email TEXT NOT NULL COLLATE NOCASE UNIQUE, display_name TEXT, password_hash TEXT NOT NULL, active INTEGER NOT NULL DEFAULT 1 CHECK(active IN (0,1)), created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
CREATE TABLE admin_sessions (id TEXT PRIMARY KEY, admin_user_id TEXT NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE, token_hash TEXT NOT NULL UNIQUE, expires_at TEXT NOT NULL, created_at TEXT NOT NULL);
CREATE INDEX idx_admin_sessions_user ON admin_sessions(admin_user_id);
CREATE INDEX idx_admin_sessions_expiry ON admin_sessions(expires_at);

CREATE TABLE destinations (id TEXT PRIMARY KEY, name TEXT NOT NULL, slug TEXT NOT NULL UNIQUE, country_code TEXT, type TEXT NOT NULL CHECK(type IN ('international','domestic')), short_description TEXT, content TEXT, map_longitude REAL, map_latitude REAL, map_order INTEGER NOT NULL DEFAULT 0, map_featured INTEGER NOT NULL DEFAULT 0 CHECK(map_featured IN (0,1)), mobile_visible INTEGER NOT NULL DEFAULT 0 CHECK(mobile_visible IN (0,1)), seo_title TEXT, seo_description TEXT, status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','published','archived')), created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
CREATE INDEX idx_destinations_status_type ON destinations(status,type);

CREATE TABLE tours (id TEXT PRIMARY KEY, title TEXT NOT NULL, slug TEXT NOT NULL UNIQUE, type TEXT NOT NULL CHECK(type IN ('international','domestic')), region TEXT, short_description TEXT NOT NULL, long_description TEXT, duration_days INTEGER NOT NULL CHECK(duration_days > 0), duration_nights INTEGER NOT NULL DEFAULT 0 CHECK(duration_nights >= 0), transportation_type TEXT, visa_status TEXT, cover_image_path TEXT, pdf_path TEXT, room_occupancy_label TEXT, single_room_supplement REAL, single_room_supplement_currency TEXT CHECK(single_room_supplement_currency IS NULL OR single_room_supplement_currency IN ('EUR','USD','TRY')), featured_home INTEGER NOT NULL DEFAULT 0 CHECK(featured_home IN (0,1)), featured_order INTEGER NOT NULL DEFAULT 0, status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','published','archived')), seo_title TEXT, seo_description TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
CREATE INDEX idx_tours_status_type ON tours(status,type);
CREATE INDEX idx_tours_featured ON tours(featured_home,featured_order);
CREATE INDEX idx_tours_status ON tours(status);
CREATE INDEX idx_tours_type ON tours(type);

CREATE TABLE tour_departures (id TEXT PRIMARY KEY, tour_id TEXT NOT NULL REFERENCES tours(id) ON DELETE CASCADE, start_date TEXT NOT NULL, end_date TEXT NOT NULL, departure_city TEXT NOT NULL, arrival_point TEXT, price REAL NOT NULL CHECK(price >= 0), currency TEXT NOT NULL CHECK(currency IN ('EUR','USD','TRY')), previous_price REAL CHECK(previous_price IS NULL OR previous_price >= 0), airline TEXT, transportation_note TEXT, status TEXT NOT NULL DEFAULT 'planned' CHECK(status IN ('available','planned','sold-out')), created_at TEXT NOT NULL, updated_at TEXT NOT NULL, UNIQUE(tour_id,start_date,end_date,departure_city));
CREATE INDEX idx_departures_tour_date ON tour_departures(tour_id,start_date);
CREATE INDEX idx_departures_date ON tour_departures(start_date);
CREATE INDEX idx_departures_status ON tour_departures(status);
CREATE TABLE tour_gallery (id TEXT PRIMARY KEY, tour_id TEXT NOT NULL REFERENCES tours(id) ON DELETE CASCADE, storage_path TEXT NOT NULL UNIQUE, alt_text TEXT NOT NULL, sort_order INTEGER NOT NULL DEFAULT 0, is_cover INTEGER NOT NULL DEFAULT 0 CHECK(is_cover IN (0,1)), created_at TEXT NOT NULL);
CREATE INDEX idx_gallery_tour_order ON tour_gallery(tour_id,sort_order);
CREATE TABLE tour_itinerary_days (id TEXT PRIMARY KEY, tour_id TEXT NOT NULL REFERENCES tours(id) ON DELETE CASCADE, day_number INTEGER NOT NULL CHECK(day_number > 0), title TEXT NOT NULL, route TEXT, summary TEXT, description TEXT, image_path TEXT, image_alt TEXT, highlights TEXT NOT NULL DEFAULT '[]', transportation TEXT, accommodation TEXT, meals TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL, UNIQUE(tour_id,day_number));
CREATE INDEX idx_itinerary_tour_day ON tour_itinerary_days(tour_id,day_number);
CREATE TABLE tour_service_items (id TEXT PRIMARY KEY, tour_id TEXT NOT NULL REFERENCES tours(id) ON DELETE CASCADE, type TEXT NOT NULL CHECK(type IN ('included','excluded')), content TEXT NOT NULL, sort_order INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL);
CREATE INDEX idx_services_tour_type_order ON tour_service_items(tour_id,type,sort_order);
CREATE TABLE tour_important_notes (id TEXT PRIMARY KEY, tour_id TEXT NOT NULL REFERENCES tours(id) ON DELETE CASCADE, title TEXT NOT NULL, content TEXT NOT NULL, sort_order INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
CREATE INDEX idx_notes_tour_order ON tour_important_notes(tour_id,sort_order);
CREATE TABLE tour_faqs (id TEXT PRIMARY KEY, tour_id TEXT NOT NULL REFERENCES tours(id) ON DELETE CASCADE, question TEXT NOT NULL, answer TEXT NOT NULL, sort_order INTEGER NOT NULL DEFAULT 0, published INTEGER NOT NULL DEFAULT 1 CHECK(published IN (0,1)), created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
CREATE INDEX idx_faqs_tour_order ON tour_faqs(tour_id,sort_order);
CREATE TABLE tour_destinations (tour_id TEXT NOT NULL REFERENCES tours(id) ON DELETE CASCADE, destination_id TEXT NOT NULL REFERENCES destinations(id) ON DELETE CASCADE, sort_order INTEGER NOT NULL DEFAULT 0, PRIMARY KEY(tour_id,destination_id));
CREATE INDEX idx_tour_destinations_destination ON tour_destinations(destination_id);
CREATE TABLE tour_hotels (id TEXT PRIMARY KEY, tour_id TEXT NOT NULL REFERENCES tours(id) ON DELETE CASCADE, city TEXT NOT NULL, night_count INTEGER NOT NULL CHECK(night_count > 0), hotel_name TEXT, stars INTEGER CHECK(stars IS NULL OR stars BETWEEN 1 AND 5), sort_order INTEGER NOT NULL DEFAULT 0);
CREATE INDEX idx_hotels_tour_order ON tour_hotels(tour_id,sort_order);

CREATE TABLE blog_posts (id TEXT PRIMARY KEY, title TEXT NOT NULL, slug TEXT NOT NULL UNIQUE, excerpt TEXT, content TEXT, cover_image_path TEXT, status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','published','archived')), published_at TEXT, seo_title TEXT, seo_description TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
CREATE INDEX idx_blog_status_published ON blog_posts(status,published_at);
CREATE TABLE reservation_requests (id TEXT PRIMARY KEY, tour_id TEXT REFERENCES tours(id) ON DELETE SET NULL, departure_id TEXT REFERENCES tour_departures(id) ON DELETE SET NULL, full_name TEXT NOT NULL, phone TEXT NOT NULL, email TEXT, participant_count INTEGER NOT NULL DEFAULT 1 CHECK(participant_count > 0), message TEXT, status TEXT NOT NULL DEFAULT 'new' CHECK(status IN ('new','contacted','completed','cancelled')), created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
CREATE INDEX idx_reservations_status_created ON reservation_requests(status,created_at);
CREATE TABLE site_settings (key TEXT PRIMARY KEY, value TEXT NOT NULL, updated_at TEXT NOT NULL);

CREATE TABLE tour_installments (id TEXT PRIMARY KEY, tour_id TEXT NOT NULL REFERENCES tours(id) ON DELETE CASCADE, installment_number INTEGER NOT NULL CHECK(installment_number BETWEEN 1 AND 12), due_date TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL, UNIQUE(tour_id,installment_number));
CREATE INDEX idx_installments_tour_number ON tour_installments(tour_id,installment_number);
CREATE TABLE tour_day_transfers (id TEXT PRIMARY KEY, tour_id TEXT NOT NULL REFERENCES tours(id) ON DELETE CASCADE, from_day_number INTEGER NOT NULL CHECK(from_day_number >= 1), to_day_number INTEGER NOT NULL CHECK(to_day_number = from_day_number + 1), transport_mode TEXT NOT NULL CHECK(transport_mode IN ('plane','train','bus','ship')), distance_km INTEGER CHECK(distance_km IS NULL OR distance_km BETWEEN 1 AND 30000), created_at TEXT NOT NULL, updated_at TEXT NOT NULL, UNIQUE(tour_id,from_day_number,to_day_number));
CREATE INDEX idx_transfers_tour_days ON tour_day_transfers(tour_id,from_day_number,to_day_number);
CREATE TABLE custom_tour_requests (id TEXT PRIMARY KEY, full_name TEXT NOT NULL, phone TEXT NOT NULL, email TEXT, destination TEXT, start_date TEXT, end_date TEXT, participant_count INTEGER NOT NULL CHECK(participant_count > 0), accommodation_preference TEXT CHECK(accommodation_preference IS NULL OR accommodation_preference IN ('hotel','apartment','no-preference')), transportation_preference TEXT, budget TEXT, notes TEXT, status TEXT NOT NULL DEFAULT 'new' CHECK(status IN ('new','contacted','completed','cancelled')), created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
CREATE INDEX idx_custom_requests_status_created ON custom_tour_requests(status,created_at);
