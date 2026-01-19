import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Modal,
} from 'react-native';
import apiService from '../api/apiService';
import { showToast } from '../components/Toast';

export default function ResultScreen({ onBack, mode = 'resultList' }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Dropdowns state
  const [exams, setExams] = useState([]);
  const [grades, setGrades] = useState([]);
  const [sections, setSections] = useState([]);
  const [students, setStudents] = useState([]);

  // Selected values
  const [selectedExamId, setSelectedExamId] = useState('');
  const [selectedGradeId, setSelectedGradeId] = useState('');
  const [selectedSectionId, setSelectedSectionId] = useState('');

  // Results data
  const [results, setResults] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [markSheetData, setMarkSheetData] = useState(null);

  // Modal states
  const [showExamPicker, setShowExamPicker] = useState(false);
  const [showGradePicker, setShowGradePicker] = useState(false);
  const [showSectionPicker, setShowSectionPicker] = useState(false);
  const [showMarkSheetModal, setShowMarkSheetModal] = useState(false);

  // Fetch initial data
  useEffect(() => {
    fetchExamData();
  }, []);

  const fetchExamData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch exams
      const examResponse = await apiService.getExamTypesForResult();
      console.log('[ResultScreen] Exam Response:', examResponse);
      const examsArray = Array.isArray(examResponse?.data?.exams) ? examResponse.data.exams : [];
      console.log('[ResultScreen] Exams:', examsArray);
      setExams(examsArray);
      
      // Fetch sections (which contain grade_id)
      const sectionsResponse = await apiService.getSections();
      console.log('[ResultScreen] Sections Response:', sectionsResponse);
      const allSectionsArray = Array.isArray(sectionsResponse?.data) ? sectionsResponse.data : [];
      console.log('[ResultScreen] All Sections:', allSectionsArray);
      
      // Extract unique grades from sections
      const uniqueGrades = {};
      allSectionsArray.forEach(section => {
        if (section.grade_id && !uniqueGrades[section.grade_id]) {
          uniqueGrades[section.grade_id] = {
            id: section.grade_id,
            name: `Grade ${section.grade_id}`
          };
        }
      });
      const gradesArray = Object.values(uniqueGrades).sort((a, b) => a.id - b.id);
      console.log('[ResultScreen] Extracted Grades:', gradesArray);
      setGrades(gradesArray);
      
      // Store all sections for later filtering
      setSections(allSectionsArray);
    } catch (err) {
      console.error('Error fetching exam data:', err);
      setError(err?.message || 'Failed to load exam data');
      showToast('Failed to load exam data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleExamSelect = (exam) => {
    setSelectedExamId(exam.id);
    setShowExamPicker(false);
    setSelectedGradeId('');
    setSelectedSectionId('');
    setResults([]);
    // Fetch grades for this exam type
    fetchGradesForExam(exam.id);
  };

  const fetchGradesForExam = async (examTypeId) => {
    try {
      const response = await apiService.getExamTypesForResult();
      console.log('[fetchGradesForExam] Response:', response);
      
      // Find the selected exam to get its grades
      const examData = response?.data?.exams?.find(e => e.id == examTypeId);
      console.log('[fetchGradesForExam] Exam data:', examData);
      
      if (examData && examData.grades) {
        // Extract grades from exam data
        const examGrades = Array.isArray(examData.grades) ? examData.grades : [];
        console.log('[fetchGradesForExam] Grades:', examGrades);
        setGrades(examGrades);
      } else {
        // Fallback: Extract unique grades from sections
        const sectionsResponse = await apiService.getSections();
        const allSectionsArray = Array.isArray(sectionsResponse?.data) ? sectionsResponse.data : [];
        
        const uniqueGrades = {};
        allSectionsArray.forEach(section => {
          if (section.grade_id && !uniqueGrades[section.grade_id]) {
            uniqueGrades[section.grade_id] = {
              id: section.grade_id,
              name: `Grade ${section.grade_id}`
            };
          }
        });
        const gradesArray = Object.values(uniqueGrades).sort((a, b) => a.id - b.id);
        setGrades(gradesArray);
      }
    } catch (err) {
      console.error('[fetchGradesForExam] Error:', err);
      showToast('Failed to load grades for exam', 'error');
    }
  };

  const handleGradeSelect = (grade) => {
    setSelectedGradeId(grade.id);
    setShowGradePicker(false);
    setSelectedSectionId('');
    setResults([]);
  };

  const handleSectionSelect = (section) => {
    setSelectedSectionId(section.id);
    setShowSectionPicker(false);
  };

  // Fetch results list
  const handleFetchResults = async () => {
    if (!selectedExamId || !selectedGradeId || !selectedSectionId) {
      showToast('Please select all fields', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.getResultList({
        exam_type_id: selectedExamId,
        grade_id: selectedGradeId,
        section_id: selectedSectionId,
      });

      console.log('[handleFetchResults] Response:', response);
      // Backend returns: {status: true, data: {data: [...]}}
      // apiService wraps it as: {raw: {...}, data: {...}, message: '...'}
      const resultsArray = response?.data?.data || response?.data || [];
      setResults(Array.isArray(resultsArray) ? resultsArray : []);
      console.log('[handleFetchResults] Results set:', resultsArray);
      showToast('Results loaded successfully', 'success');
    } catch (err) {
      console.error('Error fetching results:', err);
      showToast(err?.message || 'Failed to load results', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Open mark sheet modal
  const handleOpenMarkSheet = async (student) => {
    setSelectedStudent(student);
    setLoading(true);
    try {
      const response = await apiService.getMarkSheet({
        student_id: student.student_id,
        exam_type_id: selectedExamId,
        grade_id: selectedGradeId,
      });

      console.log('[handleOpenMarkSheet] Response:', response);
      const data = response?.data?.data || response?.data || {};
      setMarkSheetData(data);
      setShowMarkSheetModal(true);
    } catch (err) {
      console.error('Error fetching mark sheet:', err);
      showToast(err?.message || 'Failed to load mark sheet', 'error');
    } finally {
      setLoading(false);
    }
  };

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

  // Grade picker modal
  const GradePickerModal = () => (
    <Modal visible={showGradePicker} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Grade</Text>
          <ScrollView>
            {grades.length > 0 ? (
              grades.map(grade => (
                <TouchableOpacity
                  key={grade.id}
                  style={styles.modalOption}
                  onPress={() => handleGradeSelect(grade)}
                >
                  <Text style={styles.modalOptionText}>{grade.name}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No grades available</Text>
              </View>
            )}
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
  const SectionPickerModal = () => {
    // Filter sections by selected grade
    const filteredSections = selectedGradeId 
      ? sections.filter(s => s.grade_id == selectedGradeId)
      : [];
    
    return (
      <Modal visible={showSectionPicker} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Section</Text>
            <ScrollView>
              {filteredSections.length > 0 ? (
                filteredSections.map(section => (
                  <TouchableOpacity
                    key={section.id}
                    style={styles.modalOption}
                    onPress={() => handleSectionSelect(section)}
                  >
                    <Text style={styles.modalOptionText}>{section.name}</Text>
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No sections available</Text>
                </View>
              )}
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
  };

  // Mark sheet modal
  const MarkSheetModal = () => (
    <Modal visible={showMarkSheetModal} transparent animationType="fade">
      <View style={styles.markSheetModalContainer}>
        <View style={styles.markSheetModalContent}>
          {loading ? (
            <ActivityIndicator size="large" color="#007AFF" />
          ) : markSheetData ? (
            <>
              <Text style={styles.modalTitle}>
                Mark Sheet - {markSheetData.student_name}
              </Text>
              <ScrollView style={styles.markSheetList}>
                {/* Student Info */}
                <View style={styles.infoBox}>
                  <Text style={styles.infoLabel}>Exam: {markSheetData.exam_type_id}</Text>
                  <Text style={styles.infoLabel}>Grade: {markSheetData.grade_name}</Text>
                  <Text style={styles.infoLabel}>Section: {markSheetData.section_name}</Text>
                </View>

                {/* Subjects Marks */}
                <Text style={styles.subSectionTitle}>Subject Marks</Text>
                {markSheetData.subjects && markSheetData.subjects.map((subject, index) => (
                  <View key={index} style={styles.subjectRow}>
                    <View style={styles.subjectInfo}>
                      <Text style={styles.subjectName}>{subject.subject_name}</Text>
                      <Text style={styles.examTitle}>{subject.exam_title}</Text>
                    </View>
                    <View style={styles.marksInfo}>
                      <Text style={styles.markValue}>{subject.total_marks || 'Absent'}</Text>
                      <Text style={styles.markLabel}>
                        / {subject.exam_mark}
                      </Text>
                    </View>
                  </View>
                ))}

                {/* Summary */}
                <View style={styles.summaryBox}>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Total Marks:</Text>
                    <Text style={styles.summaryValue}>{markSheetData.total_marks}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Average Marks:</Text>
                    <Text style={styles.summaryValue}>{markSheetData.average_marks}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>GPA:</Text>
                    <Text style={styles.summaryValue}>{markSheetData.gpa}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Grade:</Text>
                    <Text style={[styles.summaryValue, { color: '#FF6B6B' }]}>
                      {markSheetData.grade}
                    </Text>
                  </View>
                </View>
              </ScrollView>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowMarkSheetModal(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </>
          ) : null}
        </View>
      </View>
    </Modal>
  );

  if (loading && !results.length) {
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
          <Text style={styles.title}>
            {mode === 'resultList' ? 'Result List' : mode === 'markSheet' ? 'Mark Sheet' : 'All Mark Sheets'}
          </Text>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Filter Section */}
        <View style={styles.filterSection}>
          <Text style={styles.sectionTitle}>
            {mode === 'resultList' ? 'Select Exam & Details' : mode === 'markSheet' ? 'Select Student & Exam' : 'Select Grade & Section'}
          </Text>

          {/* Mode: resultList - Show all three selectors */}
          {mode === 'resultList' && (
            <>
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
                  {selectedGradeId ? grades.find(g => g.id === selectedGradeId)?.name : '-- Select Grade --'}
                </Text>
                <Text style={styles.selectorArrow}>▼</Text>
              </TouchableOpacity>

              {/* Section Selector - Filter by selected grade */}
              <TouchableOpacity
                style={styles.selector}
                onPress={() => setShowSectionPicker(true)}
                disabled={!selectedGradeId}
              >
                <Text style={[styles.selectorValue, !selectedGradeId && { color: '#ccc' }]}>
                  {selectedSectionId ? sections.find(s => s.id === selectedSectionId)?.name : '-- Select Section --'}
                </Text>
                <Text style={styles.selectorArrow}>▼</Text>
              </TouchableOpacity>
            </>
          )}

          {/* Mode: markSheet - Show Exam and Grade only */}
          {mode === 'markSheet' && (
            <>
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
                  {selectedGradeId ? grades.find(g => g.id === selectedGradeId)?.name : '-- Select Grade --'}
                </Text>
                <Text style={styles.selectorArrow}>▼</Text>
              </TouchableOpacity>
            </>
          )}

          {/* Mode: allMarkSheet - Show Grade and Section only */}
          {mode === 'allMarkSheet' && (
            <>
              {/* Grade Selector */}
              <TouchableOpacity
                style={styles.selector}
                onPress={() => setShowGradePicker(true)}
              >
                <Text style={styles.selectorValue}>
                  {selectedGradeId ? grades.find(g => g.id === selectedGradeId)?.name : '-- Select Grade --'}
                </Text>
                <Text style={styles.selectorArrow}>▼</Text>
              </TouchableOpacity>

              {/* Section Selector - Filter by selected grade */}
              <TouchableOpacity
                style={styles.selector}
                onPress={() => setShowSectionPicker(true)}
                disabled={!selectedGradeId}
              >
                <Text style={[styles.selectorValue, !selectedGradeId && { color: '#ccc' }]}>
                  {selectedSectionId ? sections.find(s => s.id === selectedSectionId)?.name : '-- Select Section --'}
                </Text>
                <Text style={styles.selectorArrow}>▼</Text>
              </TouchableOpacity>
            </>
          )}

          {/* Fetch Results Button */}
          <TouchableOpacity
            style={styles.fetchButton}
            onPress={handleFetchResults}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.fetchButtonText}>
                {mode === 'resultList' ? 'Load Results' : mode === 'markSheet' ? 'View Mark Sheet' : 'Load All Mark Sheets'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Results List */}
        {results.length > 0 && (
          <View style={styles.resultsSection}>
            <Text style={styles.sectionTitle}>Results ({results.length})</Text>
            <FlatList
              scrollEnabled={false}
              data={results}
              keyExtractor={(item) => item.student_id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.resultCard}
                  onPress={() => handleOpenMarkSheet(item)}
                >
                  <View style={styles.resultInfo}>
                    <Text style={styles.studentName}>{item.student_name}</Text>
                    <Text style={styles.studentRoll}>Roll: {item.roll_number}</Text>
                    <View style={styles.gradeSection}>
                      <Text style={styles.gradeSectionText}>Grade: {item.grade_name || 'N/A'}</Text>
                      <Text style={styles.gradeSectionText}>Section: {item.section_name || 'N/A'}</Text>
                    </View>
                    <View style={styles.marksRow}>
                      <Text style={styles.markLabel}>Total: {item.total_marks || 'N/A'}</Text>
                      <Text style={styles.markLabel}>Avg: {item.average_marks ? parseFloat(item.average_marks).toFixed(2) : 'N/A'}</Text>
                      <Text style={styles.markLabel}>GPA: {item.gpa || 'N/A'}</Text>
                    </View>
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
      <MarkSheetModal />
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
  subSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
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
  resultsSection: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
  },
  resultCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  resultInfo: {
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
  marksRow: {
    flexDirection: 'row',
    marginTop: 6,
    gap: 12,
  },
  gradeSection: {
    flexDirection: 'row',
    marginTop: 6,
    gap: 12,
    paddingVertical: 4,
  },
  gradeSectionText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  markLabel: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
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
  closeButton: {
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    marginTop: 12,
  },
  closeButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  markSheetModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    paddingTop: 40,
  },
  markSheetModalContent: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    padding: 16,
    maxHeight: '75%',
    marginHorizontal: 10,
  },
  markSheetList: {
    marginBottom: 16,
    maxHeight: 400,
  },
  infoBox: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 13,
    color: '#555',
    marginBottom: 4,
  },
  subjectRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  subjectInfo: {
    flex: 1,
  },
  subjectName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  examTitle: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  marksInfo: {
    alignItems: 'flex-end',
  },
  markValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  summaryBox: {
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
});
