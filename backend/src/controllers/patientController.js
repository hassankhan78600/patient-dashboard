/**
 * Controller for handling patient-related API requests.
 * Functions in this module are responsible for processing HTTP requests, interacting with the patient service layer, and sending responses.
 */

const patientService = require('../services/patientService');

const createPatient = async (req, res) => {
  try {
    const newPatient = await patientService.createPatient(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Patient created successfully',
      data: newPatient
    });
    
  } catch (error) {
    console.error('Error in createPatient controller:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating patient',
      error: error.message
    });
  }
};

const getAllPatients = async (req, res) => {
  try {
    const { search, status } = req.query;
    
    const patients = await patientService.getAllPatients(search, status);
    
    res.status(200).json({
      success: true,
      message: 'Patients retrieved successfully',
      count: patients.length,
      data: patients
    });
    
  } catch (error) {
    console.error('Error in getAllPatients controller:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving patients',
      error: error.message
    });
  }
};

const getPatientById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const patient = await patientService.getPatientById(id);
    
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: `Patient with ID ${id} not found`
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Patient retrieved successfully',
      data: patient
    });
    
  } catch (error) {
    console.error('Error in getPatientById controller:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving patient',
      error: error.message
    });
  }
};

const updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    
    const updatedPatient = await patientService.updatePatient(id, req.body);
    
    if (!updatedPatient) {
      return res.status(404).json({
        success: false,
        message: `Patient with ID ${id} not found`
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Patient updated successfully',
      data: updatedPatient
    });
    
  } catch (error) {
    console.error('Error in updatePatient controller:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating patient',
      error: error.message
    });
  }