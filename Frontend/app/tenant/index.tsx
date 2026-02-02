import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, ActivityIndicator, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window');
import TopBar from '../../components/topbar';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useLanguage } from '../../context/LanguageContext';
import { TenantService } from '@/utils/tenant.service';
import { logDashboard, logDashboardSuccess, logDashboardError } from '@/utils/monitoring';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Rental {
    rentalId: string;
    propertyId: string;
    propertyDescription: string;
    propertyLocation: string;
    rentAmount: number;
    dueDay: number;
    startDate: string;
    endDate: string;
    active: boolean;
    ownerName: string;
    ownerTelephone: string;
}

interface Payment {
    paymentId: string;
    rentalId: string;
    amount: number;
    paymentMethod: string;
    status: string;
    paidDate: string;
}

export default function TenantHome() {
    const router = useRouter();
    const { t } = useLanguage();
    const [loading, setLoading] = useState(true);
    const [rental, setRental] = useState<Rental | null>(null);
    const [payments, setPayments] = useState<Payment[]>([]);
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
            logDashboard('TENANT', 'Loading dashboard data...');
            
            // Load user name - try multiple sources
            const fullName = await AsyncStorage.getItem('fullName') || '';
            const storedName = fullName.trim();
            
            if (storedName) {
                setUserName(storedName);
                logDashboard('TENANT', `User name loaded: ${storedName}`);
            } else {
                // Fallback: try to get from rental data or use default
                setUserName('Tenant');
                logDashboard('TENANT', 'User name not found in storage, using default');
            }
            
            // Load rentals and payments in parallel
            const [rentalsData, paymentsData] = await Promise.all([
                TenantService.getMyRentals(),
                TenantService.getPayments()
            ]);

            const duration = Date.now() - startTime;
            
            // Get active rental (first active rental)
            const activeRental = Array.isArray(rentalsData) && rentalsData.length > 0 
                ? rentalsData.find((r: Rental) => r.active) || rentalsData[0]
                : null;
            
            setRental(activeRental);
            setPayments(Array.isArray(paymentsData) ? paymentsData : []);
            
            logDashboardSuccess('TENANT', 'Dashboard data loaded', {
                hasRental: !!activeRental,
                paymentsCount: paymentsData.length
            }, duration);
            
        } catch (error: any) {
            const duration = Date.now() - startTime;
            logDashboardError('TENANT', 'Failed to load dashboard data', error, duration);
            console.error('Dashboard load error:', error);
        } finally {
            setLoading(false);
        }
    };

    const totalRent = rental?.rentAmount || 0;
    const currentMonthPayments = payments.filter((p: Payment) => {
        if (!p.paidDate) return false;
        const paidDate = new Date(p.paidDate);
        const now = new Date();
        return paidDate.getMonth() === now.getMonth() && 
               paidDate.getFullYear() === now.getFullYear() &&
               p.status === 'COMPLETED';
    });
    
    const paidAmount = currentMonthPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
    const remainingBalance = totalRent - paidAmount;
    
    const now = new Date();
    const dueDay = rental?.dueDay || 1;
    const isLate = now.getDate() > dueDay && remainingBalance > 0;

    let status: 'PENDING' | 'PARTIAL' | 'PAID' | 'RESTRICTED' = 'PENDING';
    if (paidAmount >= totalRent && totalRent > 0) status = 'PAID';
    else if (paidAmount > 0) status = 'PARTIAL';

    if (isLate && status !== 'PAID') status = 'RESTRICTED';

    const isPaid = status === 'PAID';
    const isRestricted = status === 'RESTRICTED';
    const isPartial = status === 'PARTIAL';
    const progress = totalRent > 0 ? (paidAmount / totalRent) : 0;

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
                title={t('tenant_dashboard')}
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
                <Animated.View entering={FadeInDown.delay(100).duration(800)} style={styles.greetingHeader}>
                    <Text style={styles.greetingText}>{t('welcome')}, {userName || 'Tenant'}</Text>
                    <Text style={styles.subGreeting}>
                        {isPaid ? "You're all set for this month!" : isRestricted ? "Access restricted. Please clear balance." : rental ? "Everything is looking good today." : "No active rental found."}
                    </Text>
                </Animated.View>


                <Animated.View entering={FadeInDown.delay(200).duration(800)}>
                    <TouchableOpacity
                        style={[styles.statusPod, isRestricted && styles.restrictedPod]}
                        onPress={() => router.push('/tenant/status')}
                        activeOpacity={0.9}
                    >
                        <View style={styles.statusLeft}>
                            <View style={[styles.statusIndicator, { backgroundColor: isPaid ? '#4CD964' : isRestricted ? '#FF3B30' : '#FFCC00' }]} />
                            <Text style={styles.statusLabel}>{t('rent_status')}</Text>
                        </View>
                        <Text style={[styles.statusValue, isRestricted && { color: '#FF3B30' }]}>{status}</Text>
                    </TouchableOpacity>
                </Animated.View>

                {/* Priority Card */}
                <Animated.View entering={FadeInDown.delay(300).duration(800)} style={[styles.card, isRestricted && styles.restrictedCard]}>
                    <View style={styles.cardInfo}>
                        <View style={styles.cardRow}>
                            <Text style={styles.cardLabel}>{isPaid ? t('last_payment') : isPartial ? t('balance_due') : t('next_payment')}</Text>
                            {isPartial && <Text style={styles.progressText}>{Math.round(progress * 100)}% Paid</Text>}
                        </View>
                        <Text style={styles.amountText}>RWF {remainingBalance.toLocaleString()}</Text>
                        <Text style={[styles.dateText, isPaid ? { color: '#4CD964' } : isRestricted ? { color: '#FF3B30' } : { color: '#FF9500' }]}>
                            {isPaid && payments.length > 0 
                                ? `Paid on ${new Date(currentMonthPayments[0].paidDate).toLocaleDateString()}`
                                : isRestricted 
                                ? 'OVERDUE - Access Limited' 
                                : rental && rental.dueDay
                                ? `Due on ${rental.dueDay} of this month`
                                : 'No payment due'}
                        </Text>

                        {(isPartial || isRestricted) && !isPaid && (
                            <View style={styles.progressBarContainer}>
                                <View style={[styles.progressBar, { width: `${progress * 100}%`, backgroundColor: isRestricted ? '#FF3B30' : '#FFF' }]} />
                            </View>
                        )}
                    </View>
                    {!isPaid && (
                        <View style={styles.buttonRow}>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.payButton]}
                                onPress={() => router.push({
                                    pathname: '/tenant/pay',
                                    params: {
                                        balance: remainingBalance.toString(),
                                        rentalId: rental?.rentalId || rental?.propertyId || '',
                                        isPartialPayment: (isPartial || isRestricted).toString()
                                    }
                                } as any)}
                            >
                                <Text style={styles.payButtonText}>{isPartial ? 'Pay Balance' : t('pay_now')}</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </Animated.View>

                {rental ? (
                <Animated.View entering={FadeInDown.delay(400).duration(800)} style={styles.propertySection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>{t('active_residence')}</Text>
                        <TouchableOpacity onPress={() => router.push('/tenant/residence' as any)}>
                            <Text style={styles.viewMoreText}>{t('view_details')}</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        style={styles.propertyCard}
                        activeOpacity={0.9}
                        onPress={() => router.push("/tenant/residence" as any)}
                    >
                        <Image
                            source={require('../../assets/images/RentifyLanding.jpg')}
                            style={styles.propertyImage}
                        />
                        <View style={styles.propertyTag}>
                            <Text style={styles.tagText}>{t('current_home')}</Text>
                        </View>
                        <View style={styles.propertyOverlay}>
                            <View style={styles.propertyMeta}>
                                    <Text style={styles.propertyTitle}>
                                        {rental.propertyDescription || 'Property'}
                                    </Text>
                                <View style={styles.locationRow}>
                                    <Ionicons name="location" size={14} color="rgba(255,255,255,0.7)" />
                                        <Text style={styles.propertyAddress}>
                                            {rental.propertyLocation || 'Location not specified'}
                                        </Text>
                                    </View>
                                </View>
                                <Ionicons name="chevron-forward" size={24} color="#FFF" />
                            </View>
                        </TouchableOpacity>
                    </Animated.View>
                ) : (
                    <Animated.View entering={FadeInDown.delay(400).duration(800)} style={styles.propertySection}>
                        <View style={[styles.propertyCard, { justifyContent: 'center', alignItems: 'center', padding: 32 }]}>
                            <Ionicons name="home-outline" size={48} color="#CCC" />
                            <Text style={{ marginTop: 16, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#888' }}>
                                No active rental
                            </Text>
                            <Text style={{ marginTop: 8, fontFamily: 'PlusJakartaSans_500Medium', color: '#AAA', textAlign: 'center' }}>
                                You don't have an active rental property yet.
                            </Text>
                        </View>
                </Animated.View>
                )}
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
        paddingBottom: 140,
        gap: 32,
    },
    greetingHeader: {
        marginTop: 8,
    },
    greetingText: {
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        fontSize: 28,
        color: '#000',
        textAlign: 'center',
    },
    subGreeting: {
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 16,
        color: '#888',
        marginTop: 6,
        textAlign: 'center'
    },
    statusPod: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F9F9F9',
        padding: 18,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    statusLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    statusIndicator: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#4CD964',
    },
    statusLabel: {
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 14,
        color: '#666',
    },
    statusValue: {
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        fontSize: 14,
        color: '#000',
        letterSpacing: 0.5,
    },
    card: {
        backgroundColor: '#000',
        borderRadius: 16,
        padding: 32,
        gap: 28,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.15,
        shadowRadius: 30,
        elevation: 10,
    },
    cardInfo: {
        gap: 12,
    },
    cardRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardLabel: {
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 14,
        color: 'rgba(255,255,255,0.5)',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    amountText: {
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        fontSize: 24,
        color: '#FFF',
    },
    dateText: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 14,
        color: '#FF3B30',
        marginTop: 4,
    },
    buttonRow: {
        flexDirection: 'row',
    },
    actionButton: {
        flex: 1,
        paddingVertical: 18,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    payButton: {
        backgroundColor: '#FFF',
    },
    payButtonText: {
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        color: '#000',
        fontSize: 15,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        fontSize: 20,
        color: '#000',
    },
    viewMoreText: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 14,
        color: '#000',
        textDecorationLine: 'underline',
    },
    propertySection: {
        marginTop: 8,
    },
    propertyCard: {
        height: 240,
        borderRadius: 32,
        overflow: 'hidden',
        position: 'relative',
    },
    propertyImage: {
        width: '100%',
        height: '100%',
    },
    propertyOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 24,
        paddingTop: 48,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    propertyTag: {
        position: 'absolute',
        top: 16,
        left: 16,
        backgroundColor: '#4CD964',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        zIndex: 10,
    },
    tagText: {
        color: '#FFF',
        fontSize: 10,
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        letterSpacing: 1,
    },
    propertyMeta: {
        gap: 6,
    },
    propertyTitle: {
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        fontSize: 22,
        color: '#FFF',
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    propertyAddress: {
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
    },
    restrictedPod: {
        borderColor: '#FF3B30',
        backgroundColor: '#FFF1F0',
    },
    restrictedCard: {
        backgroundColor: '#1A0000',
        borderColor: '#FF3B30',
        borderWidth: 1,
    },
    progressText: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 12,
        color: '#4CD964',
    },
    progressBarContainer: {
        height: 8,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 4,
        marginTop: 12,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        borderRadius: 4,
    },
    quickActions: {
        marginTop: 8,
    },
    actionGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 20,
        gap: 16,
    },
    actionItem: {
        width: (width - 48 - 16) / 2, // 2 columns
        backgroundColor: '#FAFAFA',
        padding: 24,
        borderRadius: 24,
        alignItems: 'center',
        gap: 12,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    actionIcon: {
        width: 56,
        height: 56,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionLabel: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 14,
        color: '#000',
    }
});
