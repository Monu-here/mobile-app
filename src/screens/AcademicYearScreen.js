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
      console.log('Adding academic year with payload:', payload);
      const res = await apiService.addAcademicYear(payload);
      console.log('Add response:', res);
      setLastResponseDebug(JSON.stringify(res?.raw || res, null, 2));

      showToast(res?.message || 'Academic year added successfully', 'success');
      
      // Immediately reset form
      setName('');
      setStartDate('');
      setEndDate('');
      setStatus(true);
      
      // Force a refresh from the API
      console.log('Refreshing academic years list...');
      await fetchYears();
      console.log('List refreshed after add');
    } catch (err) {
      console.error('addAcademicYear error:', err);
      const msg = err?.message || (err?.data && JSON.stringify(err.data)) || 'Failed to add academic year';
      showToast(msg, 'error');
      setLastResponseDebug(JSON.stringify({
        error: err,
        message: msg,
        payload
      }, null, 2));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      console.log('Deleting academic year with id:', id);
      const res = await apiService.deleteAcademicYear(id);
      console.log('Delete response:', res);
      showToast('Academic year deleted successfully', 'success');
      
      // Wait for list to refresh before returning
      console.log('Refreshing list after delete...');
      await fetchYears();
      console.log('List refreshed after delete');
    } catch (err) {
      console.error('Error deleting academic year:', err);
      showToast('Failed to delete academic year', 'error');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.cardMeta}>Start: {item.start_date} • End: {item.end_date} • Status: {item.status ? 'Active' : 'Inactive'}</Text>
        </View>
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => handleDelete(item.id)}
        >
          <Text style={styles.deleteButtonText}>🗑️ Delete</Text>
        </TouchableOpacity>
      </View>
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
          placeholder="Start Year (e.g. 2025)"
          value={startDate}
          onChangeText={setStartDate}
          keyboardType="numeric"
          style={styles.input}
        />
        <TextInput
          placeholder="End Year (e.g. 2026)"
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
  cardContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTextContainer: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A1A' },
  cardMeta: { fontSize: 13, color: '#666', marginTop: 6 },
  deleteButton: { 
    backgroundColor: '#E53935', 
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginLeft: 12
  },
  deleteButtonText: { 
    color: '#FFF', 
    fontWeight: '700',
    fontSize: 12
  },
  errorText: { color: '#E53935', textAlign: 'center', marginTop: 12 },
});
