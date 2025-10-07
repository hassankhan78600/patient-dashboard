/**
 * A reusable form component for creating and editing patient records. It manages its own state for form data and validation errors. 
 * The component populates with existing data if a `patientToEdit` prop is provided, and communicates form submission or cancellation via props.
 */

import React, { useState, useEffect } from 'react';

const initialState = {
  firstName: '',
  middleName: '',
  lastName: '',
  dob: '',
  status: 'Inquiry',
  address: {
    street: '',
    city: '',
    state: '',
    zip: '',
  },
};

const PatientForm = ({ patientToEdit, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (patientToEdit) {
      const formattedPatient = {
        ...patientToEdit,
        dob: patientToEdit.dob ? new Date(patientToEdit.dob).toISOString().split('T')[0] : '',
      };
      setFormData(formattedPatient);
    } else {
      setFormData(initialState);
    }
  }, [patientToEdit]);

  const validate = () => {
    const newErrors = {};
    const nameRegex = /^[a-zA-Z\s]+$/;
    const streetAddressRegex = /^[a-zA-Z0-9\s.,#'\-\/]+$/;
    const cityStateRegex = /^[a-zA-Z\s.'\-]+$/;
    const zipRegex = /^\d{5}$/;

    if (!formData.firstName) {
      newErrors.firstName = 'First Name is required';
    } else if (!nameRegex.test(formData.firstName)) {
      newErrors.firstName = 'First name must contain only letters and spaces';
    }

    if (!formData.lastName) {
      newErrors.lastName = 'Last Name is required';
    } else if (!nameRegex.test(formData.lastName)) {
      newErrors.lastName = 'Last name must contain only letters and spaces';
    }

    if (!formData.dob) {
      newErrors.dob = 'Date of Birth is required';
    } else {
      const dateOfBirth = new Date(formData.dob);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (dateOfBirth > today) {
        newErrors.dob = 'Date of birth cannot be in the future';
      }
    }

    if (!formData.address.street) {
      newErrors.street = 'Street is required';
    } else if (!streetAddressRegex.test(formData.address.street)) {
      newErrors.street = 'Street address contains invalid characters';
    }

    if (!formData.address.city) {
      newErrors.city = 'City is required';
    } else if (!cityStateRegex.test(formData.address.city)) {
      newErrors.city = 'City can only contain letters and spaces';
    }

    if (!formData.address.state) {
      newErrors.state = 'State is required';
    } else if (!cityStateRegex.test(formData.address.state)) {
      newErrors.state = 'State is required';
    }

    if (!formData.address.zip) {
      newErrors.zip = 'Zip Code is required';
    } else if (!zipRegex.test(formData.address.zip)) {
      newErrors.zip = 'Zip code must be exactly 5 digits';
    }
    
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nameRegex = /^[a-zA-Z\s]*$/;
    if (name === 'firstName' || name === 'lastName') {
      if (nameRegex.test(value)) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    const streetAddressRegex = /^[a-zA-Z0-9\s.,#'\-\/]*$/;
    const cityStateRegex = /^[a-zA-Z\s.'\-]*$/;
    const zipRegex = /^\d{0,5}$/;
    
    if (name === 'street') {
      if (streetAddressRegex.test(value)) {
        setFormData((prev) => ({
          ...prev,
          address: {
            ...prev.address,
            [name]: value,
          },
        }));
      }
    } else if (name === 'city' || name === 'state') {
      if (cityStateRegex.test(value)) {
        setFormData((prev) => ({
          ...prev,
          address: {
            ...prev.address,
            [name]: value,
          },
        }));
      }
    } else if (name === 'zip') {
      if (zipRegex.test(value)) {
        setFormData((prev) => ({
          ...prev,
          address: {
            ...prev.address,
            [name]: value,
          },
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [name]: value,
        },
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    onSubmit(formData);
  };

  return (
    <form className="patient-form" onSubmit={handleSubmit} noValidate>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="firstName">First Name <span className="required">*</span></label>
          <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} className={errors.firstName ? 'input-error' : ''} />
          {errors.firstName && <p className="error-message">{errors.firstName}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="middleName">Middle Name</label>
          <input type="text" id="middleName" name="middleName" value={formData.middleName} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last Name <span className="required">*</span></label>
          <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} className={errors.lastName ? 'input-error' : ''} />
          {errors.lastName && <p className="error-message">{errors.lastName}</p>}
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="dob">Date of Birth <span className="required">*</span></label>
          <input type="date" id="dob" name="dob" value={formData.dob} onChange={handleChange} className={errors.dob ? 'input-error' : ''} max={new Date().toISOString().split('T')[0]} />
          {errors.dob && <p className="error-message">{errors.dob}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="status">Status <span className="required">*</span></label>
          <select id="status" name="status" value={formData.status} onChange={handleChange}>
            <option value="Inquiry">Inquiry</option>
            <option value="Onboarding">Onboarding</option>
            <option value="Active">Active</option>
            <option value="Churned">Churned</option>
          </select>
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="street">Street Address <span className="required">*</span></label>
        <input type="text" id="street" name="street" value={formData.address.street} onChange={handleAddressChange} className={errors.street ? 'input-error' : ''} />
        {errors.street && <p className="error-message">{errors.street}</p>}
      </div>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="city">City <span className="required">*</span></label>
          <input type="text" id="city" name="city" value={formData.address.city} onChange={handleAddressChange} className={errors.city ? 'input-error' : ''} />
          {errors.city && <p className="error-message">{errors.city}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="state">State <span className="required">*</span></label>
          <input type="text" id="state" name="state" value={formData.address.state} onChange={handleAddressChange} className={errors.state ? 'input-error' : ''} />
          {errors.state && <p className="error-message">{errors.state}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="zip">Zip Code <span className="required">*</span></label>
          <input type="text" id="zip" name="zip" value={formData.address.zip} onChange={handleAddressChange} className={errors.zip ? 'input-error' : ''} />
          {errors.zip && <p className="error-message">{errors.zip}</p>}
        </div>
      </div>
      <div className="form-actions">
        <button type="button" className="btn btn-cancel" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">{patientToEdit ? 'Save Changes' : 'Add Patient'}</button>
      </div>
    </form>
  );
};

export default PatientForm;