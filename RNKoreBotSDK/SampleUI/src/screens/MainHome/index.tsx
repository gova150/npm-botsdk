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
import {botConfig} from '../../config/BotConfig';

interface MainHomeProps {
  navigation: any;
  route: any;
}

export default function MainHome({navigation}: MainHomeProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Home</Text>
        <TouchableOpacity
          style={styles.configButton}
          onPress={() => navigation.navigate(ROUTE_NAMES.WELCOME_SCREEN)}>
          <Text style={styles.configButtonText}>⚙️ Settings</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeBadge}>ROOT APPLICATION</Text>
          <Text style={styles.welcomeTitle}>Example Host Application</Text>
          <Text style={styles.welcomeText}>
            Demonstrating dynamic internal app navigation directly from the chatbot template.
          </Text>
        </View>

        <Text style={styles.sectionHeader}>App Pages</Text>

        {/* Page 1 Card */}
        <TouchableOpacity
          style={styles.pageCard}
          activeOpacity={0.8}
          onPress={() => navigation.navigate(ROUTE_NAMES.PAGE_ONE)}>
          <View style={styles.pageCardHeader}>
            <View style={styles.iconCircle}>
              <Text style={styles.iconText}>👤</Text>
            </View>
            <View style={styles.pageCardContent}>
              <Text style={styles.pageCardTitle}>Page 1 - Profile</Text>
              <Text style={styles.pageCardDesc}>
                User profile & account details
              </Text>
              <View style={styles.urlPill}>
                <Text style={styles.urlPillText}>
                  Route: PAGE_ONE or myapp://page1
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.arrowContainer}>
            <Text style={styles.arrowText}>→</Text>
          </View>
        </TouchableOpacity>

        {/* Page 2 Card */}
        <TouchableOpacity
          style={styles.pageCard}
          activeOpacity={0.8}
          onPress={() => navigation.navigate(ROUTE_NAMES.PAGE_TWO)}>
          <View style={styles.pageCardHeader}>
            <View style={[styles.iconCircle, {backgroundColor: '#EFF6FF'}]}>
              <Text style={styles.iconText}>⚙️</Text>
            </View>
            <View style={styles.pageCardContent}>
              <Text style={styles.pageCardTitle}>Page 2 - Settings</Text>
              <Text style={styles.pageCardDesc}>
                Preferences and configuration
              </Text>
              <View style={styles.urlPill}>
                <Text style={styles.urlPillText}>
                  Route: PAGE_TWO or myapp://page2
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.arrowContainer}>
            <Text style={styles.arrowText}>→</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.sectionHeader}>SDK ChatBot</Text>

        {/* ChatBot Card */}
        <TouchableOpacity
          style={styles.chatCard}
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate(ROUTE_NAMES.HOME, {botConfig: botConfig})
          }>
          <View style={styles.chatCardHeader}>
            <View style={[styles.iconCircle, {backgroundColor: '#ECFDF5'}]}>
              <Text style={styles.iconText}>💬</Text>
            </View>
            <View style={styles.pageCardContent}>
              <Text style={styles.chatCardTitle}>Open ChatBot</Text>
              <Text style={styles.chatCardDesc}>
                Launch chat to test template action button navigation
              </Text>
            </View>
          </View>
          <View style={styles.chatButtonPill}>
            <Text style={styles.chatButtonPillText}>Launch Chat →</Text>
          </View>
        </TouchableOpacity>

        {/* Example Reference */}
        <View style={styles.refBox}>
          <Text style={styles.refTitle}>📌 Example Navigation Values for Template JSON:</Text>
          <View style={styles.refItem}>
            <Text style={styles.refItemLabel}>Page 1 Route / URL:</Text>
            <Text style={styles.refItemValue} selectable>
              PAGE_ONE (or myapp://page1)
            </Text>
          </View>
          <View style={styles.refItem}>
            <Text style={styles.refItemLabel}>Page 2 Route / URL:</Text>
            <Text style={styles.refItemValue} selectable>
              PAGE_TWO (or myapp://page2)
            </Text>
          </View>
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
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1B365D',
  },
  configButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  configButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  container: {
    padding: 16,
  },
  welcomeCard: {
    backgroundColor: '#1B365D',
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  welcomeBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: '#93C5FD',
    letterSpacing: 1,
    marginBottom: 4,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  welcomeText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: 18,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4B5563',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
    marginTop: 4,
  },
  pageCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  pageCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EFF1F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 20,
  },
  pageCardContent: {
    flex: 1,
  },
  pageCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  pageCardDesc: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  urlPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#EFF6FF',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  urlPillText: {
    fontSize: 11,
    fontFamily: 'monospace',
    color: '#1D4ED8',
    fontWeight: '600',
  },
  arrowContainer: {
    paddingLeft: 8,
  },
  arrowText: {
    fontSize: 18,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  chatCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: '#10B981',
    shadowColor: '#10B981',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  chatCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  chatCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#065F46',
    marginBottom: 2,
  },
  chatCardDesc: {
    fontSize: 12,
    color: '#4B5563',
  },
  chatButtonPill: {
    backgroundColor: '#10B981',
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: 'center',
  },
  chatButtonPillText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  refBox: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  refTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 10,
  },
  refItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  refItemLabel: {
    fontSize: 12,
    color: '#4B5563',
  },
  refItemValue: {
    fontSize: 12,
    fontFamily: 'monospace',
    fontWeight: '700',
    color: '#1B365D',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
});
