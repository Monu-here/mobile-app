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
  Keyboard,
} from 'react-native';
import apiService from '../api/apiService';
import { showToast } from '../components/Toast';

export default function AcademicCalendarScreen({ onBack }) {
  const [loading, setLoading] = useState(false);
  const [calendars, setCalendars] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCalendars();
  }, []);

  const fetchCalendars = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiService.getAcademicCalendars();
      const data = Array.isArray(result.data) ? result.data : [];
      setCalendars(data);
    } catch (err) {
      console.error('Error fetching calendars:', err);
      setError('Failed to load calendars');
      showToast('Failed to load calendars', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Extract year, month, day from YYYYMMDD format
  const extractDateComponents = (dateStr) => {
    if (!dateStr || dateStr.length !== 8) return { year: '', month: '', day: '' };
    return {
      year: dateStr.substring(0, 4),
      month: dateStr.substring(4, 6),
      day: dateStr.substring(6, 8),
    };
  };

  const handleAdd = async () => {
    if (!name.trim() || !date.trim() || !description.trim()) {
      showToast('Please fill all required fields', 'error');
      return;
    }

    if (date.length !== 8) {
      showToast('Date must be in YYYYMMDD format', 'error');
      return;
    }

    Keyboard.dismiss();
    setSubmitting(true);
    try {
      const { year, month, day } = extractDateComponents(date);

      const payload = {
        name: name.trim(),
        date: date.trim(),
        description: description.trim(),
        year: year,
        month: month,
        day: day,
        _method: editingId ? 'POST' : undefined,
      };

      // Remove _method if not editing
      if (!editingId) {
        delete payload._method;
      }

      if (editingId) {
        await apiService.updateAcademicCalendar(editingId, payload);
        showToast('Calendar updated successfully', 'success');
      } else {
        await apiService.addAcademicCalendar(payload);
        showToast('Calendar added successfully', 'success');
      }

      await fetchCalendars();
      handleReset();
    } catch (err) {
      console.error('Error saving calendar:', err);
      showToast(err?.message || 'Failed to save calendar', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (item) => {
    setName(item.name);
    setDescription(item.description);
    setDate(item.date || '');
    setEditingId(item.id);
  };

  const handleDelete = async (id) => {
    try {
      await apiService.deleteAcademicCalendar(id);
      showToast('Calendar deleted successfully', 'success');
      // Wait a moment for backend cache to clear, then refetch
      setTimeout(() => {
        fetchCalendars();
      }, 500);
    } catch (err) {
      console.error('Error deleting calendar:', err);
      showToast('Failed to delete calendar', 'error');
    }
  };

  const handleReset = () => {
    setName('');
    setDescription('');
    setDate('');
    setEditingId(null);
    setError(null);
  };

  const renderItem = ({ item }) => {
    const { year, month, day } = extractDateComponents(item.date);

    return (
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardMeta}>
              {item.date} ({day}/{month}/{year})
            </Text>
            <Text style={styles.cardMeta}>{item.description}</Text>
          </View>
          <View style={styles.cardButtonContainer}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEdit(item)}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDelete(item.id)}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Academic Calendar</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.form}>
        <TextInput
          placeholder="Calendar Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        <TextInput
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          style={[styles.input, styles.descriptionInput]}
          multiline
          numberOfLines={3}
        />

        <TextInput
          placeholder="Date (YYYYMMDD)"
          value={date}
          onChangeText={setDate}
          keyboardType="number-pad"
          maxLength={8}
          style={styles.input}
        />

        {date.length === 8 && (
          <View style={styles.datePreview}>
            <Text style={styles.datePreviewText}>
              Parsed: {extractDateComponents(date).year}-
              {extractDateComponents(date).month}-
              {extractDateComponents(date).day}
            </Text>
          </View>
        )}

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.submitButton, { flex: 1 }]}
            onPress={handleAdd}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.submitText}>
                {editingId ? 'Update Calendar' : 'Add Calendar'}
              </Text>
            )}
          </TouchableOpacity>
          {editingId && (
            <TouchableOpacity
              style={[styles.cancelButton, { marginLeft: 8 }]}
              onPress={handleReset}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>

      <View style={styles.listContainer}>
        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#6C63FF" />
          </View>
        ) : calendars.length === 0 ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: '#999', fontSize: 16 }}>No calendars found</Text>
          </View>
        ) : (
          <FlatList
            data={calendars}
            renderItem={renderItem}
            keyExtractor={(item) => String(item.id)}
            scrollEnabled={true}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
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
  descriptionInput: {
    textAlignVertical: 'top',
    paddingTop: 10,
    minHeight: 80,
  },
  datePreview: {
    backgroundColor: '#F5F5F5',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#6C63FF',
  },
  datePreviewText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 13,
  },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  switchLabel: { fontSize: 14, color: '#333', fontWeight: '600' },
  submitButton: { backgroundColor: '#6C63FF', padding: 12, borderRadius: 10, alignItems: 'center' },
  submitText: { color: '#FFF', fontWeight: '700' },
  listContainer: { flex: 1, paddingHorizontal: 12 },
  card: { backgroundColor: '#FFF', padding: 12, borderRadius: 10, marginVertical: 8 },
  cardContent: { flexDirection: 'column' },
  cardTextContainer: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A1A', marginBottom: 4 },
  cardMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardMeta: { fontSize: 12, color: '#999', flex: 1 },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  statusBadgeText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },
  cardButtonContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#2196F3',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 12,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#E53935',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  cancelButton: {
    backgroundColor: '#999',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },
  errorText: { color: '#E53935', textAlign: 'center', marginTop: 12 },
});
