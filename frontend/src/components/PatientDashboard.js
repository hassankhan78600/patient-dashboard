/**
 * This component manages state for patients, search/filter criteria, and UI elements like modals and toasts. 
 * It handles all CRUD operations by interacting with the patient API service and renders the main user interface.
 */

import React, { useState, useEffect, useCallback } from 'react';
import SearchBar from './SearchBar';
import FilterBar from './FilterBar';
import Modal from './Modal';
import Toast from './Toast';
import PatientForm from './PatientForm';
import * as patientAPI from '../services/api';
import { formatDate } from '../utils/helpers';

const PatientDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [patientToEdit, setPatientToEdit] = useState(null);
  const [patientToDelete, setPatientToDelete] = useState(null);
  const [toast, setToast] = useState(null);

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    try {
      const data = await patientAPI.getAllPatients(searchTerm, statusFilter);
      setPatients(data);
    } catch (error) {
      console.error('Error fetching patients:', error);
      showToast('Failed to load patients. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchPatients();
    }, 300);
    
    return () => {
      clearTimeout(handler);
    };
  }, [fetchPatients]);

  const closeModal = () => {
    setIsModalOpen(false);
    setPatientToEdit(null);
    setPatientToDelete(null);
  };
  
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleFormSubmit = async (formData) => {
    const action = patientToEdit ? 'update' : 'create';
    try {
      if (action === 'update') {
        await patientAPI.updatePatient(patientToEdit._id || patientToEdit.id, formData);
        showToast('Patient updated successfully! ✓', 'success');
      } else {
        await patientAPI.createPatient(formData);
        showToast('Patient created successfully! 🎉', 'success');
      }
      closeModal();
      fetchPatients();
    } catch (error) {
      console.error(`Error ${action}ing patient:`, error);
      showToast(error.message || `Failed to ${action} patient`, 'error');
    }
  };

  const handleEditClick = (patient) => {
    setPatientToEdit(patient);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (patient) => {
    setPatientToDelete(patient);
  };

  const handleConfirmDelete = async () => {
    if (!patientToDelete) return;
    try {
      await patientAPI.deletePatient(patientToDelete._id || patientToDelete.id);
      showToast('Patient deleted successfully.', 'success');
      closeModal();
      fetchPatients();
    } catch (error) {
      console.error('Error deleting patient:', error);
      showToast(error.message || 'Failed to delete patient', 'error');
    }
  };
  
  const getStatusClass = (status) => `status-${status.toLowerCase()}`;
  
  const renderContent = () => {
    if (loading) {
      return <div className="loading-container"><div className="spinner"></div><p>Loading Patients...</p></div>;
    }
    if (patients.length === 0) {
      return <div className="no-patients"><p>No patients found.</p></div>;
    }
    return (
      <div className="table-wrapper">
        <table className="patient-table">
          <thead>
            <tr>
              <th>Name</th><th>Date of Birth</th><th>Status</th><th>Address</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map(patient => (
              <tr key={patient._id || patient.id}>
                <td><div className="patient-name">{`${patient.firstName} ${patient.lastName}`}</div></td>
                <td>{formatDate(patient.dob)}</td>
                <td><span className={`status-badge ${getStatusClass(patient.status)}`}>{patient.status}</span></td>
                <td>
                  <div className="patient-address">
                    {patient.address
                      ? `${patient.address.street}, ${patient.address.city}, ${patient.address.state}, ${patient.address.zip}`
                      : 'No address information'
                    }
                  </div>
                </td>
                <td className="patient-actions">
                  <button className="btn btn-edit" onClick={() => handleEditClick(patient)}>Edit</button>
                  <button className="btn btn-delete" onClick={() => handleDeleteClick(patient)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <>
      <div className="patient-dashboard">
        <div className="dashboard-header">
          <div>
            <h1>Patient Management</h1>
            <p className="dashboard-subtitle">Manage your patient records efficiently.</p>
          </div>
          <button className="btn btn-primary btn-add" onClick={() => setIsModalOpen(true)}>
            <span className="btn-icon">+</span> Add New Patient
          </button>
        </div>
        <div className="dashboard-controls">
          <SearchBar onSearch={setSearchTerm} />
          <FilterBar onFilterChange={setStatusFilter} />
        </div>
        <div className="patient-list-container">
          <div className="patient-count">Showing {patients.length} patients</div>
          {renderContent()}
        </div>
      </div>

      {isModalOpen && (
        <Modal 
          isOpen={isModalOpen} 
          onClose={closeModal}
          title={patientToEdit ? 'Edit Patient' : 'Add New Patient'}
        >
          <PatientForm 
            patientToEdit={patientToEdit} 
            onSubmit={handleFormSubmit} 
            onCancel={closeModal} 
          />
        </Modal>
      )}

      {patientToDelete && (
        <Modal 
          isOpen={!!patientToDelete} 
          onClose={closeModal} 
          title="Confirm Deletion"
          size="small" 
        >
          <div className="delete-confirmation">
            <h3 className="delete-message">Are you sure you want to delete this patient?</h3>
            <p className="delete-warning">This action cannot be undone.</p>
            <div className="delete-actions">
              <button className="btn btn-cancel" onClick={closeModal}>Cancel</button>
              <button className="btn btn-delete" onClick={handleConfirmDelete}>Delete</button>
            </div>
          </div>
        </Modal>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
};

export default PatientDashboard;