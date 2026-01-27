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
                title="Landlord"
                onNotificationPress={() => { }}
                onMenuPress={() => { }}
            />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.statsGrid}>
                    <Animated.View
                        entering={FadeInDown.delay(100).duration(800)}
                        style={[styles.statCard, styles.primaryStat]}
                    >
                        <View style={styles.statIconWrapper}>
                            <Ionicons name="wallet-outline" size={24} color="#FFF" />
                        </View>
                        <Text style={styles.statLabelLight}>Income (Feb)</Text>
                        <Text style={styles.statValueLight}>700,000 Frw</Text>
                    </Animated.View>

                    <Animated.View
                        entering={FadeInDown.delay(200).duration(800)}
                        style={styles.statCard}
                    >
                        <View style={styles.iconCircle}>
                            <Ionicons name="people-outline" size={20} color="#000" />
                        </View>
                        <Text style={styles.statLabel}>Tenants</Text>
                        <Text style={styles.statValue}>8 Active</Text>
                    </Animated.View>

                    <Animated.View
                        entering={FadeInDown.delay(300).duration(800)}
                        style={styles.statCard}
                    >
                        <View style={styles.iconCircle}>
                            <Ionicons name="business-outline" size={20} color="#000" />
                        </View>
                        <Text style={styles.statLabel}>Properties</Text>
                        <Text style={styles.statValue}>3 Units</Text>
                    </Animated.View>

                    <Animated.View
                        entering={FadeInDown.delay(400).duration(800)}
                        style={styles.statCard}
                    >
                        <View style={[styles.iconCircle, { backgroundColor: '#FFEEED' }]}>
                            <Ionicons name="alert-circle-outline" size={20} color="#FF3B30" />
                        </View>
                        <Text style={styles.statLabel}>Pending</Text>
                        <Text style={[styles.statValue, { color: '#FF3B30' }]}>2 Unpaid</Text>
                    </Animated.View>
                </View>

                {/* Quick Actions */}
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
        padding: 24,
        paddingBottom: 120, 
        gap: 32,
    },
    sectionTitle: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 18,
        color: '#000',
        marginBottom: 16,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        justifyContent: 'space-between',
    },
    statCard: {
        backgroundColor: '#F8F8F8',
        borderRadius: 16,
        padding: 20,
        width: '47.3%',
        gap: 12,
    },
    primaryStat: {
        backgroundColor: '#000',
        width: '100%',
        padding: 24,
        gap: 16,
    },
    statIconWrapper: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    statLabel: {
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 12,
        color: '#666',
    },
    statLabelLight: {
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 14,
        color: 'rgba(255,255,255,0.6)',
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
        borderRadius: 18,
        padding: 20,
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
        width: 52,
        height: 52,
        borderRadius: 24,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionTitle: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 16,
        color: '#000',
    },
    actionSub: {
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 12,
        color: '#999',
        marginTop: 2,
    },
});
