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

// Staff Attendance Management Screen Component
export default function StaffAttendanceScreen({ onBack }) {
  const [loading, setLoading] = useState(false);
  const [staffList, setStaffList] = useState([]);
  const [staffAttendances, setStaffAttendances] = useState({});
  const [branches, setBranches] = useState([]);
  const [grades, setGrades] = useState([]);
  const [error, setError] = useState(null);

  // Form state
  const [branchId, setBranchId] = useState('');
  const [gradeId, setGradeId] = useState('');
  const [attendanceDate, setAttendanceDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showBranchPicker, setShowBranchPicker] = useState(false);
  const [showGradePicker, setShowGradePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timePickerType, setTimePickerType] = useState(null); // 'check_in' or 'check_out'
  const [currentStaffId, setCurrentStaffId] = useState(null);

  // Attendance type options
  const attendanceTypes = [
    { label: 'Present', value: 1 },
    { label: 'Absent', value: 2 },
    { label: 'Late', value: 3 },
    { label: 'Half Day', value: 4 },
    { label: 'Leave', value: 5 },
  ];

  useEffect(() => {
    fetchBranches();
    fetchGrades();
    // Set today's date as default (Unix timestamp)
    const today = new Date();
    setSelectedDate(today);
    const todayTimestamp = Math.floor(today.getTime() / 1000);
    setAttendanceDate(todayTimestamp.toString());
  }, []);

  const fetchBranches = async () => {
    try {
      const branchRes = await apiService.getBranches();
      const branchList = Array.isArray(branchRes?.data) ? branchRes.data : branchRes?.data?.data || [];
      console.log('[StaffAttendanceScreen] Branches list:', branchList);
      setBranches(branchList);
      
      // Set first branch as default if available
      if (branchList.length > 0) {
        setBranchId(branchList[0].id.toString());
      }
    } catch (error) {
      console.error('[StaffAttendanceScreen] Error fetching branches:', error);
      showToast('Failed to fetch branches', 'error');
    }
  };

  const fetchGrades = async () => {
    try {
      const gradeRes = await apiService.getGrades();
      console.log('[StaffAttendanceScreen] Grade response:', gradeRes);
      
      // Handle multiple possible response formats
      let gradeList = [];
      if (Array.isArray(gradeRes?.data)) {
        gradeList = gradeRes.data;
      } else if (gradeRes?.data?.grade && Array.isArray(gradeRes.data.grade)) {
        gradeList = gradeRes.data.grade;
      } else if (gradeRes?.data?.data?.grade && Array.isArray(gradeRes.data.data.grade)) {
        gradeList = gradeRes.data.data.grade;
      }
      
      console.log('[StaffAttendanceScreen] Grades list:', gradeList);
      setGrades(gradeList);
    } catch (error) {
      console.error('[StaffAttendanceScreen] Error fetching grades:', error);
      showToast('Failed to fetch grades', 'error');
    }
  };

  const fetchStaffAttendance = async () => {
    if (!branchId || !attendanceDate) {
      showToast('Please select branch and date', 'error');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const payload = {
        branch_id: parseInt(branchId),
        attendance_date: parseInt(attendanceDate),
      };

      // Add grade_id if selected
      if (gradeId) {
        payload.grade_id = parseInt(gradeId);
      }

      console.log('[StaffAttendanceScreen] Fetching attendance with payload:', payload);
      const response = await apiService.getStaffAttendance(payload);
      console.log('[StaffAttendanceScreen] Response:', response);

      const data = response?.data || {};
      const staffs = data?.staffs || [];
      
      // Handle paginated or non-paginated attendance responses
      let attendances = [];
      if (data?.staffAttendances?.data) {
        // Paginated response from Laravel ->paginate()
        attendances = data.staffAttendances.data;
      } else if (Array.isArray(data?.staffAttendances)) {
        // Non-paginated array response
        attendances = data.staffAttendances;
      }

      setStaffList(staffs);

      // Convert attendance array to map for easy lookup
      const attendanceMap = {};
      attendances.forEach(att => {
        attendanceMap[att.staff_id] = {
          id: att.id,
          attendance_type: att.attendance_type,
          check_in: att.check_in && att.check_in !== 'null' ? att.check_in : null,
          check_out: att.check_out && att.check_out !== 'null' ? att.check_out : null,
        };
      });
      setStaffAttendances(attendanceMap);

      if (staffs.length === 0) {
        showToast('No staff found for this branch', 'info');
      }
    } catch (error) {
      console.error('[StaffAttendanceScreen] Error fetching attendance:', error);
      setError(error?.message || 'Failed to load staff attendance');
      showToast(error?.message || 'Failed to load staff attendance', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceChange = (staffId, field, value) => {
    setStaffAttendances(prev => {
      const currentAttendance = prev[staffId] || {};
      return {
        ...prev,
        [staffId]: {
          ...currentAttendance,
          [field]: value,
        },
      };
    });
  };

  const handleSubmit = async () => {
    if (!branchId || !attendanceDate) {
      showToast('Please select branch and date', 'error');
      return;
    }

    if (staffList.length === 0) {
      showToast('No staff to mark attendance', 'error');
      return;
    }

    setSubmitting(true);
    try {
      // Prepare staffs array - only include staff with attendance data
      const staffsData = staffList
        .filter(staff => staffAttendances[staff.id]) // Only include staff with attendance marked
        .map(staff => {
          const attendance = staffAttendances[staff.id];
          return {
            staff_id: parseInt(staff.id),
            attendance_type: parseInt(attendance.attendance_type || 1),
            check_in: attendance.check_in != null ? parseInt(attendance.check_in) : null,
            check_out: attendance.check_out != null ? parseInt(attendance.check_out) : null,
          };
        });

      if (staffsData.length === 0) {
        showToast('Please mark attendance for at least one staff member', 'error');
        setSubmitting(false);
        return;
      }

      const payload = {
        attendance_date: parseInt(attendanceDate),
        branch_id: parseInt(branchId),
        staffs: staffsData,
      };

      console.log('[StaffAttendanceScreen] Submitting payload:', payload);
      const response = await apiService.addStaffAttendance(payload);
      console.log('[StaffAttendanceScreen] Submit response:', response);

      showToast(response?.message || 'Staff attendance saved successfully', 'success');
      
      // Refresh the data
      fetchStaffAttendance();
    } catch (error) {
      console.error('[StaffAttendanceScreen] Error saving attendance:', error);
      showToast(error?.message || 'Failed to save staff attendance', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(parseInt(timestamp) * 1000);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatDateShort = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleDateSelect = (year, month, day) => {
    const selected = new Date(year, month, day);
    setSelectedDate(selected);
    const timestamp = Math.floor(selected.getTime() / 1000);
    setAttendanceDate(timestamp.toString());
    setShowDatePicker(false);
  };

  const getCurrentYear = () => new Date().getFullYear();
  const getYears = () => {
    const currentYear = getCurrentYear();
    const years = [];
    for (let i = currentYear - 5; i <= currentYear + 1; i++) {
      years.push(i);
    }
    return years;
  };

  const getMonths = () => [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const handleTimePickerOpen = (staffId, type) => {
    setCurrentStaffId(staffId);
    setTimePickerType(type);
    setShowTimePicker(true);
  };

  const handleTimeSelect = (hour, minute) => {
    if (!currentStaffId || !timePickerType) return;
    
    // Create a timestamp for today with the selected time
    const now = new Date();
    now.setHours(hour, minute, 0, 0);
    const timestamp = Math.floor(now.getTime() / 1000);
    
    handleAttendanceChange(currentStaffId, timePickerType, timestamp);
    setShowTimePicker(false);
    setCurrentStaffId(null);
    setTimePickerType(null);
  };

  const formatTime = (timestamp) => {
    if (!timestamp || timestamp === null || timestamp === 'null' || timestamp === '') return '';
    const date = new Date(parseInt(timestamp) * 1000);
    return date.toLocaleTimeString();
  };

  const renderStaffItem = ({ item: staff }) => {
    const attendance = staffAttendances[staff.id] || {};
    const attendanceType = attendance.attendance_type;

    return (
      <View style={styles.staffCard}>
        <View style={styles.staffHeader}>
          <Text style={styles.staffName}>{staff.name}</Text>
          <Text style={styles.staffGender}>
            {staff.gender === '1' ? 'Male' : staff.gender === '2' ? 'Female' : 'Other'}
          </Text>
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
                onPress={() => handleAttendanceChange(staff.id, 'attendance_type', type.value)}
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

        {/* Check In/Out Times */}
        {attendanceType !== 2 && ( // Show for all except Absent
          <View style={styles.timeContainer}>
            <View style={styles.timeField}>
              <Text style={styles.timeLabel}>Check In:</Text>
              <TouchableOpacity
                style={styles.timePickerButton}
                onPress={() => handleTimePickerOpen(staff.id, 'check_in')}
              >
                <Text style={styles.timePickerButtonText}>
                  {attendance.check_in != null ? formatTime(attendance.check_in) : 'Select Time'}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.timeField}>
              <Text style={styles.timeLabel}>Check Out:</Text>
              <TouchableOpacity
                style={styles.timePickerButton}
                onPress={() => handleTimePickerOpen(staff.id, 'check_out')}
              >
                <Text style={styles.timePickerButtonText}>
                  {attendance.check_out != null ? formatTime(attendance.check_out) : 'Select Time'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
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
        <Text style={styles.title}>Staff Attendance</Text>
      </View>

      {/* Filters */}
      <View style={styles.filterContainer}>
        {/* Branch Selection */}
        <View style={styles.filterField}>
          <Text style={styles.filterLabel}>Branch:</Text>
          <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => setShowBranchPicker(!showBranchPicker)}
          >
            <Text style={styles.pickerButtonText}>
              {branchId
                ? branches.find(b => b.id.toString() === branchId)?.name || 'Select Branch'
                : 'Select Branch'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Grade Selection */}
        <View style={styles.filterField}>
          <Text style={styles.filterLabel}>Grade (Optional):</Text>
          <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => setShowGradePicker(!showGradePicker)}
          >
            <Text style={styles.pickerButtonText}>
              {gradeId
                ? grades.find(g => g.id.toString() === gradeId)?.name || 'All Grades'
                : 'All Grades'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Date Input */}
        <View style={styles.filterField}>
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

        {/* Load Button */}
        <TouchableOpacity
          style={styles.loadButton}
          onPress={fetchStaffAttendance}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loadButtonText}>Load Attendance</Text>
          )}
        </TouchableOpacity>
      </View>

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

      {/* Grade Picker Modal */}
      {showGradePicker && (
        <View style={styles.pickerModal}>
          <Text style={styles.pickerTitle}>Select Grade</Text>
          <ScrollView style={styles.pickerScroll}>
            <TouchableOpacity
              style={[
                styles.pickerItem,
                !gradeId && styles.pickerItemSelected,
              ]}
              onPress={() => {
                setGradeId('');
                setShowGradePicker(false);
              }}
            >
              <Text
                style={[
                  styles.pickerItemText,
                  !gradeId && styles.pickerItemTextSelected,
                ]}
              >
                All Grades
              </Text>
            </TouchableOpacity>
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
                  Select {timePickerType === 'check_in' ? 'Check In' : 'Check Out'} Time
                </Text>
                <TouchableOpacity onPress={() => setShowTimePicker(false)}>
                  <Text style={styles.datePickerClose}>✕</Text>
                </TouchableOpacity>
              </View>
              
              <TimePickerContent
                selectedTime={currentStaffId && staffAttendances[currentStaffId] ? 
                  staffAttendances[currentStaffId][timePickerType] : null}
                onTimeSelect={handleTimeSelect}
              />
              
              <TouchableOpacity
                style={styles.datePickerConfirm}
                onPress={() => setShowTimePicker(false)}
              >
                <Text style={styles.datePickerConfirmText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Staff List */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {staffList.length > 0 && (
        <>
          <FlatList
            data={staffList}
            renderItem={renderStaffItem}
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

      {!loading && staffList.length === 0 && !error && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Select a branch and date, then click "Load Attendance"
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
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  filterContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterField: {
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#fff',
  },
  dateDisplay: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
  pickerButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
  },
  pickerButtonText: {
    fontSize: 14,
    color: '#333',
  },
  loadButton: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  loadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  pickerModal: {
    position: 'absolute',
    top: 200,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: 400,
    zIndex: 1000,
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  pickerScroll: {
    maxHeight: 300,
  },
  pickerItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  pickerItemSelected: {
    backgroundColor: '#e3f2fd',
  },
  pickerItemText: {
    fontSize: 16,
    color: '#333',
  },
  pickerItemTextSelected: {
    color: '#007AFF',
    fontWeight: '600',
  },
  pickerCloseButton: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center',
  },
  pickerCloseButtonText: {
    fontSize: 16,
    color: '#333',
  },
  listContent: {
    padding: 16,
  },
  staffCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  staffHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  staffName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  staffGender: {
    fontSize: 14,
    color: '#666',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  attendanceTypeContainer: {
    marginBottom: 12,
  },
  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
    backgroundColor: '#fff',
  },
  typeButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  typeButtonText: {
    fontSize: 14,
    color: '#333',
  },
  typeButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeField: {
    flex: 1,
    marginHorizontal: 4,
  },
  timeLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  timeInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 8,
    fontSize: 12,
    backgroundColor: '#f9f9f9',
  },
  timeDisplay: {
    fontSize: 10,
    color: '#007AFF',
    marginTop: 2,
  },
  timePickerButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  timePickerButtonText: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#6C63FF',
    padding: 16,
    margin: 16,
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
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  datePickerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  datePickerClose: {
    fontSize: 24,
    color: '#666',
    fontWeight: '300',
  },
  datePickerContent: {
    minHeight: 300,
  },
  datePickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  datePickerColumn: {
    flex: 1,
    marginHorizontal: 4,
  },
  datePickerLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  datePickerScrollColumn: {
    maxHeight: 200,
  },
  datePickerOption: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'center',
  },
  datePickerOptionSelected: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  datePickerOptionText: {
    fontSize: 14,
    color: '#333',
  },
  datePickerOptionTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  datePickerApply: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  datePickerApplyText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  datePickerConfirm: {
    backgroundColor: '#28a745',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  datePickerConfirmText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
