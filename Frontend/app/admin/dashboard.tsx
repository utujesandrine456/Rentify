import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import TopBar from '../../components/topbar';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';

export default function AdminDashboard() {
    const router = useRouter();

    const disputes = [
        { id: '#DSP-2024-001', user: 'Sarah M.', status: 'PENDING', desc: 'Claims payment error on MTN MoMo' },
    ];

    return (
        <View style={styles.container}>
            <TopBar title="Admin Panel" />

            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* Stats */}
                <View style={styles.statsRow}>
                    <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.statCard}>
                        <Text style={styles.statLabel}>Active Users</Text>
                        <Text style={styles.statValue}>1,240</Text>
                    </Animated.View>
                    <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.statCard}>
                        <Text style={styles.statLabel}>Restricted</Text>
                        <Text style={[styles.statValue, { color: '#FF3B30' }]}>12</Text>
                    </Animated.View>
                </View>

                <Text style={styles.sectionTitle}>Open Disputes</Text>

                {disputes.map((d) => (
                    <View key={d.id} style={styles.disputeCard}>
                        <View style={styles.disputeHeader}>
                            <Text style={styles.disputeId}>{d.id}</Text>
                            <View style={[styles.badge, { backgroundColor: '#FFCC00' }]}>
                                <Text style={styles.badgeText}>{d.status}</Text>
                            </View>
                        </View>
                        <Text style={styles.disputeUser}>Opened by: {d.user}</Text>
                        <Text style={styles.disputeDesc}>{d.desc}</Text>

                        <View style={styles.actions}>
                            <TouchableOpacity style={[styles.actionBtn, styles.resolveBtn]}>
                                <Text style={styles.resolveText}>Review Proof</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.actionBtn, styles.approveBtn]}>
                                <Text style={styles.approveText}>Resolve</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}

                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={() => router.replace('/')}
                >
                    <Text style={styles.logoutText}>Exit Admin Panel</Text>
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F7F7',
    },
    scrollContent: {
        padding: 24,
        gap: 24,
    },
    statsRow: {
        flexDirection: 'row',
        gap: 16,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#FFF',
        padding: 20,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    statLabel: {
        fontFamily: 'PlusJakartaSans_400Regular',
        fontSize: 12,
        color: '#888',
        marginBottom: 4,
    },
    statValue: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 24,
        color: '#000',
    },
    sectionTitle: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 20,
        color: '#000',
    },
    disputeCard: {
        backgroundColor: '#FFF',
        padding: 20,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    disputeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    disputeId: {
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 14,
        color: '#000',
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    badgeText: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 10,
        color: '#FFF',
    },
    disputeUser: {
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 14,
        color: '#333',
        marginBottom: 4,
    },
    disputeDesc: {
        fontFamily: 'PlusJakartaSans_400Regular',
        fontSize: 13,
        color: '#666',
        lineHeight: 18,
        marginBottom: 20,
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
    },
    actionBtn: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    resolveBtn: {
        borderWidth: 1,
        borderColor: '#000',
    },
    resolveText: {
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 12,
    },
    approveBtn: {
        backgroundColor: '#000',
    },
    approveText: {
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 12,
        color: '#FFF',
    },
    logoutButton: {
        marginTop: 20,
        padding: 16,
        alignItems: 'center',
    },
    logoutText: {
        fontFamily: 'PlusJakartaSans_500Medium',
        color: '#FF3B30',
    }
});
