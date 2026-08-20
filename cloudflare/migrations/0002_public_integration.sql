ALTER TABLE custom_tour_requests ADD COLUMN admin_note TEXT;
CREATE INDEX IF NOT EXISTS idx_installments_due_date ON tour_installments(due_date);
CREATE INDEX IF NOT EXISTS idx_custom_requests_start_date ON custom_tour_requests(start_date);
