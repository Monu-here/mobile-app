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
  Keyboard,
} from 'react-native';
import apiService from '../api/apiService';
import { showToast } from '../components/Toast';

export default function EventScreen({ onBack }) {
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [status, setStatus] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiService.getEvents();
      const data = Array.isArray(result.data) ? result.data : [];
      setEvents(data);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events');
      showToast('Failed to load events', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!name.trim() || !description.trim() || !startDate.trim() || !endDate.trim()) {
      showToast('Please fill all required fields', 'error');
      return;
    }

    Keyboard.dismiss(); // Dismiss keyboard before submitting
    setSubmitting(true);
    try {
      // Send as regular JSON (no image)
      let payload = {
        name: name.trim(),
        description: description.trim(),
        start_date: startDate.trim(),
        end_date: endDate.trim(),
        status: status ? 1 : 0,
      };

      // For PUT requests, add _method field
      if (editingId) {
        payload._method = 'POST';
        await apiService.updateEvent(editingId, payload);
        showToast('Event updated successfully', 'success');
      } else {
        await apiService.addEvent(payload);
        showToast('Event added successfully', 'success');
      }

      await fetchEvents();
      handleReset();
    } catch (err) {
      console.error('Error saving event:', err);
      showToast(err?.message || 'Failed to save event', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (item) => {
    setName(item.name);
    setDescription(item.description);
    setStartDate(item.start_date);
    setEndDate(item.end_date);
    setImageUrl(item.image || '');
    setStatus(item.status === 1 || item.status === true);
    setEditingId(item.id);
  };

  const handleDelete = async (id) => {
    try {
      await apiService.deleteEvent(id);
      showToast('Event deleted successfully', 'success');
      await fetchEvents();
    } catch (err) {
      console.error('Error deleting event:', err);
      showToast('Failed to delete event', 'error');
    }
  };

  const handleReset = () => {
    setName('');
    setDescription('');
    setStartDate('');
    setEndDate('');
    setImageUrl('');
    setStatus(true);
    setEditingId(null);
    setError(null);
  };

  const renderItem = ({ item }) => {
    const statusValue = Number(item.status);
    const isActive = statusValue === 1;
    const statusText = isActive ? 'Active' : 'Inactive';
    const statusColor = isActive ? '#4CAF50' : '#FF9800';

    return (
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <View style={styles.cardMetaRow}>
              <Text style={styles.cardMeta}>
                {item.start_date} to {item.end_date}
              </Text>
              <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
                <Text style={styles.statusBadgeText}>{statusText}</Text>
              </View>
            </View>
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
        <Text style={styles.title}>Events</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.form}>
        <TextInput
          placeholder="Event Name"
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
          placeholder="Start Date (YYYYMMDD)"
          value={startDate}
          onChangeText={setStartDate}
          keyboardType="number-pad"
          style={styles.input}
        />

        <TextInput
          placeholder="End Date (YYYYMMDD)"
          value={endDate}
          onChangeText={setEndDate}
          keyboardType="number-pad"
          style={styles.input}
        />

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Active</Text>
          <Switch value={status} onValueChange={setStatus} />
        </View>

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
                {editingId ? 'Update Event' : 'Add Event'}
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
        ) : events.length === 0 ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: '#999', fontSize: 16 }}>No events found</Text>
          </View>
        ) : (
          <FlatList
            data={events}
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
