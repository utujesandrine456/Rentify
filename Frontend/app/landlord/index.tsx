import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import TopBar from '../../components/topbar';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useRouter } from 'expo-router';

export default function LandlordDashboard() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <TopBar
                title="Landlord Dashboard"
                onNotificationPress={() => router.push('/notifications')}
                onMenuPress={() => router.push('/settings')}
            />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Animated.View entering={FadeInDown.delay(100).duration(800)} style={styles.header}>
                    <Text style={styles.greeting}>Hello, Landlord</Text>
                    <Text style={styles.subGreeting}>Manage your properties and tenants with ease.</Text>
                </Animated.View>

                <View style={styles.statsGrid}>
                    <Animated.View
                        entering={FadeInDown.delay(200).duration(800)}
                        style={[styles.statCard, styles.primaryStat]}
                    >
                        <View style={styles.statIconWrapper}>
                            <Ionicons name="wallet" size={24} color="#FFF" />
                        </View>
                        <View>
                            <Text style={styles.statLabelLight}>Income (This Month)</Text>
                            <Text style={styles.statValueLight}>700,000 Frw</Text>
                        </View>
                        <TouchableOpacity style={styles.statActionLight} onPress={() => { }}>
                            <Text style={styles.statActionTextLight}>View Details</Text>
                            <Ionicons name="arrow-forward" size={14} color="#FFF" />
                        </TouchableOpacity>
                    </Animated.View>

                    <Animated.View
                        entering={FadeInDown.delay(300).duration(800)}
                        style={styles.statCard}
                    >
                        <View style={[styles.iconCircle, { backgroundColor: '#F0F7FF' }]}>
                            <Ionicons name="people" size={20} color="#007AFF" />
                        </View>
                        <Text style={styles.statLabel}>Total Tenants</Text>
                        <Text style={styles.statValue}>8 Active</Text>
                    </Animated.View>

                    <Animated.View
                        entering={FadeInDown.delay(400).duration(800)}
                        style={styles.statCard}
                    >
                        <View style={[styles.iconCircle, { backgroundColor: '#F0FFF4' }]}>
                            <Ionicons name="business" size={20} color="#34C759" />
                        </View>
                        <Text style={styles.statLabel}>Properties</Text>
                        <Text style={styles.statValue}>3 Units</Text>
                    </Animated.View>

                    <Animated.View
                        entering={FadeInDown.delay(500).duration(800)}
                        style={styles.statCard}
                    >
                        <View style={[styles.iconCircle, { backgroundColor: '#FFEEED' }]}>
                            <Ionicons name="alert-circle" size={20} color="#FF3B30" />
                        </View>
                        <Text style={styles.statLabel}>Pending Tasks</Text>
                        <Text style={[styles.statValue, { color: '#FF3B30' }]}>2 Unpaid</Text>
                    </Animated.View>
                </View>

                <Animated.View entering={FadeInUp.delay(500).duration(800)}>
                    <Text style={styles.sectionTitle}>Quick Actions</Text>

                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => router.push('/landlord/properties')}
                    >
                        <View style={styles.actionIcon}>
                            <Ionicons name="add" size={24} color="#FFF" />
                        </View>
                        <View style={styles.actionContent}>
                            <Text style={styles.actionTitle}>Add Property</Text>
                            <Text style={styles.actionSub}>List a new unit for rent</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#EEE" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionButton, { marginTop: 16 }]}
                        onPress={() => router.push('/landlord/tenants')}
                    >
                        <View style={[styles.actionIcon, { backgroundColor: '#111' }]}>
                            <Ionicons name="search" size={20} color="#FFF" />
                        </View>
                        <View style={styles.actionContent}>
                            <Text style={styles.actionTitle}>View Tenants</Text>
                            <Text style={styles.actionSub}>Check status & payments</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#EEE" />
                    </TouchableOpacity>
                </Animated.View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 120,
        gap: 32,
    },
    header: {
        marginBottom: 0,
    },
    greeting: {
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        fontSize: 32,
        color: '#000',
        textAlign: 'center',
    },
    subGreeting: {
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 16,
        color: '#888',
        marginTop: 6,
        textAlign: 'center',
    },
    sectionTitle: {
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        fontSize: 20,
        color: '#000',
        marginBottom: 16,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        justifyContent: 'space-between',
    },
    statCard: {
        backgroundColor: '#FAFAFA',
        borderRadius: 16,
        padding: 16,
        width: '48%',
        gap: 12,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        marginBottom: 16
    },
    primaryStat: {
        backgroundColor: '#000',
        width: '100%',
        padding: 24,
        gap: 16,
        borderRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 5,
    },
    statIconWrapper: {
        width: 36,
        height: 36,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    statActionLight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.1)',
    },
    statActionTextLight: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 12,
        color: '#FFF',
    },
    iconCircle: {
        width: 36,
        height: 36,
        borderRadius: 12,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    statLabel: {
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 12,
        color: '#888',
    },
    statLabelLight: {
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 12,
        color: 'rgba(255,255,255,0.5)',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    statValue: {
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        fontSize: 18,
        color: '#000',
    },
    statValueLight: {
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        fontSize: 24,
        color: '#FFF',
    },
    actionButton: {
        backgroundColor: '#FAFAFA',
        borderRadius: 24,
        padding: 24,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    actionContent: {
        flex: 1,
        marginLeft: 16,
    },
    actionIcon: {
        width: 56,
        height: 56,
        borderRadius: 18,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionTitle: {
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        fontSize: 18,
        color: '#000',
    },
    actionSub: {
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 14,
        color: '#888',
        marginTop: 4,
    },
});
