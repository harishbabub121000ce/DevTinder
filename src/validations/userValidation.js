import validator from "validator";

// Individual field validations
export const validateEmail = (email) => {
  if (!email) {
    return { isValid: false, message: "Email is required" };
  }
  
  if (!validator.isEmail(email)) {
    return { isValid: false, message: "Invalid email format" };
  }
  
  return { isValid: true };
};

export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, message: "Password is required" };
  }
  if(!validator.isStrongPassword(password)) {
    return { isValid: false, message: "Password must contain uppercase, lowercase, number and special character" };
  }
  return { isValid: true };
};

export const validateName = (name, fieldName = "Name") => {
  if (!name) {
    return { isValid: false, message: `${fieldName} is required` };
  }
  if(!validator.isLength(name, { min: 2, max: 50 })) {
    return { isValid: false, message: `${fieldName} must be between 2 and 50 characters` };
  }
  return { isValid: true };
};

export const validateSkills = (skills) => {
  if (!skills) {
    return { isValid: true }; // Skills are optional
  }
  if (skills.length > 10) {
    return { isValid: false, message: "Skills should have a maximum of 10 items" };
  }
  return { isValid: true };
};

export const validatePhotoUrl = (photoUrl) => {
  if (!photoUrl) {
    return { isValid: true }; // Photo URL is optional
  }
  
  if (!validator.isURL(photoUrl)) {
    return { isValid: false, message: "Invalid photo URL format" };
  }
  
  return { isValid: true };
};

export const validateAge = (age) => {
  if (!age) {
    return { isValid: true }; // Age is optional
  }
  if(!validator.isInt(age, { min: 18, max: 50 })) {
    return { isValid: false, message: "Age must be between 18 and 50" };
  }
  return { isValid: true };
};

export const validateGender = (gender) => {
  if (!gender) {
    return { isValid: true }; // Gender is optional
  }
  const validGenders = ['male', 'female', 'other'];
  if (!validGenders.includes(gender.toLowerCase())) {
    return { isValid: false, message: "Gender must be one of: male, female, other" };
  }
  
  return { isValid: true };
};

// Comprehensive validation functions
export const validateSignup = (data) => {
  // Required fields for signup
  const emailValidation = validateEmail(data.email);
  if (!emailValidation.isValid) {
    return emailValidation;
  }

  const passwordValidation = validatePassword(data.password);
  if (!passwordValidation.isValid) {
    return passwordValidation;
  }

  const firstNameValidation = validateName(data.firstName, "First name");
  if (!firstNameValidation.isValid) {
    return firstNameValidation;
  }

  const lastNameValidation = validateName(data.lastName, "Last name");
  if (!lastNameValidation.isValid) {
    return lastNameValidation;
  }

  return { isValid: true };
};

export const validateUserUpdate = (data) => {
  // Optional fields for update - only validate if provided
  
  if (data.email) {
    const emailValidation = validateEmail(data.email);
    if (!emailValidation.isValid) {
      return emailValidation;
    }
  }

  if (data.password) {
    const passwordValidation = validatePassword(data.password);
    if (!passwordValidation.isValid) {
      return passwordValidation;
    }
  }

  if (data.firstName) {
    const firstNameValidation = validateName(data.firstName, "First name");
    if (!firstNameValidation.isValid) {
      return firstNameValidation;
    }
  }

  if (data.lastName) {
    const lastNameValidation = validateName(data.lastName, "Last name");
    if (!lastNameValidation.isValid) {
      return lastNameValidation;
    }
  }

  if (data.skills) {
    const skillsValidation = validateSkills(data.skills);
    if (!skillsValidation.isValid) {
      return skillsValidation;
    }
  }

  if (data.photoUrl) {
    const photoUrlValidation = validatePhotoUrl(data.photoUrl);
    if (!photoUrlValidation.isValid) {
      return photoUrlValidation;
    }
  }

  if (data.age) {
    const ageValidation = validateAge(data.age);
    if (!ageValidation.isValid) {
      return ageValidation;
    }
  }

  if (data.gender) {
    const genderValidation = validateGender(data.gender);
    if (!genderValidation.isValid) {
      return genderValidation;
    }
  }

  return { isValid: true };
};