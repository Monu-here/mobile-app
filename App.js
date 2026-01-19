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
import RFIDScreen from './src/screens/RFIDScreen';
import VehicleScreen from './src/screens/VehicleScreen';
import EventScreen from './src/screens/EventScreen';
import AcademicCalendarScreen from './src/screens/AcademicCalendarScreen';
import CasteScreen from './src/screens/CasteScreen';
import ReligionScreen from './src/screens/ReligionScreen';
import RouteScreen from './src/screens/RouteScreen';
import ScholarshipScreen from './src/screens/ScholarshipScreen';
import SubjectScreen from './src/screens/SubjectScreen';
import NoticeScreen from './src/screens/NoticeScreen';
import ScheduleScreen from './src/screens/ScheduleScreen';
import StudentCategoryScreen from './src/screens/StudentCategoryScreen';
import PostScreen from './src/screens/PostScreen';
import RoutePickupPointScreen from './src/screens/RoutePickupPointScreen';
import LeaveTypeScreen from './src/screens/LeaveTypeScreen';
import PermissionScreen from './src/screens/PermissionScreen';
import StaffScreen from './src/screens/StaffScreen';
import StaffAttendanceScreen from './src/screens/StaffAttendanceScreen';
import ExamSubjectScheduleScreen from './src/screens/ExamSubjectScheduleScreen';
import ExamTypeScreen from './src/screens/ExamTypeScreen';
import ExamSetupScreen from './src/screens/ExamSetupScreen';
import MarkGradeScreen from './src/screens/MarkGradeScreen';
import ExamAttendanceScreen from './src/screens/ExamAttendanceScreen';
import MarkStoreScreen from './src/screens/MarkStoreScreen';
import ResultScreen from './src/screens/ResultScreen';
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
  const handleNavigateRfid = () => {
    setAppState('rfid');
  }
  const handleNavigateVehicle = () => {
    setAppState('vehicle');
  }
  const handleNavigateEvent = () => {
    setAppState('event');
  }

  const handleNavigateAcademicCalendar = () => {
    setAppState('academicCalendar');
  }

  const handleNavigateCaste = () => {
    setAppState('caste');
  }

  const handleNavigateReligion = () => {
    setAppState('religion');
  }

  const handleNavigateRoute = () => {
    setAppState('route');
  }

  const handleNavigateScholarship = () => {
    setAppState('scholarship');
  }

  const handleNavigateSubject = () => {
    setAppState('subject');
  }

  const handleNavigateNotice = () => {
    setAppState('notice');
  }

  const handleNavigateSchedule = () => {
    setAppState('schedule');
  }

  const handleNavigateStudentCategory = () => {
    setAppState('studentCategory');
  }

  const handleNavigatePost = () => {
    setAppState('post');
  }

  const handleNavigateRoutePickupPoint = () => {
    setAppState('routePickupPoint');
  }

  const handleNavigateLeaveType = () => {
    setAppState('leaveType');
  }

  const handleNavigatePermission = () => {
    setAppState('permission');
  }

  const handleNavigateStaff = () => {
    setAppState('staff');
  }

  const handleNavigateStaffAttendance = () => {
    setAppState('staffAttendance');
  }

  const handleNavigateExamSchedule = () => {
    setAppState('examSchedule');
  }

  const handleNavigateExamType = () => {
    setAppState('examType');
  }

  const handleNavigateExamSetup = () => {
    setAppState('examSetup');
  }

  const handleNavigateMarkGrade = () => {
    setAppState('markGrade');
  }

  const handleNavigateExamAttendance = () => {
    setAppState('examAttendance');
  }

  const handleNavigateMarkStore = () => {
    setAppState('markStore');
  }

  const handleNavigateResultList = () => {
    setAppState('resultList');
  }

  const handleNavigateMarkSheet = () => {
    setAppState('markSheet');
  }

  const handleNavigateAllMarkSheet = () => {
    setAppState('allMarkSheet');
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
          onNavigateRfid={handleNavigateRfid}
          onNavigateVehicle={handleNavigateVehicle}
          onNavigateEvent={handleNavigateEvent}
          onNavigateAcademicCalendar={handleNavigateAcademicCalendar}
          onNavigateCaste={handleNavigateCaste}
          onNavigateReligion={handleNavigateReligion}
          onNavigateRoute={handleNavigateRoute}
          onNavigateScholarship={handleNavigateScholarship}
          onNavigateSubject={handleNavigateSubject}
          onNavigateNotice={handleNavigateNotice}
          onNavigateSchedule={handleNavigateSchedule}
          onNavigateStudentCategory={handleNavigateStudentCategory}
          onNavigatePost={handleNavigatePost}
          onNavigateRoutePickupPoint={handleNavigateRoutePickupPoint}
          onNavigateLeaveType={handleNavigateLeaveType}
          onNavigatePermission={handleNavigatePermission}
          onNavigateStaff={handleNavigateStaff}
          onNavigateStaffAttendance={handleNavigateStaffAttendance}
          onNavigateExamSchedule={handleNavigateExamSchedule}
          onNavigateExamType={handleNavigateExamType}
          onNavigateExamSetup={handleNavigateExamSetup}
          onNavigateMarkGrade={handleNavigateMarkGrade}
          onNavigateExamAttendance={handleNavigateExamAttendance}
          onNavigateMarkStore={handleNavigateMarkStore}
          onNavigateResultList={handleNavigateResultList}
          onNavigateMarkSheet={handleNavigateMarkSheet}
          onNavigateAllMarkSheet={handleNavigateAllMarkSheet}
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
      {appState === 'rfid' && <RFIDScreen onBack={() => setAppState('home')} />}
      {appState === 'vehicle' && <VehicleScreen onBack={() => setAppState('home')} />}
      {appState === 'event' && <EventScreen onBack={() => setAppState('home')} />}
      {appState === 'academicCalendar' && <AcademicCalendarScreen onBack={() => setAppState('home')} />}
      {appState === 'caste' && <CasteScreen onBack={() => setAppState('home')} />}
      {appState === 'religion' && <ReligionScreen onBack={() => setAppState('home')} />}
      {appState === 'route' && <RouteScreen onBack={() => setAppState('home')} />}
      {appState === 'scholarship' && <ScholarshipScreen onBack={() => setAppState('home')} />}
      {appState === 'subject' && <SubjectScreen onBack={() => setAppState('home')} />}
      {appState === 'notice' && <NoticeScreen onBack={() => setAppState('home')} />}
      {appState === 'schedule' && <ScheduleScreen onBack={() => setAppState('home')} />}
      {appState === 'studentCategory' && <StudentCategoryScreen onBack={() => setAppState('home')} />}
      {appState === 'post' && <PostScreen onBack={() => setAppState('home')} />}
      {appState === 'routePickupPoint' && <RoutePickupPointScreen onBack={() => setAppState('home')} />}
      {appState === 'leaveType' && <LeaveTypeScreen onBack={() => setAppState('home')} />}
      {appState === 'permission' && <PermissionScreen onBack={() => setAppState('home')} />}
      {appState === 'staff' && <StaffScreen onBack={() => setAppState('home')} />}
      {appState === 'staffAttendance' && <StaffAttendanceScreen onBack={() => setAppState('home')} />}
      {appState === 'examSchedule' && <ExamSubjectScheduleScreen onBack={() => setAppState('home')} />}
      {appState === 'examType' && <ExamTypeScreen onBack={() => setAppState('home')} />}
      {appState === 'examSetup' && <ExamSetupScreen onBack={() => setAppState('home')} />}
      {appState === 'markGrade' && <MarkGradeScreen onBack={() => setAppState('home')} />}
      {appState === 'examAttendance' && <ExamAttendanceScreen onBack={() => setAppState('home')} />}
      {appState === 'markStore' && <MarkStoreScreen onBack={() => setAppState('home')} />}
      {appState === 'resultList' && <ResultScreen mode="resultList" onBack={() => setAppState('home')} />}
      {appState === 'markSheet' && <ResultScreen mode="markSheet" onBack={() => setAppState('home')} />}
      {appState === 'allMarkSheet' && <ResultScreen mode="allMarkSheet" onBack={() => setAppState('home')} />}
      {/* Global Toast container */}
      <Toast />
    </>
  );
}

// Render Toast at the top-level so any screen can call showToast()
// Note: Toast is included in the component tree above via import and will be rendered inside App's return.
