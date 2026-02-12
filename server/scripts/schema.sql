-- MotoCare schema (PostgreSQL)

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bikes (
  bike_id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  brand VARCHAR(255) NOT NULL,
  model VARCHAR(255) NOT NULL,
  year INTEGER NOT NULL,
  plate_number VARCHAR(50),
  engine_cc INTEGER,
  current_mileage INTEGER DEFAULT 0,
  photo VARCHAR(500),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS services (
  service_id SERIAL PRIMARY KEY,
  bike_id INTEGER NOT NULL REFERENCES bikes(bike_id) ON DELETE CASCADE,
  service_type VARCHAR(255) NOT NULL,
  description TEXT,
  service_date DATE NOT NULL,
  mileage_at_service INTEGER NOT NULL,
  cost DECIMAL(12,2) DEFAULT 0,
  shop_name VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mileage_logs (
  log_id SERIAL PRIMARY KEY,
  bike_id INTEGER NOT NULL REFERENCES bikes(bike_id) ON DELETE CASCADE,
  date DATE NOT NULL,
  mileage INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(bike_id, date)
);

CREATE TABLE IF NOT EXISTS expenses (
  expense_id SERIAL PRIMARY KEY,
  bike_id INTEGER NOT NULL REFERENCES bikes(bike_id) ON DELETE CASCADE,
  category VARCHAR(255) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bikes_user ON bikes(user_id);
CREATE INDEX IF NOT EXISTS idx_services_bike ON services(bike_id);
CREATE INDEX IF NOT EXISTS idx_mileage_bike ON mileage_logs(bike_id);
CREATE INDEX IF NOT EXISTS idx_expenses_bike ON expenses(bike_id);
