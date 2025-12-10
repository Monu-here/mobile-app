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
  Modal,
  ScrollView,
} from 'react-native';
import apiService from '../api/apiService';
import { showToast } from '../components/Toast';

export default function VehicleScreen({ onBack }) {
  const [loading, setLoading] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [name, setName] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [remoteVehicleId, setRemoteVehicleId] = useState('');
  const [status, setStatus] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiService.getVehicles();
      const data = Array.isArray(result.data) ? result.data : [];
      setVehicles(data);
    } catch (err) {
      console.error('Error fetching vehicles:', err);
      setError('Failed to load vehicles');
      showToast('Failed to load vehicles', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!name.trim() || !vehicleNumber.trim() || !remoteVehicleId.trim()) {
      showToast('Please fill all required fields', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        vehicle_number: parseInt(vehicleNumber, 10),
        remote_vehicle_id: parseInt(remoteVehicleId, 10),
        status: status ? 1 : 0,
      };

      if (editingId) {
        await apiService.updateVehicle(editingId, payload);
        showToast('Vehicle updated successfully', 'success');
      } else {
        await apiService.addVehicle(payload);
        showToast('Vehicle added successfully', 'success');
      }

      await fetchVehicles();
      handleReset();
    } catch (err) {
      console.error('Error saving vehicle:', err);
      showToast(err?.message || 'Failed to save vehicle', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (item) => {
    setName(item.name);
    setVehicleNumber(String(item.vehicle_number));
    setRemoteVehicleId(String(item.remote_vehicle_id));
    setStatus(item.status === 1 || item.status === true);
    setEditingId(item.id);
  };

  const handleDelete = async (id) => {
    try {
      await apiService.deleteVehicle(id);
      showToast('Vehicle deleted successfully', 'success');
      await fetchVehicles();
    } catch (err) {
      console.error('Error deleting vehicle:', err);
      showToast('Failed to delete vehicle', 'error');
    }
  };

  const handleReset = () => {
    setName('');
    setVehicleNumber('');
    setRemoteVehicleId('');
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
              <Text style={styles.cardMeta}>Vehicle No: {item.vehicle_number}</Text>
              <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
                <Text style={styles.statusBadgeText}>{statusText}</Text>
              </View>
            </View>
            <Text style={styles.cardMeta}>Remote ID: {item.remote_vehicle_id}</Text>
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
        <Text style={styles.title}>Vehicles</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.form}>
        <TextInput
          placeholder="Vehicle Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        <TextInput
          placeholder="Vehicle Number"
          value={vehicleNumber}
          onChangeText={setVehicleNumber}
          keyboardType="number-pad"
          style={styles.input}
        />

        <TextInput
          placeholder="Remote Vehicle ID"
          value={remoteVehicleId}
          onChangeText={setRemoteVehicleId}
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
                {editingId ? 'Update Vehicle' : 'Add Vehicle'}
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
        ) : vehicles.length === 0 ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: '#999', fontSize: 16 }}>No vehicles found</Text>
          </View>
        ) : (
          <FlatList
            data={vehicles}
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
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  switchLabel: { fontSize: 14, color: '#333', fontWeight: '600' },
  submitButton: { backgroundColor: '#6C63FF', padding: 12, borderRadius: 10, alignItems: 'center' },
  submitText: { color: '#FFF', fontWeight: '700' },
  listContainer: { flex: 1, paddingHorizontal: 12 },
  card: { backgroundColor: '#FFF', padding: 12, borderRadius: 10, marginVertical: 8 },
  cardContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTextContainer: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A1A' },
  cardMeta: { fontSize: 13, color: '#666', flex: 1 },
  cardMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
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
    marginLeft: 8,
  },
  editButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  editButtonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 12,
  },
  deleteButton: {
    backgroundColor: '#E53935',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
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
