import React, { useEffect, useState } from 'react';
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
} from 'react-native';
import apiService from '../api/apiService';
import { showToast } from '../components/Toast';

// Date Picker Component
function DatePickerContent({ selectedDate, onDateSelect, getYears, getMonths, getDaysInMonth }) {
  const [selectedYear, setSelectedYear] = useState(selectedDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(selectedDate.getMonth());
  const [selectedDay, setSelectedDay] = useState(selectedDate.getDate());

  const years = getYears();
  const months = getMonths();
  const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handleConfirm = () => {
    onDateSelect(selectedYear, selectedMonth, selectedDay);
  };

  return (
    <View style={styles.datePickerContent}>
      <View style={styles.datePickerRow}>
        {/* Year Picker */}
        <View style={styles.datePickerColumn}>
          <Text style={styles.datePickerLabel}>Year</Text>
          <ScrollView style={styles.datePickerScrollColumn}>
            {years.map(year => (
              <TouchableOpacity
                key={year}
                style={[
                  styles.datePickerOption,
                  selectedYear === year && styles.datePickerOptionSelected,
                ]}
                onPress={() => setSelectedYear(year)}
              >
                <Text
                  style={[
                    styles.datePickerOptionText,
                    selectedYear === year && styles.datePickerOptionTextSelected,
                  ]}
                >
                  {year}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Month Picker */}
        <View style={styles.datePickerColumn}>
          <Text style={styles.datePickerLabel}>Month</Text>
          <ScrollView style={styles.datePickerScrollColumn}>
            {months.map((month, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.datePickerOption,
                  selectedMonth === index && styles.datePickerOptionSelected,
                ]}
                onPress={() => setSelectedMonth(index)}
              >
                <Text
                  style={[
                    styles.datePickerOptionText,
                    selectedMonth === index && styles.datePickerOptionTextSelected,
                  ]}
                >
                  {month}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Day Picker */}
        <View style={styles.datePickerColumn}>
          <Text style={styles.datePickerLabel}>Day</Text>
          <ScrollView style={styles.datePickerScrollColumn}>
            {days.map(day => (
              <TouchableOpacity
                key={day}
                style={[
                  styles.datePickerOption,
                  selectedDay === day && styles.datePickerOptionSelected,
                ]}
                onPress={() => setSelectedDay(day)}
              >
                <Text
                  style={[
                    styles.datePickerOptionText,
                    selectedDay === day && styles.datePickerOptionTextSelected,
                  ]}
                >
                  {day}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
      
      <TouchableOpacity
        style={styles.datePickerApply}
        onPress={handleConfirm}
      >
        <Text style={styles.datePickerApplyText}>Apply Selection</Text>
      </TouchableOpacity>
    </View>
  );
}

// Time Picker Component
function TimePickerContent({ selectedTime, onTimeSelect }) {
  const currentTime = selectedTime ? new Date(parseInt(selectedTime) * 1000) : new Date();
  const [selectedHour, setSelectedHour] = useState(currentTime.getHours());
  const [selectedMinute, setSelectedMinute] = useState(currentTime.getMinutes());

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  const handleConfirm = () => {
    onTimeSelect(selectedHour, selectedMinute);
  };

  const formatNumber = (num) => num.toString().padStart(2, '0');

  return (
    <View style={styles.datePickerContent}>
      <View style={styles.datePickerRow}>
        {/* Hour Picker */}
        <View style={styles.datePickerColumn}>
          <Text style={styles.datePickerLabel}>Hour</Text>
          <ScrollView style={styles.datePickerScrollColumn}>
            {hours.map(hour => (
              <TouchableOpacity
                key={hour}
                style={[
                  styles.datePickerOption,
                  selectedHour === hour && styles.datePickerOptionSelected,
                ]}
                onPress={() => setSelectedHour(hour)}
              >
                <Text
                  style={[
                    styles.datePickerOptionText,
                    selectedHour === hour && styles.datePickerOptionTextSelected,
                  ]}
                >
                  {formatNumber(hour)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Minute Picker */}
        <View style={styles.datePickerColumn}>
          <Text style={styles.datePickerLabel}>Minute</Text>
          <ScrollView style={styles.datePickerScrollColumn}>
            {minutes.map(minute => (
              <TouchableOpacity
                key={minute}
                style={[
                  styles.datePickerOption,
                  selectedMinute === minute && styles.datePickerOptionSelected,
                ]}
                onPress={() => setSelectedMinute(minute)}
              >
                <Text
                  style={[
                    styles.datePickerOptionText,
                    selectedMinute === minute && styles.datePickerOptionTextSelected,
                  ]}
                >
                  {formatNumber(minute)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
      
      <TouchableOpacity
        style={styles.datePickerApply}
        onPress={handleConfirm}
      >
        <Text style={styles.datePickerApplyText}>Apply Selection</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function ExamAttendanceScreen({ onBack }) {
  const [grades, setGrades] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [examTypes, setExamTypes] = useState([]);
  const [branches, setBranches] = useState([]);

  const [gradeId, setGradeId] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [examTypeId, setExamTypeId] = useState('');
  const [branchId, setBranchId] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [showGradePicker, setShowGradePicker] = useState(false);
  const [showSectionPicker, setShowSectionPicker] = useState(false);
  const [showSubjectPicker, setShowSubjectPicker] = useState(false);
  const [showExamTypePicker, setShowExamTypePicker] = useState(false);
  const [showBranchPicker, setShowBranchPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [studentList, setStudentList] = useState([]);
  const [studentAttendances, setStudentAttendances] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const attendanceTypes = [
    { value: 1, label: 'Present' },
    { value: 2, label: 'Absent' },
    { value: 3, label: 'Late' },
    { value: 4, label: 'Leave' },
  ];

  const formatDateShort = (date) => {
    if (!date) return 'Select Date';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${day}/${month}/${year}`;
  };

  const getYears = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);
  };

  const getMonths = () => [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    await Promise.all([
      fetchGrades(),
      fetchSections(),
      fetchSubjects(),
      fetchExamTypes(),
      fetchBranches(),
    ]);
  };

  const fetchGrades = async () => {
    try {
      const response = await apiService.getGrades();
      let gradeList = [];
      if (Array.isArray(response?.data)) {
        gradeList = response.data;
      } else if (response?.data?.grade && Array.isArray(response.data.grade)) {
        gradeList = response.data.grade;
      }
      setGrades(gradeList);
    } catch (error) {
      console.error('[ExamAttendanceScreen] Error fetching grades:', error);
    }
  };

  const fetchSections = async () => {
    try {
      const response = await apiService.getSections();
      let sectionList = [];
      if (Array.isArray(response?.data)) {
        sectionList = response.data;
      } else if (response?.data?.section && Array.isArray(response.data.section)) {
        sectionList = response.data.section;
      }
      setSections(sectionList);
    } catch (error) {
      console.error('[ExamAttendanceScreen] Error fetching sections:', error);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await apiService.getSubjects();
      let subjectList = [];
      if (Array.isArray(response?.data)) {
        subjectList = response.data;
      } else if (response?.data?.subject && Array.isArray(response.data.subject)) {
        subjectList = response.data.subject;
      }
      setSubjects(subjectList);
    } catch (error) {
      console.error('[ExamAttendanceScreen] Error fetching subjects:', error);
    }
  };

  const fetchExamTypes = async () => {
    try {
      const response = await apiService.getExamTypes();
      let examTypeList = [];
      if (Array.isArray(response?.data)) {
        examTypeList = response.data;
      }
      setExamTypes(examTypeList);
    } catch (error) {
      console.error('[ExamAttendanceScreen] Error fetching exam types:', error);
    }
  };

  const fetchBranches = async () => {
    try {
      const response = await apiService.getBranches();
      let branchList = [];
      if (Array.isArray(response?.data)) {
        branchList = response.data;
      }
      setBranches(branchList);
    } catch (error) {
      console.error('[ExamAttendanceScreen] Error fetching branches:', error);
    }
  };

  const handleDateSelect = (year, month, day) => {
    const newDate = new Date(year, month, day);
    setSelectedDate(newDate);
  };



  const fetchStudents = async () => {
    if (!gradeId || !sectionId) {
      showToast('Please select grade and section', 'error');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const payload = {
        grade_id: parseInt(gradeId),
        section_id: parseInt(sectionId),
        attendance_date: Math.floor(selectedDate.getTime() / 1000),
      };

      console.log('[ExamAttendanceScreen] Fetching students with payload:', payload);
      const response = await apiService.searchExamAttendance(payload);
      console.log('[ExamAttendanceScreen] Full search response:', response);

      let students = [];
      let attendances = [];
      
      if (response?.data) {
        if (response.data.students && response.data.attendances) {
          students = response.data.students;
          attendances = response.data.attendances;
        } else if (Array.isArray(response.data)) {
          students = response.data;
          attendances = [];
        }
      }

      console.log('[ExamAttendanceScreen] Extracted students:', students);
      console.log('[ExamAttendanceScreen] Extracted attendances:', JSON.stringify(attendances, null, 2));

      setStudentList(students);

      const attendanceMap = {};
      if (attendances && Array.isArray(attendances)) {
        attendances.forEach((att, index) => {
          console.log('[ExamAttendanceScreen] Raw attendance record #' + index + ':', JSON.stringify(att, null, 2));
          console.log('[ExamAttendanceScreen] Available keys:', Object.keys(att));
          
          // Try different possible field names
          const studentId = att.student_id || att.studentId || att.id;
          const attendanceType = parseInt(att.attendance_type || att.attendanceType || 1);
          
          console.log('[ExamAttendanceScreen] Extracted - StudentID:', studentId, 'Type:', attendanceType);
          
          if (studentId) {
            attendanceMap[studentId] = {
              id: att.id,
              attendance_type: attendanceType,
            };
          }
        });
      }
      
      console.log('[ExamAttendanceScreen] Final attendance map:', JSON.stringify(attendanceMap, null, 2));
      setStudentAttendances(attendanceMap);

      if (students.length === 0) {
        showToast('No students found', 'info');
      }
    } catch (error) {
      console.error('[ExamAttendanceScreen] Error fetching students:', error);
      setError(error?.message || 'Failed to load students');
      showToast(error?.message || 'Failed to load students', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceChange = (studentId, field, value) => {
    setStudentAttendances(prev => {
      const currentAttendance = prev[studentId] || {};
      return {
        ...prev,
        [studentId]: {
          ...currentAttendance,
          [field]: value,
        },
      };
    });
  };

  const handleSubmit = async () => {
    if (!gradeId || !sectionId || !branchId || !subjectId || !examTypeId) {
      showToast('Please select grade, section, branch, subject and exam type', 'error');
      return;
    }

    if (studentList.length === 0) {
      showToast('No students to mark attendance', 'error');
      return;
    }

    setSubmitting(true);
    try {
      // Prepare students array
      const studentsData = studentList
        .filter(student => studentAttendances[student.id])
        .map(student => {
          const attendance = studentAttendances[student.id];
          return {
            student_id: parseInt(student.id),
            attendance_type: parseInt(attendance.attendance_type || 1),
          };
        });

      if (studentsData.length === 0) {
        showToast('Please mark attendance for at least one student', 'error');
        setSubmitting(false);
        return;
      }

      console.log('[ExamAttendanceScreen] Students to submit:', studentsData);
      console.log('[ExamAttendanceScreen] Student attendance map:', studentAttendances);
      console.log('[ExamAttendanceScreen] All student list:', studentList);

      const payload = {
        grade_id: parseInt(gradeId),
        section_id: [parseInt(sectionId)],
        subject_id: parseInt(subjectId),
        exam_type_id: parseInt(examTypeId),
        branch_id: [parseInt(branchId)],
        attendance_date: Math.floor(selectedDate.getTime() / 1000),
        students: studentsData,
      };

      console.log('[ExamAttendanceScreen] Full payload:', JSON.stringify(payload, null, 2));
      const response = await apiService.addExamAttendance(payload);
      console.log('[ExamAttendanceScreen] Submit response:', response);

      showToast(response?.message || 'Exam attendance saved successfully', 'success');
      
      // Refresh the data
      fetchStudents();
    } catch (error) {
      console.error('[ExamAttendanceScreen] Error saving attendance:', error);
      showToast(error?.message || 'Failed to save attendance', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const getGradeName = (id) => grades.find(g => g.id === parseInt(id))?.name || 'N/A';
  const getSectionName = (id) => sections.find(s => s.id === parseInt(id))?.name || 'N/A';
  const getSubjectName = (id) => subjects.find(s => s.id === parseInt(id))?.name || 'N/A';
  const getExamTypeName = (id) => examTypes.find(e => e.id === parseInt(id))?.name || 'N/A';
  const getBranchName = (id) => branches.find(b => b.id === parseInt(id))?.name || 'N/A';

  const renderStudentItem = ({ item: student }) => {
    const attendance = studentAttendances[student.id] || {};
    const attendanceType = attendance.attendance_type;

    return (
      <View style={styles.staffCard}>
        <View style={styles.staffHeader}>
          <Text style={styles.staffName}>{student.name}</Text>
          <Text style={styles.staffGender}>Roll: {student.roll_number}</Text>
        </View>

        {/* Attendance Type Selection */}
        <View style={styles.attendanceTypeContainer}>
          <Text style={styles.label}>Attendance Type:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {attendanceTypes.map(type => (
              <TouchableOpacity
                key={type.value}
                style={[
                  styles.typeButton,
                  attendanceType === type.value && styles.typeButtonActive,
                ]}
                onPress={() => handleAttendanceChange(student.id, 'attendance_type', type.value)}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    attendanceType === type.value && styles.typeButtonTextActive,
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Exam Attendance</Text>
      </View>

      {/* Filters */}
      <ScrollView style={styles.filterContainer} showsVerticalScrollIndicator={false}>
        {/* Row 1: Grade and Section */}
        <View style={styles.filterRow}>
          {/* Grade Selection */}
          <View style={styles.filterFieldColumn}>
            <Text style={styles.filterLabel}>Grade:</Text>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setShowGradePicker(!showGradePicker)}
            >
              <Text style={styles.pickerButtonText}>
                {gradeId ? getGradeName(parseInt(gradeId)) : 'Select Grade'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Section Selection */}
          <View style={styles.filterFieldColumn}>
            <Text style={styles.filterLabel}>Section:</Text>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setShowSectionPicker(!showSectionPicker)}
            >
              <Text style={styles.pickerButtonText}>
                {sectionId ? getSectionName(parseInt(sectionId)) : 'Select Section'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Row 2: Subject and Exam Type */}
        <View style={styles.filterRow}>
          {/* Subject Selection */}
          <View style={styles.filterFieldColumn}>
            <Text style={styles.filterLabel}>Subject:</Text>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setShowSubjectPicker(!showSubjectPicker)}
            >
              <Text style={styles.pickerButtonText}>
                {subjectId ? getSubjectName(parseInt(subjectId)) : 'Select Subject'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Exam Type Selection */}
          <View style={styles.filterFieldColumn}>
            <Text style={styles.filterLabel}>Exam Type:</Text>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setShowExamTypePicker(!showExamTypePicker)}
            >
              <Text style={styles.pickerButtonText}>
                {examTypeId ? getExamTypeName(parseInt(examTypeId)) : 'Select Exam Type'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Row 3: Branch and Date */}
        <View style={styles.filterRow}>
          {/* Branch Selection */}
          <View style={styles.filterFieldColumn}>
            <Text style={styles.filterLabel}>Branch:</Text>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setShowBranchPicker(!showBranchPicker)}
            >
              <Text style={styles.pickerButtonText}>
                {branchId ? getBranchName(parseInt(branchId)) : 'Select Branch'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Date Input */}
          <View style={styles.filterFieldColumn}>
            <Text style={styles.filterLabel}>Attendance Date:</Text>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.pickerButtonText}>
                {selectedDate ? formatDateShort(selectedDate) : 'Select Date'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Load Button */}
        <TouchableOpacity
          style={styles.loadButton}
          onPress={fetchStudents}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loadButtonText}>Load Attendance</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Grade Picker Modal */}
      {showGradePicker && (
        <View style={styles.pickerModal}>
          <Text style={styles.pickerTitle}>Select Grade</Text>
          <ScrollView style={styles.pickerScroll}>
            {grades.map(grade => (
              <TouchableOpacity
                key={grade.id}
                style={[
                  styles.pickerItem,
                  gradeId === grade.id.toString() && styles.pickerItemSelected,
                ]}
                onPress={() => {
                  setGradeId(grade.id.toString());
                  setShowGradePicker(false);
                }}
              >
                <Text
                  style={[
                    styles.pickerItemText,
                    gradeId === grade.id.toString() && styles.pickerItemTextSelected,
                  ]}
                >
                  {grade.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity
            style={styles.pickerCloseButton}
            onPress={() => setShowGradePicker(false)}
          >
            <Text style={styles.pickerCloseButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Section Picker Modal */}
      {showSectionPicker && (
        <View style={styles.pickerModal}>
          <Text style={styles.pickerTitle}>Select Section</Text>
          <ScrollView style={styles.pickerScroll}>
            {sections.map(section => (
              <TouchableOpacity
                key={section.id}
                style={[
                  styles.pickerItem,
                  sectionId === section.id.toString() && styles.pickerItemSelected,
                ]}
                onPress={() => {
                  setSectionId(section.id.toString());
                  setShowSectionPicker(false);
                }}
              >
                <Text
                  style={[
                    styles.pickerItemText,
                    sectionId === section.id.toString() && styles.pickerItemTextSelected,
                  ]}
                >
                  {section.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity
            style={styles.pickerCloseButton}
            onPress={() => setShowSectionPicker(false)}
          >
            <Text style={styles.pickerCloseButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Subject Picker Modal */}
      {showSubjectPicker && (
        <View style={styles.pickerModal}>
          <Text style={styles.pickerTitle}>Select Subject</Text>
          <ScrollView style={styles.pickerScroll}>
            {subjects.map(subject => (
              <TouchableOpacity
                key={subject.id}
                style={[
                  styles.pickerItem,
                  subjectId === subject.id.toString() && styles.pickerItemSelected,
                ]}
                onPress={() => {
                  setSubjectId(subject.id.toString());
                  setShowSubjectPicker(false);
                }}
              >
                <Text
                  style={[
                    styles.pickerItemText,
                    subjectId === subject.id.toString() && styles.pickerItemTextSelected,
                  ]}
                >
                  {subject.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity
            style={styles.pickerCloseButton}
            onPress={() => setShowSubjectPicker(false)}
          >
            <Text style={styles.pickerCloseButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Exam Type Picker Modal */}
      {showExamTypePicker && (
        <View style={styles.pickerModal}>
          <Text style={styles.pickerTitle}>Select Exam Type</Text>
          <ScrollView style={styles.pickerScroll}>
            {examTypes.map(examType => (
              <TouchableOpacity
                key={examType.id}
                style={[
                  styles.pickerItem,
                  examTypeId === examType.id.toString() && styles.pickerItemSelected,
                ]}
                onPress={() => {
                  setExamTypeId(examType.id.toString());
                  setShowExamTypePicker(false);
                }}
              >
                <Text
                  style={[
                    styles.pickerItemText,
                    examTypeId === examType.id.toString() && styles.pickerItemTextSelected,
                  ]}
                >
                  {examType.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity
            style={styles.pickerCloseButton}
            onPress={() => setShowExamTypePicker(false)}
          >
            <Text style={styles.pickerCloseButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Branch Picker Modal */}
      {showBranchPicker && (
        <View style={styles.pickerModal}>
          <Text style={styles.pickerTitle}>Select Branch</Text>
          <ScrollView style={styles.pickerScroll}>
            {branches.map(branch => (
              <TouchableOpacity
                key={branch.id}
                style={[
                  styles.pickerItem,
                  branchId === branch.id.toString() && styles.pickerItemSelected,
                ]}
                onPress={() => {
                  setBranchId(branch.id.toString());
                  setShowBranchPicker(false);
                }}
              >
                <Text
                  style={[
                    styles.pickerItemText,
                    branchId === branch.id.toString() && styles.pickerItemTextSelected,
                  ]}
                >
                  {branch.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity
            style={styles.pickerCloseButton}
            onPress={() => setShowBranchPicker(false)}
          >
            <Text style={styles.pickerCloseButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Date Picker Modal */}
      {showDatePicker && (
        <Modal
          visible={showDatePicker}
          transparent
          animationType="slide"
          onRequestClose={() => setShowDatePicker(false)}
        >
          <View style={styles.datePickerOverlay}>
            <View style={styles.datePickerContainer}>
              <View style={styles.datePickerHeader}>
                <Text style={styles.datePickerTitle}>Select Date</Text>
                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                  <Text style={styles.datePickerClose}>✕</Text>
                </TouchableOpacity>
              </View>
              
              <DatePickerContent
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
                getYears={getYears}
                getMonths={getMonths}
                getDaysInMonth={getDaysInMonth}
              />
              
              <TouchableOpacity
                style={styles.datePickerConfirm}
                onPress={() => setShowDatePicker(false)}
              >
                <Text style={styles.datePickerConfirmText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Student List */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {studentList.length > 0 && (
        <>
          <FlatList
            data={studentList}
            renderItem={renderStudentItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
          />

          {/* Submit Button */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Save Attendance</Text>
            )}
          </TouchableOpacity>
        </>
      )}

      {!loading && studentList.length === 0 && !error && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Select filters and click "Load Attendance"
          </Text>
        </View>
      )}
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
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginRight: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: '#6C63FF',
    fontWeight: '600',
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  filterContainer: {
    backgroundColor: '#fff',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    maxHeight: 220,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    gap: 10,
  },
  filterField: {
    marginBottom: 10,
  },
  filterFieldColumn: {
    flex: 1,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  pickerButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
  },
  pickerButtonText: {
    fontSize: 13,
    color: '#333',
  },
  pickerModal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: 300,
    paddingVertical: 12,
  },
  pickerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  pickerScroll: {
    maxHeight: 250,
  },
  pickerItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  pickerItemSelected: {
    backgroundColor: '#E8E6FF',
  },
  pickerItemText: {
    fontSize: 13,
    color: '#333',
  },
  pickerItemTextSelected: {
    color: '#6C63FF',
    fontWeight: '600',
  },
  pickerCloseButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  pickerCloseButtonText: {
    color: '#6C63FF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  loadButton: {
    backgroundColor: '#6C63FF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  loadButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    padding: 8,
    paddingBottom: 20,
  },
  staffCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    marginHorizontal: 8,
  },
  staffHeader: {
    marginBottom: 12,
  },
  staffName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  staffGender: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  attendanceTypeContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  typeButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    backgroundColor: '#fff',
  },
  typeButtonActive: {
    backgroundColor: '#6C63FF',
    borderColor: '#6C63FF',
  },
  typeButtonText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  typeButtonTextActive: {
    color: '#fff',
  },
  submitButton: {
    backgroundColor: '#6C63FF',
    padding: 16,
    margin: 16,
    marginTop: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
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
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  datePickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  datePickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    minHeight: 400,
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  datePickerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  datePickerClose: {
    fontSize: 24,
    color: '#999',
    fontWeight: 'bold',
  },
  datePickerContent: {
    marginBottom: 16,
  },
  datePickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  datePickerColumn: {
    flex: 1,
    marginHorizontal: 4,
  },
  datePickerLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  datePickerScrollColumn: {
    maxHeight: 200,
  },
  datePickerOption: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  datePickerOptionSelected: {
    backgroundColor: '#6C63FF',
  },
  datePickerOptionText: {
    fontSize: 13,
    color: '#333',
    textAlign: 'center',
  },
  datePickerOptionTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  datePickerApply: {
    backgroundColor: '#6C63FF',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  datePickerApplyText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  datePickerConfirm: {
    backgroundColor: '#6C63FF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  datePickerConfirmText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
