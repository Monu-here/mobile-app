import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator, ScrollView, Image, Platform } from 'react-native';
import apiService from '../api/apiService';

export default function SettingsListScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const resp = await apiService.getSchoolSettings();
        if (!mounted) return;
        setSettings(resp.data || resp.raw || null);
      } catch (err) {
        if (!mounted) return;
        setError(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const renderCard = (d) => {
    const data = d || {};
    return (
      <View style={styles.card}>
        {data.logo ? (
          <Image source={{ uri: `${apiService.baseURL.replace('/api','')}/storage/${data.logo}` }} style={styles.logo} />
        ) : null}
        <View style={styles.cardContent}>
          <Text style={styles.name}>{data.name || 'School'}</Text>
          {data.address ? <Text style={styles.small}>{data.address}</Text> : null}
          {data.phone_number ? <Text style={styles.small}>Phone: {data.phone_number}</Text> : null}
          {data.email ? <Text style={styles.small}>Email: {data.email}</Text> : null}
          {data.academic_year_id ? <Text style={styles.small}>Academic Year: {data.academic_year_id}</Text> : null}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.errorText}>Failed to load settings</Text>
          <Text style={styles.debugText}>{JSON.stringify(error, null, 2)}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const items = Array.isArray(settings) ? settings : [settings];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {items.map((it, idx) => (
          <View key={idx} style={styles.itemWrapper}>{renderCard(it)}</View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  scroll: { padding: 16 },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    flexDirection: 'row',
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  itemWrapper: { marginBottom: 12 },
  logo: { width: 80, height: 80, borderRadius: 8, marginRight: 12 },
  cardContent: { flex: 1, justifyContent: 'center' },
  name: { fontSize: 16, fontWeight: '700', color: '#1A1A1A' },
  small: { fontSize: 13, color: '#555', marginTop: 4 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { color: '#FF6B6B', fontWeight: '700', marginBottom: 8 },
  debugText: { fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', fontSize: 11, color: '#333' },
});
