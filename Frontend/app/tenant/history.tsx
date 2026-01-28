import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import TopBar from '../../components/topbar';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useLocalSearchParams } from 'expo-router';
import { useLanguage } from '../../context/LanguageContext';

export default function PaymentHistory() {
    const { paidAmount: paidParam } = useLocalSearchParams();
    const { t } = useLanguage();
    const paidAmount = parseInt(paidParam as string || '0');
    const totalRent = 150000;
    const balance = totalRent - paidAmount;

    const history = [
        { id: 1, month: 'February 2026', date: 'Jan 27, 2026', total: totalRent, paid: paidAmount, balance: balance, status: paidAmount >= totalRent ? 'PAID' : paidAmount > 0 ? 'PARTIAL' : 'PENDING' },
        { id: 2, month: 'January 2026', date: 'Jan 05, 2026', total: 150000, paid: 150000, balance: 0, status: 'PAID' },
    ];

    return (
        <View style={styles.container}>
            <TopBar title={t('payment_history')} showBack />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {history.map((item, index) => (
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
                ))}
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
});
