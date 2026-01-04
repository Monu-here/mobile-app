import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Modal,
  ScrollView,
  SafeAreaView,
  Alert,
} from "react-native";
import apiService from "../api/apiService";
import Toast from "../components/Toast";

// Date Picker Component
function DatePickerContent({
  selectedDate,
  onDateSelect,
  getYears,
  getMonths,
  getDaysInMonth,
}) {
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
            {years.map((year) => (
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
                    selectedYear === year &&
                      styles.datePickerOptionTextSelected,
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
                    selectedMonth === index &&
                      styles.datePickerOptionTextSelected,
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
            {days.map((day) => (
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

      <TouchableOpacity style={styles.datePickerApply} onPress={handleConfirm}>
        <Text style={styles.datePickerApplyText}>Apply Selection</Text>
      </TouchableOpacity>
    </View>
  );
}

// Time Picker Component
function TimePickerContent({ selectedTime, onTimeSelect }) {
  const currentTime = selectedTime
    ? new Date(parseInt(selectedTime) * 1000)
    : new Date();
  const [selectedHour, setSelectedHour] = useState(currentTime.getHours());
  const [selectedMinute, setSelectedMinute] = useState(
    currentTime.getMinutes()
  );

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  const handleConfirm = () => {
    onTimeSelect(selectedHour, selectedMinute);
  };

  const formatNumber = (num) => num.toString().padStart(2, "0");

  return (
    <View style={styles.datePickerContent}>
      <View style={styles.datePickerRow}>
        {/* Hour Picker */}
        <View style={styles.datePickerColumn}>
          <Text style={styles.datePickerLabel}>Hour</Text>
          <ScrollView style={styles.datePickerScrollColumn}>
            {hours.map((hour) => (
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
                    selectedHour === hour &&
                      styles.datePickerOptionTextSelected,
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
            {minutes.map((minute) => (
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
                    selectedMinute === minute &&
                      styles.datePickerOptionTextSelected,
                  ]}
                >
                  {formatNumber(minute)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      <TouchableOpacity style={styles.datePickerApply} onPress={handleConfirm}>
        <Text style={styles.datePickerApplyText}>Apply Selection</Text>
      </TouchableOpacity>
    </View>
  );
}

// Exam Subject Schedule Screen Component
export default function ExamSubjectScheduleScreen({ onBack }) {
  const [loading, setLoading] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [examTypes, setExamTypes] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("info");

  // Form state
  const [examTypeId, setExamTypeId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showExamTypePicker, setShowExamTypePicker] = useState(false);
  const [showSubjectPicker, setShowSubjectPicker] = useState(false);

  // Add/Edit modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSchedules, setEditingSchedules] = useState([]);
  const [selectedExamTypeForAdd, setSelectedExamTypeForAdd] = useState("");

  // Date/Time picker state
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timePickerType, setTimePickerType] = useState(null); // 'start_time' or 'end_time'
  const [currentScheduleIndex, setCurrentScheduleIndex] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showSubjectPickerForSchedule, setShowSubjectPickerForSchedule] =
    useState(null); // index of schedule with open subject picker

  useEffect(() => {
    fetchExamTypes();
    fetchSubjects();
  }, []);

  const showToast = (message, type = "info") => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  };

  const fetchExamTypes = async () => {
    try {
      const response = await apiService.getExamTypes();
      let examTypeList = [];
      if (Array.isArray(response?.data)) {
        examTypeList = response.data;
      } else if (
        response?.data?.examType &&
        Array.isArray(response.data.examType)
      ) {
        examTypeList = response.data.examType;
      } else if (
        response?.data?.data?.examType &&
        Array.isArray(response.data.data.examType)
      ) {
        examTypeList = response.data.data.examType;
      }
      console.log("[ExamSubjectScheduleScreen] Exam types:", examTypeList);
      setExamTypes(examTypeList);
    } catch (error) {
      console.error(
        "[ExamSubjectScheduleScreen] Error fetching exam types:",
        error
      );
      showToast("Failed to fetch exam types", "error");
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await apiService.getSubjects();
      let subjectList = [];
      if (Array.isArray(response?.data)) {
        subjectList = response.data;
      } else if (
        response?.data?.subject &&
        Array.isArray(response.data.subject)
      ) {
        subjectList = response.data.subject;
      } else if (
        response?.data?.data?.subject &&
        Array.isArray(response.data.data.subject)
      ) {
        subjectList = response.data.data.subject;
      }
      console.log("[ExamSubjectScheduleScreen] Subjects:", subjectList);
      setSubjects(subjectList);
    } catch (error) {
      console.error(
        "[ExamSubjectScheduleScreen] Error fetching subjects:",
        error
      );
      showToast("Failed to fetch subjects", "error");
    }
  };

  const fetchSchedules = async () => {
    setLoading(true);
    setError(null);
    try {
      const filters = {};
      if (examTypeId) filters.exam_type_id = parseInt(examTypeId);
      if (subjectId) filters.subject_id = parseInt(subjectId);

      console.log(
        "[ExamSubjectScheduleScreen] Fetching schedules with filters:",
        filters
      );
      const response = await apiService.getExamSubjectSchedule(filters);
      console.log("[ExamSubjectScheduleScreen] Schedules response:", response);

      const data = Array.isArray(response?.data) ? response.data : [];
      setSchedules(data);

      if (data.length === 0) {
        showToast("No schedules found", "info");
      }
    } catch (error) {
      console.error(
        "[ExamSubjectScheduleScreen] Error fetching schedules:",
        error
      );
      setError(error?.message || "Failed to load exam schedules");
      showToast(error?.message || "Failed to load exam schedules", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddSchedule = () => {
    if (!examTypeId) {
      showToast("Please select an exam type first", "error");
      return;
    }
    setSelectedExamTypeForAdd(examTypeId);
    setEditingSchedules([]);
    setShowAddModal(true);
  };

  const handleEditSchedule = (schedule) => {
    setSelectedExamTypeForAdd(schedule.exam_type_id.toString());
    setEditingSchedules([
      {
        id: schedule.id,
        subject_id: schedule.subject_id,
        date: schedule.date,
        start_time: schedule.start_time,
        end_time: schedule.end_time,
      },
    ]);
    setShowAddModal(true);
  };

  const addNewScheduleRow = () => {
    setEditingSchedules([
      ...editingSchedules,
      {
        subject_id: "",
        date: Math.floor(new Date().getTime() / 1000),
        start_time: Math.floor(new Date().setHours(9, 0, 0, 0) / 1000),
        end_time: Math.floor(new Date().setHours(10, 0, 0, 0) / 1000),
      },
    ]);
  };

  const removeScheduleRow = (index) => {
    const newSchedules = editingSchedules.filter((_, i) => i !== index);
    setEditingSchedules(newSchedules);
  };

  const updateScheduleField = (index, field, value) => {
    const newSchedules = [...editingSchedules];
    newSchedules[index] = {
      ...newSchedules[index],
      [field]: value,
    };
    setEditingSchedules(newSchedules);
  };

  const handleSaveSchedules = async () => {
    if (!selectedExamTypeForAdd) {
      showToast("Please select an exam type", "error");
      return;
    }

    if (editingSchedules.length === 0) {
      showToast("Please add at least one schedule", "error");
      return;
    }

    // Validate all schedules
    for (let i = 0; i < editingSchedules.length; i++) {
      const schedule = editingSchedules[i];
      if (!schedule.subject_id) {
        showToast(`Please select subject for schedule ${i + 1}`, "error");
        return;
      }
      if (!schedule.date) {
        showToast(`Please select date for schedule ${i + 1}`, "error");
        return;
      }
      if (!schedule.start_time) {
        showToast(`Please select start time for schedule ${i + 1}`, "error");
        return;
      }
      if (!schedule.end_time) {
        showToast(`Please select end time for schedule ${i + 1}`, "error");
        return;
      }
      if (parseInt(schedule.end_time) <= parseInt(schedule.start_time)) {
        showToast(
          `End time must be after start time for schedule ${i + 1}`,
          "error"
        );
        return;
      }
    }

    setSubmitting(true);
    try {
      const payload = {
        exam_type_id: parseInt(selectedExamTypeForAdd),
        schedules: editingSchedules.map((schedule) => ({
          ...(schedule.id && { id: parseInt(schedule.id) }),
          subject_id: parseInt(schedule.subject_id),
          date: parseInt(schedule.date),
          start_time: parseInt(schedule.start_time),
          end_time: parseInt(schedule.end_time),
        })),
      };

      console.log("[ExamSubjectScheduleScreen] Saving schedules:", payload);
      const response = await apiService.addExamSubjectSchedule(payload);
      console.log("[ExamSubjectScheduleScreen] Save response:", response);

      showToast(response?.message || "Schedules saved successfully", "success");
      setShowAddModal(false);
      setEditingSchedules([]);
      fetchSchedules();
    } catch (error) {
      console.error(
        "[ExamSubjectScheduleScreen] Error saving schedules:",
        error
      );
      showToast(error?.message || "Failed to save schedules", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSchedule = (schedule) => {
    Alert.alert(
      "Delete Schedule",
      `Are you sure you want to delete this schedule for ${getSubjectName(
        schedule.subject_id
      )}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const payload = {
                exam_type_id: parseInt(schedule.exam_type_id),
                subject_id: parseInt(schedule.subject_id),
              };
              console.log(
                "[ExamSubjectScheduleScreen] Deleting schedule:",
                payload
              );
              const response = await apiService.deleteExamSubjectSchedule(
                payload
              );
              showToast(
                response?.message || "Schedule deleted successfully",
                "success"
              );
              fetchSchedules();
            } catch (error) {
              console.error(
                "[ExamSubjectScheduleScreen] Error deleting schedule:",
                error
              );
              showToast(error?.message || "Failed to delete schedule", "error");
            }
          },
        },
      ]
    );
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(parseInt(timestamp) * 1000);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(parseInt(timestamp) * 1000);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getExamTypeName = (id) => {
    const examType = examTypes.find((e) => e.id === id);
    return examType?.name || "Unknown";
  };

  const getSubjectName = (id) => {
    const subject = subjects.find((s) => s.id === id);
    return subject?.name || "Unknown";
  };

  const handleDateSelect = (year, month, day) => {
    const selected = new Date(year, month, day);
    const timestamp = Math.floor(selected.getTime() / 1000);
    updateScheduleField(currentScheduleIndex, "date", timestamp);
    setShowDatePicker(false);
  };

  const handleTimeSelect = (hour, minute) => {
    if (currentScheduleIndex === null || !timePickerType) return;

    const now = new Date();
    now.setHours(hour, minute, 0, 0);
    const timestamp = Math.floor(now.getTime() / 1000);

    updateScheduleField(currentScheduleIndex, timePickerType, timestamp);
    setShowTimePicker(false);
    setCurrentScheduleIndex(null);
    setTimePickerType(null);
  };

  const openDatePicker = (index) => {
    setCurrentScheduleIndex(index);
    const scheduleDate = editingSchedules[index]?.date;
    if (scheduleDate) {
      setSelectedDate(new Date(parseInt(scheduleDate) * 1000));
    }
    setShowDatePicker(true);
  };

  const openTimePicker = (index, type) => {
    setCurrentScheduleIndex(index);
    setTimePickerType(type);
    setShowTimePicker(true);
  };

  const getYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 1; i <= currentYear + 2; i++) {
      years.push(i);
    }
    return years;
  };

  const getMonths = () => [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const renderScheduleItem = ({ item }) => (
    <View style={styles.scheduleCard}>
      <View style={styles.scheduleHeader}>
        <View style={styles.scheduleSubjectSection}>
          <Text style={styles.scheduleSubjectLabel}>
            {getExamTypeName(item.exam_type_id)}
          </Text>
          <Text style={styles.scheduleSubjectLabel}>Subject</Text>
          <Text style={styles.subjectName}>
            {getSubjectName(item.subject_id)}
          </Text>
        </View>
        <View style={styles.scheduleActions}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => handleEditSchedule(item)}
          >
            <Text style={styles.editButtonText}>✏️ Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteSchedule(item)}
          >
            <Text style={styles.deleteButtonText}>🗑️ Delete</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.scheduleDetailsContainer}>
        <View style={styles.scheduleDetailRow}>
          <Text style={styles.scheduleDetailLabel}>📅 Date:</Text>
          <Text style={styles.scheduleDetailValue}>
            {formatDate(item.date)}
          </Text>
        </View>
        <View style={styles.scheduleDetailRow}>
          <Text style={styles.scheduleDetailLabel}>🕐 Time:</Text>
          <Text style={styles.scheduleDetailValue}>
            {formatTime(item.start_time)} - {formatTime(item.end_time)}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderEditScheduleRow = (schedule, index) => (
    <View key={index} style={styles.editScheduleRow}>
      <View style={styles.editScheduleHeader}>
        <Text style={styles.editScheduleTitle}>Schedule {index + 1}</Text>
        {editingSchedules.length > 1 && (
          <TouchableOpacity
            style={styles.removeRowButton}
            onPress={() => removeScheduleRow(index)}
          >
            <Text style={styles.removeRowButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Subject Selection */}
      <View style={styles.editField}>
        <Text style={styles.editLabel}>Subject:</Text>
        <TouchableOpacity
          style={styles.timeButton}
          onPress={() =>
            setShowSubjectPickerForSchedule(
              showSubjectPickerForSchedule === index ? null : index
            )
          }
        >
          <Text style={styles.timeButtonText}>
            {schedule.subject_id
              ? getSubjectName(schedule.subject_id)
              : "Select Subject"}
          </Text>
        </TouchableOpacity>

        {showSubjectPickerForSchedule === index && (
          <View style={styles.inlinePickerContainer}>
            <ScrollView style={styles.inlinePickerScroll}>
              {subjects.map((subject) => (
                <TouchableOpacity
                  key={subject.id}
                  style={[
                    styles.inlinePickerItem,
                    schedule.subject_id === subject.id &&
                      styles.inlinePickerItemSelected,
                  ]}
                  onPress={() => {
                    updateScheduleField(index, "subject_id", subject.id);
                    setShowSubjectPickerForSchedule(null);
                  }}
                >
                  <Text
                    style={[
                      styles.inlinePickerItemText,
                      schedule.subject_id === subject.id &&
                        styles.inlinePickerItemTextSelected,
                    ]}
                  >
                    {subject.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>

      {/* Date Selection */}
      <View style={styles.editField}>
        <Text style={styles.editLabel}>Date:</Text>
        <TouchableOpacity
          style={styles.timeButton}
          onPress={() => openDatePicker(index)}
        >
          <Text style={styles.timeButtonText}>{formatDate(schedule.date)}</Text>
        </TouchableOpacity>
      </View>

      {/* Start Time */}
      <View style={styles.editField}>
        <Text style={styles.editLabel}>Start Time:</Text>
        <TouchableOpacity
          style={styles.timeButton}
          onPress={() => openTimePicker(index, "start_time")}
        >
          <Text style={styles.timeButtonText}>
            {formatTime(schedule.start_time)}
          </Text>
        </TouchableOpacity>
      </View>

      {/* End Time */}
      <View style={styles.editField}>
        <Text style={styles.editLabel}>End Time:</Text>
        <TouchableOpacity
          style={styles.timeButton}
          onPress={() => openTimePicker(index, "end_time")}
        >
          <Text style={styles.timeButtonText}>
            {formatTime(schedule.end_time)}
          </Text>
        </TouchableOpacity>
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
        <Text style={styles.title}>Exam Schedule</Text>
      </View>

      {/* Filters */}
      <View style={styles.filterContainer}>
        {/* Exam Type Selection */}
        <View style={styles.filterField}>
          <Text style={styles.filterLabel}>Exam Type:</Text>
          <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => setShowExamTypePicker(!showExamTypePicker)}
          >
            <Text style={styles.pickerButtonText}>
              {examTypeId
                ? examTypes.find((e) => e.id.toString() === examTypeId)?.name ||
                  "Select Exam Type"
                : "Select Exam Type"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Subject Selection (Optional) */}
        <View style={styles.filterField}>
          <Text style={styles.filterLabel}>Subject (Optional):</Text>
          <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => setShowSubjectPicker(!showSubjectPicker)}
          >
            <Text style={styles.pickerButtonText}>
              {subjectId
                ? subjects.find((s) => s.id.toString() === subjectId)?.name ||
                  "All Subjects"
                : "All Subjects"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsRow}>
          <TouchableOpacity
            style={[styles.loadButton, { flex: 1, marginRight: 8 }]}
            onPress={fetchSchedules}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loadButtonText}>Load Schedules</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.addButton, { flex: 1, marginLeft: 8 }]}
            onPress={handleAddSchedule}
          >
            <Text style={styles.addButtonText}>+ Add Schedule</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Exam Type Picker Modal */}
      <Modal
        visible={showExamTypePicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowExamTypePicker(false)}
      >
        <View style={styles.pickerOverlay}>
          <View style={styles.pickerModalContent}>
            <View style={styles.pickerModalHeader}>
              <Text style={styles.pickerTitle}>Select Exam Type</Text>
              <TouchableOpacity onPress={() => setShowExamTypePicker(false)}>
                <Text style={styles.pickerClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.pickerScroll}>
              {examTypes.map((examType) => (
                <TouchableOpacity
                  key={examType.id}
                  style={[
                    styles.pickerItem,
                    examTypeId === examType.id.toString() &&
                      styles.pickerItemSelected,
                  ]}
                  onPress={() => {
                    setExamTypeId(examType.id.toString());
                    setShowExamTypePicker(false);
                  }}
                >
                  <Text
                    style={[
                      styles.pickerItemText,
                      examTypeId === examType.id.toString() &&
                        styles.pickerItemTextSelected,
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
        </View>
      </Modal>

      {/* Subject Picker Modal */}
      <Modal
        visible={showSubjectPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSubjectPicker(false)}
      >
        <View style={styles.pickerOverlay}>
          <View style={styles.pickerModalContent}>
            <View style={styles.pickerModalHeader}>
              <Text style={styles.pickerTitle}>Select Subject</Text>
              <TouchableOpacity onPress={() => setShowSubjectPicker(false)}>
                <Text style={styles.pickerClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.pickerScroll}>
              <TouchableOpacity
                style={[
                  styles.pickerItem,
                  !subjectId && styles.pickerItemSelected,
                ]}
                onPress={() => {
                  setSubjectId("");
                  setShowSubjectPicker(false);
                }}
              >
                <Text
                  style={[
                    styles.pickerItemText,
                    !subjectId && styles.pickerItemTextSelected,
                  ]}
                >
                  All Subjects
                </Text>
              </TouchableOpacity>
              {subjects.map((subject) => (
                <TouchableOpacity
                  key={subject.id}
                  style={[
                    styles.pickerItem,
                    subjectId === subject.id.toString() &&
                      styles.pickerItemSelected,
                  ]}
                  onPress={() => {
                    setSubjectId(subject.id.toString());
                    setShowSubjectPicker(false);
                  }}
                >
                  <Text
                    style={[
                      styles.pickerItemText,
                      subjectId === subject.id.toString() &&
                        styles.pickerItemTextSelected,
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
        </View>
      </Modal>

      {/* Add/Edit Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingSchedules.length > 0 && editingSchedules[0]?.id
                  ? "Edit Schedule"
                  : "Add Schedules"}
              </Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              {editingSchedules.map((schedule, index) =>
                renderEditScheduleRow(schedule, index)
              )}

              <TouchableOpacity
                style={styles.addRowButton}
                onPress={addNewScheduleRow}
              >
                <Text style={styles.addRowButtonText}>
                  + Add Another Subject
                </Text>
              </TouchableOpacity>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSaveButton}
                onPress={handleSaveSchedules}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.modalSaveButtonText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
            </View>
          </View>
        </Modal>
      )}

      {/* Time Picker Modal */}
      {showTimePicker && (
        <Modal
          visible={showTimePicker}
          transparent
          animationType="slide"
          onRequestClose={() => setShowTimePicker(false)}
        >
          <View style={styles.datePickerOverlay}>
            <View style={styles.datePickerContainer}>
              <View style={styles.datePickerHeader}>
                <Text style={styles.datePickerTitle}>
                  Select {timePickerType === "start_time" ? "Start" : "End"}{" "}
                  Time
                </Text>
                <TouchableOpacity onPress={() => setShowTimePicker(false)}>
                  <Text style={styles.datePickerClose}>✕</Text>
                </TouchableOpacity>
              </View>

              <TimePickerContent
                selectedTime={
                  currentScheduleIndex !== null &&
                  editingSchedules[currentScheduleIndex]
                    ? editingSchedules[currentScheduleIndex][timePickerType]
                    : null
                }
                onTimeSelect={handleTimeSelect}
              />
            </View>
          </View>
        </Modal>
      )}

      {/* Schedules List */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {schedules.length > 0 && (
        <FlatList
          data={schedules}
          renderItem={renderScheduleItem}
          keyExtractor={(item, index) => `${item.id || index}`}
          contentContainerStyle={styles.listContent}
        />
      )}

      {!loading && schedules.length === 0 && !error && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Select an exam type and click "Load Schedules"
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: "#6C63FF",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  filterContainer: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  filterField: {
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  pickerButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
  },
  pickerButtonText: {
    fontSize: 16,
    color: "#333",
  },
  actionButtonsRow: {
    flexDirection: "row",
    marginTop: 8,
  },
  loadButton: {
    backgroundColor: "#6C63FF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  loadButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  addButton: {
    backgroundColor: "#00BFA6",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  pickerModal: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    maxHeight: "60%",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  pickerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  pickerModalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: "60%",
    overflow: "hidden",
  },
  pickerModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  pickerClose: {
    fontSize: 24,
    color: "#666",
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  pickerScroll: {
    maxHeight: 300,
  },
  pickerItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  pickerItemSelected: {
    backgroundColor: "#E8E6FF",
  },
  pickerItemText: {
    fontSize: 16,
    color: "#333",
  },
  pickerItemTextSelected: {
    color: "#6C63FF",
    fontWeight: "600",
  },
  pickerCloseButton: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    alignItems: "center",
  },
  pickerCloseButtonText: {
    fontSize: 16,
    color: "#333",
  },
  listContent: {
    padding: 16,
  },
  scheduleCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    borderLeftWidth: 5,
    borderLeftColor: "#6C63FF",
  },
  scheduleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  scheduleSubjectSection: {
    flex: 1,
    marginRight: 12,
  },
  scheduleSubjectLabel: {
    fontSize: 12,
    color: "#999",
    fontWeight: "600",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  subjectName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  scheduleActions: {
    flexDirection: "row",
    gap: 6,
  },
  editButton: {
    backgroundColor: "#6C63FF",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  deleteButton: {
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  scheduleDetailsContainer: {
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 12,
  },
  scheduleDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    justifyContent: "space-between",
  },
  scheduleDetailLabel: {
    fontSize: 13,
    color: "#666",
    fontWeight: "600",
    flex: 0.4,
  },
  scheduleDetailValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
    flex: 0.6,
    textAlign: "right",
  },
  scheduleInfo: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: "90%",
    maxHeight: "80%",
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  modalClose: {
    fontSize: 24,
    color: "#666",
  },
  modalContent: {
    padding: 16,
  },
  editScheduleRow: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: "#f9f9f9",
  },
  editScheduleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  editScheduleTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  removeRowButton: {
    backgroundColor: "#FF6B6B",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  removeRowButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  editField: {
    marginBottom: 12,
  },
  editLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  subjectPickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
    maxHeight: 80,
  },
  subjectChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: "#f0f0f0",
    marginRight: 8,
    marginVertical: 4,
  },
  subjectChipSelected: {
    backgroundColor: "#6C63FF",
  },
  subjectChipText: {
    fontSize: 14,
    color: "#333",
  },
  subjectChipTextSelected: {
    color: "#fff",
    fontWeight: "600",
  },
  inlinePickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginTop: 8,
    maxHeight: 200,
    backgroundColor: "#fff",
  },
  inlinePickerScroll: {
    maxHeight: 200,
  },
  inlinePickerItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  inlinePickerItemSelected: {
    backgroundColor: "#E8E6FF",
  },
  inlinePickerItemText: {
    fontSize: 16,
    color: "#333",
  },
  inlinePickerItemTextSelected: {
    color: "#6C63FF",
    fontWeight: "600",
  },
  timeButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
  },
  timeButtonText: {
    fontSize: 16,
    color: "#333",
  },
  addRowButton: {
    borderWidth: 1,
    borderColor: "#6C63FF",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginTop: 8,
  },
  addRowButtonText: {
    color: "#6C63FF",
    fontSize: 16,
    fontWeight: "600",
  },
  modalActions: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  modalCancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    marginRight: 8,
    alignItems: "center",
  },
  modalCancelButtonText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
  },
  modalSaveButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#6C63FF",
    marginLeft: 8,
    alignItems: "center",
  },
  modalSaveButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
  datePickerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  datePickerContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: "90%",
    maxHeight: "70%",
    overflow: "hidden",
  },
  datePickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  datePickerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  datePickerClose: {
    fontSize: 24,
    color: "#666",
  },
  datePickerContent: {
    padding: 16,
  },
  datePickerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  datePickerColumn: {
    flex: 1,
    marginHorizontal: 4,
  },
  datePickerLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  datePickerScrollColumn: {
    maxHeight: 200,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
  },
  datePickerOption: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  datePickerOptionSelected: {
    backgroundColor: "#E8E6FF",
  },
  datePickerOptionText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  datePickerOptionTextSelected: {
    color: "#6C63FF",
    fontWeight: "600",
  },
  datePickerApply: {
    backgroundColor: "#6C63FF",
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    alignItems: "center",
  },
  datePickerApplyText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  errorContainer: {
    padding: 16,
    backgroundColor: "#ffebee",
    margin: 16,
    borderRadius: 8,
  },
  errorText: {
    color: "#c62828",
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
  },
});
