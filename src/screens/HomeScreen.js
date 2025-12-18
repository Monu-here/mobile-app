import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Menu from '../components/Menu';

// Helper to map role id to readable label
function getRoleLabel(role) {
  const map = {
    0: 'Super Admin',
    1: 'Admin',
    2: 'Teacher',
    3: 'Student',
  };
  return map[role] || `Role ${role ?? 'N/A'}`;
}

function renderRoleSpecific(user) {
  if (!user) return <Text style={{ color: '#666' }}>No user data available.</Text>;

  const role = user.role ?? user?.raw?.role ?? null;

    if (role === 3) {
    // Student
    const student = user.student || user?.raw?.student || {};
    return (
      <View style={styles.roleBox}>
        <Text style={styles.roleHeading}>Student Info</Text>
        <Text style={styles.roleTextSmall}>Grade: {student?.grade ?? '—'}</Text>
        <Text style={styles.roleTextSmall}>Section: {student?.section ?? '—'}</Text>
        <Text style={styles.roleTextSmall}>Roll Number: {student?.roll_number ?? '—'}</Text>
      </View>
    );
  }

  if (role === 2) {
    // Teacher
    const teacher = user.teacher || user?.raw?.teacher || [];
    return (
      <View style={styles.roleBox}>
        <Text style={styles.roleHeading}>Teacher Assignments</Text>
        {Array.isArray(teacher) && teacher.length > 0 ? (
          teacher.map((t, idx) => (
            <Text key={String(idx)} style={styles.roleTextSmall}>
              Grade ID: {t?.grade_id ?? '—'} • Section ID: {t?.section_id ?? '—'}
            </Text>
          ))
        ) : (
          <Text style={styles.roleTextSmall}>No assignment data available.</Text>
        )}
      </View>
    );
  }

  if (role === 0) {
    // Superadmin - show permissions/timestamp
    const permissions = user.permissions || user?.raw?.permissions || [];
    return (
      <View style={styles.roleBox}>
        <Text style={styles.roleHeading}>Super Admin</Text>
        <Text style={styles.roleTextSmall}>Permissions: {Array.isArray(permissions) ? permissions.join(', ') || '—' : '—'}</Text>
        <Text style={styles.roleTextSmall}>Timestamp: {user.timestamp ?? user?.raw?.timestamp ?? '—'}</Text>
      </View>
    );
  }

  // Default
  return (
    <View style={styles.roleBox}>
      <Text style={styles.roleHeading}>Account</Text>
      <Text style={styles.roleTextSmall}>Role: {getRoleLabel(role)}</Text>
    </View>
  );
}

export default function HomeScreen({ user, onLogout, onNavigateProfile, onNavigateSchoolSettings, onNavigateAcademicYear ,onNavigateBranch,onNavigatePickupPoint,onNavigateGrade,onNavigateSection,onNavigateRfid,onNavigateVehicle,onNavigateEvent,onNavigateAcademicCalendar,onNavigateCaste,onNavigateReligion,onNavigateRoute,onNavigateScholarship,onNavigateSubject,onNavigateNotice,onNavigateSchedule,onNavigateStudentCategory,onNavigatePost,onNavigateRoutePickupPoint,onNavigateLeaveType}) {
  const [menuVisible, setMenuVisible] = useState(false);

  const handleMenuItemPress = (item) => {
    console.log('Menu item pressed:', item.title);
    // Handle menu item navigation here
    if (item.id === '6.1') {
      // School Settings
      console.log('Navigating to School Settings');
      if (onNavigateSchoolSettings) {
        onNavigateSchoolSettings();
      }
      setMenuVisible(false);
    } else if (item.id === '6.2') {
       console.log('Navigating to User Preferences');
    } else if (item.id === '6.5') {
      // Academic Year
      console.log('Navigating to Academic Year');
      if (onNavigateAcademicYear) {
        onNavigateAcademicYear();
      }
    } else if (item.id === '6.6') {
      // Branch
      if (onNavigateBranch) {
        onNavigateBranch();
      }
      console.log('Navigating to Branch');
    } else if (item.id === '6.7') {
      // Pickup Point
      if (onNavigatePickupPoint) {
        onNavigatePickupPoint();
      }
      console.log('Navigating to Pickup Point');
    } else if (item.id === '6.8') {
      // Grade
      if (onNavigateGrade) {
        onNavigateGrade();
      }
      console.log('Navigating to Grade');
    } else if (item.id === '6.9') {
      // Section
      if (onNavigateSection) {
        onNavigateSection();
      }
      console.log('Navigating to Section');
    } else if (item.id === '6.10') {
      // RFID
      if (onNavigateRfid) {
        onNavigateRfid();
      }
      console.log('Navigating to RFID');
    } else if (item.id === '6.11') {
      // Vehicle
      if (onNavigateVehicle) {
        onNavigateVehicle();
      }
      console.log('Navigating to Vehicle');
    } else if (item.id === '6.12') {
      // Event
      if (onNavigateEvent) {
        onNavigateEvent();
      }
      console.log('Navigating to Event');
    } else if (item.id === '6.13') {
      // Academic Calendar
      if (onNavigateAcademicCalendar) {
        onNavigateAcademicCalendar();
      }
      console.log('Navigating to Academic Calendar');
    } else if (item.id === '6.14') {
      // Caste
      if (onNavigateCaste) {
        onNavigateCaste();
      }
      console.log('Navigating to Caste');
    } else if (item.id === '6.15') {
      // Religion
      if (onNavigateReligion) {
        onNavigateReligion();
      }
      console.log('Navigating to Religion');
    } else if (item.id === '6.16') {
      // Route
      if (onNavigateRoute) {
        onNavigateRoute();
      }
      console.log('Navigating to Route');
    } else if (item.id === '6.17') {
      // Scholarship
      if (onNavigateScholarship) {
        onNavigateScholarship();
      }
      console.log('Navigating to Scholarship');
    } else if (item.id === '6.18') {
      // Subject
      if (onNavigateSubject) {
        onNavigateSubject();
      }
      console.log('Navigating to Subject');
    } else if (item.id === '6.19') {
      // Notice
      if (onNavigateNotice) {
        onNavigateNotice();
      }
      console.log('Navigating to Notice');
    } else if (item.id === '6.20') {
      // Schedule
      if (onNavigateSchedule) {
        onNavigateSchedule();
      }
      console.log('Navigating to Schedule');
    } else if (item.id === '6.21') {
      // Student Category
      if (onNavigateStudentCategory) {
        onNavigateStudentCategory();
      }
      console.log('Navigating to Student Category');
    } else if (item.id === '6.22') {
      // Post
      if (onNavigatePost) {
        onNavigatePost();
      }
      console.log('Navigating to Post');
    } else if (item.id === '6.23') {
      // Route Pickup Point
      if (onNavigateRoutePickupPoint) {
        onNavigateRoutePickupPoint();
      }
      console.log('Navigating to Route Pickup Point');
    } else if (item.id === '6.24') {
      // Leave Type
      if (onNavigateLeaveType) {
        onNavigateLeaveType();
      }
      console.log('Navigating to Leave Type');
    } else if (item.id === '6.4') {
      // Privacy & Security
      console.log('Navigating to Privacy & Security');
    }
    // Add more navigation handlers as needed
  };

  const menuItems = [
    { id: '1', title: 'Dashboard', icon: '📊', color: '#6C63FF' },
    { id: '2', title: 'Classes', icon: '📚', color: '#00BFA6' },
    { id: '3', title: 'Attendance', icon: '✓', color: '#FF6B6B' },
    { id: '4', title: 'Messages', icon: '💬', color: '#FFA41B' },
    { id: '5', title: 'Reports', icon: '📄', color: '#00D4FF' },
    { id: '6', title: 'Settings', icon: '⚙️', color: '#9C63FF' },
  ];

  const renderMenuItem = ({ item }) => (
    <TouchableOpacity style={[styles.menuCard, { borderLeftColor: item.color }]}>
      <Text style={styles.menuIcon}>{item.icon}</Text>
      <Text style={styles.menuTitle}>{item.title}</Text>
      <Text style={styles.menuArrow}>→</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome Back! 👋</Text>
            <Text style={styles.email}>{user?.name || user?.email || 'User'}</Text>
            <Text style={styles.roleText}>{getRoleLabel(user?.role)}</Text>
          </View>
          <TouchableOpacity style={styles.menuButton} onPress={() => setMenuVisible(true)}>
            <Text style={styles.menuButtonText}>☰</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileButton} onPress={onNavigateProfile}>
            <Text style={styles.profileIcon}>👤</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: '#E8E4F8' }]}>
            <Text style={styles.statIcon}>📊</Text>
            <Text style={styles.statLabel}>Classes</Text>
            <Text style={styles.statValue}>12</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#E0F7F4' }]}>
            <Text style={styles.statIcon}>👥</Text>
            <Text style={styles.statLabel}>Students</Text>
            <Text style={styles.statValue}>485</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#FFE8E8' }]}>
            <Text style={styles.statIcon}>✓</Text>
            <Text style={styles.statLabel}>Attendance</Text>
            <Text style={styles.statValue}>94%</Text>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          <FlatList
            data={menuItems}
            renderItem={renderMenuItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.menuList}
          />
        </View>

        {/* Role-specific info */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Account Details</Text>
          {renderRoleSpecific(user)}
        </View>

        {/* Coming Soon Section */}
        <View style={styles.comingSoonContainer}>
          <Text style={styles.comingSoonTitle}>🚀 Features Coming Soon</Text>
          <Text style={styles.comingSoonText}>
            More features will be available once you integrate the backend APIs.
          </Text>
          <Text style={styles.comingSoonSubtext}>
            Ready to add your API? Just provide the endpoints and authentication details.
          </Text>
        </View>
      </ScrollView>

      {/* Menu Modal */}
      <Menu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onMenuItemPress={handleMenuItemPress}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
    paddingVertical: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  email: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6C63FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  menuButtonText: {
    fontSize: 20,
    color: '#FFF',
    fontWeight: '700',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
  },
  statCard: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 11,
    color: '#666',
    fontWeight: '600',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  sectionContainer: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 14,
    letterSpacing: 0.2,
  },
  menuList: {
    gap: 8,
  },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  menuIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
    flex: 1,
  },
  menuArrow: {
    fontSize: 16,
    color: '#DDD',
    fontWeight: '600',
  },
  comingSoonContainer: {
    backgroundColor: '#E8E4F8',
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    marginBottom: 24,
  },
  comingSoonTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6C63FF',
    marginBottom: 8,
    textAlign: 'center',
  },
  comingSoonText: {
    fontSize: 13,
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '500',
  },
  comingSoonSubtext: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontWeight: '400',
  },
  profileButton: {
    marginLeft: 8,
    backgroundColor: '#EEE',
    padding: 8,
    borderRadius: 20,
  },
  profileIcon: {
    fontSize: 18,
  },
  roleBox: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  roleHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  roleTextSmall: {
    fontSize: 13,
    color: '#444',
    marginBottom: 6,
  },
  roleText: {
    fontSize: 12,
    color: '#666',
  },
});
