import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import TopBar from '../../components/topbar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function StatusExplanation() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <TopBar
                title="Status Explanation"
                showBack={true}
                onBackPress={() => router.back()}
            />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.statusHeader}>
                    <View style={[styles.statusBadge, { backgroundColor: '#4CD964' }]}>
                        <Text style={styles.statusText}>GOOD</Text>
                    </View>
                    <Text style={styles.statusTitle}>Your status is Good!</Text>
                    <Text style={styles.statusDate}>Last updated: Just now</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>What this means</Text>
                    <Text style={styles.cardText}>
                        You have paid all your rent on time. You have full access to the app features and you are building a positive records for future rentals.
                    </Text>
                </View>

                <View style={styles.infoSection}>
                    <Text style={styles.sectionTitle}>Status Levels</Text>

                    <View style={styles.infoRow}>
                        <View style={[styles.dot, { backgroundColor: '#4CD964' }]} />
                        <View>
                            <Text style={styles.infoLabel}>GOOD</Text>
                            <Text style={styles.infoDesc}>All payments up to date.</Text>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <View style={[styles.dot, { backgroundColor: '#FFCC00' }]} />
                        <View>
                            <Text style={styles.infoLabel}>WARNING</Text>
                            <Text style={styles.infoDesc}>Payment is 1-3 days late.</Text>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <View style={[styles.dot, { backgroundColor: '#FF3B30' }]} />
                        <View>
                            <Text style={styles.infoLabel}>RESTRICTED</Text>
                            <Text style={styles.infoDesc}>Payment is more than 3 days late. Blocked from new rentals.</Text>
                        </View>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={() => router.back()}
                >
                    <Text style={styles.primaryButtonText}>Got it</Text>
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
    },
    statusHeader: {
        alignItems: 'center',
        marginBottom: 32,
    },
    statusBadge: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 100,
        marginBottom: 16,
    },
    statusText: {
        fontFamily: 'PlusJakartaSans_700Bold',
        color: '#FFF',
        fontSize: 16,
    },
    statusTitle: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 24,
        color: '#000',
        marginBottom: 4,
    },
    statusDate: {
        fontFamily: 'PlusJakartaSans_400Regular',
        fontSize: 14,
        color: '#888',
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 24,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    cardTitle: {
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 18,
        color: '#000',
        marginBottom: 12,
    },
    cardText: {
        fontFamily: 'PlusJakartaSans_400Regular',
        fontSize: 14,
        color: '#666',
        lineHeight: 22,
    },
    infoSection: {
        gap: 20,
        marginBottom: 40,
    },
    sectionTitle: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 18,
        color: '#000',
        marginBottom: 8,
    },
    infoRow: {
        flexDirection: 'row',
        gap: 16,
        alignItems: 'flex-start',
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginTop: 6,
    },
    infoLabel: {
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 14,
        color: '#000',
    },
    infoDesc: {
        fontFamily: 'PlusJakartaSans_400Regular',
        fontSize: 12,
        color: '#666',
    },
    primaryButton: {
        backgroundColor: '#000',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    primaryButtonText: {
        fontFamily: 'PlusJakartaSans_600SemiBold',
        color: '#FFF',
        fontSize: 16,
    },
});
