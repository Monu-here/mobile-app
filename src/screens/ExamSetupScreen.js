import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Modal,
  TextInput,
  ScrollView,
  SafeAreaView,
  Alert,
  Switch,
} from "react-native";
import apiService from "../api/apiService";
import Toast from "../components/Toast";

export default function ExamSetupScreen({ onBack }) {
  const [loading, setLoading] = useState(false);
  const [examSetups, setExamSetups] = useState([]);
  const [grades, setGrades] = useState([]);
  const [examTypes, setExamTypes] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("info");

  // Filter state
  const [gradeId, setGradeId] = useState("");
  const [examTypeId, setExamTypeId] = useState("");
  const [showGradePicker, setShowGradePicker] = useState(false);
  const [showExamTypePicker, setShowExamTypePicker] = useState(false);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingSetup, setEditingSetup] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form fields
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [isOp, setIsOp] = useState(false);
  const [totalPassMark, setTotalPassMark] = useState("");
  const [totalMark, setTotalMark] = useState("");
  const [parts, setParts] = useState([]);
  const [showSubjectPicker, setShowSubjectPicker] = useState(false);

  useEffect(() => {
    fetchGrades();
    fetchExamTypes();
    fetchSubjects();
  }, []);

  const showToast = (message, type = "info") => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
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
      console.log("[ExamSetupScreen] Grades:", gradeList);
      setGrades(gradeList);
    } catch (error) {
      console.error("[ExamSetupScreen] Error fetching grades:", error);
      showToast("Failed to fetch grades", "error");
    }
  };

  const fetchExamTypes = async () => {
    try {
      const response = await apiService.getExamTypes();
      let examTypeList = [];
      if (Array.isArray(response?.data)) {
        examTypeList = response.data;
      } else if (response?.data?.data && Array.isArray(response.data.data)) {
        examTypeList = response.data.data;
      }
      console.log("[ExamSetupScreen] Exam types:", examTypeList);
      setExamTypes(examTypeList);
    } catch (error) {
      console.error("[ExamSetupScreen] Error fetching exam types:", error);
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
      }
      console.log("[ExamSetupScreen] Subjects:", subjectList);
      setSubjects(subjectList);
    } catch (error) {
      console.error("[ExamSetupScreen] Error fetching subjects:", error);
      showToast("Failed to fetch subjects", "error");
    }
  };

  const fetchExamSetups = async () => {
    if (!gradeId || !examTypeId) {
      showToast("Please select both grade and exam type", "error");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const filters = {
        grade_id: parseInt(gradeId),
        exam_type_id: parseInt(examTypeId),
      };

      console.log(
        "[ExamSetupScreen] Fetching exam setups with filters:",
        filters
      );
      const response = await apiService.getExamSetup(filters);
      console.log(
        "[ExamSetupScreen] Full exam setups response:",
        JSON.stringify(response, null, 2)
      );

      const data = Array.isArray(response?.data) ? response.data : [];
      console.log(
        "[ExamSetupScreen] Parsed exam setups data:",
        JSON.stringify(data, null, 2)
      );

      setExamSetups(data);

      if (data.length === 0) {
        showToast("No exam setups found", "info");
      }
    } catch (error) {
      console.error("[ExamSetupScreen] Error fetching exam setups:", error);
      setError(error?.message || "Failed to load exam setups");
      showToast(error?.message || "Failed to load exam setups", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddSetup = () => {
    if (!gradeId || !examTypeId) {
      showToast("Please select grade and exam type first", "error");
      return;
    }
    setEditingSetup(null);
    setSelectedSubjects([]);
    setIsOp(false);
    setTotalPassMark("");
    setTotalMark("");
    setParts([{ title: "", exam_mark: "", exam_pass_mark: "" }]);
    setShowModal(true);
  };

  const handleEditSetup = (setup) => {
    console.log("[ExamSetupScreen] Edit setup:", setup);
    setEditingSetup(setup);
    // Parse existing data for editing
    const subjectIds = setup.subjects_ids
      ? Array.isArray(setup.subjects_ids)
        ? setup.subjects_ids
        : [setup.subjects_ids]
      : [];
    console.log("[ExamSetupScreen] Setting subjects:", subjectIds);
    setSelectedSubjects(subjectIds);
    setIsOp(setup.is_op === 1 || setup.is_op === true || false);
    setTotalPassMark(setup.total_pass_mark?.toString() || "");
    setTotalMark(setup.total_mark?.toString() || "");
    setParts(
      setup.parts && Array.isArray(setup.parts)
        ? setup.parts
        : [{ title: "", exam_mark: "", exam_pass_mark: "" }]
    );
    setShowModal(true);
  };

  const addPart = () => {
    setParts([...parts, { title: "", exam_mark: "", exam_pass_mark: "" }]);
  };

  const removePart = (index) => {
    const newParts = parts.filter((_, i) => i !== index);
    setParts(newParts);
  };

  const updatePart = (index, field, value) => {
    const newParts = [...parts];
    newParts[index] = { ...newParts[index], [field]: value };
    setParts(newParts);
  };

  const handleSaveSetup = async () => {
    if (selectedSubjects.length === 0) {
      showToast("Please select at least one subject", "error");
      return;
    }

    if (!totalMark || !totalPassMark) {
      showToast("Please enter total mark and pass mark", "error");
      return;
    }

    if (parts.length === 0) {
      showToast("Please add at least one exam part", "error");
      return;
    }

    // Validate all parts
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (!part.title) {
        showToast(`Please enter title for part ${i + 1}`, "error");
        return;
      }
      if (!part.exam_mark) {
        showToast(`Please enter mark for part ${i + 1}`, "error");
        return;
      }
      if (!part.exam_pass_mark) {
        showToast(`Please enter pass mark for part ${i + 1}`, "error");
        return;
      }
    }

    setSubmitting(true);
    try {
      const payload = {
        grade_id: parseInt(gradeId),
        exam_type_id: parseInt(examTypeId),
        subjects_ids: selectedSubjects.map((s) => parseInt(s)),
        is_op: isOp,
        total_pass_mark: parseInt(totalPassMark),
        total_mark: parseInt(totalMark),
        parts: parts.map((part) => ({
          title: part.title.trim(),
          exam_mark: parseFloat(part.exam_mark),
          exam_pass_mark: parseFloat(part.exam_pass_mark),
        })),
      };

      console.log("[ExamSetupScreen] Saving exam setup:", payload);

      let response;
      if (editingSetup) {
        // Update existing setup
        console.log(
          "[ExamSetupScreen] Updating exam setup ID:",
          editingSetup.id
        );
        console.log(
          "[ExamSetupScreen] Update payload:",
          JSON.stringify(payload, null, 2)
        );
        response = await apiService.updateExamSetup(editingSetup.id, payload);
        console.log(
          "[ExamSetupScreen] Update response:",
          JSON.stringify(response, null, 2)
        );
      } else {
        // Create new setup
        console.log(
          "[ExamSetupScreen] Create payload:",
          JSON.stringify(payload, null, 2)
        );
        response = await apiService.addExamSetup(payload);
        console.log(
          "[ExamSetupScreen] Create response:",
          JSON.stringify(response, null, 2)
        );
      }

      console.log("[ExamSetupScreen] Save response:", response);
      showToast(
        response?.message ||
          `Exam setup ${editingSetup ? "updated" : "saved"} successfully`,
        "success"
      );
      setShowModal(false);
      fetchExamSetups();
    } catch (error) {
      console.error("[ExamSetupScreen] Error saving exam setup:", error);
      showToast(error?.message || "Failed to save exam setup", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSetup = (setup) => {
    Alert.alert(
      "Delete Exam Setup",
      `Are you sure you want to delete this exam setup?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              console.log("[ExamSetupScreen] Deleting exam setup:", setup.id);
              const response = await apiService.deleteExamSetup(setup.id);
              showToast(
                response?.message || "Exam setup deleted successfully",
                "success"
              );
              fetchExamSetups();
            } catch (error) {
              console.error(
                "[ExamSetupScreen] Error deleting exam setup:",
                error
              );
              showToast(
                error?.message || "Failed to delete exam setup",
                "error"
              );
            }
          },
        },
      ]
    );
  };

  const getGradeName = (id) => {
    const grade = grades.find((g) => g.id === parseInt(id));
    return grade?.name || "N/A";
  };

  const getExamTypeName = (id) => {
    const examType = examTypes.find((e) => e.id === parseInt(id));
    return examType?.name || "N/A";
  };

  const getSubjectName = (id) => {
    const subject = subjects.find((s) => s.id === parseInt(id));
    return subject?.name || "Unknown";
  };

  const renderExamSetupItem = ({ item }) => {
    console.log(
      "[ExamSetupScreen] Rendering item:",
      JSON.stringify(item, null, 2)
    );

    const totalMark = item.exam_mark || item?.exam_mark || "N/A";
    const passMark = item.pass_mark || item?.pass_mark || "N/A";
    const subjects = item.subjects || item?.subjects || [];
    const exam_title = item.exam_title || item?.exam_title || "N/A";
    const parts = item.parts || item?.parts || [];

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleSection}>
            <Text style={styles.cardLabel}>Grade</Text>
            <Text style={styles.cardTitle}>{getGradeName(item.grade_id)}</Text>
          </View>
          <View style={styles.cardActions}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEditSetup(item)}
            >
              <Text style={styles.editButtonText}>✏️ Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteSetup(item)}
            >
              <Text style={styles.deleteButtonText}>🗑️ Delete</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.cardBody}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>📝 Subjects:</Text>
            <Text style={styles.detailValue}>
              {getSubjectName(item.subject_id)}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>📝 Exam Title:</Text>
            <Text
              style={[
                styles.detailValue,
                exam_title === "N/A" && { color: "#999" },
              ]}
            >
              {exam_title}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>📝 Exam Type:</Text>
            <Text style={styles.detailValue}>
              {getExamTypeName(item.exam_type_id)}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>📊 Total Mark:</Text>
            <Text
              style={[
                styles.detailValue,
                totalMark === "N/A" && { color: "#999" },
              ]}
            >
              {totalMark}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>✅ Pass Mark:</Text>
            <Text
              style={[
                styles.detailValue,
                passMark === "N/A" && { color: "#999" },
              ]}
            >
              {passMark}
            </Text>
          </View>

          {item.is_op === 1 && (
            <View style={styles.detailRow}>
              <Text style={styles.badgeLabel}>🎯 Optional Paper</Text>
            </View>
          )}

          {Array.isArray(subjects) && subjects.length > 0 && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>📚 Subjects:</Text>
              <Text style={styles.detailValue}>
                {subjects.length} subject(s)
              </Text>
            </View>
          )}

          {Array.isArray(parts) && parts.length > 0 && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>📋 Parts:</Text>
              <Text style={styles.detailValue}>{parts.length} part(s)</Text>
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
        <Text style={styles.title}>Exam Setup</Text>
        <TouchableOpacity
          onPress={handleAddSetup}
          style={styles.addHeaderButton}
        >
          <Text style={styles.addHeaderButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <View style={styles.filterContainer}>
        {/* Grade Selection */}
        <View style={styles.filterField}>
          <Text style={styles.filterLabel}>Grade:</Text>
          <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => setShowGradePicker(!showGradePicker)}
          >
            <Text style={styles.pickerButtonText}>
              {gradeId ? getGradeName(parseInt(gradeId)) : "Select Grade"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Exam Type Selection */}
        <View style={styles.filterField}>
          <Text style={styles.filterLabel}>Exam Type:</Text>
          <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => setShowExamTypePicker(!showExamTypePicker)}
          >
            <Text style={styles.pickerButtonText}>
              {examTypeId
                ? getExamTypeName(parseInt(examTypeId))
                : "Select Exam Type"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Load Button */}
        <TouchableOpacity
          style={styles.loadButton}
          onPress={fetchExamSetups}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loadButtonText}>Load Setups</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Grade Picker Modal */}
      <Modal
        visible={showGradePicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowGradePicker(false)}
      >
        <View style={styles.pickerOverlay}>
          <View style={styles.pickerModalContent}>
            <View style={styles.pickerModalHeader}>
              <Text style={styles.pickerTitle}>Select Grade</Text>
              <TouchableOpacity onPress={() => setShowGradePicker(false)}>
                <Text style={styles.pickerClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.pickerScroll}>
              {grades.length > 0 ? (
                grades.map((grade) => (
                  <TouchableOpacity
                    key={grade.id}
                    style={[
                      styles.pickerItem,
                      gradeId === grade.id.toString() &&
                        styles.pickerItemSelected,
                    ]}
                    onPress={() => {
                      setGradeId(grade.id.toString());
                      setShowGradePicker(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.pickerItemText,
                        gradeId === grade.id.toString() &&
                          styles.pickerItemTextSelected,
                      ]}
                    >
                      {grade.name}
                    </Text>
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.pickerEmptyState}>
                  <Text style={styles.pickerEmptyText}>
                    No grades available
                  </Text>
                </View>
              )}
            </ScrollView>
            <TouchableOpacity
              style={styles.pickerCloseButton}
              onPress={() => setShowGradePicker(false)}
            >
              <Text style={styles.pickerCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
              {examTypes.length > 0 ? (
                examTypes.map((examType) => (
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
                ))
              ) : (
                <View style={styles.pickerEmptyState}>
                  <Text style={styles.pickerEmptyText}>
                    No exam types available
                  </Text>
                </View>
              )}
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

      {/* Error Display */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Exam Setups List */}
      {!loading && examSetups.length > 0 && (
        <FlatList
          data={examSetups}
          renderItem={renderExamSetupItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
        />
      )}

      {/* Empty State */}
      {!loading && examSetups.length === 0 && !error && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Select grade and exam type, then click "Load Setups"
          </Text>
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
                {editingSetup ? "Edit Exam Setup" : "Add Exam Setup"}
              </Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              {/* Subject Selection */}
              <View style={styles.formField}>
                <Text style={styles.formLabel}>Select Subjects *</Text>
                <TouchableOpacity
                  style={styles.formPickerButton}
                  onPress={() => setShowSubjectPicker(!showSubjectPicker)}
                >
                  <Text style={styles.formPickerButtonText}>
                    {selectedSubjects.length > 0
                      ? `${selectedSubjects.length} subject(s) selected`
                      : "Select Subjects"}
                  </Text>
                </TouchableOpacity>

                {showSubjectPicker && (
                  <View style={styles.inlinePickerContainer}>
                    <ScrollView style={styles.inlinePickerScroll}>
                      {subjects.map((subject) => (
                        <TouchableOpacity
                          key={subject.id}
                          style={[
                            styles.inlinePickerItem,
                            selectedSubjects.includes(subject.id) &&
                              styles.inlinePickerItemSelected,
                          ]}
                          onPress={() => {
                            if (selectedSubjects.includes(subject.id)) {
                              setSelectedSubjects(
                                selectedSubjects.filter((s) => s !== subject.id)
                              );
                            } else {
                              setSelectedSubjects([
                                ...selectedSubjects,
                                subject.id,
                              ]);
                            }
                          }}
                        >
                          <Text
                            style={[
                              styles.inlinePickerItemText,
                              selectedSubjects.includes(subject.id) &&
                                styles.inlinePickerItemTextSelected,
                            ]}
                          >
                            {selectedSubjects.includes(subject.id) ? "✓ " : ""}
                            {subject.name}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>

              {/* Total Mark */}
              <View style={styles.formField}>
                <Text style={styles.formLabel}>Total Mark *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Enter total mark"
                  value={totalMark}
                  onChangeText={setTotalMark}
                  keyboardType="numeric"
                />
              </View>

              {/* Total Pass Mark */}
              <View style={styles.formField}>
                <Text style={styles.formLabel}>Total Pass Mark *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Enter pass mark"
                  value={totalPassMark}
                  onChangeText={setTotalPassMark}
                  keyboardType="numeric"
                />
              </View>

              {/* Optional Paper Toggle */}
              <View style={styles.formField}>
                <View style={styles.toggleRow}>
                  <Text style={styles.toggleLabel}>Optional Paper</Text>
                  <Switch
                    value={isOp}
                    onValueChange={setIsOp}
                    trackColor={{ false: "#ccc", true: "#6C63FF" }}
                    thumbColor="#fff"
                  />
                </View>
              </View>

              {/* Exam Parts */}
              <View style={styles.formField}>
                <Text style={styles.formLabel}>Exam Parts *</Text>
                {parts.map((part, index) => (
                  <View key={index} style={styles.partContainer}>
                    <View style={styles.partHeader}>
                      <Text style={styles.partTitle}>Part {index + 1}</Text>
                      {parts.length > 1 && (
                        <TouchableOpacity
                          style={styles.removePartButton}
                          onPress={() => removePart(index)}
                        >
                          <Text style={styles.removePartButtonText}>✕</Text>
                        </TouchableOpacity>
                      )}
                    </View>

                    <TextInput
                      style={styles.formInput}
                      placeholder="Part title (e.g., Theory)"
                      value={part.title}
                      onChangeText={(text) => updatePart(index, "title", text)}
                    />

                    <TextInput
                      style={styles.formInput}
                      placeholder="Exam mark"
                      value={part.exam_mark}
                      onChangeText={(text) =>
                        updatePart(index, "exam_mark", text)
                      }
                      keyboardType="numeric"
                    />

                    <TextInput
                      style={styles.formInput}
                      placeholder="Pass mark"
                      value={part.exam_pass_mark}
                      onChangeText={(text) =>
                        updatePart(index, "exam_pass_mark", text)
                      }
                      keyboardType="numeric"
                    />
                  </View>
                ))}

                <TouchableOpacity
                  style={styles.addPartButton}
                  onPress={addPart}
                >
                  <Text style={styles.addPartButtonText}>
                    + Add Another Part
                  </Text>
                </TouchableOpacity>
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
                onPress={handleSaveSetup}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.modalSaveButtonText}>
                    {editingSetup ? "Update" : "Save"}
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
  loadButton: {
    backgroundColor: "#6C63FF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  loadButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
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
  pickerEmptyState: {
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  pickerEmptyText: {
    fontSize: 16,
    color: "#999",
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
  cardLabel: {
    fontSize: 12,
    color: "#999",
    fontWeight: "600",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  cardActions: {
    flexDirection: "row",
    gap: 6,
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
  cardBody: {
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    justifyContent: "space-between",
  },
  detailLabel: {
    fontSize: 13,
    color: "#666",
    fontWeight: "600",
    flex: 0.4,
  },
  detailValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
    flex: 0.6,
    textAlign: "right",
  },
  badgeLabel: {
    fontSize: 13,
    color: "#00BFA6",
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
    marginBottom: 8,
  },
  formPickerButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
  },
  formPickerButtonText: {
    fontSize: 16,
    color: "#333",
  },
  inlinePickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginTop: 8,
    maxHeight: 200,
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
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  toggleLabel: {
    fontSize: 14,
    color: "#333",
  },
  partContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#f9f9f9",
  },
  partHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  partTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  removePartButton: {
    backgroundColor: "#FF6B6B",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  removePartButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  addPartButton: {
    borderWidth: 1,
    borderColor: "#6C63FF",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginTop: 8,
  },
  addPartButtonText: {
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
});
