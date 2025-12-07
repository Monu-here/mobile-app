import React, { useEffect, useRef, useState } from 'react';
import { Animated, Text, View, StyleSheet, Dimensions } from 'react-native';

// Module-level handler so other modules can call showToast(message, type)
let _showHandler = null;

export function showToast(message, type = 'info', duration = 3000) {
  if (_showHandler) {
    _showHandler({ message: String(message), type, duration });
  } else {
    // If handler not mounted, fallback to console
    // eslint-disable-next-line no-console
    console.warn('Toast not mounted yet. Message:', message);
  }
}

export default function Toast() {
  const [toast, setToast] = useState({ message: '', type: 'info', duration: 3000 });
  const [visible, setVisible] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current;
  const timerRef = useRef(null);

  // Expose handler
  useEffect(() => {
    _showHandler = ({ message, type, duration }) => {
      // clear previous
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      setToast({ message, type, duration });
      setVisible(true);
      Animated.timing(opacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();

      timerRef.current = setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }).start(() => {
          setVisible(false);
        });
      }, duration || 3000);
    };

    return () => {
      _showHandler = null;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [opacity]);

  if (!visible) return null;

  const bgColor = toast.type === 'error' ? '#FDECEA' : toast.type === 'success' ? '#EDF7EC' : '#E8F0FF';
  const textColor = toast.type === 'error' ? '#C0392B' : toast.type === 'success' ? '#2E7D32' : '#0B57D0';

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[styles.container, { opacity }]}
    >
      <View style={[styles.toast, { backgroundColor: bgColor }]}>
        <Text style={[styles.message, { color: textColor }]} numberOfLines={3}>
          {toast.message}
        </Text>
      </View>
    </Animated.View>
  );
}

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  toast: {
    maxWidth: Math.min(600, width - 40),
    marginHorizontal: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 8,
  },
  message: {
    fontSize: 14,
    fontWeight: '600',
  },
});
