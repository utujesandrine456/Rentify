import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, TextInput } from 'react-native';
import TopBar from '../../components/topbar';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function PayRent() {
    const router = useRouter();
    const { balance, totalPaid: totalPaidParam, isPartialPayment } = useLocalSearchParams();

    // Total rent is 150k. Remaining is either full or balance.
    const initialAmount = balance ? balance.toString() : '150000';
    const prevPaid = parseInt(totalPaidParam as string || '0');
    const isReturningForBalance = isPartialPayment === 'true';

    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);
    const [paymentType, setPaymentType] = useState<'full' | 'partial'>('full');
    const [customAmount, setCustomAmount] = useState(initialAmount);
    const [paidAmount, setPaidAmount] = useState('');

    const handlePayment = () => {
        setProcessing(true);
        const amount = paymentType === 'full' ? initialAmount : customAmount;
        setPaidAmount(amount);

        const totalNowPaid = prevPaid + parseInt(amount);

        setTimeout(() => {
            setProcessing(false);
            setSuccess(true);
            setTotalPaid(totalNowPaid);
        }, 2000);
    };

    const [totalPaid, setTotalPaid] = useState(0);

    if (success) {
        const isFullyPaid = totalPaid >= 150000;
        return (
            <View style={styles.successContainer}>
                <Animated.View entering={FadeInDown.springify()} style={styles.successCard}>
                    <View style={styles.successIcon}>
                        <Ionicons name="checkmark" size={40} color="#FFF" />
                    </View>
                    <Text style={styles.successTitle}>Payment Successful!</Text>
                    <Text style={styles.statusBadge}>Status: {isFullyPaid ? 'PAID' : 'PARTIAL'}</Text>
                    <Text style={styles.successText}>You have successfully paid RWF {parseInt(paidAmount).toLocaleString()} for Feb 2026 rent.</Text>
                    {!isFullyPaid && <Text style={styles.balanceText}>Remaining Balance: RWF {(150000 - totalPaid).toLocaleString()}</Text>}
                    <Text style={styles.receiptText}>Receipt ID: #TXN-98234</Text>

                    <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={() => router.replace('/tenant/history')}
                    >
                        <Text style={styles.primaryButtonText}>View History</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={() => router.replace({
                            pathname: '/tenant',
                            params: { paidAmount: totalPaid.toString() }
                        })}
                    >
                        <Text style={styles.secondaryButtonText}>Back Home</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TopBar
                title="Pay Rent"
                showBack={true}
                onBackPress={() => router.back()}
            />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.billCard}>
                    <Text style={styles.label}>{isReturningForBalance ? 'Remaining Balance' : 'Total Amount Due'}</Text>
                    <Text style={styles.amount}>RWF {parseInt(initialAmount).toLocaleString()}</Text>
                    {isReturningForBalance && (
                        <View style={styles.prevPaymentRow}>
                            <Text style={styles.prevLabel}>Previously Paid: RWF {prevPaid.toLocaleString()}</Text>
                        </View>
                    )}
                    <View style={styles.row}>
                        <Text style={styles.rowLabel}>Landlord</Text>
                        <Text style={styles.rowValue}>John M.</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.rowLabel}>Property</Text>
                        <Text style={styles.rowValue}>Apt 4B</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.rowLabel}>Month</Text>
                        <Text style={styles.rowValue}>February 2026</Text>
                    </View>
                </View>

                <View style={styles.selectionSection}>
                    <Text style={styles.sectionTitle}>Payment Type</Text>
                    <View style={styles.typeRow}>
                        <TouchableOpacity
                            style={[styles.typeBtn, paymentType === 'full' && styles.typeBtnActive]}
                            onPress={() => setPaymentType('full')}
                        >
                            <Text style={[styles.typeBtnText, paymentType === 'full' && styles.typeBtnTextActive]}>Full Payment</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.typeBtn, paymentType === 'partial' && styles.typeBtnActive]}
                            onPress={() => setPaymentType('partial')}
                        >
                            <Text style={[styles.typeBtnText, paymentType === 'partial' && styles.typeBtnTextActive]}>Partial Payment</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {paymentType === 'partial' && (
                    <Animated.View entering={FadeInDown} style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Enter Amount (RWF)</Text>
                        <TextInput
                            style={styles.textInput}
                            value={customAmount}
                            onChangeText={setCustomAmount}
                            keyboardType="numeric"
                            placeholder="e.g. 50000"
                        />
                    </Animated.View>
                )}

                <Text style={styles.sectionTitle}>Select Payment Method</Text>

                <TouchableOpacity style={styles.paymentMethod} onPress={handlePayment} disabled={processing}>
                    <View style={[styles.methodIcon, { backgroundColor: '#FFCC00' }]}>
                        <Text style={styles.mtnText}>MoMo</Text>
                    </View>
                    <View style={styles.methodInfo}>
                        <Text style={styles.methodTitle}>MTN Mobile Money</Text>
                        <Text style={styles.methodSub}>Pay directly from your phone</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#CCC" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.paymentMethod} onPress={handlePayment} disabled={processing}>
                    <View style={[styles.methodIcon, { backgroundColor: '#FF0000' }]}>
                        <Text style={styles.airtelText}>Airtel</Text>
                    </View>
                    <View style={styles.methodInfo}>
                        <Text style={styles.methodTitle}>Airtel Money</Text>
                        <Text style={styles.methodSub}>Pay directly from your phone</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#CCC" />
                </TouchableOpacity>

                {processing && (
                    <View style={styles.loadingOverlay}>
                        <ActivityIndicator size="large" color="#000" />
                        <Text style={styles.loadingText}>Processing Payment...</Text>
                        <Text style={styles.loadingSub}>Please check your phone for the prompt.</Text>
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
