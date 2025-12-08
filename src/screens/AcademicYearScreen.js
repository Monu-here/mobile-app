import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Switch,
} from 'react-native';
import apiService from '../api/apiService';
import { showToast } from '../components/Toast';

export default function AcademicYearScreen({ onBack }) {
  const [loading, setLoading] = useState(false);
  const [years, setYears] = useState([]);
  const [error, setError] = useState(null);

  // Form state
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [lastResponseDebug, setLastResponseDebug] = useState(null);

  useEffect(() => {
    fetchYears();
  }, []);

  const fetchYears = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.getAcademicYears();
      // Normalize nested data shapes: res.data may be array or { data: [...] }
      const maybe = res?.data;
      const list = Array.isArray(maybe) ? maybe : (maybe?.data || maybe) || [];
      setYears(Array.isArray(list) ? list : []);
      setLastResponseDebug(JSON.stringify(res?.raw || res, null, 2));
    } catch (err) {
      console.error('getAcademicYears error:', err);
      setError(err?.message || 'Failed to load academic years');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!name || !startDate || !endDate) {
      showToast('Please fill name, start and end date', 'error');
      return;
    }

    const payload = {
      name,
      start_date: Number(startDate),
      end_date: Number(endDate),
      status: status ? 1 : 0,
    };

    setSubmitting(true);
    try {
      const res = await apiService.addAcademicYear(payload);
      // store debug
      setLastResponseDebug(JSON.stringify(res?.raw || res, null, 2));

      showToast(res?.message || 'Academic year added', 'success');
      // refresh list
      await fetchYears();
      // reset form
      setName('');
      setStartDate('');
      setEndDate('');
      setStatus(true);
    } catch (err) {
      console.error('addAcademicYear error:', err);
      const msg = err?.message || (err?.data && JSON.stringify(err.data)) || 'Failed to add academic year';
      showToast(msg, 'error');
      setLastResponseDebug(JSON.stringify(err || {}, null, 2));
    } finally {
      setSubmitting(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.name}</Text>
      <Text style={styles.cardMeta}>Start: {item.start_date} • End: {item.end_date} • Status: {item.status ? 'Active' : 'Inactive'}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Academic Years</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.form}>
        
        <TextInput
          placeholder="Name (e.g. 2025-2026)"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <TextInput
          placeholder="Start (numeric)"
          value={startDate}
          onChangeText={setStartDate}
          keyboardType="numeric"
          style={styles.input}
        />
        <TextInput
          placeholder="End (numeric)"
          value={endDate}
          onChangeText={setEndDate}
          keyboardType="numeric"
          style={styles.input}
        />
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Active</Text>
          <Switch value={status} onValueChange={setStatus} />
        </View>
        <TouchableOpacity style={styles.submitButton} onPress={handleAdd} disabled={submitting}>
          {submitting ? <ActivityIndicator color="#FFF" /> : <Text style={styles.submitText}>Add Academic Year</Text>}
        </TouchableOpacity>
      </View>

      <View style={styles.listContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#6C63FF" />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <FlatList
            data={years}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 40 }}
          />
        )}
      </View>
        
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {},
  backText: { color: '#6C63FF', fontWeight: '700' },
  title: { fontSize: 18, fontWeight: '800', color: '#1A1A1A' },
  form: { padding: 16, backgroundColor: '#FFF', margin: 12, borderRadius: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#EFEFEF',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#FFF',
  },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  switchLabel: { fontSize: 14, color: '#333', fontWeight: '600' },
  submitButton: { backgroundColor: '#6C63FF', padding: 12, borderRadius: 10, alignItems: 'center' },
  submitText: { color: '#FFF', fontWeight: '700' },
  listContainer: { flex: 1, paddingHorizontal: 12 },
  card: { backgroundColor: '#FFF', padding: 12, borderRadius: 10, marginVertical: 8 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A1A' },
  cardMeta: { fontSize: 13, color: '#666', marginTop: 6 },
  errorText: { color: '#E53935', textAlign: 'center', marginTop: 12 },
});
