import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import apiService from '../api/apiService';
import { showToast } from '../components/Toast';

export default function PermissionScreen({ onBack }) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [permissionsStructure, setPermissionsStructure] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [error, setError] = useState(null);
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      await fetchPermissionInfos();
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load permission data');
      showToast('Failed to load permission data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchPermissionInfos = async () => {
    try {
      console.log('[PermissionScreen] Fetching permission infos');
      const result = await apiService.getPermissionInfos();
      const data = result?.data || {};
      console.log('[PermissionScreen] Fetched data:', JSON.stringify(data, null, 2));

      const usersList = Array.isArray(data.users) ? data.users : [];
      const permissionsList = Array.isArray(data.permissions) ? data.permissions : [];

      console.log('[PermissionScreen] Users:', usersList);
      console.log('[PermissionScreen] Permissions:', permissionsList);

      setUsers(usersList);
      setPermissionsStructure(permissionsList);
      setSelectedPermissions([]);
      setSelectedUser(null);
    } catch (err) {
      console.error('Error fetching permission infos:', err);
      setError('Failed to load permission data');
      showToast('Failed to load permission data', 'error');
    }
  };

  const handleSelectUser = async (user) => {
    console.log('[PermissionScreen] Selected user:', user);
    setSelectedUser(user);
    setUserModalVisible(false);
    setError(null);

    try {
      console.log('[PermissionScreen] Fetching permissions for user:', user.id);
      const result = await apiService.getUserPermissions(user.id);
      const permissions = Array.isArray(result?.data) ? result.data : [];
      console.log('[PermissionScreen] User permissions:', permissions);
      setSelectedPermissions(permissions);
    } catch (err) {
      console.error('Error fetching user permissions:', err);
      let errorMsg = 'Failed to load user permissions';

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
    }
  };

  const handleTogglePermission = (permissionCode) => {
    if (selectedPermissions.includes(permissionCode)) {
      setSelectedPermissions(selectedPermissions.filter((p) => p !== permissionCode));
    } else {
      setSelectedPermissions([...selectedPermissions, permissionCode]);
    }
  };

  const handleToggleCategory = (categoryName) => {
    setExpandedCategories({
      ...expandedCategories,
      [categoryName]: !expandedCategories[categoryName],
    });
  };

  const handleSelectAllInCategory = (category) => {
    const categoryPermissions = category.children.map((p) => p.code);
    const allSelected = categoryPermissions.every((p) => selectedPermissions.includes(p));

    if (allSelected) {
      setSelectedPermissions(selectedPermissions.filter((p) => !categoryPermissions.includes(p)));
    } else {
      const newPermissions = [...selectedPermissions];
      categoryPermissions.forEach((p) => {
        if (!newPermissions.includes(p)) {
          newPermissions.push(p);
        }
      });
      setSelectedPermissions(newPermissions);
    }
  };

  const handleSavePermissions = async () => {
    if (!selectedUser) {
      showToast('Please select a user', 'error');
      return;
    }

    Keyboard.dismiss();
    setSubmitting(true);

    try {
      console.log('[PermissionScreen] Saving permissions:', selectedPermissions);
      const response = await apiService.savePermissions(selectedUser.id, selectedPermissions);

      if (response) {
        showToast('Permissions updated successfully', 'success');
        await fetchPermissionInfos();
      }
    } catch (err) {
      console.error('Error saving permissions:', err);
      let errorMsg = 'Failed to save permissions';

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

  const renderUserModal = () => (
    <Modal
      visible={userModalVisible}
      transparent
      animationType="slide"
      onRequestClose={() => setUserModalVisible(false)}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Select User</Text>
          <TouchableOpacity onPress={() => setUserModalVisible(false)}>
            <Text style={styles.modalCloseButton}>✕</Text>
          </TouchableOpacity>
        </View>
        {users.length === 0 ? (
          <View style={styles.emptyUserList}>
            <Text style={styles.emptyUserText}>No users available</Text>
          </View>
        ) : (
          <FlatList
            data={users}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.userOption}
                onPress={() => handleSelectUser(item)}
              >
                <View style={styles.userOptionContent}>
                  <Text style={styles.userOptionName}>{item.name}</Text>
                  <Text style={styles.userOptionId}>ID: {item.id}</Text>
                </View>
                {selectedUser?.id === item.id && (
                  <Text style={styles.userOptionCheck}>✓</Text>
                )}
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.userList}
          />
        )}
      </SafeAreaView>
    </Modal>
  );

  const renderPermissionCategory = ({ item: category }) => {
    const isExpanded = expandedCategories[category.name];
    const categoryPermissions = category.children.map((p) => p.code);
    const allSelected = categoryPermissions.every((p) => selectedPermissions.includes(p));
    const someSelected = categoryPermissions.some((p) => selectedPermissions.includes(p));

    return (
      <View style={styles.categoryContainer}>
        <TouchableOpacity
          style={styles.categoryHeader}
          onPress={() => handleToggleCategory(category.name)}
        >
          <View style={[styles.categoryCheckbox, (allSelected || someSelected) && styles.categoryCheckboxSelected]}>
            {allSelected && <Text style={styles.checkmark}>✓</Text>}
            {someSelected && !allSelected && <Text style={styles.partialCheckmark}>−</Text>}
          </View>
          <Text style={styles.categoryName}>{category.name}</Text>
          <Text style={styles.categoryIcon}>{isExpanded ? '▼' : '▶'}</Text>
        </TouchableOpacity>

        {isExpanded && (
          <>
            <TouchableOpacity
              style={styles.selectCategoryButton}
              onPress={() => handleSelectAllInCategory(category)}
            >
              <Text style={styles.selectCategoryText}>
                {allSelected ? 'Deselect All' : 'Select All'}
              </Text>
            </TouchableOpacity>

            {category.children.map((permission) => {
              const isSelected = selectedPermissions.includes(permission.code);
              return (
                <TouchableOpacity
                  key={permission.code}
                  style={[styles.permissionItem, isSelected && styles.permissionItemSelected]}
                  onPress={() => handleTogglePermission(permission.code)}
                >
                  <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                    {isSelected && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <View style={styles.permissionContent}>
                    <Text style={styles.permissionName}>{permission.name}</Text>
                    <Text style={styles.permissionCode}>{permission.code}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Permission Management</Text>
          <View style={styles.spacer} />
        </View>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#6C63FF" />
          <Text style={styles.loadingText}>Loading permissions...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Permission Management</Text>
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
        <Text style={styles.formSection}>Select User</Text>

        <TouchableOpacity
          style={styles.userSelectorButton}
          onPress={() => setUserModalVisible(true)}
        >
          <Text style={styles.userSelectorLabel}>
            {selectedUser ? `${selectedUser.name} (ID: ${selectedUser.id})` : 'Tap to select user'}
          </Text>
          <Text style={styles.userSelectorIcon}>▼</Text>
        </TouchableOpacity>

        {selectedUser && (
          <>
            <Text style={styles.formSection}>Manage Permissions ({selectedPermissions.length} selected)</Text>

            <FlatList
              data={permissionsStructure}
              renderItem={renderPermissionCategory}
              keyExtractor={(item, idx) => item.name + idx}
              scrollEnabled={false}
              contentContainerStyle={styles.permissionList}
            />

            <View style={styles.formActions}>
              <TouchableOpacity
                style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
                onPress={handleSavePermissions}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.submitButtonText}>Save Permissions</Text>
                )}
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>

      {renderUserModal()}
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
    marginBottom: 12,
    marginTop: 12,
  },
  userSelectorButton: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  userSelectorLabel: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    flex: 1,
  },
  userSelectorIcon: {
    fontSize: 12,
    color: '#999',
  },
  permissionList: {
    paddingBottom: 30,
  },
  categoryContainer: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#F5F1FF',
  },
  categoryCheckbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#DDD',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  categoryCheckboxSelected: {
    backgroundColor: '#6C63FF',
    borderColor: '#6C63FF',
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    flex: 1,
    textTransform: 'capitalize',
  },
  categoryIcon: {
    fontSize: 12,
    color: '#999',
  },
  selectCategoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F9F9F9',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  selectCategoryText: {
    fontSize: 12,
    color: '#6C63FF',
    fontWeight: '600',
  },
  permissionItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  permissionItemSelected: {
    backgroundColor: '#F0E8FF',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderColor: '#DDD',
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  checkboxSelected: {
    backgroundColor: '#6C63FF',
    borderColor: '#6C63FF',
  },
  checkmark: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  partialCheckmark: {
    color: '#6C63FF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  permissionContent: {
    flex: 1,
  },
  permissionName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  permissionCode: {
    fontSize: 11,
    color: '#999',
    fontFamily: 'monospace',
  },
  formActions: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 30,
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
  modalContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalCloseButton: {
    fontSize: 24,
    color: '#999',
    fontWeight: 'bold',
  },
  userList: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 20,
  },
  emptyUserList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyUserText: {
    fontSize: 16,
    color: '#999',
  },
  userOption: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#6C63FF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  userOptionContent: {
    flex: 1,
  },
  userOptionName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  userOptionId: {
    fontSize: 12,
    color: '#666',
  },
  userOptionCheck: {
    fontSize: 18,
    color: '#6C63FF',
    fontWeight: 'bold',
  },
});
