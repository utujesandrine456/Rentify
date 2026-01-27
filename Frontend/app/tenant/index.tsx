import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import TopBar from '../../components/topbar';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function TenantHome() {
    const router = useRouter();
    const { paidAmount: paidParam, isLate: lateParam } = useLocalSearchParams();

    const totalRent = 150000;
    const paidAmount = parseInt(paidParam as string || '0');
    const remainingBalance = totalRent - paidAmount;
    const isLate = lateParam === 'true';

    // Status Logic
    let status: 'PENDING' | 'PARTIAL' | 'PAID' | 'RESTRICTED' = 'PENDING';
    if (paidAmount >= totalRent) status = 'PAID';
    else if (paidAmount > 0) status = 'PARTIAL';

    if (isLate && status !== 'PAID') status = 'RESTRICTED';

    const isPaid = status === 'PAID';
    const isRestricted = status === 'RESTRICTED';
    const isPartial = status === 'PARTIAL';
    const progress = (paidAmount / totalRent);

    return (
        <View style={styles.container}>
            <TopBar
                title="Tenant"
                onNotificationPress={() => router.push('/notifications')}
                onMenuPress={() => router.push('/settings')}
            />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Animated.View entering={FadeInDown.delay(100).duration(800)} style={styles.greetingHeader}>
                    <Text style={styles.greetingText}>Welcome back, Tony</Text>
                    <Text style={styles.subGreeting}>
                        {isPaid ? "You're all set for this month!" : isRestricted ? "Access restricted. Please clear balance." : "Everything is looking good today."}
                    </Text>
                </Animated.View>

                {/* Status Pod */}
                <Animated.View entering={FadeInDown.delay(200).duration(800)}>
                    <TouchableOpacity
                        style={[styles.statusPod, isRestricted && styles.restrictedPod]}
                        onPress={() => router.push('/tenant/status')}
                        activeOpacity={0.9}
                    >
                        <View style={styles.statusLeft}>
                            <View style={[styles.statusIndicator, { backgroundColor: isPaid ? '#4CD964' : isRestricted ? '#FF3B30' : '#FFCC00' }]} />
                            <Text style={styles.statusLabel}>Rent Status</Text>
                        </View>
                        <Text style={[styles.statusValue, isRestricted && { color: '#FF3B30' }]}>{status}</Text>
                    </TouchableOpacity>
                </Animated.View>

                {/* Priority Card */}
                <Animated.View entering={FadeInDown.delay(300).duration(800)} style={[styles.card, isRestricted && styles.restrictedCard]}>
                    <View style={styles.cardInfo}>
                        <View style={styles.cardRow}>
                            <Text style={styles.cardLabel}>{isPaid ? 'Last Payment' : isPartial ? 'Balance Due' : 'Next Payment'}</Text>
                            {isPartial && <Text style={styles.progressText}>{Math.round(progress * 100)}% Paid</Text>}
                        </View>
                        <Text style={styles.amountText}>RWF {remainingBalance.toLocaleString()}</Text>
                        <Text style={[styles.dateText, isPaid ? { color: '#4CD964' } : isRestricted ? { color: '#FF3B30' } : { color: '#FF9500' }]}>
                            {isPaid ? 'Paid on Jan 27, 2026' : isRestricted ? 'OVERDUE - Access Limited' : 'Due on Feb 01, 2026'}
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
                                        totalPaid: paidAmount.toString(),
                                        isPartialPayment: (isPartial || isRestricted).toString()
                                    }
                                })}
                            >
                                <Text style={styles.payButtonText}>{isPartial ? 'Pay Balance' : 'Pay Now'}</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(400).duration(800)} style={styles.propertySection}>
                    <Text style={styles.sectionTitle}>Active Residence</Text>
                    <TouchableOpacity style={styles.propertyCard}>
                        <View style={styles.propertyIcon}>
                            <Ionicons name="home" size={20} color="#000" />
                        </View>
                        <View style={styles.propertyMeta}>
                            <Text style={styles.propertyTitle}>Apartment 4B</Text>
                            <Text style={styles.propertyAddress}>Kigali, Kicukiro, Niboye</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color="#CCC" />
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
    },
    subGreeting: {
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 16,
        color: '#888',
        marginTop: 4,
    },
    statusPod: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F9F9F9',
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    statusLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    statusIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#4CD964',
    },
    statusLabel: {
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 14,
        color: '#666',
    },
    statusValue: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 14,
        color: '#000',
    },
    card: {
        backgroundColor: '#000',
        borderRadius: 32,
        padding: 32,
        gap: 24,
    },
    cardInfo: {
        gap: 8,
    },
    cardLabel: {
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 14,
        color: 'rgba(255,255,255,0.6)',
    },
    amountText: {
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        fontSize: 36,
        color: '#FFF',
    },
    dateText: {
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 14,
        color: '#FF3B30',
    },
    buttonRow: {
        flexDirection: 'row',
    },
    actionButton: {
        flex: 1,
        paddingVertical: 18,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    payButton: {
        backgroundColor: '#FFF',
    },
    payButtonText: {
        fontFamily: 'PlusJakartaSans_700Bold',
        color: '#000',
        fontSize: 15,
    },
    sectionTitle: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 18,
        color: '#000',
        marginBottom: 16,
    },
    propertySection: {
        marginTop: 8,
    },
    propertyCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FAFAFA',
        padding: 20,
        borderRadius: 24,
        gap: 16,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    propertyIcon: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#EEE',
    },
    propertyMeta: {
        flex: 1,
    },
    propertyTitle: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 16,
        color: '#000',
    },
    propertyAddress: {
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 13,
        color: '#888',
        marginTop: 2,
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
    cardRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    progressText: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 12,
        color: '#4CD964',
    },
    progressBarContainer: {
        height: 6,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 3,
        marginTop: 12,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        borderRadius: 3,
    }
});
