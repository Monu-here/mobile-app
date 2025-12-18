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

export default function RoutePickupPointScreen({ onBack }) {
  const [loading, setLoading] = useState(false);
  const [routePickupPoints, setRoutePickupPoints] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [pickupPoints, setPickupPoints] = useState([]);
  
  const [routeId, setRouteId] = useState('');
  const [pickupPointId, setPickupPointId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  
  const [showRoutePicker, setShowRoutePicker] = useState(false);
  const [showPickupPointPicker, setShowPickupPointPicker] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch routes
      const routeRes = await apiService.getRoutes();
      const routeMaybe = routeRes?.data;
      let routeList = [];
      if (routeMaybe?.route && Array.isArray(routeMaybe.route)) {
        routeList = routeMaybe.route;
      } else if (Array.isArray(routeMaybe)) {
        routeList = routeMaybe;
      } else if (routeMaybe?.data && Array.isArray(routeMaybe.data)) {
        routeList = routeMaybe.data;
      }
      const finalRoutes = Array.isArray(routeList) ? routeList : [];
      console.log('[RoutePickupPointScreen] Fetched routes:', finalRoutes);
      setRoutes(finalRoutes);

      // Fetch pickup points
      const pickupRes = await apiService.getPickupPoints();
      const pickupMaybe = pickupRes?.data;
      let pickupList = [];
      if (pickupMaybe?.pickupPoint && Array.isArray(pickupMaybe.pickupPoint)) {
        pickupList = pickupMaybe.pickupPoint;
      } else if (Array.isArray(pickupMaybe)) {
        pickupList = pickupMaybe;
      } else if (pickupMaybe?.data && Array.isArray(pickupMaybe.data)) {
        pickupList = pickupMaybe.data;
      }
      const finalPickupPoints = Array.isArray(pickupList) ? pickupList : [];
      console.log('[RoutePickupPointScreen] Fetched pickup points:', finalPickupPoints);
      setPickupPoints(finalPickupPoints);

      await fetchRoutePickupPoints();
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data');
      showToast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchRoutePickupPoints = async () => {
    try {
      console.log('[RoutePickupPointScreen] Fetching route pickup points');
      const result = await apiService.getRoutePickupPoints({});
      const data = Array.isArray(result.data) ? result.data : [];
      console.log('[RoutePickupPointScreen] Fetched route pickup points:', data);
      setRoutePickupPoints(data);
    } catch (err) {
      console.error('Error fetching route pickup points:', err);
      setError('Failed to load route pickup points');
      showToast('Failed to load route pickup points', 'error');
    }
  };

  const getRouteName = (id) => {
    const route = routes.find(r => parseInt(r.id, 10) === parseInt(id, 10));
    return route?.name || 'Unknown Route';
  };

  const getPickupPointName = (id) => {
    const point = pickupPoints.find(p => parseInt(p.id, 10) === parseInt(id, 10));
    return point?.name || 'Unknown Pickup Point';
  };

  const clearForm = () => {
    setRouteId('');
    setPickupPointId('');
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleAdd = async () => {
    if (!routeId) {
      showToast('Route is required', 'error');
      return;
    }
    if (!pickupPointId) {
      showToast('Pickup Point is required', 'error');
      return;
    }

    Keyboard.dismiss();
    setSubmitting(true);

    try {
      const payload = {
        route_id: parseInt(routeId, 10),
        pick_up_point_id: parseInt(pickupPointId, 10),
      };

      console.log('[RoutePickupPointScreen] Submitting payload:', JSON.stringify(payload, null, 2));

      let response;
      if (editingId) {
        response = await apiService.updateRoutePickupPoint(editingId, payload);
      } else {
        response = await apiService.addRoutePickupPoint(payload);
      }

      if (response) {
        showToast(editingId ? 'Route Pickup Point updated successfully' : 'Route Pickup Point added successfully', 'success');
        clearForm();
        await fetchData();
      }
    } catch (err) {
      console.error('Error adding/updating route pickup point:', err);
      let errorMsg = 'Failed to add/update route pickup point';

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

  const handleEdit = async (item) => {
    setRouteId(item.route_id ? String(item.route_id) : '');
    setPickupPointId(item.pick_up_point_id ? String(item.pick_up_point_id) : '');
    setEditingId(item.id);
    window.scrollTo(0, 0);
  };

  const handleDelete = (id) => {
    Alert.alert('Delete Route Pickup Point', 'Are you sure you want to delete this route pickup point?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Delete',
        onPress: async () => {
          try {
            await apiService.deleteRoutePickupPoint(id);
            showToast('Route Pickup Point deleted successfully', 'success');
            await fetchData();
          } catch (err) {
            console.error('Error deleting route pickup point:', err);
            showToast('Failed to delete route pickup point', 'error');
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitle}>
          <Text style={styles.cardTitleText}>{getRouteName(item.route_id)}</Text>
          <Text style={styles.cardSubText}>Pickup: {getPickupPointName(item.pick_up_point_id)}</Text>
        </View>
      </View>
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
        <Text style={styles.headerTitle}>Route Pickup Point Management</Text>
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
        <Text style={styles.formSection}>{editingId ? 'Edit Route Pickup Point' : 'Add New Route Pickup Point'}</Text>

        <Text style={styles.formLabel}>Route *</Text>
        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => setShowRoutePicker(true)}
          disabled={submitting}
        >
          <Text style={styles.pickerButtonText}>
            {routeId ? getRouteName(parseInt(routeId, 10)) : '-- Select Route --'}
          </Text>
          <Text style={styles.pickerButtonArrow}>▼</Text>
        </TouchableOpacity>

        <Text style={styles.formLabel}>Pickup Point *</Text>
        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => setShowPickupPointPicker(true)}
          disabled={submitting}
        >
          <Text style={styles.pickerButtonText}>
            {pickupPointId ? getPickupPointName(parseInt(pickupPointId, 10)) : '-- Select Pickup Point --'}
          </Text>
          <Text style={styles.pickerButtonArrow}>▼</Text>
        </TouchableOpacity>

        <View style={styles.formActions}>
          <TouchableOpacity
            style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
            onPress={handleAdd}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>{editingId ? 'Update Route Pickup Point' : 'Add Route Pickup Point'}</Text>
            )}
          </TouchableOpacity>

          {editingId && (
            <TouchableOpacity style={styles.cancelButton} onPress={cancelEdit} disabled={submitting}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* Route Picker Modal */}
      <Modal visible={showRoutePicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Route</Text>
              <TouchableOpacity onPress={() => setShowRoutePicker(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalList}>
              {routes.map((route) => (
                <TouchableOpacity
                  key={route.id}
                  style={[
                    styles.modalItem,
                    routeId === String(route.id) && styles.modalItemSelected
                  ]}
                  onPress={() => {
                    setRouteId(String(route.id));
                    setShowRoutePicker(false);
                  }}
                >
                  <Text style={[
                    styles.modalItemText,
                    routeId === String(route.id) && styles.modalItemTextSelected
                  ]}>
                    {route.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Pickup Point Picker Modal */}
      <Modal visible={showPickupPointPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Pickup Point</Text>
              <TouchableOpacity onPress={() => setShowPickupPointPicker(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalList}>
              {pickupPoints.map((point) => (
                <TouchableOpacity
                  key={point.id}
                  style={[
                    styles.modalItem,
                    pickupPointId === String(point.id) && styles.modalItemSelected
                  ]}
                  onPress={() => {
                    setPickupPointId(String(point.id));
                    setShowPickupPointPicker(false);
                  }}
                >
                  <Text style={[
                    styles.modalItemText,
                    pickupPointId === String(point.id) && styles.modalItemTextSelected
                  ]}>
                    {point.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Route Pickup Points List ({routePickupPoints.length})</Text>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#6C63FF" />
          <Text style={styles.loadingText}>Loading route pickup points...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchData}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : routePickupPoints.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No route pickup points found</Text>
        </View>
      ) : (
        <FlatList
          data={routePickupPoints}
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
