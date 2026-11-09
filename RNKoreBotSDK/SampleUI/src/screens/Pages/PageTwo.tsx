import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {ROUTE_NAMES} from '../../navigation/RouteNames';

interface PageTwoProps {
  navigation: any;
  route: any;
}

export default function PageTwo({navigation, route}: PageTwoProps) {
  const itemData = route?.params?.data || route?.params?.item;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.navigate(ROUTE_NAMES.MAIN_HOME);
            }
          }}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Page 2 - Settings</Text>
        <View style={{width: 50}} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.banner}>
          <Text style={styles.bannerBadge}>NAVIGATION TEST SUCCESS</Text>
          <Text style={styles.bannerTitle}>
            Navigated via Internal App Navigation!
          </Text>
          <Text style={styles.bannerText}>
            Target: Page 2 (route: PAGE_TWO or URL: myapp://page2)
          </Text>
        </View>

        {/* Settings Card Preview */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Application Preferences</Text>
          <Text style={styles.cardSubtitle}>
            Account settings and configurations
          </Text>

          <View style={styles.row}>
            <Text style={styles.label}>Push Notifications</Text>
            <Text style={styles.value}>Enabled</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>Theme Mode</Text>
            <Text style={styles.value}>Light</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>Language</Text>
            <Text style={styles.value}>English (US)</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>App Version</Text>
            <Text style={styles.value}>v1.0.0</Text>
          </View>
        </View>

        {itemData ? (
          <View style={styles.metaBox}>
            <Text style={styles.metaTitle}>Received Action Data:</Text>
            <Text style={styles.metaContent}>
              {JSON.stringify(itemData, null, 2)}
            </Text>
          </View>
        ) : null}

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.chatButton}
            onPress={() => navigation.navigate(ROUTE_NAMES.HOME)}>
            <Text style={styles.chatButtonText}>💬 Back to ChatBot</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => navigation.navigate(ROUTE_NAMES.MAIN_HOME)}>
            <Text style={styles.homeButtonText}>🏠 Go to Homepage</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#EFF1F5',
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1B365D',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  container: {
    padding: 16,
  },
  banner: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  bannerBadge: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1D4ED8',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  bannerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E3A8A',
    marginBottom: 2,
  },
  bannerText: {
    fontSize: 13,
    color: '#2563EB',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  label: {
    fontSize: 14,
    color: '#374151',
  },
  value: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1B365D',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },
  metaBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
  },
  metaTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 4,
  },
  metaContent: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'monospace',
  },
  actionRow: {
    gap: 10,
  },
  chatButton: {
    backgroundColor: '#1B365D',
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 8,
  },
  chatButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  homeButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#1B365D',
    borderWidth: 1.5,
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
  },
  homeButtonText: {
    color: '#1B365D',
    fontSize: 15,
    fontWeight: '700',
  },
});
