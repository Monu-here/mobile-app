import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import OnboardingScreen from './src/screens/OnboardingScreen';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import { isOnboardingCompleted, getToken, setOnboardingCompleted } from './src/utils/storage';
import apiService from './src/api/apiService';

export default function App() {
  const [appState, setAppState] = useState('loading'); // 'loading', 'onboarding', 'login', 'home'
  const [user, setUser] = useState(null);

  // Initialize app state on mount
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check if onboarding is completed
        const onboardingDone = await isOnboardingCompleted();

        if (!onboardingDone) {
          setAppState('onboarding');
          return;
        }

        // Check if user is already logged in
        const token = await getToken();
        if (token) {
          apiService.setToken(token);
          setAppState('home');
        } else {
          setAppState('login');
        }
      } catch (error) {
        console.error('Error initializing app:', error);
        setAppState('login');
      }
    };

    initializeApp();
  }, []);

  const handleOnboardingDone = async () => {
    await setOnboardingCompleted();
    setAppState('login');
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setAppState('home');
  };

  const handleLogout = async () => {
    setUser(null);
    apiService.clearToken();
    setAppState('login');
  };

  const handleNavigateSignUp = () => {
    // TODO: Navigate to SignUp screen when created
    console.log('Navigate to Sign Up');
  };

  // Show loading screen while initializing
  if (appState === 'loading') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FAFAFA' }}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />
      {appState === 'onboarding' && <OnboardingScreen onDone={handleOnboardingDone} />}
      {appState === 'login' && (
        <LoginScreen onLoginSuccess={handleLoginSuccess} onNavigateSignUp={handleNavigateSignUp} />
      )}
      {appState === 'home' && <HomeScreen user={user} onLogout={handleLogout} />}
    </>
  );
}
