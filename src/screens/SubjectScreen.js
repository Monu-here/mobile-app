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
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import apiService from '../api/apiService';
import { showToast } from '../components/Toast';

export default function SubjectScreen({ onBack }) {
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [grades, setGrades] = useState([]);
  const [sections, setSections] = useState([]);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [creditHours, setCreditHours] = useState('');
  const [subjectType, setSubjectType] = useState('');
  const [gradeId, setGradeId] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [showGradePicker, setShowGradePicker] = useState(false);
  const [showSectionPicker, setShowSectionPicker] = useState(false);
  const [showSubjectTypePicker, setShowSubjectTypePicker] = useState(false);

  // Subject types: 1 = Theory, 2 = Practical
  const subjectTypes = [
    { id: 1, name: 'Theory' },
    { id: 2, name: 'Practical' },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch grades
      const gradeRes = await apiService.getGrades();
      const gradeMaybe = gradeRes?.data;
      let gradeList = [];
      if (gradeMaybe?.grade && Array.isArray(gradeMaybe.grade)) {
        gradeList = gradeMaybe.grade;
      } else if (Array.isArray(gradeMaybe)) {
        gradeList = gradeMaybe;
      } else if (gradeMaybe?.data && Array.isArray(gradeMaybe.data)) {
        gradeList = gradeMaybe.data;
      }
      const finalGrades = Array.isArray(gradeList) ? gradeList : [];
      console.log('[SubjectScreen] Fetched grades:', finalGrades);
      setGrades(finalGrades);

      // Fetch sections
      const sectionRes = await apiService.getSections();
      const sectionMaybe = sectionRes?.data;
      let sectionList = [];
      if (sectionMaybe?.section && Array.isArray(sectionMaybe.section)) {
        sectionList = sectionMaybe.section;
      } else if (Array.isArray(sectionMaybe)) {
        sectionList = sectionMaybe;
      } else if (sectionMaybe?.data && Array.isArray(sectionMaybe.data)) {
        sectionList = sectionMaybe.data;
      }
      const finalSections = Array.isArray(sectionList) ? sectionList : [];
      console.log('[SubjectScreen] Fetched sections:', finalSections);
      setSections(finalSections);

      // Fetch subjects
      const result = await apiService.getSubjects();
      const data = Array.isArray(result.data) ? result.data : [];
      console.log('[SubjectScreen] Fetched subjects:', data);
      setSubjects(data);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data');
      showToast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setName('');
    setCode('');
    setCreditHours('');
    setSubjectType('');
    setGradeId('');
    setSectionId('');
    setEditingId(null);
  };

  const getGradeName = (id) => {
    const grade = grades.find(g => parseInt(g.id, 10) === parseInt(id, 10));
    return grade?.name || 'Unknown Grade';
  };

  const getSectionName = (id) => {
    const section = sections.find(s => parseInt(s.id, 10) === parseInt(id, 10));
    return section?.name || 'Unknown Section';
  };

  const getSubjectTypeName = (id) => {
    const type = subjectTypes.find(t => t.id === parseInt(id, 10));
    return type?.name || 'Unknown Type';
  };

  const handleAdd = async () => {
    // Validation
    if (!name.trim()) {
      showToast('Please enter subject name', 'error');
      return;
    }
    if (!gradeId) {
      showToast('Please select a grade', 'error');
      return;
    }

    Keyboard.dismiss();
    setSubmitting(true);
    setError(null); // Clear any previous errors

    try {
      // Build payload with proper field validation
      const payload = {
        name: name.trim(),
        code: code.trim() || '',
        subject_credit_hours: creditHours.trim() || '',
        subject_type: subjectType ? parseInt(subjectType, 10) : '',
        grade_id: parseInt(gradeId, 10),
        section_id: sectionId ? parseInt(sectionId, 10) : '',
      };

      console.log('[SubjectScreen] Field values:');
      console.log('  name:', name, '-> trim:', name.trim());
      console.log('  code:', code, '-> trim:', code.trim());
      console.log('  creditHours:', creditHours, '-> trim:', creditHours.trim());
      console.log('  subjectType:', subjectType);
      console.log('  gradeId:', gradeId);
      console.log('  sectionId:', sectionId);
      
      console.log('[SubjectScreen] Final payload:', JSON.stringify(payload, null, 2));

      if (editingId) {
        // Update
        const response = await apiService.updateSubject(editingId, payload);
        console.log('[SubjectScreen] Update response:', response);
        showToast('Subject updated successfully', 'success');
      } else {
        // Add
        const response = await apiService.addSubject(payload);
        console.log('[SubjectScreen] Add response:', response);
        showToast('Subject added successfully', 'success');
      }

      clearForm();
      setTimeout(() => {
        fetchData();
      }, 500);
    } catch (err) {
      console.error('Error saving subject:', err);
      console.error('Full error object:', JSON.stringify(err, null, 2));
      console.error('Error details:', {
        message: err.message,
        response: err.response,
        data: err.response?.data,
        status: err.response?.status,
      });
      
      let errorMessage = 'Failed to save subject';
      
      // Try multiple error message sources
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.data?.message) {
        errorMessage = err.data.message;
      } else if (err.data?.error) {
        errorMessage = err.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      console.log('[SubjectScreen] Final error message:', errorMessage);
      showToast(errorMessage, 'error');
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (item) => {
    setName(item.name || '');
    setCode(item.code || '');
    setCreditHours(item.subject_credit_hours?.toString() || '');
    setSubjectType(item.subject_type?.toString() || '');
    setGradeId(item.grade_id?.toString() || '');
    setSectionId(item.section_id?.toString() || '');
    setEditingId(item.id);
    Keyboard.dismiss();
  };

  const handleDelete = (item) => {
    Alert.alert(
      'Delete Subject',
      `Are you sure you want to delete "${item.name}"?`,
      [
        { text: 'Cancel', onPress: () => {} },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await apiService.deleteSubject(item.id);
              showToast('Subject deleted successfully', 'success');
              setTimeout(() => {
                fetchData();
              }, 500);
            } catch (err) {
              console.error('Error deleting subject:', err);
              console.error('Delete error details:', {
                message: err.message,
                response: err.response,
                data: err.response?.data,
                status: err.response?.status,
              });
              
              let errorMessage = 'Failed to delete subject';
              if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
              } else if (err.response?.data?.error) {
                errorMessage = err.response.data.error;
              } else if (err.message) {
                errorMessage = err.message;
              }
              
              showToast(errorMessage, 'error');
              setError(errorMessage);
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemContent}>
        <Text style={styles.itemName}>{item.name}</Text>
        {item.code && <Text style={styles.itemSubtext}>Code: {item.code}</Text>}
        {item.subject_credit_hours && (
          <Text style={styles.itemSubtext}>Credits: {item.subject_credit_hours}</Text>
        )}
        {item.subject_type && (
          <Text style={styles.itemSubtext}>Type: {item.subject_type}</Text>
        )}
        <Text style={styles.itemSubtext}>Grade ID: {item.grade_id}</Text>
      </View>
      <View style={styles.itemActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => handleEdit(item)}
        >
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDelete(item)}
        >
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Subjects</Text>
        <View style={{ width: 80 }} />
      </View>

      <ScrollView style={styles.formContainer} keyboardShouldPersistTaps="handled">
        {error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>{error}</Text>
            <TouchableOpacity onPress={() => setError(null)}>
              <Text style={styles.errorCloseButton}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
        
        <View style={styles.form}>
          <Text style={styles.formLabel}>Subject Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter subject name"
            value={name}
            onChangeText={setName}
            editable={!submitting}
          />

          <Text style={styles.formLabel}>Code</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter subject code"
            value={code}
            onChangeText={setCode}
            editable={!submitting}
          />

          <Text style={styles.formLabel}>Credit Hours</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter credit hours"
            value={creditHours}
            onChangeText={setCreditHours}
            keyboardType="numeric"
            editable={!submitting}
          />

          <Text style={styles.formLabel}>Subject Type</Text>
          <TouchableOpacity 
            style={styles.pickerButton}
            onPress={() => setShowSubjectTypePicker(true)}
            disabled={submitting}
          >
            <Text style={styles.pickerButtonText}>
              {subjectType ? getSubjectTypeName(parseInt(subjectType, 10)) : '-- Select Subject Type --'}
            </Text>
            <Text style={styles.pickerButtonArrow}>▼</Text>
          </TouchableOpacity>

          <Text style={styles.formLabel}>Grade *</Text>
          <TouchableOpacity 
            style={styles.pickerButton}
            onPress={() => setShowGradePicker(true)}
            disabled={submitting}
          >
            <Text style={styles.pickerButtonText}>
              {gradeId ? getGradeName(parseInt(gradeId, 10)) : '-- Select Grade --'}
            </Text>
            <Text style={styles.pickerButtonArrow}>▼</Text>
          </TouchableOpacity>

          <Text style={styles.formLabel}>Section</Text>
          <TouchableOpacity 
            style={styles.pickerButton}
            onPress={() => setShowSectionPicker(true)}
            disabled={submitting}
          >
            <Text style={styles.pickerButtonText}>
              {sectionId ? getSectionName(parseInt(sectionId, 10)) : '-- Select Section --'}
            </Text>
            <Text style={styles.pickerButtonArrow}>▼</Text>
          </TouchableOpacity>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.submitButton, submitting && styles.disabledButton]}
              onPress={handleAdd}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#FFF" size="small" />
              ) : (
                <Text style={styles.submitButtonText}>
                  {editingId ? 'Update Subject' : 'Add Subject'}
                </Text>
              )}
            </TouchableOpacity>

            {editingId && (
              <TouchableOpacity
                style={[styles.cancelButton, submitting && styles.disabledButton]}
                onPress={clearForm}
                disabled={submitting}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Grade Picker Modal */}
      <Modal visible={showGradePicker} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Grade</Text>
              <TouchableOpacity onPress={() => setShowGradePicker(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalList}>
              {grades.map((grade) => (
                <TouchableOpacity
                  key={grade.id}
                  style={[
                    styles.modalItem,
                    gradeId === String(grade.id) && styles.modalItemSelected
                  ]}
                  onPress={() => {
                    setGradeId(String(grade.id));
                    setShowGradePicker(false);
                  }}
                >
                  <Text style={[
                    styles.modalItemText,
                    gradeId === String(grade.id) && styles.modalItemTextSelected
                  ]}>
                    {grade.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Section Picker Modal */}
      <Modal visible={showSectionPicker} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Section</Text>
              <TouchableOpacity onPress={() => setShowSectionPicker(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalList}>
              <TouchableOpacity 
                style={styles.modalItem}
                onPress={() => {
                  setSectionId('');
                  setShowSectionPicker(false);
                }}
              >
                <Text style={styles.modalItemText}>-- Clear Selection --</Text>
              </TouchableOpacity>
              {sections.map((section) => (
                <TouchableOpacity
                  key={section.id}
                  style={[
                    styles.modalItem,
                    sectionId === String(section.id) && styles.modalItemSelected
                  ]}
                  onPress={() => {
                    setSectionId(String(section.id));
                    setShowSectionPicker(false);
                  }}
                >
                  <Text style={[
                    styles.modalItemText,
                    sectionId === String(section.id) && styles.modalItemTextSelected
                  ]}>
                    {section.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Subject Type Picker Modal */}
      <Modal visible={showSubjectTypePicker} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Subject Type</Text>
              <TouchableOpacity onPress={() => setShowSubjectTypePicker(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalList}>
              <TouchableOpacity 
                style={styles.modalItem}
                onPress={() => {
                  setSubjectType('');
                  setShowSubjectTypePicker(false);
                }}
              >
                <Text style={styles.modalItemText}>-- Clear Selection --</Text>
              </TouchableOpacity>
              {subjectTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.modalItem,
                    subjectType === String(type.id) && styles.modalItemSelected
                  ]}
                  onPress={() => {
                    setSubjectType(String(type.id));
                    setShowSubjectTypePicker(false);
                  }}
                >
                  <Text style={[
                    styles.modalItemText,
                    subjectType === String(type.id) && styles.modalItemTextSelected
                  ]}>
                    {type.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Subjects List ({subjects.length})</Text>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#6C63FF" />
          <Text style={styles.loadingText}>Loading subjects...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchData}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : subjects.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No subjects found</Text>
        </View>
      ) : (
        <FlatList
          data={subjects}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          scrollEnabled={true}
        />
      )}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 8,
    width: 80,
  },
  backButtonText: {
    fontSize: 16,
    color: '#6C63FF',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    maxHeight: '45%',
  },
  form: {
    padding: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#EFEFEF',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: '#FFF',
    color: '#333',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#6C63FF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#E0E0E0',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 14,
  },
  disabledButton: {
    opacity: 0.6,
  },
  listHeader: {
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  listTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  itemContainer: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#6C63FF',
  },
  itemContent: {
    marginBottom: 10,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  itemSubtext: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  itemActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#4A90E2',
  },
  deleteButton: {
    backgroundColor: '#E85D5D',
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  errorText: {
    fontSize: 14,
    color: '#E85D5D',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  retryButton: {
    marginTop: 15,
    backgroundColor: '#6C63FF',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 6,
  },
  retryButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
  pickerButton: {
    borderWidth: 1,
    borderColor: '#EFEFEF',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  pickerButtonText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  pickerButtonArrow: {
    fontSize: 12,
    color: '#999',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    width: '85%',
    maxHeight: '70%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  modalClose: {
    fontSize: 20,
    color: '#999',
    fontWeight: '600',
  },
  modalList: {
    maxHeight: 300,
  },
  modalItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalItemSelected: {
    backgroundColor: '#F0F3FF',
  },
  modalItemText: {
    fontSize: 14,
    color: '#333',
  },
  modalItemTextSelected: {
    color: '#6C63FF',
    fontWeight: '600',
  },
  errorBanner: {
    backgroundColor: '#FFE5E5',
    borderLeftWidth: 4,
    borderLeftColor: '#E85D5D',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 4,
  },
  errorBannerText: {
    color: '#C92A2A',
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  errorCloseButton: {
    color: '#C92A2A',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
