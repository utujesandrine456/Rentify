import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, TextInput, Alert } from 'react-native';
import TopBar from '../../components/topbar';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useLanguage } from '../../context/LanguageContext';
import { apiRequest } from '@/utils/api';
import { TenantService } from '@/utils/tenant.service';
import { logDashboard, logDashboardSuccess, logDashboardError } from '@/utils/monitoring';

export default function PayRent() {
    const router = useRouter();
    const { balance, rentalId, isPartialPayment } = useLocalSearchParams();
    const { t } = useLanguage();

    const initialAmount = balance ? balance.toString() : '0';
    const isReturningForBalance = isPartialPayment === 'true';
    const rentalIdParam = rentalId as string;

    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);
    const [paymentType, setPaymentType] = useState<'full' | 'partial'>('full');
    const [customAmount, setCustomAmount] = useState(initialAmount);
    const [paidAmount, setPaidAmount] = useState('');
    const [paymentId, setPaymentId] = useState('');
    const [rentalData, setRentalData] = useState<any>(null);
    const [actualPayments, setActualPayments] = useState<any[]>([]);
    const [calculatedBalance, setCalculatedBalance] = useState(0);

    useEffect(() => {
        if (rentalIdParam) {
            loadRentalData();
        } else {
            loadRentalData();
        }
    }, [rentalIdParam]);

    const loadRentalData = async () => {
        const startTime = Date.now();
        setLoading(true);
        
        try {
            logDashboard('TENANT', 'Loading rental and payment data for payment page...');
            
            // Load rentals and payments
            const [rentalsData, paymentsData] = await Promise.all([
                TenantService.getMyRentals(),
                TenantService.getPayments()
            ]);

            // Find the rental
            let rental = null;
            if (rentalIdParam) {
                rental = rentalsData.find((r: any) => 
                    r.rentalId === rentalIdParam || 
                    r.rentalId?.toString() === rentalIdParam ||
                    r.propertyId === rentalIdParam
                );
            } else if (rentalsData.length > 0) {
                // Get first active rental if no ID provided
                rental = rentalsData.find((r: any) => r.active) || rentalsData[0];
            }

            if (rental) {
                setRentalData(rental);
                
                // Get payments for this rental
                const rentalPayments = paymentsData.filter((p: any) => 
                    p.rentalId === rental.rentalId || 
                    p.rentalId?.toString() === rental.rentalId?.toString()
                );

                setActualPayments(rentalPayments);

                // Calculate actual balance from real payments
                const now = new Date();
                const currentMonthPayments = rentalPayments.filter((p: any) => {
                    if (!p.paidDate || p.status !== 'COMPLETED') return false;
                    const paidDate = new Date(p.paidDate);
                    return paidDate.getMonth() === now.getMonth() && 
                           paidDate.getFullYear() === now.getFullYear();
                });

                const totalPaid = currentMonthPayments.reduce((sum: number, p: any) => sum + (p.amount || 0), 0);
                const rentAmount = rental.rentAmount || 0;
                const actualBalance = rentAmount - totalPaid;

                setCalculatedBalance(actualBalance);
                
                // Update custom amount if balance changed
                if (actualBalance > 0 && actualBalance !== parseFloat(initialAmount)) {
                    setCustomAmount(actualBalance.toString());
                }

                const duration = Date.now() - startTime;
                logDashboardSuccess('TENANT', 'Payment data loaded', {
                    rentalId: rental.rentalId,
                    rentAmount,
                    totalPaid,
                    actualBalance,
                    paymentsCount: rentalPayments.length
                }, duration);
            } else {
                logDashboardError('TENANT', 'No rental found', new Error('Rental not found'), Date.now() - startTime);
            }
        } catch (error: any) {
            const duration = Date.now() - startTime;
            logDashboardError('TENANT', 'Failed to load rental data', error, duration);
            console.error('Failed to load rental data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = async (method: 'MOBILE_MONEY_MTN' | 'MOBILE_MONEY_AIRTEL') => {
        if (!rentalData || !rentalData.rentalId) {
            Alert.alert('Error', 'Rental information is missing. Please try again.');
            await loadRentalData();
            return;
        }

        const actualBalance = calculatedBalance > 0 ? calculatedBalance : parseFloat(initialAmount);
        
        if (actualBalance <= 0) {
            Alert.alert('Already Paid', 'You have no outstanding balance for this rental.');
            return;
        }

        setProcessing(true);
        const amount = paymentType === 'full' ? actualBalance : parseFloat(customAmount);
        
        if (amount <= 0 || amount > actualBalance) {
            Alert.alert('Invalid Amount', `Please enter an amount between 1 and ${actualBalance.toLocaleString()} Frw`);
            setProcessing(false);
            return;
        }

        setPaidAmount(amount.toString());

        const startTime = Date.now();

        try {
            logDashboard('TENANT', `Processing payment: ${method}`, { 
                amount, 
                rentalId: rentalData.rentalId,
                rentalAmount: rentalData.rentAmount,
                currentBalance: actualBalance
            });

            const response = await apiRequest('/payments/simulate', 'POST', {
                rentalId: rentalData.rentalId,
                amount: amount,
                paymentMethod: method
            });

            const duration = Date.now() - startTime;
            logDashboardSuccess('TENANT', 'Payment processed successfully', { 
                paymentId: response.id || response.paymentId,
                amount,
                method,
                rentalId: rentalData.rentalId
            }, duration);

            setPaymentId(response.id || response.paymentId || 'TXN-' + Date.now());
            setProcessing(false);
            setSuccess(true);
        } catch (error: any) {
            const duration = Date.now() - startTime;
            logDashboardError('TENANT', 'Payment failed', error, duration);
            setProcessing(false);
            Alert.alert('Payment Failed', error.message || 'Failed to process payment. Please try again.');
        }
    };

    if (success) {
        return (
            <View style={styles.successContainer}>
                <Animated.View entering={FadeInDown.springify()} style={styles.successCard}>
                    <View style={styles.successIcon}>
                        <Ionicons name="checkmark" size={40} color="#FFF" />
                    </View>
                    <Text style={styles.successTitle}>{t('payment_successful')}</Text>
                    <Text style={styles.statusBadge}>Status: COMPLETED</Text>
                    <Text style={styles.successText}>You have successfully paid RWF {parseInt(paidAmount).toLocaleString()} for {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} rent.</Text>
                    <Text style={styles.receiptText}>Receipt ID: #{paymentId}</Text>

                    <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={() => router.replace('/tenant/history')}
                    >
                        <Text style={styles.primaryButtonText}>{t('view_history')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={() => router.replace({
                            pathname: '/tenant',
                            params: { paidAmount: totalPaid.toString() }
                        })}
                    >
                        <Text style={styles.secondaryButtonText}>{t('back_home')}</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        );
    }

    // Check if already paid based on actual payments
    const isAlreadyPaid = calculatedBalance <= 0 && rentalData && actualPayments.length > 0;

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#000" />
                <Text style={{ marginTop: 16, fontFamily: 'PlusJakartaSans_500Medium', color: '#888' }}>
                    Loading payment information...
                </Text>
            </View>
        );
    }

    if (isAlreadyPaid && !success) {
        return (
            <View style={styles.container}>
                <TopBar title={t('all_settled')} showBack onBackPress={() => router.back()} />
                <View style={[styles.successContainer, { backgroundColor: '#F7F7F7' }]}>
                    <Animated.View entering={FadeInDown.springify()} style={styles.successCard}>
                        <View style={styles.successIcon}>
                            <Ionicons name="checkmark-done-circle" size={40} color="#FFF" />
                        </View>
                        <Text style={styles.successTitle}>{t('all_settled')}</Text>
                        <Text style={styles.successText}>
                            {t('all_paid_msg')} You have no outstanding balance for {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}.
                        </Text>

                        <TouchableOpacity
                            style={styles.primaryButton}
                            onPress={() => router.replace('/tenant/history')}
                        >
                            <Text style={styles.primaryButtonText}>{t('view_history')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.secondaryButton}
                            onPress={() => router.replace('/tenant')}
                        >
                            <Text style={styles.secondaryButtonText}>{t('back_home')}</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TopBar
                title={t('pay_rent')}
                showBack={true}
                onBackPress={() => router.back()}
            />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.billCard}>
                    <Text style={styles.label}>{isReturningForBalance ? t('remaining_balance') : t('total_amount_due')}</Text>
                    <Text style={styles.amount}>
                        {calculatedBalance > 0 ? calculatedBalance.toLocaleString() : parseInt(initialAmount).toLocaleString()} Frw
                    </Text>
                    {actualPayments.length > 0 && (
                        <View style={styles.prevPaymentRow}>
                            <Text style={styles.prevLabel}>
                                {t('previously_paid')}: {actualPayments
                                    .filter((p: any) => p.status === 'COMPLETED')
                                    .reduce((sum: number, p: any) => sum + (p.amount || 0), 0)
                                    .toLocaleString()} Frw
                            </Text>
                        </View>
                    )}
                    <View style={styles.row}>
                        <Text style={styles.rowLabel}>{t('landlord')}</Text>
                        <Text style={styles.rowValue}>{rentalData?.ownerName || 'N/A'}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.rowLabel}>{t('property')}</Text>
                        <Text style={styles.rowValue}>{rentalData?.propertyDescription || 'N/A'}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.rowLabel}>{t('month')}</Text>
                        <Text style={styles.rowValue}>{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</Text>
                    </View>
                </View>

                <View style={styles.selectionSection}>
                    <Text style={styles.sectionTitle}>{t('payment_type')}</Text>
                    <View style={styles.typeRow}>
                        <TouchableOpacity
                            style={[styles.typeBtn, paymentType === 'full' && styles.typeBtnActive]}
                            onPress={() => setPaymentType('full')}
                        >
                            <Text style={[styles.typeBtnText, paymentType === 'full' && styles.typeBtnTextActive]}>{t('full_payment')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.typeBtn, paymentType === 'partial' && styles.typeBtnActive]}
                            onPress={() => setPaymentType('partial')}
                        >
                            <Text style={[styles.typeBtnText, paymentType === 'partial' && styles.typeBtnTextActive]}>{t('partial_payment')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {paymentType === 'partial' && (
                    <Animated.View entering={FadeInDown} style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>{t('enter_amount')} (Frw)</Text>
                        <TextInput
                            style={styles.textInput}
                            value={customAmount}
                            onChangeText={setCustomAmount}
                            keyboardType="numeric"
                            placeholder="e.g. 50000"
                        />
                    </Animated.View>
                )}

                <Text style={styles.sectionTitle}>{t('select_payment_method')}</Text>

                <TouchableOpacity style={styles.paymentMethod} onPress={() => handlePayment('MOBILE_MONEY_MTN')} disabled={processing}>
                    <View style={[styles.methodIcon, { backgroundColor: '#FFCC00' }]}>
                        <Text style={styles.mtnText}>MoMo</Text>
                    </View>
                    <View style={styles.methodInfo}>
                        <Text style={styles.methodTitle}>MTN Mobile Money</Text>
                        <Text style={styles.methodSub}>{t('momo_sub')}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#CCC" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.paymentMethod} onPress={() => handlePayment('MOBILE_MONEY_AIRTEL')} disabled={processing}>
                    <View style={[styles.methodIcon, { backgroundColor: '#FF0000' }]}>
                        <Text style={styles.airtelText}>Airtel</Text>
                    </View>
                    <View style={styles.methodInfo}>
                        <Text style={styles.methodTitle}>Airtel Money</Text>
                        <Text style={styles.methodSub}>{t('airtel_sub')}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#CCC" />
                </TouchableOpacity>

                {processing && (
                    <View style={styles.loadingOverlay}>
                        <ActivityIndicator size="large" color="#000" />
                        <Text style={styles.loadingText}>{t('processing_payment')}</Text>
                        <Text style={styles.loadingSub}>{t('phone_prompt')}</Text>
                    </View>
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
        padding: 24,
        paddingBottom: 120,
    },
    billCard: {
        backgroundColor: '#000',
        borderRadius: 24,
        padding: 32,
        marginBottom: 40,
    },
    label: {
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 14,
        color: '#888',
        marginBottom: 8,
    },
    amount: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 36,
        color: '#FFF',
        marginBottom: 32,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    rowLabel: {
        fontFamily: 'PlusJakartaSans_400Regular',
        fontSize: 14,
        color: '#888',
    },
    rowValue: {
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 14,
        color: '#FFF',
    },
    sectionTitle: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 18,
        color: '#000',
        marginBottom: 16,
    },
    prevPaymentRow: {
        marginBottom: 24,
        padding: 12,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
    },
    prevLabel: {
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 12,
        color: '#4CD964',
    },
    paymentMethod: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
        gap: 16,
    },
    methodIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    mtnText: { fontWeight: 'bold', color: '#000' },
    airtelText: { fontWeight: 'bold', color: '#FFF' },
    methodInfo: {
        flex: 1,
    },
    methodTitle: {
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 16,
        color: '#000',
    },
    methodSub: {
        fontFamily: 'PlusJakartaSans_400Regular',
        fontSize: 12,
        color: '#888',
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(255,255,255,0.9)',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    loadingText: {
        fontFamily: 'PlusJakartaSans_700Bold',
        marginTop: 16,
        fontSize: 18,
    },
    loadingSub: {
        fontFamily: 'PlusJakartaSans_400Regular',
        color: '#666',
        marginTop: 8,
    },
    successContainer: {
        flex: 1,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    successCard: {
        backgroundColor: '#FFF',
        width: '100%',
        borderRadius: 32,
        padding: 32,
        alignItems: 'center',
    },
    successIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#4CD964',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    successTitle: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 24,
        textAlign: 'center',
        marginBottom: 8,
    },
    successText: {
        fontFamily: 'PlusJakartaSans_400Regular',
        textAlign: 'center',
        color: '#666',
        marginBottom: 24,
    },
    receiptText: {
        fontFamily: 'PlusJakartaSans_500Medium',
        color: '#888',
        marginBottom: 40,
        backgroundColor: '#F5F5F5',
        padding: 8,
        borderRadius: 8,
    },
    balanceText: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 14,
        color: '#FF3B30',
        marginBottom: 16,
    },
    primaryButton: {
        backgroundColor: '#000',
        width: '100%',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 16,
    },
    primaryButtonText: {
        color: '#FFF',
        fontFamily: 'PlusJakartaSans_600SemiBold',
    },
    secondaryButton: {
        paddingVertical: 16,
    },
    secondaryButtonText: {
        color: '#000',
        fontFamily: 'PlusJakartaSans_600SemiBold',
    },
    selectionSection: {
        marginBottom: 32,
    },
    typeRow: {
        flexDirection: 'row',
        gap: 12,
    },
    typeBtn: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#EEE',
    },
    typeBtnActive: {
        backgroundColor: '#000',
        borderColor: '#000',
    },
    typeBtnText: {
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 14,
        color: '#666',
    },
    typeBtnTextActive: {
        color: '#FFF',
    },
    inputGroup: {
        marginBottom: 32,
        gap: 8,
    },
    inputLabel: {
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 14,
        color: '#666',
    },
    textInput: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#EEE',
        borderRadius: 12,
        padding: 16,
        fontSize: 18,
        fontFamily: 'PlusJakartaSans_700Bold',
        color: '#000',
    },
    statusBadge: {
        backgroundColor: '#E8FAEF',
        color: '#4CD964',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 12,
        overflow: 'hidden',
        marginBottom: 16,
    }
});
