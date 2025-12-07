import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  AUTH_TOKEN: '@schoolapp_auth_token',
  USER_DATA: '@schoolapp_user_data',
  ONBOARDING_COMPLETED: '@schoolapp_onboarding_completed',
  REMEMBER_ME: '@schoolapp_remember_me',
};

/**
 * Store authentication token
 */
export const storeToken = async (token) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  } catch (error) {
    console.error('Error storing token:', error);
  }
};

/**
 * Retrieve authentication token
 */
export const getToken = async () => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
};

/**
 * Clear authentication token
 */
export const clearToken = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  } catch (error) {
    console.error('Error clearing token:', error);
  }
};

/**
 * Store user data
 */
export const storeUserData = async (userData) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
  } catch (error) {
    console.error('Error storing user data:', error);
  }
};

/**
 * Retrieve user data
 */
export const getUserData = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error retrieving user data:', error);
    return null;
  }
};

/**
 * Clear user data
 */
export const clearUserData = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
  } catch (error) {
    console.error('Error clearing user data:', error);
  }
};

/**
 * Mark onboarding as completed
 */
export const setOnboardingCompleted = async () => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
  } catch (error) {
    console.error('Error setting onboarding completed:', error);
  }
};

/**
 * Check if onboarding is completed
 */
export const isOnboardingCompleted = async () => {
  try {
    const completed = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
    return completed === 'true';
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return false;
  }
};

/**
 * Store remember me preference
 */
export const storeRememberMe = async (email) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.REMEMBER_ME, email);
  } catch (error) {
    console.error('Error storing remember me:', error);
  }
};

/**
 * Get remembered email
 */
export const getRememberedEmail = async () => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.REMEMBER_ME);
  } catch (error) {
    console.error('Error retrieving remembered email:', error);
    return null;
  }
};

/**
 * Clear remember me preference
 */
export const clearRememberMe = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);
  } catch (error) {
    console.error('Error clearing remember me:', error);
  }
};

/**
 * Clear all stored data (logout)
 */
export const clearAllData = async () => {
  try {
    await Promise.all([
      clearToken(),
      clearUserData(),
      clearRememberMe(),
    ]);
  } catch (error) {
    console.error('Error clearing all data:', error);
  }
};
