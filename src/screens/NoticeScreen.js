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

export default function NoticeScreen({ onBack }) {
  const [loading, setLoading] = useState(false);
  const [notices, setNotices] = useState([]);
  const [grades, setGrades] = useState([]);
  const [sections, setSections] = useState([]);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [publishedAt, setPublishedAt] = useState('');
  const [forType, setForType] = useState('');
  const [gradeId, setGradeId] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [showGradePicker, setShowGradePicker] = useState(false);
  const [showSectionPicker, setShowSectionPicker] = useState(false);
  const [showForTypePicker, setShowForTypePicker] = useState(false);

  // Filter states for notice listing
  const [filterGradeId, setFilterGradeId] = useState('');
  const [filterForType, setFilterForType] = useState('');
  const [showFilterGradePicker, setShowFilterGradePicker] = useState(false);
  const [showFilterForTypePicker, setShowFilterForTypePicker] = useState(false);

  // For types: 1 = Students, 2 = Parents, 3 = Teachers, etc.
  const forTypes = [
    { id: 5, name: 'All' },
    { id: 1, name: 'Admin' },
    { id: 2, name: 'Teachers' },
    { id: 3, name: 'Students' },
    { id: 4, name: 'Parents' },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  // Refetch notices when filters change
  useEffect(() => {
    if (filterGradeId || filterForType) {
      fetchNoticesWithFilters();
    } else {
      // When filters are cleared, fetch all notices
      fetchNoticesWithFilters();
    }
  }, [filterGradeId, filterForType]);

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
      console.log('[NoticeScreen] Fetched grades:', finalGrades);
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
      console.log('[NoticeScreen] Fetched sections:', finalSections);
      setSections(finalSections);

      // Fetch notices without filters
      await fetchNoticesWithFilters();
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data');
      showToast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchNoticesWithFilters = async () => {
    try {
      const filters = {};
      if (filterGradeId) {
        filters.grade_id = parseInt(filterGradeId, 10);
      }
      if (filterForType) {
        filters.for = parseInt(filterForType, 10);
      }

      console.log('[NoticeScreen] Fetching notices with filters:', filters);
      const result = await apiService.getNotices(filters);
      const data = Array.isArray(result.data) ? result.data : [];
      console.log('[NoticeScreen] Fetched notices:', data);
      setNotices(data);
    } catch (err) {
      console.error('Error fetching notices:', err);
      setError('Failed to load notices');
      showToast('Failed to load notices', 'error');
    }
  };

  const clearForm = () => {
    setTitle('');
    setDesc('');
    setPublishedAt('');
    setForType('');
    setGradeId('');
    setSectionId('');
    setEditingId(null);
  };

  const cancelEdit = () => {
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

  const getForTypeName = (id) => {
    const type = forTypes.find(t => t.id === parseInt(id, 10));
    return type?.name || 'Unknown Type';
  };

  const handleAdd = async () => {
    if (!title.trim()) {
      showToast('Title is required', 'error');
      return;
    }

    if (!desc.trim()) {
      showToast('Description is required', 'error');
      return;
    }

    if (!forType) {
      showToast('For Type is required', 'error');
      return;
    }

    Keyboard.dismiss();
    setSubmitting(true);

    try {
      const payload = {
        title: title.trim(),
        desc: desc.trim(),
        published_at: publishedAt ? parseInt(publishedAt, 10) : '',
        grade_id: gradeId ? parseInt(gradeId, 10) : '',
        section_id: sectionId ? parseInt(sectionId, 10) : '',
        for: parseInt(forType, 10),
      };

      console.log('[NoticeScreen] Submitting payload:', JSON.stringify(payload, null, 2));

      let response;
      if (editingId) {
        response = await apiService.updateNotice(editingId, payload);
      } else {
        response = await apiService.addNotice(payload);
      }

      if (response) {
        showToast(editingId ? 'Notice updated successfully' : 'Notice added successfully', 'success');
        clearForm();
        await fetchData();
      }
    } catch (err) {
      console.error('Error adding/updating notice:', err);
      let errorMsg = 'Failed to add/update notice';

      if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMsg = err.response.data.error;
      } else if (err.data?.message) {
        errorMsg = err.data.message;
      } else if (err.data?.error) {
        errorMsg = err.data.error;
      } else if (err.message) {
        errorMsg = err.message;
      }

      setError(errorMsg);
      showToast(errorMsg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (notice) => {
    setTitle(notice.title || '');
    setDesc(notice.desc || '');
    setPublishedAt(notice.published_at ? String(notice.published_at) : '');
    setForType(notice.for ? String(notice.for) : '');
    setGradeId(notice.grade_id ? String(notice.grade_id) : '');
    setSectionId(notice.section_id ? String(notice.section_id) : '');
    setEditingId(notice.id);
    window.scrollTo(0, 0);
  };

  const handleDelete = (id) => {
    Alert.alert('Delete Notice', 'Are you sure you want to delete this notice?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Delete',
        onPress: async () => {
          try {
            await apiService.deleteNotice(id);
            showToast('Notice deleted successfully', 'success');
            await fetchData();
          } catch (err) {
            console.error('Error deleting notice:', err);
            showToast('Failed to delete notice', 'error');
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitle}>
          <Text style={styles.cardTitleText}>{item.title}</Text>
          {item.grade_id && (
            <Text style={styles.cardSubText}>Grade: {getGradeName(item.grade_id)}</Text>
          )}
        </View>
        <Text style={styles.cardType}>{getForTypeName(item.for)}</Text>
      </View>
      <Text style={styles.cardDesc} numberOfLines={2}>{item.desc}</Text>
      {item.section_id && (
        <Text style={styles.cardMeta}>Section: {getSectionName(item.section_id)}</Text>
      )}
      <View style={styles.cardActions}>
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
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notices Management</Text>
        <View style={styles.spacer} />
      </View>

      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>{error}</Text>
          <TouchableOpacity onPress={() => setError(null)} style={styles.errorBannerClose}>
            <Text style={styles.errorBannerCloseText}>✕</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* For Type Picker Modal */}
      <Modal visible={showForTypePicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select For Type</Text>
              <TouchableOpacity onPress={() => setShowForTypePicker(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalList}>
              {forTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.modalItem,
                    forType === String(type.id) && styles.modalItemSelected
                  ]}
                  onPress={() => {
                    setForType(String(type.id));
                    setShowForTypePicker(false);
                  }}
                >
                  <Text style={[
                    styles.modalItemText,
                    forType === String(type.id) && styles.modalItemTextSelected
                  ]}>
                    {type.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Grade Picker Modal */}
      <Modal visible={showGradePicker} transparent animationType="slide">
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
                style={[
                  styles.modalItem,
                  gradeId === '' && styles.modalItemSelected
                ]}
                onPress={() => {
                  setGradeId('');
                  setShowGradePicker(false);
                }}
              >
                <Text style={[
                  styles.modalItemText,
                  gradeId === '' && styles.modalItemTextSelected
                ]}>
                  Clear Selection
                </Text>
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

      {/* Section Picker Modal */}
      <Modal visible={showSectionPicker} transparent animationType="slide">
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
                style={[
                  styles.modalItem,
                  sectionId === '' && styles.modalItemSelected
                ]}
                onPress={() => {
                  setSectionId('');
                  setShowSectionPicker(false);
                }}
              >
                <Text style={[
                  styles.modalItemText,
                  sectionId === '' && styles.modalItemTextSelected
                ]}>
                  Clear Selection
                </Text>
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

      {/* Filter Grade Picker Modal */}
      <Modal visible={showFilterGradePicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter by Grade</Text>
              <TouchableOpacity onPress={() => setShowFilterGradePicker(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalList}>
              <TouchableOpacity
                style={[
                  styles.modalItem,
                  filterGradeId === '' && styles.modalItemSelected
                ]}
                onPress={() => {
                  setFilterGradeId('');
                  setShowFilterGradePicker(false);
                }}
              >
                <Text style={[
                  styles.modalItemText,
                  filterGradeId === '' && styles.modalItemTextSelected
                ]}>
                  All Grades
                </Text>
              </TouchableOpacity>
              {grades.map((grade) => (
                <TouchableOpacity
                  key={grade.id}
                  style={[
                    styles.modalItem,
                    filterGradeId === String(grade.id) && styles.modalItemSelected
                  ]}
                  onPress={() => {
                    setFilterGradeId(String(grade.id));
                    setShowFilterGradePicker(false);
                  }}
                >
                  <Text style={[
                    styles.modalItemText,
                    filterGradeId === String(grade.id) && styles.modalItemTextSelected
                  ]}>
                    {grade.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Filter For Type Picker Modal */}
      <Modal visible={showFilterForTypePicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter by For Type</Text>
              <TouchableOpacity onPress={() => setShowFilterForTypePicker(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalList}>
              <TouchableOpacity
                style={[
                  styles.modalItem,
                  filterForType === '' && styles.modalItemSelected
                ]}
                onPress={() => {
                  setFilterForType('');
                  setShowFilterForTypePicker(false);
                }}
              >
                <Text style={[
                  styles.modalItemText,
                  filterForType === '' && styles.modalItemTextSelected
                ]}>
                  All Types
                </Text>
              </TouchableOpacity>
              {forTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.modalItem,
                    filterForType === String(type.id) && styles.modalItemSelected
                  ]}
                  onPress={() => {
                    setFilterForType(String(type.id));
                    setShowFilterForTypePicker(false);
                  }}
                >
                  <Text style={[
                    styles.modalItemText,
                    filterForType === String(type.id) && styles.modalItemTextSelected
                  ]}>
                    {type.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <ScrollView style={styles.formContainer} keyboardShouldPersistTaps="handled">
        <Text style={styles.formSection}>{editingId ? 'Edit Notice' : 'Add New Notice'}</Text>

        <Text style={styles.formLabel}>Title *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter notice title"
          value={title}
          onChangeText={setTitle}
          editable={!submitting}
          placeholderTextColor="#ffffffff"
        />

        <Text style={styles.formLabel}>Description *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Enter notice description"
          value={desc}
          onChangeText={setDesc}
          multiline
          numberOfLines={4}
          editable={!submitting}
          placeholderTextColor="#ffffffff"
        />

        <Text style={styles.formLabel}>For Type *</Text>
        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => setShowForTypePicker(true)}
          disabled={submitting}
        >
          <Text style={styles.pickerButtonText}>
            {forType ? getForTypeName(parseInt(forType, 10)) : '-- Select For Type --'}
          </Text>
          <Text style={styles.pickerButtonArrow}>▼</Text>
        </TouchableOpacity>

        <Text style={styles.formLabel}>Grade (Optional)</Text>
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

        <Text style={styles.formLabel}>Section (Optional)</Text>
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

        <Text style={styles.formLabel}>Published At (Optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter published at timestamp"
          value={publishedAt}
          onChangeText={setPublishedAt}
          keyboardType="number-pad"
          editable={!submitting}
          placeholderTextColor="#ffffffff"
        />

        <View style={styles.formActions}>
          <TouchableOpacity
            style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
            onPress={handleAdd}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>{editingId ? 'Update Notice' : 'Add Notice'}</Text>
            )}
          </TouchableOpacity>

          {editingId && (
            <TouchableOpacity style={styles.cancelButton} onPress={cancelEdit} disabled={submitting}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* For Type Picker Modal */}
      <Modal visible={showForTypePicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select For Type</Text>
              <TouchableOpacity onPress={() => setShowForTypePicker(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalList}>
              {forTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.modalItem,
                    forType === String(type.id) && styles.modalItemSelected
                  ]}
                  onPress={() => {
                    setForType(String(type.id));
                    setShowForTypePicker(false);
                  }}
                >
                  <Text style={[
                    styles.modalItemText,
                    forType === String(type.id) && styles.modalItemTextSelected
                  ]}>
                    {type.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Grade Picker Modal */}
      <Modal visible={showGradePicker} transparent animationType="slide">
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
                style={[
                  styles.modalItem,
                  gradeId === '' && styles.modalItemSelected
                ]}
                onPress={() => {
                  setGradeId('');
                  setShowGradePicker(false);
                }}
              >
                <Text style={[
                  styles.modalItemText,
                  gradeId === '' && styles.modalItemTextSelected
                ]}>
                  Clear Selection
                </Text>
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

      {/* Section Picker Modal */}
      <Modal visible={showSectionPicker} transparent animationType="slide">
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
                style={[
                  styles.modalItem,
                  sectionId === '' && styles.modalItemSelected
                ]}
                onPress={() => {
                  setSectionId('');
                  setShowSectionPicker(false);
                }}
              >
                <Text style={[
                  styles.modalItemText,
                  sectionId === '' && styles.modalItemTextSelected
                ]}>
                  Clear Selection
                </Text>
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

      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Notices List ({notices.length})</Text>
      </View>

      {/* Filter UI always visible */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filterGradeId && styles.filterButtonActive
          ]}
          onPress={() => setShowFilterGradePicker(true)}
        >
          <Text style={[
            styles.filterButtonText,
            filterGradeId && styles.filterButtonTextActive
          ]}>
            Grade: {filterGradeId ? getGradeName(parseInt(filterGradeId, 10)) : 'All'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            filterForType && styles.filterButtonActive
          ]}
          onPress={() => setShowFilterForTypePicker(true)}
        >
          <Text style={[
            styles.filterButtonText,
            filterForType && styles.filterButtonTextActive
          ]}>
            For: {filterForType ? getForTypeName(parseInt(filterForType, 10)) : 'All'}
          </Text>
        </TouchableOpacity>

        {(filterGradeId || filterForType) && (
          <TouchableOpacity
            style={styles.clearFilterButton}
            onPress={() => {
              setFilterGradeId('');
              setFilterForType('');
            }}
          >
            <Text style={styles.clearFilterText}>Clear Filters</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Grade Picker Modal */}
      <Modal visible={showFilterGradePicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter by Grade</Text>
              <TouchableOpacity onPress={() => setShowFilterGradePicker(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalList}>
              <TouchableOpacity
                style={[
                  styles.modalItem,
                  filterGradeId === '' && styles.modalItemSelected
                ]}
                onPress={() => {
                  setFilterGradeId('');
                  setShowFilterGradePicker(false);
                }}
              >
                <Text style={[
                  styles.modalItemText,
                  filterGradeId === '' && styles.modalItemTextSelected
                ]}>
                  All Grades
                </Text>
              </TouchableOpacity>
              {grades.map((grade) => (
                <TouchableOpacity
                  key={grade.id}
                  style={[
                    styles.modalItem,
                    filterGradeId === String(grade.id) && styles.modalItemSelected
                  ]}
                  onPress={() => {
                    setFilterGradeId(String(grade.id));
                    setShowFilterGradePicker(false);
                  }}
                >
                  <Text style={[
                    styles.modalItemText,
                    filterGradeId === String(grade.id) && styles.modalItemTextSelected
                  ]}>
                    {grade.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Filter For Type Picker Modal */}
      <Modal visible={showFilterForTypePicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter by For Type</Text>
              <TouchableOpacity onPress={() => setShowFilterForTypePicker(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalList}>
              <TouchableOpacity
                style={[
                  styles.modalItem,
                  filterForType === '' && styles.modalItemSelected
                ]}
                onPress={() => {
                  setFilterForType('');
                  setShowFilterForTypePicker(false);
                }}
              >
                <Text style={[
                  styles.modalItemText,
                  filterForType === '' && styles.modalItemTextSelected
                ]}>
                  All Types
                </Text>
              </TouchableOpacity>
              {forTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.modalItem,
                    filterForType === String(type.id) && styles.modalItemSelected
                  ]}
                  onPress={() => {
                    setFilterForType(String(type.id));
                    setShowFilterForTypePicker(false);
                  }}
                >
                  <Text style={[
                    styles.modalItemText,
                    filterForType === String(type.id) && styles.modalItemTextSelected
                  ]}>
                    {type.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#6C63FF" />
          <Text style={styles.loadingText}>Loading notices...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchData}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : notices.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No notices found</Text>
        </View>
      ) : (
        <FlatList
          data={notices}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#6C63FF',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  spacer: {
    width: 40,
  },
  errorBanner: {
    backgroundColor: '#FFE5E5',
    borderBottomWidth: 1,
    borderBottomColor: '#FFB3B3',
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorBannerText: {
    color: '#C33333',
    flex: 1,
    marginRight: 8,
  },
  errorBannerClose: {
    padding: 4,
  },
  errorBannerCloseText: {
    color: '#C33333',
    fontSize: 18,
    fontWeight: 'bold',
  },
  formContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  formSection: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDDD',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
  },
  textArea: {
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  pickerButton: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
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
  formActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 20,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#6C63FF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  modalClose: {
    fontSize: 24,
    color: '#999',
  },
  modalList: {
    maxHeight: 300,
  },
  modalItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalItemSelected: {
    backgroundColor: '#E8E4FF',
  },
  modalItemText: {
    fontSize: 15,
    color: '#333',
  },
  modalItemTextSelected: {
    color: '#6C63FF',
    fontWeight: '600',
  },
  listHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  listTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    flexWrap: 'wrap',
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F0F3FF',
    borderWidth: 1,
    borderColor: '#D0D8FF',
  },
  filterButtonActive: {
    backgroundColor: '#E0E8FF',
    borderColor: '#6C63FF',
  },
  filterButtonText: {
    fontSize: 12,
    color: '#6C63FF',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#6C63FF',
    fontWeight: '600',
  },
  clearFilterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#FFE5E5',
    borderWidth: 1,
    borderColor: '#FFB3B3',
  },
  clearFilterText: {
    fontSize: 12,
    color: '#D32F2F',
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#6C63FF',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cardTitle: {
    flex: 1,
  },
  cardTitleText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  cardSubText: {
    fontSize: 12,
    color: '#666',
  },
  cardType: {
    fontSize: 11,
    backgroundColor: '#E8E4FF',
    color: '#6C63FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontWeight: '500',
  },
  cardDesc: {
    fontSize: 13,
    color: '#555',
    marginBottom: 8,
    lineHeight: 18,
  },
  cardMeta: {
    fontSize: 12,
    color: '#888',
    marginBottom: 10,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#6C63FF',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#FFE5E5',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#D32F2F',
    fontSize: 13,
    fontWeight: '600',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
  },
  errorText: {
    fontSize: 14,
    color: '#D32F2F',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#6C63FF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  retryButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});
