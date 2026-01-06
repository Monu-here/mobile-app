import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
  ScrollView,
  SafeAreaView,
  Alert,
} from "react-native";
import apiService from "../api/apiService";
import Toast from "../components/Toast";

export default function MarkGradeScreen({ onBack }) {
  const [loading, setLoading] = useState(false);
  const [markGrades, setMarkGrades] = useState([]);
  const [error, setError] = useState(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("info");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingGrade, setEditingGrade] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form fields
  const [name, setName] = useState("");
  const [gpa, setGpa] = useState("");
  const [percentFrom, setPercentFrom] = useState("");
  const [percentUpto, setPercentUpto] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchMarkGrades();
  }, []);

  const showToast = (message, type = "info") => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  };

  const fetchMarkGrades = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("[MarkGradeScreen] Fetching mark grades");
      const response = await apiService.getMarkGrades();
      console.log(
        "[MarkGradeScreen] Mark grades response:",
        JSON.stringify(response, null, 2)
      );

      const data = Array.isArray(response?.data) ? response.data : [];
      console.log(
        "[MarkGradeScreen] Parsed mark grades:",
        JSON.stringify(data, null, 2)
      );

      setMarkGrades(data);

      if (data.length === 0) {
        showToast("No mark grades found", "info");
      }
    } catch (error) {
      console.error("[MarkGradeScreen] Error fetching mark grades:", error);
      setError(error?.message || "Failed to load mark grades");
      showToast(error?.message || "Failed to load mark grades", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddGrade = () => {
    setEditingGrade(null);
    setName("");
    setGpa("");
    setPercentFrom("");
    setPercentUpto("");
    setDescription("");
    setShowModal(true);
  };

  const handleEditGrade = (grade) => {
    console.log("[MarkGradeScreen] Edit grade:", grade);
    setEditingGrade(grade);
    setName(grade.name || "");
    setGpa(grade.gpa?.toString() || "");
    setPercentFrom(grade.percent_from?.toString() || "");
    setPercentUpto(grade.percent_upto?.toString() || "");
    setDescription(grade.description || "");
    setShowModal(true);
  };

  const handleSaveGrade = async () => {
    if (!name) {
      showToast("Please enter grade name", "error");
      return;
    }

    if (!gpa) {
      showToast("Please enter GPA", "error");
      return;
    }

    if (!percentFrom) {
      showToast("Please enter percent from", "error");
      return;
    }

    if (!percentUpto) {
      showToast("Please enter percent upto", "error");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        gpa: parseFloat(gpa),
        percent_from: parseFloat(percentFrom),
        percent_upto: parseFloat(percentUpto),
        description: description.trim(),
      };

      console.log("[MarkGradeScreen] Saving mark grade:", payload);

      let response;
      if (editingGrade) {
        // Update existing grade
        console.log("[MarkGradeScreen] Updating mark grade ID:", editingGrade.id);
        console.log(
          "[MarkGradeScreen] Update payload:",
          JSON.stringify(payload, null, 2)
        );
        response = await apiService.updateMarkGrade(editingGrade.id, payload);
        console.log(
          "[MarkGradeScreen] Update response:",
          JSON.stringify(response, null, 2)
        );
      } else {
        // Create new grade
        console.log(
          "[MarkGradeScreen] Create payload:",
          JSON.stringify(payload, null, 2)
        );
        response = await apiService.addMarkGrade(payload);
        console.log(
          "[MarkGradeScreen] Create response:",
          JSON.stringify(response, null, 2)
        );
      }

      console.log("[MarkGradeScreen] Save response:", response);
      showToast(
        response?.message ||
          `Mark grade ${editingGrade ? "updated" : "saved"} successfully`,
        "success"
      );
      setShowModal(false);
      fetchMarkGrades();
    } catch (error) {
      console.error("[MarkGradeScreen] Error saving mark grade:", error);
      showToast(error?.message || "Failed to save mark grade", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteGrade = (grade) => {
    Alert.alert(
      "Delete Mark Grade",
      `Are you sure you want to delete ${grade.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              console.log("[MarkGradeScreen] Deleting mark grade:", grade.id);
              const response = await apiService.deleteMarkGrade(grade.id);
              showToast(
                response?.message || "Mark grade deleted successfully",
                "success"
              );
              fetchMarkGrades();
            } catch (error) {
              console.error(
                "[MarkGradeScreen] Error deleting mark grade:",
                error
              );
              showToast(
                error?.message || "Failed to delete mark grade",
                "error"
              );
            }
          },
        },
      ]
    );
  };

  const renderMarkGradeItem = ({ item }) => {
    console.log(
      "[MarkGradeScreen] Rendering item:",
      JSON.stringify(item, null, 2)
    );

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleSection}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardSubtitle}>
              GPA: {item.gpa} | {item.percent_from}% - {item.percent_upto}%
            </Text>
          </View>
          <View style={styles.cardActions}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEditGrade(item)}
            >
              <Text style={styles.editButtonText}>✏️ Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteGrade(item)}
            >
              <Text style={styles.deleteButtonText}>🗑️ Delete</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.cardBody}>
          {item.description && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Description:</Text>
              <Text style={styles.detailValue}>{item.description}</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

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
        <Text style={styles.title}>Mark Grades</Text>
        <TouchableOpacity
          onPress={handleAddGrade}
          style={styles.addHeaderButton}
        >
          <Text style={styles.addHeaderButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {/* Loading Indicator */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6C63FF" />
          <Text style={styles.loadingText}>Loading mark grades...</Text>
        </View>
      )}

      {/* Error Display */}
      {error && !loading && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchMarkGrades}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Mark Grades List */}
      {!loading && markGrades.length > 0 && (
        <ScrollView contentContainerStyle={styles.listContent}>
          {markGrades.map((grade) => (
            <View key={grade.id}>{renderMarkGradeItem({ item: grade })}</View>
          ))}
        </ScrollView>
      )}

      {/* Empty State */}
      {!loading && markGrades.length === 0 && !error && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No mark grades found</Text>
          <TouchableOpacity
            style={styles.emptyAddButton}
            onPress={handleAddGrade}
          >
            <Text style={styles.emptyAddButtonText}>Create First Grade</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Add/Edit Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingGrade ? "Edit Mark Grade" : "Add Mark Grade"}
              </Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              {/* Grade Name */}
              <View style={styles.formField}>
                <Text style={styles.formLabel}>Grade Name *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="e.g., A+, A, B+, B"
                  value={name}
                  onChangeText={setName}
                />
              </View>

              {/* GPA */}
              <View style={styles.formField}>
                <Text style={styles.formLabel}>GPA *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="e.g., 4.0"
                  value={gpa}
                  onChangeText={setGpa}
                  keyboardType="decimal-pad"
                />
              </View>

              {/* Percent From */}
              <View style={styles.formField}>
                <Text style={styles.formLabel}>Percent From *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="e.g., 90"
                  value={percentFrom}
                  onChangeText={setPercentFrom}
                  keyboardType="decimal-pad"
                />
              </View>

              {/* Percent Upto */}
              <View style={styles.formField}>
                <Text style={styles.formLabel}>Percent Upto *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="e.g., 100"
                  value={percentUpto}
                  onChangeText={setPercentUpto}
                  keyboardType="decimal-pad"
                />
              </View>

              {/* Description */}
              <View style={styles.formField}>
                <Text style={styles.formLabel}>Description</Text>
                <TextInput
                  style={[styles.formInput, styles.textAreaInput]}
                  placeholder="Enter description (optional)"
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={3}
                />
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSaveButton}
                onPress={handleSaveGrade}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.modalSaveButtonText}>
                    {editingGrade ? "Update" : "Save"}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    justifyContent: "space-between",
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
    fontWeight: "600",
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  addHeaderButton: {
    backgroundColor: "#6C63FF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addHeaderButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 50,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    borderLeftWidth: 5,
    borderLeftColor: "#6C63FF",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  cardTitleSection: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: "#666",
  },
  cardActions: {
    flexDirection: "row",
    gap: 6,
  },
  editButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 6,
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
  cardBody: {
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 12,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 13,
    color: "#666",
    fontWeight: "600",
    marginRight: 8,
  },
  detailValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
    flex: 1,
  },
  errorContainer: {
    padding: 16,
    backgroundColor: "#ffebee",
    margin: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  errorText: {
    color: "#c62828",
    fontSize: 14,
    marginBottom: 8,
  },
  retryButton: {
    backgroundColor: "#c62828",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
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
    marginBottom: 16,
  },
  emptyAddButton: {
    backgroundColor: "#6C63FF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyAddButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
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
    maxHeight: "85%",
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
    maxHeight: 400,
  },
  formField: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  formInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#333",
  },
  textAreaInput: {
    textAlignVertical: "top",
    minHeight: 80,
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
});
