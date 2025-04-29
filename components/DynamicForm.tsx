import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FormResponse, FormData, ValidationError } from '../lib/types';
import { getFormStructure } from '../lib/api';
import { validateSection } from '../lib/validation';
import FormSection from './FormSection';
import ThemeToggle from './ThemeToggle';

export default function DynamicForm({ rollNumber }: { rollNumber: string }) {
  const router = useRouter();
  const [formStructure, setFormStructure] = useState<FormResponse | null>(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [formData, setFormData] = useState<FormData>({});
  const [sectionErrors, setSectionErrors] = useState<ValidationError[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Fetch form structure on component load
  useEffect(() => {
    const fetchForm = async () => {
      if (!rollNumber) {
        setError('No roll number provided');
        setIsLoading(false);
        return;
      }

      try {
        const formData = await getFormStructure(rollNumber);
        setFormStructure(formData);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching form:', err);
        setError('Failed to load form. Please try again.');
        setIsLoading(false);
      }
    };

    fetchForm();
  }, [rollNumber]);

  // Handle field change
  const handleFieldChange = (fieldId: string, value: string | string[] | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  // Validate current section
  const validateCurrentSection = (): boolean => {
    if (!formStructure) return false;
    
    const currentSection = formStructure.form.sections[currentSectionIndex];
    if (!currentSection) return false;

    const validationResult = validateSection(currentSection.fields, formData);
    
    setSectionErrors(validationResult.errors);
    return validationResult.isValid;
  };

  // Handle next section
  const handleNext = () => {
    const isValid = validateCurrentSection();
    
    if (isValid && formStructure) {
      const nextIndex = currentSectionIndex + 1;
      if (nextIndex < formStructure.form.sections.length) {
        setCurrentSectionIndex(nextIndex);
        setSectionErrors([]);
      }
    }
  };

  // Handle previous section
  const handlePrevious = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
      setSectionErrors([]);
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    const isValid = validateCurrentSection();
    
    if (isValid) {
      // Log collected form data to console as per requirements
      console.log('Form Data Submitted:', formData);
      
      // Show confetti effect
      setShowConfetti(true);
      
      // Show success message with animation
      setFormSubmitted(true);
      
      // Redirect to home page after delay
      setTimeout(() => {
        router.push('/');
      }, 3000);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950 transition-colors duration-300">
        <div className="text-center p-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-xl">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-orange-600 dark:border-orange-500 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-10 w-10 bg-orange-600 dark:bg-orange-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="mt-8 text-gray-700 dark:text-gray-300 font-medium text-lg">Loading your form...</p>
          <div className="mt-6 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden max-w-md mx-auto">
            <div className="h-full bg-orange-600 dark:bg-orange-500 rounded-full animate-loadingProgress"></div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !formStructure) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950 transition-colors duration-300 p-4">
        <div className="max-w-md w-full p-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-xl">
          <div className="flex items-center justify-center mb-8">
            <div className="h-16 w-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-4 text-red-600 dark:text-red-400 text-center">Error</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-8 text-center">{error || 'An unknown error occurred'}</p>
          <button
            onClick={() => router.push('/')}
            className="w-full px-6 py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors duration-300 font-medium shadow-md"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  // Make sure we have sections
  if (!formStructure.form.sections || formStructure.form.sections.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950 transition-colors duration-300 p-4">
        <div className="max-w-md w-full p-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-xl">
          <div className="flex items-center justify-center mb-8">
            <div className="h-16 w-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-4 text-red-600 dark:text-red-400 text-center">Error</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-8 text-center">No form sections found</p>
          <button
            onClick={() => router.push('/')}
            className="w-full px-6 py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors duration-300 font-medium shadow-md"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  // Ensure current section index is valid
  if (currentSectionIndex >= formStructure.form.sections.length) {
    setCurrentSectionIndex(0);
    return null; // Render nothing while state updates
  }

  // Show success message
  if (formSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950 transition-colors duration-300 p-4">
        <div className="max-w-xl w-full p-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-xl relative overflow-hidden">
          {/* Improved confetti effect */}
          {showConfetti && (
            <div className="absolute inset-0 z-0">
              <div className="absolute top-0 left-1/4 w-4 h-12 bg-orange-500 animate-confetti-1"></div>
              <div className="absolute top-0 left-1/3 w-4 h-16 bg-amber-500 animate-confetti-2"></div>
              <div className="absolute top-0 left-1/2 w-5 h-14 bg-yellow-400 animate-confetti-3"></div>
              <div className="absolute top-0 left-2/3 w-4 h-18 bg-red-400 animate-confetti-4"></div>
              <div className="absolute top-0 left-3/4 w-4 h-12 bg-orange-400 animate-confetti-5"></div>
              <div className="absolute top-0 left-10 w-5 h-14 bg-amber-400 animate-confetti-6"></div>
              <div className="absolute top-0 right-10 w-4 h-16 bg-yellow-500 animate-confetti-7"></div>
              <div className="absolute top-0 right-1/4 w-5 h-14 bg-orange-300 animate-confetti-2"></div>
              <div className="absolute top-0 right-1/3 w-4 h-12 bg-red-300 animate-confetti-5"></div>
              <div className="absolute top-0 right-2/3 w-4 h-16 bg-amber-300 animate-confetti-3"></div>
              <div className="absolute top-0 right-3/4 w-5 h-14 bg-yellow-400 animate-confetti-6"></div>
              <div className="absolute top-0 w-4 h-10 bg-orange-400 animate-confetti-4" style={{ left: '15%' }}></div>
              <div className="absolute top-0 w-4 h-10 bg-amber-400 animate-confetti-7" style={{ left: '85%' }}></div>
            </div>
          )}
          
          {/* Decorative blobs */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-orange-200 dark:bg-orange-900/20 rounded-full filter blur-3xl opacity-40 animate-blob"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-amber-200 dark:bg-amber-900/20 rounded-full filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
          
          <div className="flex flex-col items-center relative z-10">
            {/* Success icon with animation */}
            <div className="relative mb-8">
              <div className="h-24 w-24 bg-gradient-to-r from-orange-400 to-amber-500 dark:from-orange-500 dark:to-amber-600 rounded-full flex items-center justify-center shadow-lg transform transition-transform duration-700 hover:scale-110 animate-bounce-slow">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="absolute inset-0 h-24 w-24 rounded-full border-4 border-orange-400 dark:border-orange-500 opacity-50 animate-ping-slow"></div>
            </div>
            
            {/* Success text with animations */}
            <h2 className="text-4xl font-bold mb-6 text-center relative z-10 bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent animate-pulse-slow">
              Success!
            </h2>
            
            <p className="text-gray-700 dark:text-gray-300 mb-8 text-center text-lg relative z-10 max-w-md animate-fade-in">
              Your form has been submitted successfully. Thank you for your participation!
            </p>
            
            {/* Progress bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-6 overflow-hidden shadow-inner">
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 h-3 rounded-full animate-success-progress"></div>
            </div>
            
            {/* Redirecting text */}
            <p className="text-gray-500 dark:text-gray-400 text-center text-sm relative z-10 flex items-center animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Redirecting to home page...
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentSection = formStructure.form.sections[currentSectionIndex];
  const isLastSection = currentSectionIndex === formStructure.form.sections.length - 1;

  return (
    <div className="min-h-screen py-16 px-6 bg-gradient-to-br from-orange-50 to-amber-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950 transition-colors duration-300">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-300 dark:bg-orange-700 rounded-full filter blur-3xl opacity-20 -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-300 dark:bg-amber-700 rounded-full filter blur-3xl opacity-20 -z-10"></div>
      <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-orange-200 dark:bg-orange-800 rounded-full filter blur-3xl opacity-10 -z-10"></div>
      
      {/* Theme Toggle Button */}
      <ThemeToggle />
      
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden mb-12 transition-all duration-500 hover:shadow-2xl">
          <div className="p-8 bg-gradient-to-r from-orange-500 to-amber-600 text-white flex justify-between items-center">
            <h1 className="text-3xl font-bold">{formStructure.form.formTitle}</h1>
            <button
              onClick={handleLogout}
              className="px-5 py-2.5 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors duration-300 flex items-center gap-2 font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>

          {/* Progress indicator */}
          <div className="px-12 pt-10">
            <div className="flex items-center justify-between mb-6">
              {formStructure.form.sections.map((section, index) => (
                <div 
                  key={section.sectionId}
                  className="flex flex-col items-center relative"
                >
                  <div 
                    className={`h-12 w-12 rounded-full flex items-center justify-center ${
                      index === currentSectionIndex
                        ? 'bg-orange-500 text-white ring-4 ring-orange-100 dark:ring-orange-900'
                        : index < currentSectionIndex
                        ? 'bg-amber-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                    } transition-all duration-500 ease-in-out transform ${
                      index === currentSectionIndex ? 'scale-110' : 'scale-100'
                    } shadow-md font-medium`}
                  >
                    {index < currentSectionIndex ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span className={`text-sm mt-3 font-medium ${
                    index === currentSectionIndex ? 'text-orange-600 dark:text-orange-400' : 'text-gray-700 dark:text-gray-300'
                  } transition-colors duration-300 max-w-[120px] text-center`}>
                    {section.title.substring(0, 20)}{section.title.length > 20 ? '...' : ''}
                  </span>
                  {index < formStructure.form.sections.length - 1 && (
                    <div 
                      className={`absolute top-6 left-full w-full h-0.5 -ml-2 ${
                        index < currentSectionIndex ? 'bg-amber-500' : 'bg-gray-200 dark:bg-gray-700'
                      } transition-all duration-500 ease-in-out`}
                      style={{ width: 'calc(100% - 24px)' }}
                    ></div>
                  )}
                </div>
              ))}
            </div>

            {/* Progress percentage */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2 overflow-hidden">
              <div 
                className="bg-orange-500 h-3 rounded-full transition-all duration-700 ease-in-out" 
                style={{ width: `${((currentSectionIndex + 1) / formStructure.form.sections.length) * 100}%` }}
              ></div>
            </div>
            <div className="text-right text-sm text-gray-600 dark:text-gray-400 mb-8 font-medium">
              <span className="text-orange-600 dark:text-orange-400 text-lg">{currentSectionIndex + 1}</span> of <span className="text-gray-700 dark:text-gray-300">{formStructure.form.sections.length}</span> sections
            </div>
          </div>

          {/* Current form section */}
          <div className="px-12 pb-12">
            <FormSection
              section={currentSection}
              formData={formData}
              onChange={handleFieldChange}
              errors={sectionErrors}
              isLastSection={isLastSection}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
}