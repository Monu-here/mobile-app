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

export default function SectionScreen({ onBack }) {
  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState([]);
  const [grades, setGrades] = useState([]);
  const [error, setError] = useState(null);

  // Form state
  const [name, setName] = useState('');
  const [gradeId, setGradeId] = useState('');
  const [status, setStatus] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [lastResponseDebug, setLastResponseDebug] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [showGradePicker, setShowGradePicker] = useState(false);

  useEffect(() => {
    fetchGradesAndSections();
  }, []);

  const fetchGradesAndSections = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch grades for dropdown
      const gradeRes = await apiService.getGrades();
      const gradeMaybe = gradeRes?.data;
      
      // Handle nested structure: { grade: [...], section: [...] }
      let gradeList = [];
      if (gradeMaybe?.grade && Array.isArray(gradeMaybe.grade)) {
        gradeList = gradeMaybe.grade;
      } else if (Array.isArray(gradeMaybe)) {
        gradeList = gradeMaybe;
      } else if (gradeMaybe?.data && Array.isArray(gradeMaybe.data)) {
        gradeList = gradeMaybe.data;
      }
      
      console.log('[fetchGradesAndSections] Grades:', gradeList);
      setGrades(Array.isArray(gradeList) ? gradeList : []);

      // Fetch sections
      const sectionRes = await apiService.getSections();
      const sectionMaybe = sectionRes?.data;
      
      // Handle nested structure: { grade: [...], section: [...] }
      let sectionList = [];
      if (sectionMaybe?.section && Array.isArray(sectionMaybe.section)) {
        sectionList = sectionMaybe.section;
      } else if (Array.isArray(sectionMaybe)) {
        sectionList = sectionMaybe;
      } else if (sectionMaybe?.data && Array.isArray(sectionMaybe.data)) {
        sectionList = sectionMaybe.data;
      }
      
      console.log('[fetchGradesAndSections] Raw response:', sectionRes);
      console.log('[fetchGradesAndSections] Extracted sections:', sectionList);
      console.log('[fetchGradesAndSections] First item:', sectionList[0]);
      setSections(Array.isArray(sectionList) ? sectionList : []);
      setLastResponseDebug(JSON.stringify(sectionRes?.raw || sectionRes, null, 2));
    } catch (err) {
      console.error('Error fetching:', err);
      setError(err?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!name || !gradeId) {
      showToast('Please fill name and select grade', 'error');
      return;
    }

    const payload = {
      name,
      grade_id: parseInt(gradeId, 10),
      status: status ? 1 : 0,
    };

    setSubmitting(true);
    try {
      let res;
      
      if (editingId) {
        console.log('Updating section with id:', editingId, 'payload:', payload);
        res = await apiService.updateSection(editingId, payload);
        console.log('Update response:', res);
        showToast(res?.message || 'Section updated successfully', 'success');
      } else {
        console.log('Adding section with payload:', payload);
        res = await apiService.addSection(payload);
        console.log('Add response:', res);
        showToast(res?.message || 'Section added successfully', 'success');
      }
      
      setLastResponseDebug(JSON.stringify(res?.raw || res, null, 2));
      
      setName('');
      setGradeId('');
      setStatus(true);
      setEditingId(null);
      
      console.log('Refreshing sections list...');
      await fetchGradesAndSections();
      console.log('List refreshed');
    } catch (err) {
      console.error('Error in add/update section:', err);
      const msg = err?.message || (err?.data && JSON.stringify(err.data)) || 'Failed to save section';
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

  const handleReset = () => {
    setName('');
    setGradeId('');
    setStatus(true);
    setEditingId(null);
  };

  const handleEdit = (item) => {
    console.log('[handleEdit] Editing item:', item);
    setName(item.name);
    setGradeId(String(item.grade_id));
    const statusValue = Number(item.status);
    setStatus(statusValue === 1);
    console.log('[handleEdit] Setting status to:', statusValue === 1, 'from value:', item.status);
    setEditingId(item.id);
  };

  const handleDelete = async (id) => {
    try {
      console.log('Deleting section with id:', id);
      const res = await apiService.deleteSection(id);
      console.log('Delete response:', res);
      showToast('Section deleted successfully', 'success');
      
      console.log('Refreshing list after delete...');
      await fetchGradesAndSections();
      console.log('List refreshed after delete');
    } catch (err) {
      console.error('Error deleting section:', err);
      showToast('Failed to delete section', 'error');
    }
  };

  const getGradeName = (gradeId) => {
    const numGradeId = Number(gradeId);
    const grade = grades.find(g => Number(g.id) === numGradeId);
    return grade ? grade.name : 'Unknown Grade';
  };

  const renderItem = ({ item }) => {
    const statusValue = Number(item.status);
    const isActive = statusValue === 1;
    const statusText = isActive ? 'Active' : 'Inactive';
    const statusColor = isActive ? '#4CAF50' : '#FF9800';
    
    console.log('[renderItem] item.id:', item.id, 'status:', item.status, 'statusValue:', statusValue, 'isActive:', isActive);
    
    return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <View style={styles.cardMetaRow}>
            <Text style={styles.cardMeta}>Grade: {getGradeName(item.grade_id)}</Text>
            <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
              <Text style={styles.statusBadgeText}>{statusText}</Text>
            </View>
          </View>
        </View>
        <View style={styles.cardButtonContainer}>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => handleEdit(item)}
          >
            <Text style={styles.editButtonText}>✏️ Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => handleDelete(item.id)}
          >
            <Text style={styles.deleteButtonText}>🗑️ Delete</Text>
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
        <Text style={styles.title}>Sections</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.form}>
        
        <TextInput
          placeholder="Section Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        
        <TouchableOpacity 
          style={styles.pickerButton}
          onPress={() => setShowGradePicker(true)}
        >
          <Text style={styles.pickerButtonText}>
            {gradeId ? getGradeName(parseInt(gradeId, 10)) : '-- Select Grade --'}
          </Text>
          <Text style={styles.pickerButtonArrow}>▼</Text>
        </TouchableOpacity>

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
                <TouchableOpacity 
                  style={styles.modalItem}
                  onPress={() => {
                    setGradeId('');
                    setShowGradePicker(false);
                  }}
                >
                  <Text style={styles.modalItemText}>-- Clear Selection --</Text>
                </TouchableOpacity>
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
                {editingId ? 'Update Section' : 'Add Section'}
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
      </View>

      <View style={styles.listContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#6C63FF" />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <FlatList
            data={sections}
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
  pickerButton: {
    borderWidth: 1,
    borderColor: '#EFEFEF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  modalClose: {
    fontSize: 24,
    color: '#999',
    fontWeight: '600',
  },
  modalList: {
    maxHeight: '100%',
  },
  modalItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalItemSelected: {
    backgroundColor: '#F0F0FF',
  },
  modalItemText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  modalItemTextSelected: {
    color: '#6C63FF',
    fontWeight: '700',
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
    fontSize: 12
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
