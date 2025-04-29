import { FormField, FormData, ValidationError } from '../lib/types';
import { useState, useEffect } from 'react';

interface FormFieldProps {
  field: FormField;
  value: string | string[] | boolean;
  onChange: (fieldId: string, value: string | string[] | boolean) => void;
  error?: ValidationError | null;
}

export default function FormFields({ field, value, onChange, error }: FormFieldProps) {
  // Common classes
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2";
  const inputClass = `w-full px-4 py-3 border ${
    error ? "border-red-500" : "border-gray-300 dark:border-gray-600"
  } rounded-lg focus:outline-none focus:ring-2 ${
    error ? "focus:ring-red-300 dark:focus:ring-red-800" : "focus:ring-orange-300 dark:focus:ring-orange-700"
  } transition-all duration-200 shadow-sm`;
  const errorClass = "mt-2 text-sm text-red-600 dark:text-red-400 flex items-center";
  
  // State for phone input with prefix
  const [phoneInput, setPhoneInput] = useState('');
  
  // Effect to initialize phone input with +91 prefix
  useEffect(() => {
    if (field.type === 'tel' && typeof value === 'string') {
      // If value starts with +91, use it as is, otherwise add the prefix
      if (value && !value.startsWith('+91')) {
        setPhoneInput(value ? `+91${value}` : '+91');
      } else {
        setPhoneInput(value || '+91');
      }
    }
  }, [field.type, value]);

  // Handle phone input changes separately
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setPhoneInput(inputValue);
    
    // Update the actual value without prefix for form data
    if (inputValue.startsWith('+91')) {
      onChange(field.fieldId, inputValue.substring(3));
    } else {
      onChange(field.fieldId, inputValue);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const target = e.target;
    
    if (target.type === 'checkbox') {
      // Handle single checkbox
      if (!field.options || field.options.length === 0) {
        onChange(field.fieldId, (target as HTMLInputElement).checked);
      } else {
        // Handle multiple checkboxes
        const checkValue = (target as HTMLInputElement).value;
        const isChecked = (target as HTMLInputElement).checked;
        
        // Make sure value is an array
        const currentValue = Array.isArray(value) ? value : [];
        
        if (isChecked) {
          onChange(field.fieldId, [...currentValue, checkValue]);
        } else {
          onChange(
            field.fieldId,
            currentValue.filter((v) => v !== checkValue)
          );
        }
      }
    } else {
      onChange(field.fieldId, target.value);
    }
  };

  // Initialize default value for checkboxes if undefined
  const initValue = () => {
    if (value !== undefined) return value;
    
    if (field.type === 'checkbox') {
      return field.options && field.options.length > 0 ? [] : false;
    }
    return '';
  };

  const fieldValue = initValue();

  // Get field label with hint text if applicable
  const getFieldLabel = () => {
    let hint = '';
    if (field.type === 'date') {
      hint = ' (dd-mm-yyyy)';
    } else if (field.type === 'tel') {
      hint = ' (+91)';
    }
    return (
      <>
        {field.label}
        {hint && <span className="text-xs text-gray-500 ml-1">{hint}</span>}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </>
    );
  };

  // Render different form fields based on type
  switch (field.type) {
    case "text":
    case "email":
      return (
        <div className="mb-6 group hover:transform hover:scale-[1.01] transition-all duration-300">
          <label htmlFor={field.fieldId} className={labelClass}>
            {getFieldLabel()}
          </label>
          <div className="relative">
            <input
              type={field.type}
              id={field.fieldId}
              value={fieldValue as string}
              onChange={handleChange}
              placeholder={field.placeholder}
              className={`${inputClass} ${error ? "bg-red-50 dark:bg-red-900/20" : "bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm group-hover:border-orange-400 dark:group-hover:border-orange-500"} dark:text-white`}
              data-testid={field.dataTestId}
              required={field.required}
              maxLength={field.maxLength}
              minLength={field.minLength}
            />
            {field.type === "email" && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
          {error && (
            <p className={errorClass}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {error.message}
            </p>
          )}
        </div>
      );

    case "tel":
      return (
        <div className="mb-6 group hover:transform hover:scale-[1.01] transition-all duration-300">
          <label htmlFor={field.fieldId} className={labelClass}>
            {getFieldLabel()}
          </label>
          <div className="relative">
            <input
              type="tel"
              id={field.fieldId}
              value={phoneInput}
              onChange={handlePhoneChange}
              placeholder="+91 Phone Number"
              className={`${inputClass} ${error ? "bg-red-50 dark:bg-red-900/20" : "bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm group-hover:border-orange-400 dark:group-hover:border-orange-500"} dark:text-white`}
              data-testid={field.dataTestId}
              required={field.required}
              maxLength={field.maxLength ? field.maxLength + 3 : undefined}
              minLength={field.minLength ? field.minLength + 3 : undefined}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
          </div>
          {error && (
            <p className={errorClass}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {error.message}
            </p>
          )}
        </div>
      );

    case "date":
      return (
        <div className="mb-6 group hover:transform hover:scale-[1.01] transition-all duration-300">
          <label htmlFor={field.fieldId} className={labelClass}>
            {getFieldLabel()}
          </label>
          <div className="relative">
            <input
              type="date"
              id={field.fieldId}
              value={fieldValue as string}
              onChange={handleChange}
              className={`${inputClass} ${error ? "bg-red-50 dark:bg-red-900/20" : "bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm group-hover:border-orange-400 dark:group-hover:border-orange-500"} dark:text-white`}
              data-testid={field.dataTestId}
              required={field.required}
              max={field.maxLength}
              min={field.minLength}
              // Format for date input (yyyy-mm-dd)
              placeholder="dd-mm-yyyy"
              // Add custom formatting for display
              onFocus={(e) => e.target.setAttribute('type', 'date')}
              onBlur={(e) => {
                if (!e.target.value) e.target.setAttribute('type', 'text');
              }}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          {error && (
            <p className={errorClass}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {error.message}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">Please enter date in dd-mm-yyyy format</p>
        </div>
      );

    case "textarea":
      return (
        <div className="mb-6 group hover:transform hover:scale-[1.01] transition-all duration-300">
          <label htmlFor={field.fieldId} className={labelClass}>
            {getFieldLabel()}
          </label>
          <textarea
            id={field.fieldId}
            value={fieldValue as string}
            onChange={handleChange}
            placeholder={field.placeholder}
            className={`${inputClass} resize-y ${error ? "bg-red-50 dark:bg-red-900/20" : "bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm group-hover:border-orange-400 dark:group-hover:border-orange-500"} dark:text-white`}
            data-testid={field.dataTestId}
            required={field.required}
            maxLength={field.maxLength}
            minLength={field.minLength}
          ></textarea>
          {error && (
            <p className={errorClass}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {error.message}
            </p>
          )}
          {field.maxLength && (
            <div className="flex justify-end mt-1">
              <span className="text-xs text-gray-500">
                {(fieldValue as string).length}/{field.maxLength} characters
              </span>
            </div>
          )}
        </div>
      );

    case "dropdown":
      return (
        <div className="mb-6 group hover:transform hover:scale-[1.01] transition-all duration-300">
          <label htmlFor={field.fieldId} className={labelClass}>
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </label>
          <div className="relative">
            <select
              id={field.fieldId}
              value={fieldValue as string}
              onChange={handleChange}
              className={`${inputClass} ${error ? "bg-red-50" : "bg-white/80 backdrop-blur-sm group-hover:border-orange-400"} appearance-none`}
              data-testid={field.dataTestId}
              required={field.required}
            >
              <option value="">-- Select an option --</option>
              {field.options?.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  data-testid={option.dataTestId}
                >
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          {error && (
            <p className={errorClass}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {error.message}
            </p>
          )}
        </div>
      );

    case "radio":
      return (
        <div className="mb-6">
          <fieldset>
            <legend className={labelClass}>
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </legend>
            <div className="space-y-3 bg-white/80 backdrop-blur-sm p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
              {field.options?.map((option) => (
                <div key={option.value} className="flex items-center">
                  <div className="relative flex items-center">
                    <input
                      type="radio"
                      id={`${field.fieldId}-${option.value}`}
                      name={field.fieldId}
                      value={option.value}
                      checked={fieldValue === option.value}
                      onChange={handleChange}
                      className="h-5 w-5 text-orange-600 border-gray-300 focus:ring-orange-500 cursor-pointer"
                      data-testid={option.dataTestId}
                      required={field.required}
                    />
                    <label
                      htmlFor={`${field.fieldId}-${option.value}`}
                      className="ml-3 block text-gray-700 cursor-pointer hover:text-orange-600 transition-colors"
                    >
                      {option.label}
                    </label>
                  </div>
                </div>
              ))}
            </div>
            {error && (
              <p className={errorClass}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {error.message}
              </p>
            )}
          </fieldset>
        </div>
      );

    case "checkbox":
      // Single checkbox
      if (!field.options || field.options.length === 0) {
        return (
          <div className="mb-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id={field.fieldId}
                checked={!!fieldValue}
                onChange={handleChange}
                className={`w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-orange-600 dark:text-orange-500 focus:ring-orange-500 dark:focus:ring-orange-700 ${error ? "border-red-500 bg-red-50 dark:bg-red-900/20" : ""} mr-3 transition-all duration-200`}
                data-testid={field.dataTestId}
                required={field.required}
              />
              <label
                htmlFor={field.fieldId}
                className="ml-3 block text-gray-700 cursor-pointer"
              >
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
            </div>
            {error && (
              <p className={errorClass}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {error.message}
              </p>
            )}
          </div>
        );
      }

      // Multiple checkboxes
      return (
        <div className="mb-6">
          <fieldset>
            <legend className={labelClass}>
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </legend>
            <div className="space-y-3 bg-white/80 backdrop-blur-sm p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
              {field.options?.map((option) => {
                // Make sure value is an array for multiple checkboxes
                const checkedValues = Array.isArray(fieldValue) ? fieldValue : [];
                return (
                  <div key={option.value} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`${field.fieldId}-${option.value}`}
                      name={field.fieldId}
                      value={option.value}
                      checked={checkedValues.includes(option.value)}
                      onChange={handleChange}
                      className={`w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-orange-600 dark:text-orange-500 focus:ring-orange-500 dark:focus:ring-orange-700 ${error ? "border-red-500 bg-red-50 dark:bg-red-900/20" : ""} mr-3 transition-all duration-200`}
                      data-testid={`${field.dataTestId}-${option.value}`}
                      required={field.required && Array.isArray(fieldValue) && fieldValue.length === 0}
                    />
                    <label
                      htmlFor={`${field.fieldId}-${option.value}`}
                      className="ml-3 block text-gray-700 cursor-pointer hover:text-orange-600 transition-colors"
                    >
                      {option.label}
                    </label>
                  </div>
                );
              })}
            </div>
            {error && (
              <p className={errorClass}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {error.message}
              </p>
            )}
          </fieldset>
        </div>
      );

    default:
      return null;
  }
}