/**
 * Service layer for patient-related operations.
 * This module contains the business logic for interacting with patient data, executing database queries, and transforming data for the controllers.
 */

const pool = require('../config/database');

const createPatient = async (patientData) => {
  const {
    firstName,
    middleName,
    lastName,
    dob,
    status,
    address
  } = patientData;

  const query = `
    INSERT INTO patients (
      first_name, middle_name, last_name, date_of_birth, status, 
      street_address, city, state, zip_code
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING 
      id,
      first_name AS "firstName",
      middle_name AS "middleName",
      last_name AS "lastName",
      date_of_birth AS "dob",
      status,
      street_address, city, state, zip_code;
  `;

  const values = [
    firstName,
    middleName || null,
    lastName,
    dob,
    status,
    address.street,
    address.city,
    address.state,
    address.zip
  ];

  try {
    const result = await pool.query(query, values);
    const p = result.rows[0];
    return {
        ...p,
        address: {
            street: p.street_address,
            city: p.city,
            state: p.state,
            zip: p.zip_code
        }
    };
  } catch (error) {
    console.error('Error in createPatient service:', error);
    throw error;
  }
};

const getAllPatients = async (searchTerm, statusFilter) => {
  let query = `
    SELECT 
      id, first_name AS "firstName", middle_name AS "middleName", last_name AS "lastName",
      date_of_birth AS "dob", status, street_address, city, state, zip_code
    FROM patients
    WHERE 1=1
  `;
  
  const values = [];
  let paramCount = 1;

  if (searchTerm) {
    query += ` AND (first_name ILIKE $${paramCount} OR last_name ILIKE $${paramCount})`;
    values.push(`%${searchTerm}%`);
    paramCount++;
  }

  if (statusFilter && statusFilter !== 'All') {
    query += ` AND status = $${paramCount}`;
    values.push(statusFilter);
    paramCount++;
  }

  query += ` ORDER BY "lastName" ASC, "firstName" ASC`;

  try {
    const result = await pool.query(query, values);
    return result.rows.map(p => ({
        ...p,
        address: {
            street: p.street_address, city: p.city, state: p.state, zip: p.zip_code
        }
    }));
  } catch (error) {
    console.error('Error in getAllPatients service:', error);
    throw error;
  }
};

const getPatientById = async (id) => {
  const query = `
    SELECT 
      id, first_name AS "firstName", middle_name AS "middleName", last_name AS "lastName",
      date_of_birth AS "dob", status, street_address, city, state, zip_code
    FROM patients 
    WHERE id = $1
  `;

  try {
    const result = await pool.query(query, [id]);
    if (!result.rows[0]) return null;
    const p = result.rows[0];
    return {
        ...p,
        address: {
            street: p.street_address, city: p.city, state: p.state, zip: p.zip_code
        }
    };
  } catch (error) {
    console.error('Error in getPatientById service:', error);
    throw error;
  }
};

const updatePatient = async (id, patientData) => {
  const {
    firstName,
    middleName,
    lastName,
    dob,
    status,
    address
  } = patientData;

  const query = `
    UPDATE patients 
    SET 
      first_name = $1, middle_name = $2, last_name = $3, date_of_birth = $4, status = $5,
      street_address = $6, city = $7, state = $8, zip_code = $9,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $10
    RETURNING 
      id, first_name AS "firstName", middle_name AS "middleName", last_name AS "lastName",
      date_of_birth AS "dob", status, street_address, city, state, zip_code;
  `;

  const values = [
    firstName,
    middleName || null,
    lastName,
    dob,
    status,
    address.street,
    address.city,
    address.state,
    address.zip,
    id
  ];

  try {
    const result = await pool.query(query, values);
    if (!result.rows[0]) return null;
    const p = result.rows[0];
    return {
        ...p,
        address: {
            street: p.street_address, city: p.city, state: p.state, zip: p.zip_code
        }
    };
  } catch (error) {
    console.error('Error in updatePatient service:', error);
    throw error;
  }
};

const deletePatient = async (id) => {
  const query = `DELETE FROM patients WHERE id = $1 RETURNING *;`;
  try {
    const result = await pool.query(query, [id]);
    return result.rows[0];
  } catch (error) {
    console.error('Error in deletePatient service:', error);
    throw error;
  }
};

module.exports = {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient
};