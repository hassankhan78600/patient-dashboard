/**
 * Defines the API routes for patient-related endpoints.
 * Connects HTTP methods and URL paths to the corresponding controller functions and validation middleware.
 */

const express = require('express');
const router = express.Router();

const patientController = require('../controllers/patientController');
const { validatePatientData, validatePatientId } = require('../middleware/validation');

router.get(
  '/',
  patientController.getAllPatients
);

router.get(
  '/:id',
  validatePatientId,
  patientController.getPatientById
);

router.post(
  '/',
  validatePatientData,
  patientController.createPatient
);

router.put(
  '/:id',
  validatePatientId,
  validatePatientData,
  patientController.updatePatient
);

router.delete(
  '/:id',
  validatePatientId,
  patientController.deletePatient
);

module.exports = router;