import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import TopBar from '../../components/topbar';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useLanguage } from '../../context/LanguageContext';
import { LandlordService } from '@/context/landlord.service';
import { logDashboard, logDashboardSuccess, logDashboardError } from '@/utils/monitoring';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Payment {
    paymentId: string;
    rentalId: string;
    amount: number;
    paymentMethod: string;
    status: string;
    paidDate: string;
}

export default function LandlordDashboard() {
    const router = useRouter();
    const { t } = useLanguage();
    const [loading, setLoading] = useState(true);
    const [income, setIncome] = useState(0);
    const [totalTenants, setTotalTenants] = useState(0);
    const [totalProperties, setTotalProperties] = useState(0);
    const [pendingTasks, setPendingTasks] = useState(0);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        loadDashboardData();
    }, []);

    // Refresh dashboard when screen comes into focus (e.g., after profile update)
    useFocusEffect(
        useCallback(() => {
            loadDashboardData();
        }, [])
    );

    const loadDashboardData = async () => {
        const startTime = Date.now();
        setLoading(true);
        
        try {
            logDashboard('LANDLORD', 'Loading dashboard data...');
            
            // Load user name - try multiple sources
            const fullName = await AsyncStorage.getItem('fullName') || '';
            const storedName = fullName.trim();
            
            if (storedName) {
                setUserName(storedName);
                logDashboard('LANDLORD', `User name loaded: ${storedName}`);
            } else {
                // Fallback: try to get from rental data or use default
                setUserName('Landlord');
                logDashboard('LANDLORD', 'User name not found in storage, using default');
            }
            
            // Load all data in parallel
            const [propertiesData, tenantsData, paymentsData] = await Promise.all([
                LandlordService.getMyProperties(),
                LandlordService.getMyTenants(),
                LandlordService.getPayments()
            ]);

            const duration = Date.now() - startTime;
            
            // Calculate income for current month
            const now = new Date();
            const currentMonthPayments = (paymentsData || []).filter((p: Payment) => {
                if (!p.paidDate || p.status !== 'COMPLETED') return false;
                const paidDate = new Date(p.paidDate);
                return paidDate.getMonth() === now.getMonth() && 
                       paidDate.getFullYear() === now.getFullYear();
            });
            
            const monthlyIncome = currentMonthPayments.reduce((sum: number, p: Payment) => sum + (p.amount || 0), 0);
            
            // Count tenants
            const tenantsCount = Array.isArray(tenantsData) ? tenantsData.length : 0;
            
            // Count properties
            const propertiesCount = Array.isArray(propertiesData) ? propertiesData.length : 0;
            
            // Count pending/unpaid payments (simplified - could be enhanced)
            const pendingPayments = (paymentsData || []).filter((p: Payment) => 
                p.status !== 'COMPLETED'
            ).length;
            
            setIncome(monthlyIncome);
            setTotalTenants(tenantsCount);
            setTotalProperties(propertiesCount);
            setPendingTasks(pendingPayments);
            
            logDashboardSuccess('LANDLORD', 'Dashboard data loaded', {
                income: monthlyIncome,
                tenants: tenantsCount,
                properties: propertiesCount,
                pending: pendingPayments
            }, duration);
            
        } catch (error: any) {
            const duration = Date.now() - startTime;
            logDashboardError('LANDLORD', 'Failed to load dashboard data', error, duration);
            console.error('Dashboard load error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#000" />
                <Text style={{ marginTop: 16, fontFamily: 'PlusJakartaSans_500Medium', color: '#888' }}>
                    Loading dashboard...
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TopBar
                title={t('landlord_dashboard')}
                onNotificationPress={() => router.push('/notifications')}
                onMenuPress={() => router.push('/settings')}
            />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={loadDashboardData} />
                }
            >
                <Animated.View entering={FadeInDown.delay(100).duration(800)} style={styles.header}>
                    <Text style={styles.greeting}>{t('welcome_name')}, {userName || 'Landlord'}</Text>
                    <Text style={styles.subGreeting}>{t('manage_properties_subtitle')}</Text>
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
                            <Text style={styles.statLabelLight}>{t('income_this_month')}</Text>
                            <Text style={styles.statValueLight}>
                                {income.toLocaleString('en-US')} Frw
                            </Text>
                        </View>
                        <TouchableOpacity style={styles.statActionLight} onPress={() => { }}>
                            <Text style={styles.statActionTextLight}>{t('view_details')}</Text>
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
                        <Text style={styles.statLabel}>{t('total_tenants')}</Text>
                        <Text style={styles.statValue}>{totalTenants} {t('active')}</Text>
                    </Animated.View>

                    <Animated.View
                        entering={FadeInDown.delay(400).duration(800)}
                        style={styles.statCard}
                    >
                        <View style={[styles.iconCircle, { backgroundColor: '#F0FFF4' }]}>
                            <Ionicons name="business" size={20} color="#34C759" />
                        </View>
                        <Text style={styles.statLabel}>{t('properties')}</Text>
                        <Text style={styles.statValue}>{totalProperties} {t('units')}</Text>
                    </Animated.View>

                    <Animated.View
                        entering={FadeInDown.delay(500).duration(800)}
                        style={styles.statCard}
                    >
                        <View style={[styles.iconCircle, { backgroundColor: '#FFEEED' }]}>
                            <Ionicons name="alert-circle" size={20} color="#FF3B30" />
                        </View>
                        <Text style={styles.statLabel}>{t('pending_tasks')}</Text>
                        <Text style={[styles.statValue, { color: '#FF3B30' }]}>{pendingTasks} {t('unpaid')}</Text>
                    </Animated.View>
                </View>

                <Animated.View entering={FadeInUp.delay(500).duration(800)}>
                    <Text style={styles.sectionTitle}>{t('quick_actions')}</Text>

                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => router.push('/landlord/properties')}
                    >
                        <View style={styles.actionIcon}>
                            <Ionicons name="add" size={24} color="#FFF" />
                        </View>
                        <View style={styles.actionContent}>
                            <Text style={styles.actionTitle}>{t('add_property')}</Text>
                            <Text style={styles.actionSub}>{t('list_new_unit')}</Text>
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
                            <Text style={styles.actionTitle}>{t('view_tenants')}</Text>
                            <Text style={styles.actionSub}>{t('check_status_payments')}</Text>
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
        fontSize: 14,
        color: '#888',
        marginTop: 6,
        textAlign: 'center',
    },
    sectionTitle: {
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        fontSize: 18,
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
        borderRadius: 16,
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
        borderRadius: 16,
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
