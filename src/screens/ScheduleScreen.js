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

export default function ScheduleScreen({ onBack }) {
  const [loading, setLoading] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [grades, setGrades] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [staffList, setStaffList] = useState([]);
  
  const [gradeId, setGradeId] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [staffId, setStaffId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [day, setDay] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [academicYearId, setAcademicYearId] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [showGradePicker, setShowGradePicker] = useState(false);
  const [showSectionPicker, setShowSectionPicker] = useState(false);
  const [showSubjectPicker, setShowSubjectPicker] = useState(false);
  const [showDayPicker, setShowDayPicker] = useState(false);
  const [showAcademicYearPicker, setShowAcademicYearPicker] = useState(false);

  // Filter states
  const [filterGradeId, setFilterGradeId] = useState('');
  const [filterAcademicYearId, setFilterAcademicYearId] = useState('');
  const [showFilterGradePicker, setShowFilterGradePicker] = useState(false);
  const [showFilterAcademicYearPicker, setShowFilterAcademicYearPicker] = useState(false);

  const days = [
    { id: 1, name: 'Monday' },
    { id: 2, name: 'Tuesday' },
    { id: 3, name: 'Wednesday' },
    { id: 4, name: 'Thursday' },
    { id: 5, name: 'Friday' },
    { id: 6, name: 'Saturday' },
    { id: 7, name: 'Sunday' },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (filterGradeId || filterAcademicYearId) {
      fetchSchedulesWithFilters();
    } else {
      fetchSchedulesWithFilters();
    }
  }, [filterGradeId, filterAcademicYearId]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
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
      console.log('[ScheduleScreen] Fetched grades:', finalGrades);
      setGrades(finalGrades);

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
      console.log('[ScheduleScreen] Fetched sections:', finalSections);
      setSections(finalSections);

      const subjectRes = await apiService.getSubjects();
      const subjectMaybe = subjectRes?.data;
      let subjectList = [];
      if (subjectMaybe?.subject && Array.isArray(subjectMaybe.subject)) {
        subjectList = subjectMaybe.subject;
      } else if (Array.isArray(subjectMaybe)) {
        subjectList = subjectMaybe;
      } else if (subjectMaybe?.data && Array.isArray(subjectMaybe.data)) {
        subjectList = subjectMaybe.data;
      }
      const finalSubjects = Array.isArray(subjectList) ? subjectList : [];
      console.log('[ScheduleScreen] Fetched subjects:', finalSubjects);
      setSubjects(finalSubjects);

      const yearRes = await apiService.getAcademicYears();
      const yearMaybe = yearRes?.data;
      let yearList = [];
      if (yearMaybe?.academicYear && Array.isArray(yearMaybe.academicYear)) {
        yearList = yearMaybe.academicYear;
      } else if (Array.isArray(yearMaybe)) {
        yearList = yearMaybe;
      } else if (yearMaybe?.data && Array.isArray(yearMaybe.data)) {
        yearList = yearMaybe.data;
      }
      const finalYears = Array.isArray(yearList) ? yearList : [];
      console.log('[ScheduleScreen] Fetched academic years:', finalYears);
      setAcademicYears(finalYears);

      await fetchSchedulesWithFilters();
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data');
      showToast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchSchedulesWithFilters = async () => {
    try {
      const filters = {};
      if (filterGradeId) {
        filters.grade_id = parseInt(filterGradeId, 10);
      }
      if (filterAcademicYearId) {
        filters.academic_year_id = parseInt(filterAcademicYearId, 10);
      }

      console.log('[ScheduleScreen] Fetching schedules with filters:', filters);
      const result = await apiService.getSchedules(filters);
      const data = Array.isArray(result.data) ? result.data : [];
      console.log('[ScheduleScreen] Fetched schedules:', data);
      setSchedules(data);
    } catch (err) {
      console.error('Error fetching schedules:', err);
      setError('Failed to load schedules');
      showToast('Failed to load schedules', 'error');
    }
  };

  const clearForm = () => {
    setGradeId('');
    setSectionId('');
    setStaffId('');
    setSubjectId('');
    setDay('');
    setStartTime('');
    setEndTime('');
    setAcademicYearId('');
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

  const getSubjectName = (id) => {
    const subject = subjects.find(s => parseInt(s.id, 10) === parseInt(id, 10));
    return subject?.name || 'Unknown Subject';
  };

  const getDayName = (id) => {
    const dayObj = days.find(d => d.id === parseInt(id, 10));
    return dayObj?.name || 'Unknown Day';
  };

  const getAcademicYearName = (id) => {
    const year = academicYears.find(y => parseInt(y.id, 10) === parseInt(id, 10));
    return year?.name || 'Unknown Year';
  };

  const handleAdd = async () => {
    if (!gradeId) {
      showToast('Grade is required', 'error');
      return;
    }
    if (!sectionId) {
      showToast('Section is required', 'error');
      return;
    }
    if (!staffId) {
      showToast('Staff is required', 'error');
      return;
    }
    if (!subjectId) {
      showToast('Subject is required', 'error');
      return;
    }
    if (!day) {
      showToast('Day is required', 'error');
      return;
    }
    if (!startTime) {
      showToast('Start Time is required', 'error');
      return;
    }
    if (!endTime) {
      showToast('End Time is required', 'error');
      return;
    }
    if (!academicYearId) {
      showToast('Academic Year is required', 'error');
      return;
    }

    Keyboard.dismiss();
    setSubmitting(true);

    try {
      const payload = {
        grade_id: parseInt(gradeId, 10),
        section_id: parseInt(sectionId, 10),
        staff_id: parseInt(staffId, 10),
        subject_id: parseInt(subjectId, 10),
        day: parseInt(day, 10),
        start_time: parseInt(startTime, 10),
        end_time: parseInt(endTime, 10),
        academic_year_id: parseInt(academicYearId, 10),
      };

      console.log('[ScheduleScreen] Submitting payload:', JSON.stringify(payload, null, 2));

      let response;
      if (editingId) {
        response = await apiService.updateSchedule(editingId, payload);
      } else {
        response = await apiService.addSchedule(payload);
      }

      if (response) {
        showToast(editingId ? 'Schedule updated successfully' : 'Schedule added successfully', 'success');
        clearForm();
        await fetchData();
      }
    } catch (err) {
      console.error('Error adding/updating schedule:', err);
      let errorMsg = 'Failed to add/update schedule';

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

  const handleEdit = async (schedule) => {
    setGradeId(schedule.grade_id ? String(schedule.grade_id) : '');
    setSectionId(schedule.section_id ? String(schedule.section_id) : '');
    setStaffId(schedule.staff_id ? String(schedule.staff_id) : '');
    setSubjectId(schedule.subject_id ? String(schedule.subject_id) : '');
    setDay(schedule.day ? String(schedule.day) : '');
    setStartTime(schedule.start_time ? String(schedule.start_time) : '');
    setEndTime(schedule.end_time ? String(schedule.end_time) : '');
    setAcademicYearId(schedule.academic_year_id ? String(schedule.academic_year_id) : '');
    setEditingId(schedule.id);
    window.scrollTo(0, 0);
  };

  const handleDelete = (id) => {
    Alert.alert('Delete Schedule', 'Are you sure you want to delete this schedule?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Delete',
        onPress: async () => {
          try {
            await apiService.deleteSchedule(id);
            showToast('Schedule deleted successfully', 'success');
            await fetchData();
          } catch (err) {
            console.error('Error deleting schedule:', err);
            showToast('Failed to delete schedule', 'error');
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitle}>
          <Text style={styles.cardTitleText}>{getSubjectName(item.subject_id)}</Text>
          <Text style={styles.cardSubText}>Grade: {getGradeName(item.grade_id)}</Text>
        </View>
        <Text style={styles.cardType}>{getDayName(item.day)}</Text>
      </View>
      <Text style={styles.cardMeta}>
        Time: {item.start_time}:00 - {item.end_time}:00
      </Text>
      <Text style={styles.cardMeta}>Section: {getSectionName(item.section_id)}</Text>
      <Text style={styles.cardMeta}>Year: {getAcademicYearName(item.academic_year_id)}</Text>
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
        <Text style={styles.headerTitle}>Schedule Management</Text>
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

      <ScrollView style={styles.formContainer} keyboardShouldPersistTaps="handled">
        <Text style={styles.formSection}>{editingId ? 'Edit Schedule' : 'Add New Schedule'}</Text>

        <Text style={styles.formLabel}>Academic Year *</Text>
        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => setShowAcademicYearPicker(true)}
          disabled={submitting}
        >
          <Text style={styles.pickerButtonText}>
            {academicYearId ? getAcademicYearName(parseInt(academicYearId, 10)) : '-- Select Academic Year --'}
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

        <Text style={styles.formLabel}>Section *</Text>
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

        <Text style={styles.formLabel}>Subject *</Text>
        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => setShowSubjectPicker(true)}
          disabled={submitting}
        >
          <Text style={styles.pickerButtonText}>
            {subjectId ? getSubjectName(parseInt(subjectId, 10)) : '-- Select Subject --'}
          </Text>
          <Text style={styles.pickerButtonArrow}>▼</Text>
        </TouchableOpacity>

        <Text style={styles.formLabel}>Day *</Text>
        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => setShowDayPicker(true)}
          disabled={submitting}
        >
          <Text style={styles.pickerButtonText}>
            {day ? getDayName(parseInt(day, 10)) : '-- Select Day --'}
          </Text>
          <Text style={styles.pickerButtonArrow}>▼</Text>
        </TouchableOpacity>

        <Text style={styles.formLabel}>Start Time (Hour) *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 8"
          value={startTime}
          onChangeText={setStartTime}
          keyboardType="number-pad"
          editable={!submitting}
          placeholderTextColor="#999"
        />

        <Text style={styles.formLabel}>End Time (Hour) *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 9"
          value={endTime}
          onChangeText={setEndTime}
          keyboardType="number-pad"
          editable={!submitting}
          placeholderTextColor="#999"
        />

        <Text style={styles.formLabel}>Staff ID *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter staff ID"
          value={staffId}
          onChangeText={setStaffId}
          keyboardType="number-pad"
          editable={!submitting}
          placeholderTextColor="#999"
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
              <Text style={styles.submitButtonText}>{editingId ? 'Update Schedule' : 'Add Schedule'}</Text>
            )}
          </TouchableOpacity>

          {editingId && (
            <TouchableOpacity style={styles.cancelButton} onPress={cancelEdit} disabled={submitting}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* Academic Year Picker Modal */}
      <Modal visible={showAcademicYearPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Academic Year</Text>
              <TouchableOpacity onPress={() => setShowAcademicYearPicker(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalList}>
              {academicYears.map((year) => (
                <TouchableOpacity
                  key={year.id}
                  style={[
                    styles.modalItem,
                    academicYearId === String(year.id) && styles.modalItemSelected
                  ]}
                  onPress={() => {
                    setAcademicYearId(String(year.id));
                    setShowAcademicYearPicker(false);
                  }}
                >
                  <Text style={[
                    styles.modalItemText,
                    academicYearId === String(year.id) && styles.modalItemTextSelected
                  ]}>
                    {year.name}
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

      {/* Subject Picker Modal */}
      <Modal visible={showSubjectPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Subject</Text>
              <TouchableOpacity onPress={() => setShowSubjectPicker(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalList}>
              {subjects.map((subject) => (
                <TouchableOpacity
                  key={subject.id}
                  style={[
                    styles.modalItem,
                    subjectId === String(subject.id) && styles.modalItemSelected
                  ]}
                  onPress={() => {
                    setSubjectId(String(subject.id));
                    setShowSubjectPicker(false);
                  }}
                >
                  <Text style={[
                    styles.modalItemText,
                    subjectId === String(subject.id) && styles.modalItemTextSelected
                  ]}>
                    {subject.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Day Picker Modal */}
      <Modal visible={showDayPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Day</Text>
              <TouchableOpacity onPress={() => setShowDayPicker(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalList}>
              {days.map((dayObj) => (
                <TouchableOpacity
                  key={dayObj.id}
                  style={[
                    styles.modalItem,
                    day === String(dayObj.id) && styles.modalItemSelected
                  ]}
                  onPress={() => {
                    setDay(String(dayObj.id));
                    setShowDayPicker(false);
                  }}
                >
                  <Text style={[
                    styles.modalItemText,
                    day === String(dayObj.id) && styles.modalItemTextSelected
                  ]}>
                    {dayObj.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Schedules List ({schedules.length})</Text>
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
            filterAcademicYearId && styles.filterButtonActive
          ]}
          onPress={() => setShowFilterAcademicYearPicker(true)}
        >
          <Text style={[
            styles.filterButtonText,
            filterAcademicYearId && styles.filterButtonTextActive
          ]}>
            Year: {filterAcademicYearId ? getAcademicYearName(parseInt(filterAcademicYearId, 10)) : 'All'}
          </Text>
        </TouchableOpacity>

        {(filterGradeId || filterAcademicYearId) && (
          <TouchableOpacity
            style={styles.clearFilterButton}
            onPress={() => {
              setFilterGradeId('');
              setFilterAcademicYearId('');
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

      {/* Filter Academic Year Picker Modal */}
      <Modal visible={showFilterAcademicYearPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter by Academic Year</Text>
              <TouchableOpacity onPress={() => setShowFilterAcademicYearPicker(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalList}>
              <TouchableOpacity
                style={[
                  styles.modalItem,
                  filterAcademicYearId === '' && styles.modalItemSelected
                ]}
                onPress={() => {
                  setFilterAcademicYearId('');
                  setShowFilterAcademicYearPicker(false);
                }}
              >
                <Text style={[
                  styles.modalItemText,
                  filterAcademicYearId === '' && styles.modalItemTextSelected
                ]}>
                  All Years
                </Text>
              </TouchableOpacity>
              {academicYears.map((year) => (
                <TouchableOpacity
                  key={year.id}
                  style={[
                    styles.modalItem,
                    filterAcademicYearId === String(year.id) && styles.modalItemSelected
                  ]}
                  onPress={() => {
                    setFilterAcademicYearId(String(year.id));
                    setShowFilterAcademicYearPicker(false);
                  }}
                >
                  <Text style={[
                    styles.modalItemText,
                    filterAcademicYearId === String(year.id) && styles.modalItemTextSelected
                  ]}>
                    {year.name}
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
          <Text style={styles.loadingText}>Loading schedules...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchData}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : schedules.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No schedules found</Text>
        </View>
      ) : (
        <FlatList
          data={schedules}
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
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
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
  cardMeta: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8,
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
