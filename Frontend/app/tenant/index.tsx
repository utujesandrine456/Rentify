import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
import TopBar from '../../components/topbar';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useLanguage } from '../../context/LanguageContext';

export default function TenantHome() {
    const router = useRouter();
    const { paidAmount: paidParam, isLate: lateParam } = useLocalSearchParams();
    const { t } = useLanguage();

    const totalRent = 150000;
    const paidAmount = parseInt(paidParam as string || '0');
    const remainingBalance = totalRent - paidAmount;
    const isLate = lateParam === 'true';

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
                title={t('tenant_dashboard')}
                onNotificationPress={() => router.push('/notifications')}
                onMenuPress={() => router.push('/settings')}
            />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Animated.View entering={FadeInDown.delay(100).duration(800)} style={styles.greetingHeader}>
                    <Text style={styles.greetingText}>{t('welcome')}, Tony</Text>
                    <Text style={styles.subGreeting}>
                        {isPaid ? "You're all set for this month!" : isRestricted ? "Access restricted. Please clear balance." : "Everything is looking good today."}
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
                                } as any)}
                            >
                                <Text style={styles.payButtonText}>{isPartial ? 'Pay Balance' : t('pay_now')}</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </Animated.View>

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
                                <Text style={styles.propertyTitle}>Luxury Apartment 4B</Text>
                                <View style={styles.locationRow}>
                                    <Ionicons name="location" size={14} color="rgba(255,255,255,0.7)" />
                                    <Text style={styles.propertyAddress}>Kigali, Kicukiro, Niboye</Text>
                                </View>
                            </View>
                            <Ionicons name="chevron-forward" size={24} color="#FFF" />
                        </View>
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
