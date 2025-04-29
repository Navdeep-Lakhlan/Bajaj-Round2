import { FormResponse, LoginData } from './types';

const API_BASE_URL = 'https://dynamic-form-generator-9rl7.onrender.com';

// Function to register a new user
export async function createUser(userData: LoginData): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/create-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create user');
    }

    return { success: true, message: data.message || 'User created successfully' };
  } catch (error) {
    console.error('Error creating user:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
}

// Function to fetch the dynamic form structure
export async function getFormStructure(rollNumber: string): Promise<FormResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/get-form?rollNumber=${rollNumber}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch form');
    }

    return data;
  } catch (error) {
    console.error('Error fetching form:', error);
    throw error;
  }
}