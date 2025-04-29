"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DynamicForm from '../../components/DynamicForm';

export default function FormPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [rollNumber, setRollNumber] = useState<string | null>(null);
  
  useEffect(() => {
    // Check if user is logged in
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      // Redirect to login if not logged in
      router.push('/');
      return;
    }

    // Get roll number from URL or localStorage
    const urlRollNumber = searchParams.get('rollNumber');
    if (urlRollNumber) {
      setRollNumber(urlRollNumber);
    } else {
      try {
        const user = JSON.parse(userStr);
        setRollNumber(user.rollNumber);
      } catch (error) {
        console.error('Error parsing user data:', error);
        router.push('/');
      }
    }
  }, [router, searchParams]);

  if (!rollNumber) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-orange-50 to-amber-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950 transition-colors duration-300">
        <div className="text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-8 rounded-2xl shadow-lg">
          <div className="relative mx-auto w-20 h-20">
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-orange-500 dark:border-orange-600"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-10 w-10 bg-orange-500 dark:bg-orange-600 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="mt-6 text-gray-700 dark:text-gray-300 font-medium">Loading your form...</p>
          <div className="mt-4 w-48 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-orange-500 dark:bg-orange-600 rounded-full animate-loadingProgress"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      <DynamicForm rollNumber={rollNumber} />
    </main>
  );
}