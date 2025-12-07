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
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [lastErrorDebug, setLastErrorDebug] = useState(null);

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
    // Trim values to avoid whitespace mismatch
    const e = {};
    const cur = (currentPassword || '').trim();
    const nw = (newPassword || '').trim();
    const cf = (confirmPassword || '').trim();

    if (!cur) e.current = 'Current password is required';
    if (!nw) e.new = 'New password is required';
    if (nw && nw.length < 6) e.new = 'New password must be at least 6 characters';
    if (nw !== cf) e.confirm = 'Passwords do not match';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChangePassword = async () => {
    if (!validatePasswordForm()) return;
    setLoading(true);
    try {
      // Log attempt (do not include passwords)
      // eslint-disable-next-line no-console
      console.log('[ProfileScreen] changePassword attempt for user:', user?.user_id ?? user?.id ?? 'unknown');

      const res = await apiService.changePassword(currentPassword.trim(), newPassword.trim());

      // Log success response
      // eslint-disable-next-line no-console
      console.log('[ProfileScreen] changePassword success:', res);

      showToast(res.message || 'Password changed successfully', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setLastErrorDebug(null);
    } catch (err) {
      // Try to extract validation messages from backend and log full error
      // eslint-disable-next-line no-console
      console.error('[ProfileScreen] changePassword error:', err);

      let message = 'Failed to change password';
      if (err?.data) {
        if (err.data.errors) {
          const firstKey = Object.keys(err.data.errors)[0];
          message = err.data.errors[firstKey][0];
        } else if (err.data.message) {
          message = err.data.message;
        } else if (typeof err.data === 'string') {
          message = err.data;
        }
        // store raw data for debug copy-paste
        setLastErrorDebug(err.data);
      } else if (err?.message) {
        message = err.message;
        setLastErrorDebug({ message: err.message });
      } else {
        setLastErrorDebug(err);
      }

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
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              secureTextEntry={!showCurrent}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="Current password"
            />
            <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)} style={styles.eyeBtn}>
              <Text style={styles.eyeText}>{showCurrent ? '👁️' : '👁️‍🗨️'}</Text>
            </TouchableOpacity>
          </View>
          {errors.current && <Text style={styles.err}>{errors.current}</Text>}

          <Text style={styles.fieldLabel}>New Password</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              secureTextEntry={!showNew}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="New password"
            />
            <TouchableOpacity onPress={() => setShowNew(!showNew)} style={styles.eyeBtn}>
              <Text style={styles.eyeText}>{showNew ? '👁️' : '👁️‍🗨️'}</Text>
            </TouchableOpacity>
          </View>
          {errors.new && <Text style={styles.err}>{errors.new}</Text>}

          <Text style={styles.fieldLabel}>Confirm New Password</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              secureTextEntry={!showConfirm}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm new password"
            />
            <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)} style={styles.eyeBtn}>
              <Text style={styles.eyeText}>{showConfirm ? '👁️' : '👁️‍🗨️'}</Text>
            </TouchableOpacity>
          </View>
          {errors.confirm && <Text style={styles.err}>{errors.confirm}</Text>}

          <TouchableOpacity style={styles.btn} onPress={handleChangePassword} disabled={loading}>
            {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.btnText}>Change Password</Text>}
          </TouchableOpacity>
          {lastErrorDebug && (
            <View style={{ marginTop: 12 }}>
              <Text style={{ fontSize: 12, color: '#999' }}>Last error (debug):</Text>
              <Text style={{ fontSize: 11, color: '#b00', marginTop: 6 }}>{JSON.stringify(lastErrorDebug)}</Text>
            </View>
          )}
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
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eyeBtn: {
    padding: 8,
    marginLeft: 8,
  },
  eyeText: {
    fontSize: 18,
  },
});
