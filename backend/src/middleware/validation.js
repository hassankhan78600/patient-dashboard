/**
 * Middleware for validating patient data from the request body.
 * Ensures required fields are present and correctly formatted before passing the request to the controller.
 */
const validatePatientData = (req, res, next) => {
  const {
    firstName,
    lastName,
    dob
  } = req.body;

  const address = req.body.address || {};
  const errors = [];

  const nameRegex = /^[a-zA-Z\s]+$/;
  const streetAddressRegex = /^[a-zA-Z0-9\s.,#'\-\/]+$/;
  const cityStateRegex = /^[a-zA-Z\s.'\-]+$/;

  const zipRegex = /^\d{5}$/;

  if (!firstName || firstName.trim() === '') {
    errors.push('First name is required');
  } else if (!nameRegex.test(firstName)) {
    errors.push('First name must contain only letters and spaces');
  }

  if (!lastName || lastName.trim() === '') {
    errors.push('Last name is required');
  } else if (!nameRegex.test(lastName)) {
    errors.push('Last name must contain only letters and spaces');
  }

  if (!address.street || address.street.trim() === '') {
    errors.push('Street address is required');
  } else if (!streetAddressRegex.test(address.street)) {
    errors.push('Street address contains invalid characters');
  }

  if (!address.city || address.city.trim() === '') {
    errors.push('City is required');
  } else if (!cityStateRegex.test(address.city)) {
    errors.push('City contains invalid characters');
  }

  if (!address.state || address.state.trim() === '') {
    errors.push('State is required');
  } else if (!cityStateRegex.test(address.state)) {
    errors.push('State contains invalid characters');
  }

  if (!address.zip || address.zip.trim() === '') {
    errors.push('Zip code is required');
  } else if (!zipRegex.test(address.zip)) {
    errors.push('Zip code must be exactly 5 digits');
  }

  if (dob) {
    const dateOfBirth = new Date(dob);
    if (isNaN(dateOfBirth.getTime())) {
      errors.push('Date of birth must be a valid date');
    } else {
      const today = new Date();

      today.setHours(23, 59, 59, 999);

      if (dateOfBirth > today) {
        errors.push('Date of birth cannot be in the future');
      }

      const maxAgeDate = new Date();
      maxAgeDate.setFullYear(maxAgeDate.getFullYear() - 150);
      maxAgeDate.setHours(0, 0, 0, 0);

      if (dateOfBirth < maxAgeDate) {
        errors.push('Date of birth cannot be more than 150 years in the past');
      }
    }
  } else {
    errors.push('Date of birth is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      errors
    });
  }

  next();
};