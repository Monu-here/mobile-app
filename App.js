import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import OnboardingScreen from './src/screens/OnboardingScreen';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import Toast from './src/components/Toast';
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

          // Validate token / get user info from backend
          try {
            const res = await apiService.authCheck();
            const user = res?.user || res?.raw?.data || res?.raw || null;
            setUser(user);
            setAppState('home');
          } catch (err) {
            // Token invalid or auth-check failed
            console.warn('Auth check failed:', err);
            // Clear local token and go to login
            try {
              // best-effort clear
              const { clearToken } = apiService;
              clearToken && clearToken();
            } catch (e) {}
            setAppState('login');
          }
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
    // Normalize userData which may be either the raw user object or a wrapper { email, user }
    const normalized = userData?.user ?? userData;
    setUser(normalized);
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
      {/* Global Toast container */}
      <Toast />
    </>
  );
}

// Render Toast at the top-level so any screen can call showToast()
// Note: Toast is included in the component tree above via import and will be rendered inside App's return.
