import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Modal,
  TextInput,
  ScrollView,
  SafeAreaView,
  Alert,
  Switch,
} from 'react-native';
import apiService from '../api/apiService';
import Toast from '../components/Toast';

export default function ExamTypeScreen({ onBack }) {
  const [loading, setLoading] = useState(false);
  const [examTypes, setExamTypes] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [error, setError] = useState(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('info');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingExamType, setEditingExamType] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [academicYearId, setAcademicYearId] = useState('');
  const [status, setStatus] = useState(1);
  const [canEnterMark, setCanEnterMark] = useState(false);
  const [isPublish, setIsPublish] = useState(false);
  const [isSchedulePublish, setIsSchedulePublish] = useState(false);
  const [showAcademicYearPicker, setShowAcademicYearPicker] = useState(false);

  useEffect(() => {
    fetchExamTypes();
    fetchAcademicYears();
  }, []);

  const showToast = (message, type = 'info') => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  };

  const fetchExamTypes = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('[ExamTypeScreen] Fetching exam types');
      const response = await apiService.getExamTypes();
      console.log('[ExamTypeScreen] Exam types response:', response);

      const data = Array.isArray(response?.data) ? response.data : [];
      setExamTypes(data);

      if (data.length === 0) {
        showToast('No exam types found', 'info');
      }
    } catch (error) {
      console.error('[ExamTypeScreen] Error fetching exam types:', error);
      setError(error?.message || 'Failed to load exam types');
      showToast(error?.message || 'Failed to load exam types', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchAcademicYears = async () => {
    try {
      const response = await apiService.getAcademicYears();
      let yearList = [];
      if (Array.isArray(response?.data)) {
        yearList = response.data;
      } else if (response?.data?.academicYear && Array.isArray(response.data.academicYear)) {
        yearList = response.data.academicYear;
      } else if (response?.data?.data?.academicYear && Array.isArray(response.data.data.academicYear)) {
        yearList = response.data.data.academicYear;
      }
      console.log('[ExamTypeScreen] Academic years:', yearList);
      setAcademicYears(yearList);
    } catch (error) {
      console.error('[ExamTypeScreen] Error fetching academic years:', error);
      showToast('Failed to fetch academic years', 'error');
    }
  };

  const handleAdd = () => {
    setEditingExamType(null);
    setName('');
    setAcademicYearId('');
    setStatus(1);
    setCanEnterMark(false);
    setIsPublish(false);
    setIsSchedulePublish(false);
    setShowModal(true);
  };

  const handleEdit = (examType) => {
    setEditingExamType(examType);
    setName(examType.name || '');
    setAcademicYearId(examType.academic_year_id?.toString() || '');
    setStatus(examType.status || 1);
    setCanEnterMark(examType.can_enter_mark === 1 || examType.can_enter_mark === true);
    setIsPublish(examType.is_publish === 1 || examType.is_publish === true);
    setIsSchedulePublish(examType.is_schedule_publish === 1 || examType.is_schedule_publish === true);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      showToast('Please enter exam type name', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        status: status,
        can_enter_mark: canEnterMark,
        is_publish: isPublish,
        is_schedule_publish: isSchedulePublish,
      };

      if (academicYearId) {
        payload.academic_year = parseInt(academicYearId);
      }

      let response;
      if (editingExamType) {
        console.log('[ExamTypeScreen] Updating exam type:', editingExamType.id, payload);
        response = await apiService.updateExamType(editingExamType.id, payload);
      } else {
        console.log('[ExamTypeScreen] Adding exam type:', payload);
        response = await apiService.addExamType(payload);
      }

      console.log('[ExamTypeScreen] Save response:', response);
      showToast(response?.message || `Exam type ${editingExamType ? 'updated' : 'added'} successfully`, 'success');
      setShowModal(false);
      fetchExamTypes();
    } catch (error) {
      console.error('[ExamTypeScreen] Error saving exam type:', error);
      showToast(error?.message || 'Failed to save exam type', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (examType) => {
    Alert.alert(
      'Delete Exam Type',
      `Are you sure you want to delete "${examType.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('[ExamTypeScreen] Deleting exam type:', examType.id);
              const response = await apiService.deleteExamType(examType.id);
              showToast(response?.message || 'Exam type deleted successfully', 'success');
              fetchExamTypes();
            } catch (error) {
              console.error('[ExamTypeScreen] Error deleting exam type:', error);
              showToast(error?.message || 'Failed to delete exam type', 'error');
            }
          },
        },
      ]
    );
  };

  const handleToggleStatus = async (examType, column) => {
    const currentValue = examType[column];
    const newValue = currentValue === 1 || currentValue === true ? 0 : 1;

    try {
      const payload = {
        status: newValue,
        column: column,
      };

      console.log('[ExamTypeScreen] Setting status:', examType.id, payload);
      const response = await apiService.setExamTypeStatus(examType.id, payload);
      showToast(response?.message || 'Status updated successfully', 'success');
      fetchExamTypes();
    } catch (error) {
      console.error('[ExamTypeScreen] Error setting status:', error);
      showToast(error?.message || 'Failed to update status', 'error');
    }
  };

  const getAcademicYearName = (id) => {
    const year = academicYears.find(y => parseInt(y.id, 10) === parseInt(id, 10));
    return year?.name || 'N/A';
  };

  const renderExamTypeItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => handleEdit(item)}
          >
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDelete(item)}
          >
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.cardInfo}>
          📅 Academic Year: {getAcademicYearName(item.academic_year_id)}
        </Text>
        <Text style={styles.cardInfo}>
          📊 Status: <Text style={item.status === 1 ? styles.activeText : styles.inactiveText}>
            {item.status === 1 ? 'Active' : 'Inactive'}
          </Text>
        </Text>

        <View style={styles.switchContainer}>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Can Enter Mark:</Text>
            <Switch
              value={item.can_enter_mark === 1 || item.can_enter_mark === true}
              onValueChange={() => handleToggleStatus(item, 'can_enter_mark')}
              trackColor={{ false: '#ccc', true: '#6C63FF' }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Is Published:</Text>
            <Switch
              value={item.is_publish === 1 || item.is_publish === true}
              onValueChange={() => handleToggleStatus(item, 'is_publish')}
              trackColor={{ false: '#ccc', true: '#6C63FF' }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Schedule Published:</Text>
            <Switch
              value={item.is_schedule_publish === 1 || item.is_schedule_publish === true}
              onValueChange={() => handleToggleStatus(item, 'is_schedule_publish')}
              trackColor={{ false: '#ccc', true: '#6C63FF' }}
              thumbColor="#fff"
            />
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Toast */}
      <Toast
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
        onHide={() => setToastVisible(false)}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Exam Types</Text>
        <TouchableOpacity onPress={handleAdd} style={styles.addHeaderButton}>
          <Text style={styles.addHeaderButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {/* Error Display */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Loading */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6C63FF" />
        </View>
      )}

      {/* Exam Types List */}
      {!loading && examTypes.length > 0 && (
        <FlatList
          data={examTypes}
          renderItem={renderExamTypeItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
        />
      )}

      {/* Empty State */}
      {!loading && examTypes.length === 0 && !error && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No exam types found</Text>
          <TouchableOpacity style={styles.emptyAddButton} onPress={handleAdd}>
            <Text style={styles.emptyAddButtonText}>+ Add First Exam Type</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Add/Edit Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingExamType ? 'Edit Exam Type' : 'Add Exam Type'}
              </Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              {/* Name */}
              <View style={styles.formField}>
                <Text style={styles.formLabel}>Name *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Enter exam type name"
                  value={name}
                  onChangeText={setName}
                />
              </View>

              {/* Academic Year */}
              <View style={styles.formField}>
                <Text style={styles.formLabel}>Academic Year</Text>
                <TouchableOpacity
                  style={styles.formPickerButton}
                  onPress={() => setShowAcademicYearPicker(!showAcademicYearPicker)}
                >
                  <Text style={styles.formPickerButtonText}>
                    {academicYearId
                      ? getAcademicYearName(parseInt(academicYearId))
                      : 'Select Academic Year (Optional)'}
                  </Text>
                </TouchableOpacity>
              </View>

              {showAcademicYearPicker && (
                <View style={styles.inlinePickerContainer}>
                  <ScrollView style={styles.inlinePickerScroll}>
                    <TouchableOpacity
                      style={[
                        styles.inlinePickerItem,
                        !academicYearId && styles.inlinePickerItemSelected,
                      ]}
                      onPress={() => {
                        setAcademicYearId('');
                        setShowAcademicYearPicker(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.inlinePickerItemText,
                          !academicYearId && styles.inlinePickerItemTextSelected,
                        ]}
                      >
                        Default (Current Year)
                      </Text>
                    </TouchableOpacity>
                    {academicYears.map(year => (
                      <TouchableOpacity
                        key={year.id}
                        style={[
                          styles.inlinePickerItem,
                          academicYearId === year.id.toString() && styles.inlinePickerItemSelected,
                        ]}
                        onPress={() => {
                          setAcademicYearId(year.id.toString());
                          setShowAcademicYearPicker(false);
                        }}
                      >
                        <Text
                          style={[
                            styles.inlinePickerItemText,
                            academicYearId === year.id.toString() && styles.inlinePickerItemTextSelected,
                          ]}
                        >
                          {year.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* Status */}
              <View style={styles.formField}>
                <Text style={styles.formLabel}>Status</Text>
                <View style={styles.statusButtons}>
                  <TouchableOpacity
                    style={[
                      styles.statusButton,
                      status === 1 && styles.statusButtonActive,
                    ]}
                    onPress={() => setStatus(1)}
                  >
                    <Text
                      style={[
                        styles.statusButtonText,
                        status === 1 && styles.statusButtonTextActive,
                      ]}
                    >
                      Active
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.statusButton,
                      status === 0 && styles.statusButtonActive,
                    ]}
                    onPress={() => setStatus(0)}
                  >
                    <Text
                      style={[
                        styles.statusButtonText,
                        status === 0 && styles.statusButtonTextActive,
                      ]}
                    >
                      Inactive
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Toggles */}
              <View style={styles.formField}>
                <View style={styles.toggleRow}>
                  <Text style={styles.toggleLabel}>Can Enter Mark</Text>
                  <Switch
                    value={canEnterMark}
                    onValueChange={setCanEnterMark}
                    trackColor={{ false: '#ccc', true: '#6C63FF' }}
                    thumbColor="#fff"
                  />
                </View>
              </View>

              <View style={styles.formField}>
                <View style={styles.toggleRow}>
                  <Text style={styles.toggleLabel}>Is Published</Text>
                  <Switch
                    value={isPublish}
                    onValueChange={setIsPublish}
                    trackColor={{ false: '#ccc', true: '#6C63FF' }}
                    thumbColor="#fff"
                  />
                </View>
              </View>

              <View style={styles.formField}>
                <View style={styles.toggleRow}>
                  <Text style={styles.toggleLabel}>Schedule Published</Text>
                  <Switch
                    value={isSchedulePublish}
                    onValueChange={setIsSchedulePublish}
                    trackColor={{ false: '#ccc', true: '#6C63FF' }}
                    thumbColor="#fff"
                  />
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSaveButton}
                onPress={handleSave}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.modalSaveButtonText}>
                    {editingExamType ? 'Update' : 'Add'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#6C63FF',
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  addHeaderButton: {
    backgroundColor: '#6C63FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addHeaderButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    padding: 16,
    backgroundColor: '#ffebee',
    margin: 16,
    borderRadius: 8,
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  cardActions: {
    flexDirection: 'row',
  },
  editButton: {
    backgroundColor: '#6C63FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 8,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  cardBody: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  cardInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  activeText: {
    color: '#00BFA6',
    fontWeight: '600',
  },
  inactiveText: {
    color: '#FF6B6B',
    fontWeight: '600',
  },
  switchContainer: {
    marginTop: 12,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  switchLabel: {
    fontSize: 14,
    color: '#333',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginBottom: 16,
  },
  emptyAddButton: {
    backgroundColor: '#6C63FF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyAddButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '90%',
    maxHeight: '80%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalClose: {
    fontSize: 24,
    color: '#666',
  },
  modalContent: {
    padding: 16,
    maxHeight: 400,
  },
  formField: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  formPickerButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
  },
  formPickerButtonText: {
    fontSize: 16,
    color: '#333',
  },
  inlinePickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 16,
    maxHeight: 150,
  },
  inlinePickerScroll: {
    maxHeight: 150,
  },
  inlinePickerItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  inlinePickerItemSelected: {
    backgroundColor: '#E8E6FF',
  },
  inlinePickerItemText: {
    fontSize: 16,
    color: '#333',
  },
  inlinePickerItemTextSelected: {
    color: '#6C63FF',
    fontWeight: '600',
  },
  statusButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  statusButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  statusButtonActive: {
    backgroundColor: '#6C63FF',
    borderColor: '#6C63FF',
  },
  statusButtonText: {
    fontSize: 16,
    color: '#333',
  },
  statusButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleLabel: {
    fontSize: 14,
    color: '#333',
  },
  modalActions: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  modalCancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
    alignItems: 'center',
  },
  modalCancelButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  modalSaveButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#6C63FF',
    marginLeft: 8,
    alignItems: 'center',
  },
  modalSaveButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});
