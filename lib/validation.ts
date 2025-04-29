import { FormField, FormData, ValidationError, SectionValidationState } from './types';

// Function to validate a single field
export function validateField(field: FormField, value: string | string[] | boolean | undefined): ValidationError | null {
  // Required field validation
  if (field.required && (value === undefined || value === null || value === '' || 
    (Array.isArray(value) && value.length === 0))) {
    return {
      fieldId: field.fieldId,
      message: field.validation?.message || `${field.label} is required`,
    };
  }

  // String-specific validations
  if (typeof value === 'string' && value) {
    // Check minLength
    if (field.minLength !== undefined && value.length < field.minLength) {
      return {
        fieldId: field.fieldId,
        message: `${field.label} must be at least ${field.minLength} characters`,
      };
    }

    // Check maxLength
    if (field.maxLength !== undefined && value.length > field.maxLength) {
      return {
        fieldId: field.fieldId,
        message: `${field.label} must be at most ${field.maxLength} characters`,
      };
    }

    // Email validation
    if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return {
        fieldId: field.fieldId,
        message: 'Please enter a valid email address',
      };
    }

    // Phone validation for tel type
    if (field.type === 'tel' && !/^\+?[0-9\s-()]{7,}$/.test(value)) {
      return {
        fieldId: field.fieldId,
        message: 'Please enter a valid phone number',
      };
    }
  }

  return null;
}

// Function to validate an entire section
export function validateSection(fields: FormField[], formData: FormData): SectionValidationState {
  const errors: ValidationError[] = [];

  fields.forEach((field) => {
    const value = formData[field.fieldId];
    const error = validateField(field, value);
    if (error) {
      errors.push(error);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}