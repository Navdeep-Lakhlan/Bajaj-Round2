import { FormSection as FormSectionType, FormData, ValidationError } from '../lib/types';
import FormFields from './FormFields';
import { useState, useEffect } from 'react';

interface FormSectionProps {
  section: FormSectionType;
  formData: FormData;
  onChange: (fieldId: string, value: string | string[] | boolean) => void;
  errors: ValidationError[];
  isLastSection: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onSubmit: () => void;
}

export default function FormSection({
  section,
  formData,
  onChange,
  errors,
  isLastSection,
  onNext,
  onPrevious,
  onSubmit,
}: FormSectionProps) {
  const getFieldError = (fieldId: string): ValidationError | null => {
    return errors.find((error) => error.fieldId === fieldId) || null;
  };

  // Animation for fields when they appear
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    // Reset animation on section change
    setIsVisible(false);
    
    // Start animation with a slight delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [section.sectionId]);

  // Check if it's the first section
  const isFirstSection = section.sectionId === 1;

  return (
    <div className="transition-all duration-500 ease-in-out px-2">
      <div className={`mb-10 transform transition-all duration-500 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        <div className="flex items-center mb-3">
          <span className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-full mr-4 flex-shrink-0 shadow-md">
            <span className="text-sm font-medium">{section.sectionId}</span>
          </span>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent">
            {section.title}
          </h2>
        </div>
        <div className="pl-14">
          <p className="text-gray-600 dark:text-gray-300 text-base border-l-4 border-orange-200 dark:border-orange-700 pl-4 py-2 italic">{section.description}</p>
        </div>
      </div>

      <div className="space-y-8 mb-12 pl-4">
        {section.fields.map((field, index) => (
          <div 
            key={field.fieldId} 
            className={`transform transition-all duration-500 ease-out ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
            style={{ transitionDelay: `${index * 50}ms` }}
          >
            <FormFields
              field={field}
              value={
                formData[field.fieldId] !== undefined 
                  ? formData[field.fieldId] 
                  : field.type === 'checkbox' 
                    ? (field.options && field.options.length > 0 ? [] : false)
                    : ''
              }
              onChange={onChange}
              error={getFieldError(field.fieldId)}
            />
          </div>
        ))}
      </div>

      <div className={`flex justify-between mt-12 pt-6 border-t border-gray-200 dark:border-gray-700 transform transition-all duration-500 ease-out ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`} style={{ transitionDelay: '300ms' }}>
        <button
          type="button"
          onClick={onPrevious}
          className={`group px-8 py-4 rounded-lg flex items-center transition-all duration-300 ${
            isFirstSection 
              ? 'opacity-0 pointer-events-none' 
              : 'bg-white dark:bg-gray-800 text-orange-600 dark:text-orange-400 border border-orange-600 dark:border-orange-500 hover:bg-orange-50 dark:hover:bg-gray-700 focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-800 hover:shadow-md'
          }`}
          disabled={isFirstSection}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 transform transition-transform duration-300 group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>
        
        {isLastSection ? (
          <button
            type="button"
            onClick={onSubmit}
            className="group px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-lg hover:from-orange-600 hover:to-amber-700 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-600 focus:ring-offset-2 transition-all duration-300 shadow-md flex items-center font-medium"
            data-testid="submit-button"
          >
            Submit
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </button>
        ) : (
          <button
            type="button"
            onClick={onNext}
            className="group px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-lg hover:from-orange-600 hover:to-amber-700 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-600 focus:ring-offset-2 transition-all duration-300 shadow-md flex items-center font-medium"
          >
            Next
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {errors.length > 0 && (
        <div className="mt-6 p-6 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 rounded-lg animate-pulse">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                There {errors.length === 1 ? 'is' : 'are'} {errors.length} {errors.length === 1 ? 'error' : 'errors'} that need{errors.length === 1 ? 's' : ''} to be fixed
              </h3>
              <div className="mt-3">
                <ul className="list-disc pl-5 space-y-2 text-sm text-red-700 dark:text-red-300">
                  {errors.map((error, index) => (
                    <li key={index} className="hover:text-red-800 dark:hover:text-red-200 transition-colors duration-300">
                      {error.message}
                      <button 
                        onClick={() => {
                          const el = document.getElementById(error.fieldId);
                          if (el) {
                            el.focus();
                            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          }
                        }}
                        className="ml-2 text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 underline focus:outline-none"
                      >
                        Go to field
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}