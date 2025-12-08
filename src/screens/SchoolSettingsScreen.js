import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import apiService from '../api/apiService';
import { showToast } from '../components/Toast';

export default function SchoolSettingsScreen({ onBack, onSaveSuccess }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    state: '',
    city: '',
    postal_code: '',
    address: '',
    phone_number: '',
    email: '',
    school_code: '',
    logo: '',
    academic_year_id: '',
  });
  const [errors, setErrors] = useState({});
  const [lastErrorDebug, setLastErrorDebug] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value.trim(),
    }));
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name || formData.name.length === 0) {
      newErrors.name = 'School name is required';
    }
    if (!formData.address || formData.address.length === 0) {
      newErrors.address = 'Address is required';
    }
    if (!formData.phone_number || formData.phone_number.length === 0) {
      newErrors.phone_number = 'Phone number is required';
    }
    if (!formData.academic_year_id || formData.academic_year_id.length === 0) {
      newErrors.academic_year_id = 'Academic year is required';
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChooseFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*'],
        copyToCacheDirectory: true,
      });

      if (result.type === 'success') {
        // Store the file URI and name
        const fileName = result.name || `logo_${Date.now()}`;
        const fileUri = result.uri;
        const fileSize = result.size || 0;

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (fileSize > maxSize) {
          showToast('File size must be less than 5MB', 'error');
          return;
        }

        // Store file info in formData
        setFormData((prev) => ({
          ...prev,
          logo: {
            uri: fileUri,
            name: fileName,
            size: fileSize,
            type: 'image/jpeg', // Default, will be adjusted based on file
          },
        }));

        showToast(`Logo selected: ${fileName}`, 'success');
        console.log('[SchoolSettingsScreen] File selected:', { fileName, fileUri, fileSize });
      } else if (result.type === 'cancel') {
        console.log('[SchoolSettingsScreen] File selection cancelled');
      }
    } catch (error) {
      console.error('[SchoolSettingsScreen] File picker error:', error);
      showToast('Error selecting file', 'error');
    }
  };

  const handleSaveSettings = async () => {
    if (!validateForm()) {
      showToast('Please fix the errors below', 'error');
      return;
    }

    setLoading(true);
    try {
      // Prepare form data for submission
      const formDataToSend = new FormData();
      
      // Add all text fields
      formDataToSend.append('name', formData.name);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('phone_number', formData.phone_number);
      formDataToSend.append('academic_year_id', parseInt(formData.academic_year_id, 10) || 0);
      
      // Add optional fields
      if (formData.school_code) {
        formDataToSend.append('school_code', formData.school_code);
      }
      if (formData.email) {
        formDataToSend.append('email', formData.email);
      }
      if (formData.country) {
        formDataToSend.append('country', formData.country);
      }
      if (formData.state) {
        formDataToSend.append('state', formData.state);
      }
      if (formData.city) {
        formDataToSend.append('city', formData.city);
      }
      if (formData.postal_code) {
        formDataToSend.append('postal_code', formData.postal_code);
      }

      // Add logo file if selected
      if (formData.logo && formData.logo.uri) {
        const logoFile = {
          uri: formData.logo.uri,
          type: formData.logo.type || 'image/jpeg',
          name: formData.logo.name || `logo_${Date.now()}.jpg`,
        };
        formDataToSend.append('logo', logoFile);
        console.log('[SchoolSettingsScreen] Logo file:', logoFile);
      }

      console.log('[SchoolSettingsScreen] Submitting FormData with fields:', {
        name: formData.name,
        address: formData.address,
        phone_number: formData.phone_number,
        academic_year_id: parseInt(formData.academic_year_id, 10) || 0,
        hasLogo: !!formData.logo?.uri,
      });

      const response = await apiService.updateSchoolSettings(formDataToSend);
      
      showToast(response.message || 'Settings saved successfully', 'success');
      setLastErrorDebug(null);
      
      if (onSaveSuccess) {
        onSaveSuccess(response.data);
      }
    } catch (error) {
      console.error('[SchoolSettingsScreen] Save error:', error);
      // Prefer structured server response if available
      const serverData = error?.data || error?.raw || null;

      if (serverData && typeof serverData === 'object') {
        // If backend returned validation errors in `errors` object, map them to form fields
        if (serverData.errors && typeof serverData.errors === 'object') {
          const mapped = {};
          Object.keys(serverData.errors).forEach((k) => {
            const v = serverData.errors[k];
            mapped[k] = Array.isArray(v) ? v[0] : (v || String(v));
          });
          setErrors((prev) => ({ ...prev, ...mapped }));
        }
        setLastErrorDebug(JSON.stringify(serverData, null, 2));
      } else {
        setLastErrorDebug(JSON.stringify(error, null, 2));
      }

      const errorMessage = (error && (error.message || (serverData && serverData.message))) || 'Failed to save settings';
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (field) => [
    styles.input,
    errors[field] ? styles.inputError : styles.inputNormal,
  ];

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={onBack}>
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.title}>School Settings</Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {/* School Name */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>School Name *</Text>
              <TextInput
                style={inputStyle('name')}
                placeholder="Enter school name"
                placeholderTextColor="#CCC"
                value={formData.name}
                onChangeText={(value) => handleInputChange('name', value)}
                editable={!loading}
              />
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>

            {/* School Code */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>School Code</Text>
              <TextInput
                style={inputStyle('school_code')}
                placeholder="Enter school code"
                placeholderTextColor="#CCC"
                value={formData.school_code}
                onChangeText={(value) => handleInputChange('school_code', value)}
                editable={!loading}
              />
            </View>
            {/* Logo */}
            <View style={styles.formGroup}>
                <Text style={styles.label}>Logo</Text>
                <TouchableOpacity style={inputStyle('logo')} onPress={handleChooseFile}>
                    <Text style={styles.fileInputText}>
                        {formData.logo ? 'Logo selected' : 'Choose file'}
                    </Text>
                </TouchableOpacity>
                {errors.logo && <Text style={styles.errorText}>{errors.logo}</Text>}
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={inputStyle('email')}
                placeholder="Enter school email"
                placeholderTextColor="#CCC"
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                keyboardType="email-address"
                editable={!loading}
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            {/* Phone Number */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Phone Number *</Text>
              <TextInput
                style={inputStyle('phone_number')}
                placeholder="Enter phone number"
                placeholderTextColor="#CCC"
                value={formData.phone_number}
                onChangeText={(value) => handleInputChange('phone_number', value)}
                keyboardType="phone-pad"
                editable={!loading}
              />
              {errors.phone_number && <Text style={styles.errorText}>{errors.phone_number}</Text>}
            </View>

            {/* Address */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Address *</Text>
              <TextInput
                style={[inputStyle('address'), styles.multilineInput]}
                placeholder="Enter full address"
                placeholderTextColor="#CCC"
                value={formData.address}
                onChangeText={(value) => handleInputChange('address', value)}
                multiline={true}
                numberOfLines={3}
                editable={!loading}
              />
              {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}
            </View>

            {/* Country */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Country</Text>
              <TextInput
                style={inputStyle('country')}
                placeholder="Enter country"
                placeholderTextColor="#CCC"
                value={formData.country}
                onChangeText={(value) => handleInputChange('country', value)}
                editable={!loading}
              />
            </View>

            {/* State */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>State/Province</Text>
              <TextInput
                style={inputStyle('state')}
                placeholder="Enter state or province"
                placeholderTextColor="#CCC"
                value={formData.state}
                onChangeText={(value) => handleInputChange('state', value)}
                editable={!loading}
              />
            </View>

            {/* City */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>City</Text>
              <TextInput
                style={inputStyle('city')}
                placeholder="Enter city"
                placeholderTextColor="#CCC"
                value={formData.city}
                onChangeText={(value) => handleInputChange('city', value)}
                editable={!loading}
              />
            </View>

            {/* Postal Code */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Postal Code</Text>
              <TextInput
                style={inputStyle('postal_code')}
                placeholder="Enter postal code"
                placeholderTextColor="#CCC"
                value={formData.postal_code}
                onChangeText={(value) => handleInputChange('postal_code', value)}
                editable={!loading}
              />
            </View>

            {/* Academic Year ID */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Academic Year ID *</Text>
              <TextInput
                style={inputStyle('academic_year_id')}
                placeholder="Enter academic year ID (e.g., 1)"
                placeholderTextColor="#CCC"
                value={formData.academic_year_id}
                onChangeText={(value) => handleInputChange('academic_year_id', value)}
                keyboardType="numeric"
                editable={!loading}
              />
              {errors.academic_year_id && <Text style={styles.errorText}>{errors.academic_year_id}</Text>}
            </View>

            {/* Save Button */}
            <TouchableOpacity
              style={[styles.saveButton, loading && styles.saveButtonDisabled]}
              onPress={handleSaveSettings}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" size="small" />
              ) : (
                <Text style={styles.saveButtonText}>Save Settings</Text>
              )}
            </TouchableOpacity>

            {/* Debug Info */}
            {lastErrorDebug && (
              <View style={styles.debugContainer}>
                <Text style={styles.debugTitle}>Last error (debug):</Text>
                <ScrollView style={styles.debugScroll} nestedScrollEnabled={true}>
                  <Text style={styles.debugText}>{lastErrorDebug}</Text>
                </ScrollView>
              </View>
            )}

            <View style={styles.requiredNote}>
              <Text style={styles.requiredNoteText}>* = Required field</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 12,
  },
  backButton: {
    paddingRight: 12,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6C63FF',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1A1A',
    letterSpacing: 0.3,
    flex: 1,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1A1A1A',
  },
  inputNormal: {
    borderColor: '#E0E0E0',
    backgroundColor: '#FAFAFA',
  },
  inputError: {
    borderColor: '#FF6B6B',
    backgroundColor: '#FFE8E8',
  },
  multilineInput: {
    paddingVertical: 12,
    textAlignVertical: 'top',
  },
  fileInputText: {
    color: '#1A1A1A',
    fontSize: 14,
    fontWeight: '500',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
    marginTop: 6,
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#6C63FF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  debugContainer: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#FFE8E8',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B6B',
  },
  debugTitle: {
    color: '#FF6B6B',
    fontWeight: '700',
    fontSize: 12,
    marginBottom: 8,
  },
  debugScroll: {
    maxHeight: 150,
  },
  debugText: {
    color: '#333',
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  requiredNote: {
    marginTop: 16,
    paddingVertical: 8,
    alignItems: 'center',
  },
  requiredNoteText: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
});
