import React, { useEffect, useState, useCallback, useMemo, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
  Modal,
  TextInput,
  CheckBox,
} from 'react-native';
import apiService from '../api/apiService';
import { showToast } from '../components/Toast';

export default function MarkStoreScreen({ onBack }) {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Dropdowns state
  const [exams, setExams] = useState([]);
  const [grades, setGrades] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [marksDistribution, setMarksDistribution] = useState([]);

  // Selected values
  const [selectedExamId, setSelectedExamId] = useState('');
  const [selectedGradeId, setSelectedGradeId] = useState('');
  const [selectedSectionId, setSelectedSectionId] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');

  // Students and marks
  const [students, setStudents] = useState([]);
  const [studentMarks, setStudentMarks] = useState({});
  const [existingMarks, setExistingMarks] = useState({});

  // Modal states
  const [showExamPicker, setShowExamPicker] = useState(false);
  const [showGradePicker, setShowGradePicker] = useState(false);
  const [showSectionPicker, setShowSectionPicker] = useState(false);
  const [showSubjectPicker, setShowSubjectPicker] = useState(false);
  const [showMarkEntryModal, setShowMarkEntryModal] = useState(false);

  // Mark entry modal state
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentMarksData, setStudentMarksData] = useState([]);

  // Fetch initial data
  useEffect(() => {
    fetchExamData();
  }, []);

  const fetchExamData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getExamDataForMarkStore();
      const data = response?.data || response || {};
      setExams(Array.isArray(data.exams) ? data.exams : []);
    } catch (err) {
      console.error('Error fetching exam data:', err);
      setError(err?.message || 'Failed to load exam data');
      showToast('Failed to load exam data', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch grades from selected exam
  const handleExamSelect = (exam) => {
    setSelectedExamId(exam.id);
    setShowExamPicker(false);
    // Reset dependent fields
    setSelectedGradeId('');
    setSelectedSectionId('');
    setSelectedSubjectId('');
    setStudents([]);
    setMarksDistribution([]);
  };

  // Fetch sections and subjects when grade is selected
  const handleGradeSelect = async (grade) => {
    setSelectedGradeId(grade.id);
    setShowGradePicker(false);
    setSelectedSectionId('');
    setSelectedSubjectId('');
    setStudents([]);
    setMarksDistribution([]);

    // Fetch subjects for this grade
    try {
      const response = await apiService.getSubjectsForTeacher();
      console.log('[handleGradeSelect] Subject API Response:', response);
      const subjectData = response?.data || response || [];
      console.log('[handleGradeSelect] Subject data extracted:', subjectData);
      
      // Handle nested structure
      let subjects = [];
      if (Array.isArray(subjectData)) {
        subjects = subjectData;
      } else if (subjectData?.data && Array.isArray(subjectData.data)) {
        subjects = subjectData.data;
      } else if (subjectData?.subjects && Array.isArray(subjectData.subjects)) {
        subjects = subjectData.subjects;
      }
      
      console.log('[handleGradeSelect] Final subjects array:', subjects);
      setSubjects(subjects);
    } catch (err) {
      console.error('Error fetching subjects:', err);
      setSubjects([]);
    }
  };

  const handleSectionSelect = (section) => {
    setSelectedSectionId(section.id);
    setShowSectionPicker(false);
  };

  const handleSubjectSelect = (subject) => {
    setSelectedSubjectId(subject.id);
    setShowSubjectPicker(false);
  };

  // Fetch students and marks distribution
  const handleFetchStudents = async () => {
    if (!selectedExamId || !selectedGradeId || !selectedSectionId || !selectedSubjectId) {
      showToast('Please select all fields', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.getStudentsForExam({
        exam_type_id: selectedExamId,
        grade_id: selectedGradeId,
        section_id: selectedSectionId,
        subject_id: selectedSubjectId,
      });

      console.log('[handleFetchStudents] Full response:', response);
      
      const responseData = response?.data || {};
      
      setStudents(Array.isArray(responseData.data) ? responseData.data : []);
      setMarksDistribution(Array.isArray(responseData.marks_distribution) ? responseData.marks_distribution : []);
      
      // Initialize marks data
      const existingMarksMap = {};
      if (Array.isArray(responseData.existingMark)) {
        responseData.existingMark.forEach(mark => {
          const key = `${mark.student_id}_${mark.exam_setup_id}`;
          existingMarksMap[key] = mark;
        });
      }
      setExistingMarks(existingMarksMap);

      console.log('[handleFetchStudents] Students:', responseData.data);
      console.log('[handleFetchStudents] Marks Distribution:', responseData.marks_distribution);
      showToast('Students loaded successfully', 'success');
    } catch (err) {
      console.error('Error fetching students:', err);
      showToast(err?.message || 'Failed to load students', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Open mark entry modal for a student
  const handleOpenMarkEntry = (student) => {
    setSelectedStudent(student);
    const marks = [];
    const seenExams = new Set(); // Track seen exam IDs to avoid duplicates
    
    marksDistribution.forEach(exam => {
      // Skip if we've already added this exam
      if (seenExams.has(exam.id)) {
        return;
      }
      seenExams.add(exam.id);
      
      const key = `${student.student_id}_${exam.id}`;
      const existingMark = existingMarks[key];
      marks.push({
        exam_setup_id: exam.id,
        exam_title: exam.exam_title,
        mark: existingMark?.total_marks || '',
      });
    });
    setStudentMarksData(marks);
    setShowMarkEntryModal(true);
  };

  // Update mark for a student
  const handleMarkChange = useCallback((index, value) => {
    setStudentMarksData(prevMarks => {
      const updatedMarks = [...prevMarks];
      updatedMarks[index].mark = value;
      return updatedMarks;
    });
  }, []);

  // Save marks for selected student
  const handleSubmitMarks = useCallback(async (marksToSubmit) => {
    if (!selectedStudent) {
      showToast('No student selected', 'error');
      return;
    }

    try {
      const studentsData = [{
        student_id: selectedStudent.student_id,
        marks: marksToSubmit.map(m => ({
          exam_setup_id: m.exam_setup_id,
          mark: m.mark || 0,
        })),
      }];

      const response = await apiService.storeExamMarks({
        exam_type_id: selectedExamId,
        grade_id: selectedGradeId,
        section_id: selectedSectionId,
        subject_id: selectedSubjectId,
        students: studentsData,
      });

      showToast(response?.message || 'Marks saved successfully', 'success');
      setShowMarkEntryModal(false);
      handleFetchStudents(); // Refresh the list
    } catch (err) {
      console.error('Error saving marks:', err);
      showToast(err?.message || 'Failed to save marks', 'error');
    }
  }, [selectedStudent, selectedExamId, selectedGradeId, selectedSectionId, selectedSubjectId]);

  // Modal for selecting exam
  const ExamPickerModal = () => (
    <Modal visible={showExamPicker} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Exam</Text>
          <ScrollView>
            {exams.map(exam => (
              <TouchableOpacity
                key={exam.id}
                style={styles.modalOption}
                onPress={() => handleExamSelect(exam)}
              >
                <Text style={styles.modalOptionText}>{exam.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowExamPicker(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  // Grade picker modal (mock for now)
  const GradePickerModal = () => (
    <Modal visible={showGradePicker} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Grade</Text>
          <ScrollView>
            {/* Grades would come from API */}
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleGradeSelect({ id: 1, name: 'Grade 1' })}
            >
              <Text style={styles.modalOptionText}>Grade 1</Text>
            </TouchableOpacity>
          </ScrollView>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowGradePicker(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  // Section picker modal
  const SectionPickerModal = () => (
    <Modal visible={showSectionPicker} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Section</Text>
          <ScrollView>
            {/* Sections would come from API */}
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleSectionSelect({ id: 1, name: 'Section A' })}
            >
              <Text style={styles.modalOptionText}>Section A</Text>
            </TouchableOpacity>
          </ScrollView>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowSectionPicker(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  // Subject picker modal
  const SubjectPickerModal = () => (
    <Modal visible={showSubjectPicker} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Subject</Text>
          <ScrollView>
            {Array.isArray(subjects) && subjects.length > 0 ? (
              subjects.map(subject => (
                <TouchableOpacity
                  key={subject.id || subject}
                  style={styles.modalOption}
                  onPress={() => handleSubjectSelect(subject)}
                >
                  <Text style={styles.modalOptionText}>{subject.name || subject}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No subjects available</Text>
              </View>
            )}
          </ScrollView>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowSubjectPicker(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
  // Mark entry modal - Independent component with local state
  const MarkEntryModal = memo(({ 
    visible, 
    student, 
    initialMarks,
    onSubmit, 
    onClose, 
  }) => {
    const [localMarks, setLocalMarks] = useState([]);
    const [submitting, setSubmitting] = useState(false);

    // Update local marks only when modal opens with new data
    useEffect(() => {
      if (visible && initialMarks?.length > 0) {
        setLocalMarks(JSON.parse(JSON.stringify(initialMarks)));
      }
    }, [visible, initialMarks]);

    const handleLocalMarkChange = useCallback((index, value) => {
      setLocalMarks(prev => {
        const updated = [...prev];
        updated[index].mark = value;
        return updated;
      });
    }, []);

    const handleLocalSubmit = useCallback(async () => {
      setSubmitting(true);
      try {
        await onSubmit(localMarks);
      } finally {
        setSubmitting(false);
      }
    }, [localMarks, onSubmit]);

    if (!visible) return null;

    return (
      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.markEntryModalContainer}>
          <View style={styles.markEntryModalContent}>
            <Text style={styles.modalTitle}>
              Enter Marks - {student?.name}
            </Text>
            <ScrollView 
              style={styles.markEntryList}
              scrollEnabled={localMarks.length > 4}
              keyboardShouldPersistTaps="handled"
            >
              {localMarks.map((mark, index) => (
                <View key={`mark_${mark.exam_setup_id}`} style={styles.markEntryRow}>
                  <Text style={styles.markEntryLabel}>{mark.exam_title}</Text>
                  <TextInput
                    style={styles.markInput}
                    placeholder="Enter mark"
                    keyboardType="numeric"
                    value={mark.mark.toString()}
                    onChangeText={(value) => handleLocalMarkChange(index, value)}
                    selectTextOnFocus={true}
                  />
                </View>
              ))}
            </ScrollView>
            <View style={styles.modalButtonGroup}>
              <TouchableOpacity
                style={[styles.button, styles.submitButton]}
                onPress={handleLocalSubmit}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Submit</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  });

  if (loading && !students.length) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Mark Store</Text>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Filter Section */}
        <View style={styles.filterSection}>
          <Text style={styles.sectionTitle}>Select Details</Text>

          {/* Exam Selector */}
          <TouchableOpacity
            style={styles.selector}
            onPress={() => setShowExamPicker(true)}
          >
            <Text style={styles.selectorValue}>
              {selectedExamId ? exams.find(e => e.id === selectedExamId)?.name : '-- Select Exam --'}
            </Text>
            <Text style={styles.selectorArrow}>▼</Text>
          </TouchableOpacity>

          {/* Grade Selector */}
          <TouchableOpacity
            style={styles.selector}
            onPress={() => setShowGradePicker(true)}
          >
            <Text style={styles.selectorValue}>
              {selectedGradeId ? `Grade ${selectedGradeId}` : '-- Select Grade --'}
            </Text>
            <Text style={styles.selectorArrow}>▼</Text>
          </TouchableOpacity>

          {/* Section Selector */}
          <TouchableOpacity
            style={styles.selector}
            onPress={() => setShowSectionPicker(true)}
          >
            <Text style={styles.selectorValue}>
              {selectedSectionId ? `Section ${selectedSectionId}` : '-- Select Section --'}
            </Text>
            <Text style={styles.selectorArrow}>▼</Text>
          </TouchableOpacity>

          {/* Subject Selector */}
          <TouchableOpacity
            style={styles.selector}
            onPress={() => setShowSubjectPicker(true)}
          >
            <Text style={styles.selectorValue}>
              {selectedSubjectId ? `Subject ${selectedSubjectId}` : '-- Select Subject --'}
            </Text>
            <Text style={styles.selectorArrow}>▼</Text>
          </TouchableOpacity>

          {/* Fetch Students Button */}
          <TouchableOpacity
            style={styles.fetchButton}
            onPress={handleFetchStudents}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.fetchButtonText}>Load Students</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Students List */}
        {students.length > 0 && (
          <View style={styles.studentsSection}>
            <Text style={styles.sectionTitle}>Students ({students.length})</Text>
            <FlatList
              scrollEnabled={false}
              data={students}
              keyExtractor={(item) => item.student_id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.studentCard}
                  onPress={() => handleOpenMarkEntry(item)}
                >
                  <View style={styles.studentInfo}>
                    <Text style={styles.studentName}>{item.name}</Text>
                    <Text style={styles.studentRoll}>Roll: {item.roll_number}</Text>
                  </View>
                  <Text style={styles.editIcon}>→</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </ScrollView>

      {/* Modals */}
      <ExamPickerModal />
      <GradePickerModal />
      <SectionPickerModal />
      <SubjectPickerModal />
      <MarkEntryModal
        visible={showMarkEntryModal}
        student={selectedStudent}
        initialMarks={studentMarksData}
        onSubmit={handleSubmitMarks}
        onClose={() => setShowMarkEntryModal(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    fontSize: 16,
    color: '#007AFF',
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  errorContainer: {
    backgroundColor: '#fee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#c33',
    fontSize: 14,
  },
  filterSection: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  selector: {
    borderWidth: 1,
    borderColor: '#EFEFEF',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectorLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 0,
  },
  selectorValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    flex: 1,
  },
  selectorArrow: {
    fontSize: 12,
    color: '#999',
    marginLeft: 8,
  },
  fetchButton: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  fetchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  studentsSection: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
  },
  studentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  studentRoll: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  editIcon: {
    fontSize: 20,
    color: '#007AFF',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  modalOption: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#333',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
  },
  markEntryList: {
    maxHeight: 400,
    marginBottom: 16,
  },
  markEntryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  markEntryLabel: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  markInput: {
    flex: 0.4,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    fontSize: 14,
    textAlign: 'center',
    backgroundColor: '#FFF',
  },
  modalButtonGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  closeButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  markEntryModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    paddingTop: 40,
  },
  markEntryModalContent: {
    backgroundColor: '#fff',
    padding: 16,
    maxHeight: '75%',
    marginHorizontal: 10,
    borderRadius: 10,
  },
});
