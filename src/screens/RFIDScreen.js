import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Modal,
  Switch,
} from 'react-native';
import apiService from '../api/apiService';
import { showToast } from '../components/Toast';

export default function RFIDScreen({ onBack }) {
  const [loading, setLoading] = useState(true);
  const [rfids, setRfids] = useState([]);
  const [name, setName] = useState('');
  const [rfidNo, setRfidNo] = useState('');
  const [type, setType] = useState(1);
  const [status, setStatus] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [typeModalVisible, setTypeModalVisible] = useState(false);
  const [errors, setErrors] = useState({});

  const typeOptions = [
    { label: 'Teacher', value: 1 },
    { label: 'Student', value: 2 },
  ];

  useEffect(() => {
    fetchRfids();
  }, []);

  const fetchRfids = async () => {
    try {
      setLoading(true);
      const result = await apiService.getRfids();
      const data = Array.isArray(result.data) ? result.data : [];
      setRfids(data);
    } catch (error) {
      console.error('Error fetching RFIDs:', error);
      showToast('Failed to load RFIDs', 'error');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!rfidNo.trim()) newErrors.rfidNo = 'RFID No is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdd = async () => {
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        rfid_no: rfidNo.trim(),
        type: Number(type),
        status: Number(status),
      };

      if (editingId) {
        await apiService.updateRfid(editingId, payload);
        showToast('RFID updated successfully', 'success');
      } else {
        await apiService.addRfid(payload);
        showToast('RFID added successfully', 'success');
      }

      // Reset form
      setName('');
      setRfidNo('');
      setType(1);
      setStatus(0);
      setEditingId(null);
      setModalVisible(false);
      setErrors({});

      // Refresh list
      await fetchRfids();
    } catch (error) {
      console.error('Error saving RFID:', error);
      showToast(error?.message || 'Failed to save RFID', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (item) => {
    setName(item.name);
    setRfidNo(item.rfid_no);
    setType(Number(item.type) || 1);
    setStatus(Number(item.status) || 0);
    setEditingId(item.id);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this RFID?')) return;

    try {
      await apiService.deleteRfid(id);
      showToast('RFID deleted successfully', 'success');
      await fetchRfids();
    } catch (error) {
      console.error('Error deleting RFID:', error);
      showToast(error?.message || 'Failed to delete RFID', 'error');
    }
  };

  const handleAddNew = () => {
    setName('');
    setRfidNo('');
    setType(1);
    setStatus(0);
    setEditingId(null);
    setErrors({});
    setModalVisible(true);
  };

  const getTypeName = (typeVal) => {
    const found = typeOptions.find((opt) => opt.value === Number(typeVal));
    return found ? found.label : 'Unknown';
  };

  const renderRfidCard = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitle}>
          <Text style={styles.cardName}>{item.name}</Text>
          <Text style={styles.cardSubtitle}>RFID: {item.rfid_no}</Text>
          <Text style={styles.cardType}>Type: {getTypeName(item.type)}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: item.status === 1 ? '#D4EDDA' : '#F8D7DA' },
          ]}
        >
          <Text style={[styles.statusText, { color: item.status === 1 ? '#155724' : '#721C24' }]}>
            {item.status === 1 ? 'Active' : 'Inactive'}
          </Text>
        </View>
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.editBtn} onPress={() => handleEdit(item)}>
          <Text style={styles.editBtnText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.deleteBtn]}
          onPress={() => handleDelete(item.id)}
        >
          <Text style={styles.deleteBtnText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6C63FF" />
          <Text style={styles.loadingText}>Loading RFIDs...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerTop}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>RFID Management</Text>
        <View style={{ width: 60 }} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        <TouchableOpacity style={styles.addButton} onPress={handleAddNew}>
          <Text style={styles.addButtonText}>+ Add New RFID</Text>
        </TouchableOpacity>

        {rfids.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No RFIDs found</Text>
            <Text style={styles.emptySubtext}>Tap "Add New RFID" to create one</Text>
          </View>
        ) : (
          <FlatList
            data={rfids}
            renderItem={renderRfidCard}
            keyExtractor={(item) => String(item.id)}
            scrollEnabled={false}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </ScrollView>

      {/* Modal for Add/Edit */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editingId ? 'Edit RFID' : 'Add New RFID'}</Text>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Name *</Text>
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                placeholder="Enter RFID name"
                value={name}
                onChangeText={setName}
                placeholderTextColor="#999"
              />
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>RFID No *</Text>
              <TextInput
                style={[styles.input, errors.rfidNo && styles.inputError]}
                placeholder="Enter RFID number"
                value={rfidNo}
                onChangeText={setRfidNo}
                placeholderTextColor="#999"
              />
              {errors.rfidNo && <Text style={styles.errorText}>{errors.rfidNo}</Text>}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Type</Text>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setTypeModalVisible(true)}
              >
                <Text style={styles.dropdownButtonText}>{getTypeName(type)}</Text>
                <Text style={styles.dropdownArrow}>▼</Text>
              </TouchableOpacity>
            </View>

            <Modal visible={typeModalVisible} transparent animationType="fade">
              <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={() => setTypeModalVisible(false)}
              >
                <View style={styles.dropdownMenu}>
                  {typeOptions.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={styles.menuItem}
                      onPress={() => {
                        setType(option.value);
                        setTypeModalVisible(false);
                      }}
                    >
                      <Text style={styles.menuItemText}>{option.label}</Text>
                      {type === option.value && <Text style={styles.checkmark}>✓</Text>}
                    </TouchableOpacity>
                  ))}
                </View>
              </TouchableOpacity>
            </Modal>

            <View style={styles.formGroup}>
              <View style={styles.switchContainer}>
                <Text style={styles.label}>Status: {status === 1 ? 'Active' : 'Inactive'}</Text>
                <Switch
                  value={status === 1}
                  onValueChange={(val) => setStatus(val ? 1 : 0)}
                  trackColor={{ false: '#E0E0E0', true: '#A8D5BA' }}
                  thumbColor={status === 1 ? '#4CAF50' : '#999'}
                />
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
                disabled={submitting}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveButton, submitting && styles.saveButtonDisabled]}
                onPress={handleAdd}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <Text style={styles.saveButtonText}>{editingId ? 'Update' : 'Add'}</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
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
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E4F8',
  },
  backButton: {
    padding: 8,
  },
  backText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6C63FF',
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1A1A',
    textAlign: 'center',
    flex: 1,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: '#6C63FF',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 300,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  listContainer: {
    gap: 12,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardTitle: {
    flex: 1,
  },
  cardName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
    marginBottom: 4,
  },
  cardType: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editBtn: {
    flex: 1,
    backgroundColor: '#E8E4F8',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  editBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6C63FF',
  },
  deleteBtn: {
    flex: 1,
    backgroundColor: '#FFE0E0',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF6B6B',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 13,
    color: '#999',
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  modalContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  modalHeader: {
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  inputError: {
    borderColor: '#FF6B6B',
  },
  errorText: {
    fontSize: 12,
    color: '#FF6B6B',
    marginTop: 4,
    fontWeight: '500',
  },
  dropdownButton: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  dropdownButtonText: {
    fontSize: 14,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#999',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownMenu: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    width: '80%',
    maxWidth: 300,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuItemText: {
    fontSize: 14,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  checkmark: {
    fontSize: 16,
    color: '#6C63FF',
    fontWeight: '700',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#6C63FF',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#999',
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
  },
});
