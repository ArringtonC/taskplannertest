/**
 * API configuration for backend services
 */

// Vite-compatible API base URL
const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export { API_BASE_URL };

/**
 * Get auth token from local storage
 * @returns The token or null if not found
 */
export const getAuthToken = (): string | null => {
  const token = localStorage.getItem('token');
  console.log('Retrieved token from storage:', token ? 'present' : 'missing');
  return token;
};

/**
 * Set auth token in local storage
 * @param token JWT token to store
 */
export const setAuthToken = (token: string): void => {
  console.log('Saving token to storage');
  localStorage.setItem('token', token);
};

/**
 * Remove auth token from local storage
 */
export const removeAuthToken = (): void => {
  console.log('Removing token from storage');
  localStorage.removeItem('token');
};

/**
 * Get common request headers including auth token if available
 * @returns Headers object with content type and auth token
 */
export const getHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const token = getAuthToken();
  if (token) {
    console.log('Adding token to request headers');
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    console.log('No token available for request headers');
  }

  return headers;
};

/**
 * Generic API error class
 */
export class ApiError extends Error {
  status: number;
  data?: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Handle API response and throw custom error if response is not ok
 * @param response Fetch response object
 * @returns Promise that resolves to the parsed JSON response
 */
export const handleApiResponse = async <T>(response: Response): Promise<T> => {
  console.log(`API response status: ${response.status}`);

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
      console.error('API error response:', errorData);
    } catch (e) {
      errorData = { message: 'Unknown error occurred' };
      console.error('Failed to parse error response:', e);
    }

    // Handle specific status codes
    if (response.status === 401) {
      console.error('Authentication error (401):', errorData.message);
    }

    throw new ApiError(
      errorData.message || `API error with status ${response.status}`,
      response.status,
      errorData
    );
  }

  return response.json() as Promise<T>;
};
