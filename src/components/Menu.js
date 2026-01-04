import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  SafeAreaView,
} from "react-native";

// Permission code mapping for menu items
// Maps menu IDs to their required permission codes from backend routes
const MENU_PERMISSION_MAP = {
  // Settings Submenu Items
  6.1: "001.001", // School Settings
  6.5: "001.001", // Academic Year (view)
  6.6: "001.006", // Branch (view)
  6.7: "001.011", // Pickup Point (view)
  6.8: "001.016", // Grade (view)
  6.9: "001.020", // Section (view)
  6.18: "001.055", // Subject (view)
  "6.10": "001.025", // Vehicle (view)
  6.11: "001.025", // Vehicle (view)
  6.12: "001.040", // Event (view)
  6.13: "001.045", // Academic Calendar (view)
  6.14: "001.050", // Caste (view)
  6.15: "001.060", // Religion (view)
  6.16: "001.095", // Route (view)
  6.17: "001.075", // Scholarship (view)
  6.19: "001.065", // Notice (view)
  "6.20": "001.070", // Schedule (view)
  6.21: "001.080", // Student Category (view)
  6.22: "001.090", // Post (view)
  6.23: "001.100", // Route Pickup Point (view)
  6.24: "001.105", // Leave Type (view)
  6.25: "001.100", // Permission
  6.26: "002.000", // Staff (view)
  6.27: "002.007", // Staff Attendance (view/list)
  // Exam Submenu Items
  7.1: "003.010", // Exam Subject Schedule (view/list)
  7.2: "003.001", // Exam Type (view/list)
};

export default function Menu({
  visible,
  onClose,
  onMenuItemPress,
  userPermissions = [],
}) {
  const [expandedMenu, setExpandedMenu] = useState(null);

  const menuItems = [
    {
      id: "1",
      title: "Dashboard",
      icon: "📊",
      color: "#6C63FF",
      submenu: null,
    },
    {
      id: "6.26",
      title: "Staff",
      icon: "👨‍💼",
    },
    {
      id: "6.27",
      title: "Staff Attendance",
      icon: "👨‍💼✓",
    },
    {
      id: "7",
      title: "Exam",
      icon: "📝",
      color: "#FF6B6B",
      submenu: [
        {
          id: "7.2",
          title: "Exam Type",
          icon: "📋",
        },
        {
          id: "7.1",
          title: "Exam Schedule",
          icon: "📅",
        },
      ],
    },
    {
      id: "2",
      title: "Classes",
      icon: "📚",
      color: "#00BFA6",
      submenu: null,
    },
    {
      id: "3",
      title: "Attendance",
      icon: "✓",
      color: "#FF6B6B",
      submenu: null,
    },
    {
      id: "4",
      title: "Messages",
      icon: "💬",
      color: "#FFA41B",
      submenu: null,
    },
    {
      id: "5",
      title: "Reports",
      icon: "📄",
      color: "#00D4FF",
      submenu: null,
    },
    {
      id: "6",
      title: "Settings",
      icon: "⚙️",
      color: "#9C63FF",
      submenu: [
        {
          id: "6.1",
          title: "School Settings",
          icon: "🏫",
        },
        {
          id: "6.5",
          title: "Academic Year",
          icon: "📆",
        },
        {
          id: "6.6",
          title: "Branch",
          icon: "🏢",
        },
        {
          id: "6.7",
          title: "Pickup Point",
          icon: "📍",
        },
        {
          id: "6.8",
          title: "Grade",
          icon: "📊",
        },
        {
          id: "6.9",
          title: "Section",
          icon: "📂",
        },
        {
          id: "6.18",
          title: "Subject",
          icon: "📝",
        },
        {
          id: "6.10",
          title: "RFID",
          icon: "📡",
        },
        {
          id: "6.11",
          title: "Vehicle",
          icon: "🚌",
        },
        {
          id: "6.12",
          title: "Event",
          icon: "🎉",
        },
        {
          id: "6.13",
          title: "Academic Calendar",
          icon: "📅",
        },
        {
          id: "6.14",
          title: "Caste",
          icon: "👥",
        },
        {
          id: "6.15",
          title: "Religion",
          icon: "🙏",
        },
        {
          id: "6.16",
          title: "Route",
          icon: "🛣️",
        },
        {
          id: "6.17",
          title: "Scholarship",
          icon: "🎓",
        },
        {
          id: "6.19",
          title: "Notice",
          icon: "📢",
        },
        {
          id: "6.20",
          title: "Schedule",
          icon: "📅",
        },
        {
          id: "6.21",
          title: "Student Category",
          icon: "👥",
        },
        {
          id: "6.22",
          title: "Post",
          icon: "💼",
        },
        {
          id: "6.23",
          title: "Route Pickup Point",
          icon: "🛣️📍",
        },
        {
          id: "6.24",
          title: "Leave Type",
          icon: "📋",
        },
        {
          id: "6.25",
          title: "Permission",
          icon: "🔐",
        },
      ],
    },
  ];

  // Helper function to check if user has permission for a menu item
  const hasPermission = (menuId) => {
    // If no permissions provided, show all items (for super admin)
    if (!userPermissions || userPermissions.length === 0) {
      return true;
    }

    // Check if this menu item requires a permission
    const requiredPermission = MENU_PERMISSION_MAP[menuId];
    if (!requiredPermission) {
      // No permission required for this item, show it
      return true;
    }

    // Check if user has this permission
    return userPermissions.includes(requiredPermission);
  };

  // Get filtered submenu items based on user permissions
  const getFilteredSubmenu = (submenu) => {
    if (!submenu) return null;
    return submenu.filter((item) => hasPermission(item.id));
  };

  // Get filtered menu items based on user permissions
  const getFilteredMenuItems = () => {
    console.log("[Menu] Current user permissions:", userPermissions);

    const filtered = menuItems
      .map((item) => {
        if (item.submenu) {
          return {
            ...item,
            submenu: getFilteredSubmenu(item.submenu),
          };
        }
        return item;
      })
      .filter((item) => {
        // Only show main menu items that have permission or have visible subitems
        if (item.id === "6" && item.submenu) {
          return item.submenu.length > 0;
        }
        return hasPermission(item.id);
      });

    console.log(
      "[Menu] Filtered menu items:",
      filtered.length,
      "items visible"
    );

    return filtered;
  };

  const filteredMenuItems = getFilteredMenuItems();

  const toggleSubmenu = (id) => {
    setExpandedMenu(expandedMenu === id ? null : id);
  };

  const handleMenuItemPress = (item) => {
    if (onMenuItemPress) {
      onMenuItemPress(item);
    }
    // Don't close menu if item has submenu
    if (!item.submenu) {
      setExpandedMenu(null);
      onClose();
    }
  };

  const renderMenuItem = ({ item }) => {
    const isExpanded = expandedMenu === item.id && item.submenu;

    return (
      <View>
        <TouchableOpacity
          style={[styles.menuItem, { borderLeftColor: item.color }]}
          onPress={() => {
            if (item.submenu) {
              toggleSubmenu(item.id);
            } else {
              handleMenuItemPress(item);
            }
          }}
        >
          <View style={styles.menuItemContent}>
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <Text style={styles.menuTitle}>{item.title}</Text>
          </View>
          {item.submenu && (
            <Text style={styles.submenuToggle}>{isExpanded ? "▼" : "▶"}</Text>
          )}
        </TouchableOpacity>

        {/* Submenu Items */}
        {isExpanded && item.submenu && (
          <View style={styles.submenuContainer}>
            {item.submenu.map((subitem) => (
              <TouchableOpacity
                key={subitem.id}
                style={styles.submenuItem}
                onPress={() => handleMenuItemPress(subitem)}
              >
                <Text style={styles.submenuIcon}>{subitem.icon}</Text>
                <Text style={styles.submenuTitle}>{subitem.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.overlay}>
        <View style={styles.menuContainer}>
          {/* Menu Header */}
          <View style={styles.menuHeader}>
            <Text style={styles.menuHeaderTitle}>Menu</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Menu Items */}
          <FlatList
            data={filteredMenuItems}
            renderItem={renderMenuItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={true}
            contentContainerStyle={styles.menuListContent}
          />

          {/* Footer */}
          <View style={styles.menuFooter}>
            <Text style={styles.footerText}>School Management System</Text>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  menuContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    marginTop: 60,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    flexDirection: "column",
  },
  menuHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  menuHeaderTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1A1A1A",
    letterSpacing: 0.3,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 24,
    color: "#1A1A1A",
    fontWeight: "600",
  },
  menuListContent: {
    paddingVertical: 12,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginVertical: 6,
    marginHorizontal: 12,
    borderLeftWidth: 4,
    borderRadius: 12,
    backgroundColor: "#F9F9F9",
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  submenuToggle: {
    fontSize: 14,
    color: "#999",
    fontWeight: "600",
  },
  submenuContainer: {
    backgroundColor: "#F5F5F5",
    marginHorizontal: 12,
    marginVertical: 6,
    borderRadius: 12,
    overflow: "hidden",
  },
  submenuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEF",
  },
  submenuIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  submenuTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  menuFooter: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#999",
    fontWeight: "500",
  },
});
