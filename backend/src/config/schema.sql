/*
 * Defines the schema for the 'patients' table, including columns, constraints, and indexes.
 * Also seeds the table with initial sample data for development purposes.
 */
 
DROP TABLE IF EXISTS patients CASCADE;

CREATE TABLE patients (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  middle_name VARCHAR(100),
  last_name VARCHAR(100) NOT NULL,
  date_of_birth DATE NOT NULL,
  status VARCHAR(20) NOT NULL 
    CHECK (status IN ('Inquiry', 'Onboarding', 'Active', 'Churned')),
  street_address VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(50) NOT NULL,
  zip_code VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_patients_last_name ON patients(last_name);
CREATE INDEX idx_patients_status ON patients(status);

INSERT INTO patients (first_name, middle_name, last_name, date_of_birth, status, street_address, city, state, zip_code)
VALUES 
  ('John', 'Michael', 'Doe', '1985-03-15', 'Active', '123 Main St', 'Springfield', 'IL', '62701'),
  ('Jane', NULL, 'Smith', '1990-07-22', 'Inquiry', '456 Oak Ave', 'Chicago', 'IL', '60601'),
  ('Bob', 'Lee', 'Johnson', '1978-11-30', 'Onboarding', '789 Pine Rd', 'Naperville', 'IL', '60540');