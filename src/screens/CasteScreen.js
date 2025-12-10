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

export default function CasteScreen({ onBack }) {
  const [loading, setLoading] = useState(false);
  const [castes, setCastes] = useState([]);
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCastes();
  }, []);

  const fetchCastes = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiService.getCastes();
      const data = Array.isArray(result.data) ? result.data : [];
      setCastes(data);
    } catch (err) {
      console.error('Error fetching castes:', err);
      setError('Failed to load castes');
      showToast('Failed to load castes', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!name.trim()) {
      showToast('Please enter caste name', 'error');
      return;
    }

    Keyboard.dismiss();
    setSubmitting(true);
    try {
      const payload = { name: name.trim() };

      if (editingId) {
        await apiService.updateCaste(editingId, payload);
        showToast('Caste updated successfully', 'success');
      } else {
        await apiService.addCaste(payload);
        showToast('Caste added successfully', 'success');
      }

      await fetchCastes();
      handleReset();
    } catch (err) {
      console.error('Error saving caste:', err);
      showToast(err?.message || 'Failed to save caste', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (item) => {
    setName(item.name);
    setEditingId(item.id);
  };

  const handleDelete = async (id) => {
    try {
      await apiService.deleteCaste(id);
      showToast('Caste deleted successfully', 'success');
      setTimeout(() => {
        fetchCastes();
      }, 500);
    } catch (err) {
      console.error('Error deleting caste:', err);
      showToast('Failed to delete caste', 'error');
    }
  };

  const handleReset = () => {
    setName('');
    setEditingId(null);
    setError(null);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardTitle}>{item.name}</Text>
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Caste</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.form}>
        <TextInput
          placeholder="Caste Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

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
                {editingId ? 'Update Caste' : 'Add Caste'}
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
        ) : castes.length === 0 ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: '#999', fontSize: 16 }}>No castes found</Text>
          </View>
        ) : (
          <FlatList
            data={castes}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
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
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 8,
  },
  backText: {
    color: '#6C63FF',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  form: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 14,
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  submitButton: {
    backgroundColor: '#6C63FF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#E8E8E8',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
  errorText: {
    color: '#E74C3C',
    marginTop: 8,
    fontSize: 12,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  cardButtonContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    backgroundColor: '#6C63FF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  editButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#E74C3C',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
});
