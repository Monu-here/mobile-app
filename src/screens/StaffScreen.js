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
  Alert,
} from 'react-native';
import apiService from '../api/apiService';
import { showToast } from '../components/Toast';

// Staff Management Screen Component
export default function StaffScreen({ onBack }) {
  const [loading, setLoading] = useState(false);
  const [staffList, setStaffList] = useState([]);
  const [posts, setPosts] = useState([]);
  const [branches, setBranches] = useState([]);
  const [grades, setGrades] = useState([]);
  const [error, setError] = useState(null);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState('');
  const [postId, setPostId] = useState('');
  const [branchId, setBranchId] = useState('');
  const [gradeId, setGradeId] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [status, setStatus] = useState(true);
  const [isTeacher, setIsTeacher] = useState(false);
  
  // Optional fields
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('');
  const [nationality, setNationality] = useState('');
  const [dateOfJoining, setDateOfJoining] = useState('');
  const [salary, setSalary] = useState('');
  const [highestQualification, setHighestQualification] = useState('');
  const [experience, setExperience] = useState('');
  const [otAmount, setOtAmount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [providentFund, setProvidentFund] = useState('');
  const [marriedStatus, setMarriedStatus] = useState(false);
  const [socialSecurity, setSocialSecurity] = useState('');
  const [tds, setTds] = useState('');
  const [hasGrade, setHasGrade] = useState(false);
  const [staffGrade, setStaffGrade] = useState('');
  const [gradeAmountPerGrade, setGradeAmountPerGrade] = useState('');
  const [sectionId, setSectionId] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showPostPicker, setShowPostPicker] = useState(false);
  const [showBranchPicker, setShowBranchPicker] = useState(false);
  const [showGradePicker, setShowGradePicker] = useState(false);
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Gender options
  const genderOptions = [
    { label: 'Male', value: '1' },
    { label: 'Female', value: '2' },
    { label: 'Other', value: '3' },
  ];

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch posts
      const postRes = await apiService.getPosts();
      const postList = Array.isArray(postRes?.data) ? postRes.data : postRes?.data?.data || [];
      console.log('[StaffScreen] Posts response:', postRes);
      console.log('[StaffScreen] Posts list:', postList);
      console.log('[StaffScreen] First post:', postList[0]);
      setPosts(postList);

      // Fetch branches
      const branchRes = await apiService.getBranches();
      const branchList = Array.isArray(branchRes?.data) ? branchRes.data : branchRes?.data?.data || [];
      console.log('[StaffScreen] Branches response:', branchRes);
      console.log('[StaffScreen] Branches list:', branchList);
      console.log('[StaffScreen] First branch:', branchList[0]);
      setBranches(branchList);

      // Fetch grades
      const gradeRes = await apiService.getGrades();
      const gradeMaybe = gradeRes?.data;
      let gradeList = [];
      if (gradeMaybe?.grade && Array.isArray(gradeMaybe.grade)) {
        gradeList = gradeMaybe.grade;
      } else if (Array.isArray(gradeMaybe)) {
        gradeList = gradeMaybe;
      }
      console.log('[StaffScreen] Grades response:', gradeRes);
      console.log('[StaffScreen] Grades list:', gradeList);
      console.log('[StaffScreen] First grade:', gradeList[0]);
      setGrades(gradeList);

      // Fetch staff
      await searchStaffData({});
    } catch (err) {
      console.error('Error fetching initial data:', err);
      setError(err?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const searchStaffData = async (filters) => {
    setLoading(true);
    try {
      const response = await apiService.searchStaff({
        post_id: filters.postId || '',
        gender: filters.gender || '',
        status: filters.status !== undefined ? filters.status : '',
        is_teacher: filters.isTeacher !== undefined ? filters.isTeacher : '',
        searchData: filters.searchQuery || '',
      });

      const staffMaybe = response?.data;
      let staffArray = [];
      
      if (Array.isArray(staffMaybe)) {
        staffArray = staffMaybe;
      } else if (staffMaybe?.data && Array.isArray(staffMaybe.data)) {
        staffArray = staffMaybe.data;
      } else if (staffMaybe) {
        staffArray = [staffMaybe];
      }

      setStaffList(staffArray);
      setError(null);
    } catch (err) {
      console.error('Error searching staff:', err);
      setError(err?.message || 'Failed to search staff');
      setStaffList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    searchStaffData({ searchQuery: query });
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhoneNumber('');
    setGender('');
    setPostId('');
    setBranchId('');
    setGradeId('');
    setAccountNumber('');
    setDob('');
    setAddress('');
    setNationality('');
    setDateOfJoining('');
    setSalary('');
    setHighestQualification('');
    setExperience('');
    setOtAmount('');
    setStartDate('');
    setEndDate('');
    setProvidentFund('');
    setMarriedStatus(false);
    setSocialSecurity('');
    setTds('');
    setHasGrade(false);
    setStaffGrade('');
    setGradeAmountPerGrade('');
    setSectionId('');
    setStatus(true);
    setIsTeacher(false);
    setEditingId(null);
  };

  const handleAdd = async () => {
    if (!name || !email || !phoneNumber || !gender || !postId || !accountNumber) {
      showToast('Please fill required fields (name, email, phone, gender, post, account number)', 'error');
      return;
    }

    const payload = {
      name,
      email,
      phone_number: parseInt(phoneNumber, 10),
      gender: parseInt(gender, 10),
      post_id: parseInt(postId, 10),
      status: status ? 1 : 0,
      branch_id: branchId ? parseInt(branchId, 10) : null,
      grade_id: gradeId ? parseInt(gradeId, 10) : null,
      dob: dob || null,
      address: address || null,
      nationality: nationality || null,
      date_of_joining: dateOfJoining || null,
      salary: salary ? parseInt(salary, 10) : null,
      highest_qualification: highestQualification || null,
      experience: experience || null,
      account_number: accountNumber || '0',
      ot_amount: otAmount ? parseInt(otAmount, 10) : null,
      start_date: startDate || null,
      end_date: endDate || null,
      provident_fund: providentFund || null,
      married_status: marriedStatus ? 1 : 0,
      social_security: socialSecurity || null,
      tds: tds || null,
      has_grade: hasGrade ? 1 : 0,
      staff_grade: staffGrade || null,
      grade_amount_per_grade: gradeAmountPerGrade ? parseInt(gradeAmountPerGrade, 10) : null,
      section_id: sectionId ? parseInt(sectionId, 10) : null,
      is_teacher: isTeacher ? 1 : 0,
    };

    setSubmitting(true);
    try {
      let res;

      if (editingId) {
        res = await apiService.updateStaff(editingId, payload);
        showToast(res?.message || 'Staff updated successfully', 'success');
      } else {
        res = await apiService.addStaff(payload);
        showToast(res?.message || 'Staff added successfully', 'success');
      }

      resetForm();
      setShowForm(false);
      await searchStaffData({ searchQuery });
    } catch (err) {
      console.error('Error adding/updating staff:', err);
      showToast(err?.message || 'Failed to save staff', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (staff) => {
    setEditingId(staff.id);
    setName(staff.name || '');
    setEmail(staff.email || '');
    setPhoneNumber((staff.phone_number || '').toString());
    setGender((staff.gender || '').toString());
    setPostId((staff.post_id || '').toString());
    setBranchId((staff.branch_id || '').toString());
    setGradeId((staff.grade_id || '').toString());
    setAccountNumber((staff.account_number || '').toString());
    setDob(staff.dob || '');
    setAddress(staff.address || '');
    setNationality(staff.nationality || '');
    setDateOfJoining(staff.date_of_joining || '');
    setSalary((staff.salary || '').toString());
    setHighestQualification(staff.highest_qualification || '');
    setExperience((staff.experience || '').toString());
    setOtAmount((staff.ot_amount || '').toString());
    setStartDate(staff.start_date || '');
    setEndDate(staff.end_date || '');
    setProvidentFund((staff.provident_fund || '').toString());
    setMarriedStatus(parseInt(staff.married_status) === 1);
    setSocialSecurity((staff.social_security || '').toString());
    setTds((staff.tds || '').toString());
    setHasGrade(parseInt(staff.has_grade) === 1);
    setStaffGrade((staff.staff_grade || '').toString());
    setGradeAmountPerGrade((staff.grade_amount_per_grade || '').toString());
    setSectionId((staff.section_id || '').toString());
    setStatus(parseInt(staff.status) === 1);
    setIsTeacher(parseInt(staff.is_teacher) === 1);
    setShowForm(true);
  };

  const handleDelete = (staffId) => {
    Alert.alert(
      'Delete Staff',
      'Are you sure you want to delete this staff member?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setSubmitting(true);
            try {
              const res = await apiService.deleteStaff(staffId);
              showToast(res?.message || 'Staff deleted successfully', 'success');
              await searchStaffData({ searchQuery });
            } catch (err) {
              console.error('Error deleting staff:', err);
              showToast(err?.message || 'Failed to delete staff', 'error');
            } finally {
              setSubmitting(false);
            }
          },
        },
      ]
    );
  };

  const renderStaffItem = ({ item }) => (
    <View style={styles.staffCard}>
      <View style={styles.staffHeader}>
        <Text style={styles.staffName}>{item.name}</Text>
        <View style={styles.statusBadge}>
          <Text style={[styles.statusText, { color: parseInt(item.status) === 1 ? '#22c55e' : '#ef4444' }]}>
            {parseInt(item.status) === 1 ? 'Active' : 'Inactive'}
          </Text>
        </View>
      </View>

      <View style={styles.staffDetails}>
        <Text style={styles.detailText}>Email:{item.email}</Text>
        <Text style={styles.detailText}>Phone Number: {item.phone_number}</Text>
        {item.post_id && <Text style={styles.detailText}>💼Post: {getPostLabel(item.post_id)}</Text>}
        {parseInt(item.is_teacher) === 1 && <Text style={styles.detailText}>🏫 Teacher</Text>}
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => handleEdit(item)}
          disabled={submitting}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDelete(item.id)}
          disabled={submitting}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const getPostLabel = (id) => {
    const idNum = parseInt(id);
    const post = posts.find(p => parseInt(p.id) === idNum);
    console.log('[getPostLabel] Looking for id:', idNum, 'Found post:', post);
    return post?.name || post?.title || post?.post_name || idNum;
  };

  const getBranchLabel = (id) => {
    const idNum = parseInt(id);
    const branch = branches.find(b => parseInt(b.id) === idNum);
    console.log('[getBranchLabel] Looking for id:', idNum, 'Found branch:', branch);
    return branch?.name || branch?.title || branch?.branch_name || idNum;
  };

  const getGradeLabel = (id) => {
    const idNum = parseInt(id);
    const grade = grades.find(g => parseInt(g.id) === idNum);
    console.log('[getGradeLabel] Looking for id:', idNum, 'Found grade:', grade);
    return grade?.name || grade?.title || grade?.grade_name || idNum;
  };

  const getGenderLabel = (id) => {
    const gender = genderOptions.find(g => g.value === id.toString());
    return gender?.label || id;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Staff Management</Text>
        <TouchableOpacity
          onPress={() => {
            resetForm();
            setShowForm(true);
          }}
          style={styles.addButton}
        >
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, email, or phone..."
          value={searchQuery}
          onChangeText={handleSearch}
          placeholderTextColor="#999"
        />
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      ) : staffList.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No staff members found</Text>
        </View>
      ) : (
        <FlatList
          data={staffList}
          renderItem={renderStaffItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
        />
      )}

      <Modal visible={showForm} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowForm(false)}>
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {editingId ? 'Edit Staff' : 'Add New Staff'}
            </Text>
            <View style={{ width: 30 }} />
          </View>

          <ScrollView style={styles.formContainer} contentContainerStyle={styles.formContent}>
            <TextInput
              style={styles.input}
              placeholder="Name *"
              value={name}
              onChangeText={setName}
              placeholderTextColor="#999"
            />

            <TextInput
              style={styles.input}
              placeholder="Email *"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholderTextColor="#999"
            />

            <TextInput
              style={styles.input}
              placeholder="Phone Number *"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              placeholderTextColor="#999"
            />

            <TextInput
              style={styles.input}
              placeholder="Account Number *"
              value={accountNumber}
              onChangeText={setAccountNumber}
              keyboardType="default"
              placeholderTextColor="#999"
            />

            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setShowGenderPicker(true)}
            >
              <Text style={styles.pickerButtonText}>
                {gender ? getGenderLabel(gender) : 'Select Gender *'}
              </Text>
            </TouchableOpacity>

            <Modal visible={showGenderPicker} animationType="slide">
              <SafeAreaView style={styles.pickerContainer}>
                <View style={styles.pickerHeader}>
                  <TouchableOpacity onPress={() => setShowGenderPicker(false)}>
                    <Text style={styles.pickerCloseText}>✕</Text>
                  </TouchableOpacity>
                  <Text style={styles.pickerTitle}>Select Gender</Text>
                  <View style={{ width: 30 }} />
                </View>
                <FlatList
                  data={genderOptions}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.pickerOption}
                      onPress={() => {
                        setGender(item.value);
                        setShowGenderPicker(false);
                      }}
                    >
                      <Text style={styles.pickerOptionText}>{item.label}</Text>
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item) => item.value}
                />
              </SafeAreaView>
            </Modal>

            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setShowPostPicker(true)}
            >
              <Text style={styles.pickerButtonText}>
                {postId ? getPostLabel(parseInt(postId)) : 'Select Post *'}
              </Text>
            </TouchableOpacity>

            <Modal visible={showPostPicker} animationType="slide">
              <SafeAreaView style={styles.pickerContainer}>
                <View style={styles.pickerHeader}>
                  <TouchableOpacity onPress={() => setShowPostPicker(false)}>
                    <Text style={styles.pickerCloseText}>✕</Text>
                  </TouchableOpacity>
                  <Text style={styles.pickerTitle}>Select Post</Text>
                  <View style={{ width: 30 }} />
                </View>
                <FlatList
                  data={posts}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.pickerOption}
                      onPress={() => {
                        setPostId(item.id.toString());
                        setShowPostPicker(false);
                      }}
                    >
                      <Text style={styles.pickerOptionText}>{item.name}</Text>
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item) => item.id.toString()}
                />
              </SafeAreaView>
            </Modal>

            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setShowBranchPicker(true)}
            >
              <Text style={styles.pickerButtonText}>
                {branchId ? getBranchLabel(parseInt(branchId)) : 'Select Branch'}
              </Text>
            </TouchableOpacity>

            <Modal visible={showBranchPicker} animationType="slide">
              <SafeAreaView style={styles.pickerContainer}>
                <View style={styles.pickerHeader}>
                  <TouchableOpacity onPress={() => setShowBranchPicker(false)}>
                    <Text style={styles.pickerCloseText}>✕</Text>
                  </TouchableOpacity>
                  <Text style={styles.pickerTitle}>Select Branch</Text>
                  <View style={{ width: 30 }} />
                </View>
                <FlatList
                  data={branches}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.pickerOption}
                      onPress={() => {
                        setBranchId(item.id.toString());
                        setShowBranchPicker(false);
                      }}
                    >
                      <Text style={styles.pickerOptionText}>{item.name}</Text>
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item) => item.id.toString()}
                />
              </SafeAreaView>
            </Modal>

            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setShowGradePicker(true)}
            >
              <Text style={styles.pickerButtonText}>
                {gradeId ? getGradeLabel(parseInt(gradeId)) : 'Select Grade'}
              </Text>
            </TouchableOpacity>

            <Modal visible={showGradePicker} animationType="slide">
              <SafeAreaView style={styles.pickerContainer}>
                <View style={styles.pickerHeader}>
                  <TouchableOpacity onPress={() => setShowGradePicker(false)}>
                    <Text style={styles.pickerCloseText}>✕</Text>
                  </TouchableOpacity>
                  <Text style={styles.pickerTitle}>Select Grade</Text>
                  <View style={{ width: 30 }} />
                </View>
                <FlatList
                  data={grades}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.pickerOption}
                      onPress={() => {
                        setGradeId(item.id.toString());
                        setShowGradePicker(false);
                      }}
                    >
                      <Text style={styles.pickerOptionText}>{item.name}</Text>
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item) => item.id.toString()}
                />
              </SafeAreaView>
            </Modal>

            {/* Optional Fields Section */}
            <Text style={styles.sectionTitle}>Optional Information</Text>

            <TextInput
              style={styles.input}
              placeholder="Date of Birth (YYYY-MM-DD)"
              value={dob}
              onChangeText={setDob}
              placeholderTextColor="#999"
            />

            <TextInput
              style={styles.input}
              placeholder="Address"
              value={address}
              onChangeText={setAddress}
              multiline
              placeholderTextColor="#999"
            />

            <TextInput
              style={styles.input}
              placeholder="Nationality"
              value={nationality}
              onChangeText={setNationality}
              placeholderTextColor="#999"
            />

            <TextInput
              style={styles.input}
              placeholder="Date of Joining (YYYY-MM-DD)"
              value={dateOfJoining}
              onChangeText={setDateOfJoining}
              placeholderTextColor="#999"
            />

            <TextInput
              style={styles.input}
              placeholder="Salary"
              value={salary}
              onChangeText={setSalary}
              keyboardType="decimal-pad"
              placeholderTextColor="#999"
            />

            <TextInput
              style={styles.input}
              placeholder="Highest Qualification"
              value={highestQualification}
              onChangeText={setHighestQualification}
              placeholderTextColor="#999"
            />

            <TextInput
              style={styles.input}
              placeholder="Experience (years)"
              value={experience}
              onChangeText={setExperience}
              keyboardType="decimal-pad"
              placeholderTextColor="#999"
            />

            <TextInput
              style={styles.input}
              placeholder="OT Amount"
              value={otAmount}
              onChangeText={setOtAmount}
              keyboardType="decimal-pad"
              placeholderTextColor="#999"
            />

            <TextInput
              style={styles.input}
              placeholder="Start Date (YYYY-MM-DD)"
              value={startDate}
              onChangeText={setStartDate}
              placeholderTextColor="#999"
            />

            <TextInput
              style={styles.input}
              placeholder="End Date (YYYY-MM-DD)"
              value={endDate}
              onChangeText={setEndDate}
              placeholderTextColor="#999"
            />

            <TextInput
              style={styles.input}
              placeholder="Provident Fund"
              value={providentFund}
              onChangeText={setProvidentFund}
              keyboardType="decimal-pad"
              placeholderTextColor="#999"
            />

            <TextInput
              style={styles.input}
              placeholder="Social Security"
              value={socialSecurity}
              onChangeText={setSocialSecurity}
              placeholderTextColor="#999"
            />

            <TextInput
              style={styles.input}
              placeholder="TDS"
              value={tds}
              onChangeText={setTds}
              keyboardType="decimal-pad"
              placeholderTextColor="#999"
            />

            <TextInput
              style={styles.input}
              placeholder="Staff Grade"
              value={staffGrade}
              onChangeText={setStaffGrade}
              placeholderTextColor="#999"
            />

            <TextInput
              style={styles.input}
              placeholder="Grade Amount Per Grade"
              value={gradeAmountPerGrade}
              onChangeText={setGradeAmountPerGrade}
              keyboardType="decimal-pad"
              placeholderTextColor="#999"
            />

            <TextInput
              style={styles.input}
              placeholder="Section ID"
              value={sectionId}
              onChangeText={setSectionId}
              keyboardType="numeric"
              placeholderTextColor="#999"
            />

            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Married Status</Text>
              <Switch
                value={marriedStatus}
                onValueChange={setMarriedStatus}
                trackColor={{ false: '#ccc', true: '#81c784' }}
                thumbColor={marriedStatus ? '#4caf50' : '#999'}
              />
            </View>

            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Has Grade</Text>
              <Switch
                value={hasGrade}
                onValueChange={setHasGrade}
                trackColor={{ false: '#ccc', true: '#81c784' }}
                thumbColor={hasGrade ? '#4caf50' : '#999'}
              />
            </View>

            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Active Status</Text>
              <Switch
                value={status}
                onValueChange={setStatus}
                trackColor={{ false: '#ccc', true: '#81c784' }}
                thumbColor={status ? '#4caf50' : '#999'}
              />
            </View>

            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Is Teacher</Text>
              <Switch
                value={isTeacher}
                onValueChange={setIsTeacher}
                trackColor={{ false: '#ccc', true: '#81c784' }}
                thumbColor={isTeacher ? '#4caf50' : '#999'}
              />
            </View>

            <TouchableOpacity
              style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
              onPress={handleAdd}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.submitButtonText}>
                  {editingId ? 'Update Staff' : 'Add Staff'}
                </Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginTop: 20,
    marginBottom: 12,
    paddingHorizontal: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 8,
  },
  addButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  errorContainer: {
    backgroundColor: '#fee2e2',
    padding: 12,
    margin: 16,
    borderRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  errorText: {
    color: '#991b1b',
    fontSize: 14,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchInput: {
    backgroundColor: '#f3f4f6',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  listContent: {
    padding: 16,
  },
  staffCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  staffHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  staffName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: '#f3f4f6',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  staffDetails: {
    marginBottom: 12,
  },
  detailText: {
    fontSize: 13,
    color: '#666',
    marginVertical: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#3b82f6',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalCloseText: {
    fontSize: 24,
    color: '#666',
    width: 30,
    textAlign: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  formContainer: {
    flex: 1,
  },
  formContent: {
    padding: 16,
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#EFEFEF',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 14,
    color: '#333',
  },
  pickerButton: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#EFEFEF',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 12,
    justifyContent: 'center',
  },
  pickerButtonText: {
    fontSize: 14,
    color: '#333',
  },
  pickerContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  pickerCloseText: {
    fontSize: 24,
    color: '#666',
    width: 30,
    textAlign: 'center',
  },
  pickerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  pickerOption: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  pickerOptionText: {
    fontSize: 15,
    color: '#333',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#EFEFEF',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 12,
  },
  switchLabel: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  permissionDeniedBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  permissionDeniedIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  permissionDeniedTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#991b1b',
    marginBottom: 8,
    textAlign: 'center',
  },
  permissionDeniedText: {
    fontSize: 14,
    color: '#7f1d1d',
    textAlign: 'center',
    lineHeight: 20,
  },
});
