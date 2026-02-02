import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import TopBar from '../../components/topbar';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useLanguage } from '../../context/LanguageContext';
import { TenantService } from '@/utils/tenant.service';
import { logDashboard, logDashboardSuccess, logDashboardError } from '@/utils/monitoring';

interface Payment {
    paymentId: string;
    rentalId: string;
    amount: number;
    paymentMethod: string;
    status: string;
    paidDate: string;
    ownerName: string;
    tenantName: string;
}

export default function PaymentHistory() {
    const router = useRouter();
    const { t } = useLanguage();
    const [loading, setLoading] = useState(true);
    const [payments, setPayments] = useState<Payment[]>([]);

    useEffect(() => {
        loadPaymentHistory();
    }, []);

    const loadPaymentHistory = async () => {
        const startTime = Date.now();
        setLoading(true);
        
        try {
            logDashboard('TENANT', 'Loading payment history...');
            
            const paymentsData = await TenantService.getPayments();
            setPayments(Array.isArray(paymentsData) ? paymentsData : []);
            
            const duration = Date.now() - startTime;
            logDashboardSuccess('TENANT', 'Payment history loaded', { count: paymentsData.length }, duration);
        } catch (error: any) {
            const duration = Date.now() - startTime;
            logDashboardError('TENANT', 'Failed to load payment history', error, duration);
        } finally {
            setLoading(false);
        }
    };

    // Group payments by month
    const groupedPayments = payments.reduce((acc: any, payment: Payment) => {
        if (!payment.paidDate) return acc;
        const date = new Date(payment.paidDate);
        const monthKey = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        
        if (!acc[monthKey]) {
            acc[monthKey] = {
                month: monthKey,
                date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                payments: [],
                total: 0,
                paid: 0
            };
        }
        
        acc[monthKey].payments.push(payment);
        acc[monthKey].total += payment.amount || 0;
        if (payment.status === 'COMPLETED') {
            acc[monthKey].paid += payment.amount || 0;
        }
        
        return acc;
    }, {});

    const history = Object.values(groupedPayments).map((group: any) => {
        // Estimate total rent from first payment (could be improved)
        const estimatedRent = group.payments[0]?.amount || 0;
        const totalRent = estimatedRent; // Simplified - in real app, get from rental
        const balance = totalRent - group.paid;
        
        return {
            id: group.month,
            month: group.month,
            date: group.date,
            total: totalRent,
            paid: group.paid,
            balance: balance,
            status: group.paid >= totalRent ? 'PAID' : group.paid > 0 ? 'PARTIAL' : 'PENDING'
        };
    }).reverse(); // Most recent first

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#000" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TopBar title={t('payment_history')} showBack />

            <ScrollView 
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={loadPaymentHistory} />
                }
            >
                {history.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="receipt-outline" size={48} color="#CCC" />
                        <Text style={styles.emptyText}>No payment history found</Text>
                    </View>
                ) : (
                    history.map((item, index) => (
                    <Animated.View
                        key={item.id}
                        entering={FadeInDown.delay(index * 100).duration(600)}
                        style={styles.historyItem}
                    >
                        <View style={styles.topRow}>
                            <View style={styles.details}>
                                <Text style={styles.month}>{item.month}</Text>
                                <Text style={styles.date}>{item.date}</Text>
                            </View>
                            <View style={[styles.statusBadge, { backgroundColor: item.status === 'PAID' ? '#E8FAEF' : item.status === 'PARTIAL' ? '#FFF9E6' : '#FFF1F0' }]}>
                                <Text style={[styles.statusText, { color: item.status === 'PAID' ? '#4CD964' : item.status === 'PARTIAL' ? '#FFCC00' : '#FF3B30' }]}>{item.status}</Text>
                            </View>
                        </View>

                        <View style={styles.breakdown}>
                            <View style={styles.breakdownItem}>
                                <Text style={styles.breakdownLabel}>{t('total_rent')}</Text>
                                <Text style={styles.breakdownValue}>RWF {item.total.toLocaleString()}</Text>
                            </View>
                            <View style={styles.breakdownItem}>
                                <Text style={styles.breakdownLabel}>{t('paid')}</Text>
                                <Text style={[styles.breakdownValue, { color: '#4CD964' }]}>RWF {item.paid.toLocaleString()}</Text>
                            </View>
                            <View style={styles.breakdownItem}>
                                <Text style={styles.breakdownLabel}>{t('balance')}</Text>
                                <Text style={[styles.breakdownValue, { color: item.balance > 0 ? '#FF3B30' : '#888' }]}>RWF {item.balance.toLocaleString()}</Text>
                            </View>
                        </View>
                    </Animated.View>
                    ))
                )}
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
        padding: 20,
        paddingBottom: 140,
        gap: 16,
    },
    historyItem: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 20,
        gap: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    details: {
        flex: 1,
    },
    month: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 18,
        color: '#000',
    },
    date: {
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 14,
        color: '#888',
        marginTop: 4,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    statusText: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 12,
    },
    breakdown: {
        flexDirection: 'row',
        backgroundColor: '#F9F9F9',
        padding: 16,
        borderRadius: 16,
        justifyContent: 'space-between',
    },
    breakdownItem: {
        alignItems: 'flex-start',
    },
    breakdownLabel: {
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 12,
        color: '#888',
        marginBottom: 4,
    },
    breakdownValue: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 14,
        color: '#000',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        gap: 16,
    },
    emptyText: {
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 16,
        color: '#94A3B8',
    },
});
