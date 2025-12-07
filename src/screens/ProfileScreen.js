import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import apiService from '../api/apiService';
import { getUserData } from '../utils/storage';
import { showToast } from '../components/Toast';

export default function ProfileScreen({ user: initialUser, onBack }) {
  const [user, setUser] = useState(initialUser || null);
  const [loading, setLoading] = useState(false);

  // Change password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const load = async () => {
      if (!user) {
        const stored = await getUserData();
        setUser(stored);
      }
    };
    load();
  }, [user]);
function getRoleLabel(role) {
  const map = {
    0: 'Super Admin',
    1: 'Admin',
    2: 'Teacher',
    3: 'Student',
  };
  return map[role] || `Role ${role ?? 'N/A'}`;
}

function getUserEmail(u) {
  return (
    u?.email ||
    u?.raw?.email ||
    u?.data?.email ||
    u?.user?.email ||
    u?.attributes?.email ||
    null
  );
}

function getUserName(u) {
  return (
    u?.name ||
    u?.raw?.name ||
    u?.data?.name ||
    u?.user?.name ||
    u?.attributes?.name ||
    null
  );
}

  const validatePasswordForm = () => {
    const e = {};
    if (!currentPassword) e.current = 'Current password is required';
    if (!newPassword) e.new = 'New password is required';
    if (newPassword && newPassword.length < 6) e.new = 'New password must be at least 6 characters';
    if (newPassword !== confirmPassword) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChangePassword = async () => {
    if (!validatePasswordForm()) return;
    setLoading(true);
    try {
      const res = await apiService.changePassword(currentPassword, newPassword);
      showToast(res.message || 'Password changed successfully', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      const message = err?.message || err?.data?.message || 'Failed to change password';
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.header}>My Profile</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>{getUserName(user) || '—'}</Text>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{getUserEmail(user) || '—'}</Text>
          <Text style={styles.label}>Role</Text>
          <Text style={styles.value}>{getRoleLabel(user?.role ?? user?.raw?.role)}</Text>
          {!getUserEmail(user) && (
            <View style={{ marginTop: 8 }}>
              <Text style={{ fontSize: 12, color: '#999' }}>Raw user data (debug):</Text>
              <Text style={{ fontSize: 11, color: '#444', marginTop: 6 }}>{JSON.stringify(user, null, 2)}</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Change Password</Text>
          <Text style={styles.fieldLabel}>Current Password</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="Current password"
          />
          {errors.current && <Text style={styles.err}>{errors.current}</Text>}

          <Text style={styles.fieldLabel}>New Password</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="New password"
          />
          {errors.new && <Text style={styles.err}>{errors.new}</Text>}

          <Text style={styles.fieldLabel}>Confirm New Password</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm new password"
          />
          {errors.confirm && <Text style={styles.err}>{errors.confirm}</Text>}

          <TouchableOpacity style={styles.btn} onPress={handleChangePassword} disabled={loading}>
            {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.btnText}>Change Password</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  content: { padding: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  backBtn: { padding: 6 },
  backText: { color: '#6C63FF', fontWeight: '700' },
  header: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '800' },
  section: { backgroundColor: '#FFF', padding: 16, borderRadius: 12, marginBottom: 16 },
  label: { fontSize: 12, color: '#666', marginTop: 8 },
  value: { fontSize: 16, fontWeight: '700', color: '#1A1A1A' },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  fieldLabel: { fontSize: 13, color: '#444', marginTop: 8 },
  input: { backgroundColor: '#F7F7F8', borderRadius: 10, padding: 10, marginTop: 6 },
  btn: { backgroundColor: '#6C63FF', padding: 12, borderRadius: 10, marginTop: 16, alignItems: 'center' },
  btnText: { color: '#FFF', fontWeight: '700' },
  err: { color: '#C0392B', marginTop: 6 },
});
