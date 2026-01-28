import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, StatusBar, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

export default function TenantPublicProfile() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    const tenantData = {
        name: 'John Doe',
        reliabilityScore: '98%',
        joinedDate: 'Jan 2024',
        status: 'Verified',
        rentHistory: [
            { id: 1, month: 'Jan 2026', status: 'On-time', amount: '150,000' },
            { id: 2, month: 'Dec 2025', status: 'On-time', amount: '150,000' },
            { id: 3, month: 'Nov 2025', status: 'On-time', amount: '150,000' },
        ],
        contact: '+250 788 123 456'
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Tenant Public Profile</Text>
                <TouchableOpacity style={styles.shareBtn}>
                    <Ionicons name="share-outline" size={24} color="#000" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Animated.View entering={FadeInUp.duration(800)} style={styles.profileCard}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>{tenantData.name.charAt(0)}</Text>
                        </View>
                        <View style={styles.statusBadge}>
                            <Ionicons name="checkmark-circle" size={16} color="#FFF" />
                            <Text style={styles.statusText}>{tenantData.status}</Text>
                        </View>
                    </View>
                    <Text style={styles.name}>{tenantData.name}</Text>
                    <Text style={styles.joined}>Member since {tenantData.joinedDate}</Text>

                    <View style={styles.reliabilityContainer}>
                        <Text style={styles.reliabilityLabel}>Tenant Trust Score</Text>
                        <Text style={styles.reliabilityValue}>{tenantData.reliabilityScore}</Text>
                        <View style={styles.progressBar}>
                            <View style={[styles.progressFill, { width: '98%' }]} />
                        </View>
                        <Text style={styles.reliabilityDesc}>Excellent reliability based on past rent history.</Text>
                    </View>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(200).duration(800)} style={styles.contactSection}>
                    <Text style={styles.sectionTitle}>Contact Information</Text>
                    <View style={styles.contactCard}>
                        <View style={styles.contactItem}>
                            <Ionicons name="call-outline" size={20} color="#000" />
                            <Text style={styles.contactText}>{tenantData.contact}</Text>
                        </View>
                    </View>
                </Animated.View>

                <TouchableOpacity
                    style={styles.contactBtn}
                    onPress={() => Linking.openURL(`tel:${tenantData.contact}`)}
                >
                    <Ionicons name="call" size={20} color="#FFF" />
                    <Text style={styles.contactBtnText}>Contact This Tenant</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FB',
        paddingBottom: 48,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingVertical: 16,
        backgroundColor: '#FFF',
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#F7F7F7',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 18,
    },
    shareBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#F7F7F7',
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollContent: {
        padding: 24,
        paddingBottom: 40,
    },
    profileCard: {
        backgroundColor: '#FFF',
        borderRadius: 32,
        padding: 32,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.05,
        shadowRadius: 20,
        elevation: 5,
        marginBottom: 24,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#F0F0F0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        fontSize: 40,
        color: '#000',
    },
    statusBadge: {
        position: 'absolute',
        bottom: 0,
        right: -10,
        backgroundColor: '#4CD964',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 4,
        borderColor: '#FFF',
    },
    statusText: {
        color: '#FFF',
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 10,
        marginLeft: 4,
    },
    name: {
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        fontSize: 24,
        color: '#000',
        marginBottom: 4,
    },
    joined: {
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 14,
        color: '#888',
        marginBottom: 32,
    },
    reliabilityContainer: {
        width: '100%',
        backgroundColor: '#F8F9FB',
        padding: 24,
        borderRadius: 24,
        alignItems: 'center',
    },
    reliabilityLabel: {
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    reliabilityValue: {
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        fontSize: 32,
        color: '#4CD964',
        marginBottom: 12,
    },
    progressBar: {
        width: '100%',
        height: 8,
        backgroundColor: '#E0E0E0',
        borderRadius: 4,
        marginBottom: 12,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#4CD964',
        borderRadius: 4,
    },
    reliabilityDesc: {
        fontFamily: 'PlusJakartaSans_400Regular',
        fontSize: 12,
        color: '#888',
        textAlign: 'center',
    },
    contactSection: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 18,
        color: '#000',
        marginBottom: 16,
    },
    contactCard: {
        backgroundColor: '#FFF',
        padding: 24,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    contactText: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 16,
        color: '#000',
    },
    contactBtn: {
        backgroundColor: '#000',
        paddingVertical: 18,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    contactBtnText: {
        fontFamily: 'PlusJakartaSans_700Bold',
        color: '#FFF',
        fontSize: 16,
    },
});
