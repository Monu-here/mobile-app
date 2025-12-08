import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import OnboardingScreen from './src/screens/OnboardingScreen';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SchoolSettingsScreen from './src/screens/SchoolSettingsScreen';
import SettingsListScreen from './src/screens/SettingsListScreen';
import AcademicYearScreen from './src/screens/AcademicYearScreen';
import BranchScreen from './src/screens/BranchScreen';
import PickupPointScreen from './src/screens/PickupPointScreen';
import GradeScreen from './src/screens/GradeScreen';
import SectionScreen from './src/screens/SectionScreen';
import Toast from './src/components/Toast';
import { isOnboardingCompleted, getToken, setOnboardingCompleted } from './src/utils/storage';
import apiService from './src/api/apiService';
import { getFcmToken } from './src/utils/storage';
import { showToast } from './src/components/Toast';

export default function App() {
  const [appState, setAppState] = useState('loading'); // 'loading', 'onboarding', 'login', 'home', 'profile', 'schoolSettings'
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

            // If client stored an FCM token earlier, register it with backend
            try {
              const fcmToken = await getFcmToken();
              if (fcmToken) {
                await apiService.subscribe(fcmToken);
                showToast('Device subscribed for push notifications', 'success');
              }
            } catch (subErr) {
              console.warn('FCM subscribe error:', subErr);
            }

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

  const handleNavigateProfile = () => {
    setAppState('profile');
  };

  const handleNavigateSchoolSettings = () => {
    setAppState('schoolSettings');
  };

  const handleNavigateAcademicYear = () => {
    setAppState('academicYear');
  };
  const handleNavigateBranch = () => {
    setAppState('branch');
  }
  const handleNavigatePickupPoint = () => {
    setAppState('pickupPoint');
  }
  const handleNavigateGrade = () => {
    setAppState('grade');
  }
  const handleNavigateSection = () => {
    setAppState('section');
  }

  const handleNavigateSettingsList = () => {
    setAppState('settingsList');
  };

  const handleProfileBack = () => {
    setAppState('home');
  };

  const handleSchoolSettingsBack = () => {
    setAppState('home');
  };

  const handleSettingsListBack = () => {
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
      {appState === 'home' && (
        <HomeScreen
          user={user}
          onLogout={handleLogout}
          onNavigateProfile={handleNavigateProfile}
          onNavigateSchoolSettings={handleNavigateSchoolSettings}
          onNavigateAcademicYear={handleNavigateAcademicYear}
          onNavigateBranch={handleNavigateBranch}
          onNavigatePickupPoint={handleNavigatePickupPoint}
          onNavigateGrade={handleNavigateGrade}
          onNavigateSection={handleNavigateSection}
        />
      )}
      {appState === 'profile' && <ProfileScreen user={user} onBack={handleProfileBack} />}
      {appState === 'schoolSettings' && <SchoolSettingsScreen onBack={handleSchoolSettingsBack} />}
  {appState === 'settingsList' && <SettingsListScreen onBack={handleSettingsListBack} />}
    {appState === 'academicYear' && <AcademicYearScreen onBack={() => setAppState('home')} />}
    {appState === 'branch' && <BranchScreen onBack={() => setAppState('home')} />}
    {appState === 'pickupPoint' && <PickupPointScreen onBack={() => setAppState('home')} />}
    {appState === 'grade' && <GradeScreen onBack={() => setAppState('home')} />}
    {appState === 'section' && <SectionScreen onBack={() => setAppState('home')} />}
      {/* Global Toast container */}
      <Toast />
    </>
  );
}

// Render Toast at the top-level so any screen can call showToast()
// Note: Toast is included in the component tree above via import and will be rendered inside App's return.
