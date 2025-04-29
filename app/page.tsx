"use client";

import LoginForm from '../components/LoginForm';
import ThemeToggle from '../components/ThemeToggle';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-950 transition-colors duration-300">
      {/* Theme toggle */}
      <ThemeToggle />
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-10 left-10 w-40 h-40 bg-orange-300 dark:bg-orange-700 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 right-10 w-60 h-60 bg-amber-300 dark:bg-amber-700 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-orange-200 dark:bg-orange-800 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
        <div className="absolute -bottom-20 right-56 w-56 h-56 bg-amber-200 dark:bg-amber-800 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-6000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="flex justify-center mb-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-full shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-orange-500 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-800 dark:text-white tracking-tight">
          Dynamic Form Builder
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-8 max-w-sm mx-auto">
          A beautiful and customizable form experience for collecting student information
        </p>
        
        <LoginForm />
        
        <p className="text-center text-gray-500 dark:text-gray-400 text-xs mt-8">
          &copy; {new Date().getFullYear()} Dynamic Form Builder. All rights reserved.
        </p>
      </div>
    </main>
  );
}