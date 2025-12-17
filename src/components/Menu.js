import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  SafeAreaView,
} from 'react-native';

export default function Menu({ visible, onClose, onMenuItemPress }) {
  const [expandedMenu, setExpandedMenu] = useState(null);

  const menuItems = [
    {
      id: '1',
      title: 'Dashboard',
      icon: '📊',
      color: '#6C63FF',
      submenu: null,
    },
    {
      id: '2',
      title: 'Classes',
      icon: '📚',
      color: '#00BFA6',
      submenu: null,
    },
    {
      id: '3',
      title: 'Attendance',
      icon: '✓',
      color: '#FF6B6B',
      submenu: null,
    },
    {
      id: '4',
      title: 'Messages',
      icon: '💬',
      color: '#FFA41B',
      submenu: null,
    },
    {
      id: '5',
      title: 'Reports',
      icon: '📄',
      color: '#00D4FF',
      submenu: null,
    },
    {
      id: '6',
      title: 'Settings',
      icon: '⚙️',
      color: '#9C63FF',
      submenu: [
        {
          id: '6.1',
          title: 'School Settings',
          icon: '🏫',
        },
        {
          id: '6.5',
          title: 'Academic Year',
          icon: '📆',
        },
        {
          id: '6.6',
          title: 'Branch',
          icon: '🏢',
        },
        {
          id: '6.7',
          title: 'Pickup Point',
          icon: '📍',
        },
        {
          id: '6.8',
          title: 'Grade',
          icon: '📊',
        },
        {
          id: '6.9',
          title: 'Section',
          icon: '📂',
        },
        {
          id: '6.18',
          title: 'Subject',
          icon: '📝',
        },
        {
          id: '6.10',
          title: 'RFID',
          icon: '📡',
        },
        {
          id: '6.11',
          title: 'Vehicle',
          icon: '🚌',
        },
        {
          id: '6.12',
          title: 'Event',
          icon: '🎉',
        },
        {
          id: '6.13',
          title: 'Academic Calendar',
          icon: '📅',
        },
        {
          id: '6.14',
          title: 'Caste',
          icon: '👥',
        },
        {
          id: '6.15',
          title: 'Religion',
          icon: '🙏',
        },
        {
          id: '6.16',
          title: 'Route',
          icon: '🛣️',
        },
        {
          id: '6.17',
          title: 'Scholarship',
          icon: '🎓',
        },
        {
          id: '6.19',
          title: 'Notice',
          icon: '📢',
        },
        {
          id: '6.2',
          title: 'User Preferences',
          icon: '👤',
        },
        {
          id: '6.3',
          title: 'Notifications',
          icon: '🔔',
        },
        {
          id: '6.4',
          title: 'Privacy & Security',
          icon: '🔒',
        },
        
      ],
    },
  ];

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
            <Text style={styles.submenuToggle}>
              {isExpanded ? '▼' : '▶'}
            </Text>
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
            data={menuItems}
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginTop: 60,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    flexDirection: 'column',
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuHeaderTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
    letterSpacing: 0.3,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: '#1A1A1A',
    fontWeight: '600',
  },
  menuListContent: {
    paddingVertical: 12,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginVertical: 6,
    marginHorizontal: 12,
    borderLeftWidth: 4,
    borderRadius: 12,
    backgroundColor: '#F9F9F9',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  submenuToggle: {
    fontSize: 14,
    color: '#999',
    fontWeight: '600',
  },
  submenuContainer: {
    backgroundColor: '#F5F5F5',
    marginHorizontal: 12,
    marginVertical: 6,
    borderRadius: 12,
    overflow: 'hidden',
  },
  submenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  submenuIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  submenuTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  menuFooter: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
});
