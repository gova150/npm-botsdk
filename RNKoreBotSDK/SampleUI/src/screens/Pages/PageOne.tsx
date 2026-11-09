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

interface PageOneProps {
  navigation: any;
  route: any;
}

export default function PageOne({navigation, route}: PageOneProps) {
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
        <Text style={styles.headerTitle}>Page 1 - Profile</Text>
        <View style={{width: 50}} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.banner}>
          <Text style={styles.bannerBadge}>NAVIGATION TEST SUCCESS</Text>
          <Text style={styles.bannerTitle}>
            Navigated via Internal App Navigation!
          </Text>
          <Text style={styles.bannerText}>
            Target: Page 1 (route: PAGE_ONE or URL: myapp://page1)
          </Text>
        </View>

        {/* Profile Card Preview */}
        <View style={styles.profileCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardNetwork}>Example User Profile</Text>
            <Text style={styles.statusBadge}>ACTIVE</Text>
          </View>

          <View style={styles.cardBody}>
            <Text style={styles.fieldLabel}>USER NAME</Text>
            <Text style={styles.fieldValuePrimary}>Alex Johnson</Text>

            <View style={styles.cardRow}>
              <View style={styles.cardCol}>
                <Text style={styles.fieldLabel}>ACCOUNT ID</Text>
                <Text style={styles.fieldValue}>ACC-1029384</Text>
              </View>
              <View style={styles.cardCol}>
                <Text style={styles.fieldLabel}>TIER</Text>
                <Text style={styles.fieldValue}>Premium Member</Text>
              </View>
            </View>

            <View style={styles.cardRow}>
              <View style={styles.cardCol}>
                <Text style={styles.fieldLabel}>EMAIL</Text>
                <Text style={styles.fieldValue}>alex.johnson@example.com</Text>
              </View>
            </View>
          </View>

          <View style={styles.cardFooter}>
            <Text style={styles.footerNote}>
              Opened directly from chatbot action button
            </Text>
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
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  bannerBadge: {
    fontSize: 11,
    fontWeight: '800',
    color: '#065F46',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  bannerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#064E3B',
    marginBottom: 2,
  },
  bannerText: {
    fontSize: 13,
    color: '#047857',
  },
  profileCard: {
    backgroundColor: '#1B365D',
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
    paddingBottom: 10,
  },
  cardNetwork: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  statusBadge: {
    backgroundColor: '#10B981',
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 6,
    overflow: 'hidden',
  },
  cardBody: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  fieldValuePrimary: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cardCol: {
    flex: 1,
  },
  fieldValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    paddingTop: 8,
    marginTop: 4,
  },
  footerNote: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
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
