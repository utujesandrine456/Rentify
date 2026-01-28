import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function TermsAndConditions() {
    const router = useRouter();
    const [agreed, setAgreed] = useState(false);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="close" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Terms of Service</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Animated.View entering={FadeInDown.delay(100).duration(800)}>
                    <Text style={styles.lastUpdated}>Last updated: January 28, 2026</Text>

                    <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
                    <Text style={styles.text}>
                        By creating an account on Rentify, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services.
                    </Text>

                    <Text style={styles.sectionTitle}>2. User Responsibilities</Text>
                    <Text style={styles.text}>
                        Tenants are responsible for timely payments and maintaining property care. Landlords are responsible for providing safe and habitable housing.
                    </Text>

                    <Text style={styles.sectionTitle}>3. Payments and Fees</Text>
                    <Text style={styles.text}>
                        Rentify facilitates rent payments via mobile money. We are not responsible for disputes between landlords and tenants regarding rent amounts or property conditions.
                    </Text>

                    <Text style={styles.sectionTitle}>4. Privacy Policy</Text>
                    <Text style={styles.text}>
                        Your data is stored securely. We share minimal necessary information between landlords and tenants to facilitate housing agreements.
                    </Text>

                    <Text style={styles.sectionTitle}>5. Termination</Text>
                    <Text style={styles.text}>
                        We reserve the right to suspend or terminate accounts that violate these terms or engage in fraudulent activities.
                    </Text>

                    <View style={styles.spacer} />
                </Animated.View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.checkboxContainer}
                    onPress={() => setAgreed(!agreed)}
                >
                    <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
                        {agreed && <Ionicons name="checkmark" size={16} color="#FFF" />}
                    </View>
                    <Text style={styles.checkboxLabel}>I agree to the Terms & Conditions</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.continueBtn, !agreed && styles.continueBtnDisabled]}
                    disabled={!agreed}
                    onPress={() => router.push('/register')}
                >
                    <Text style={styles.continueText}>Continue to Signup</Text>
                    <Ionicons name="arrow-forward" size={20} color="#FFF" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        paddingBlock: 16
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    headerTitle: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 20,
        color: '#000',
    },
    scrollContent: {
        padding: 24,
    },
    lastUpdated: {
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 14,
        color: '#888',
        marginBottom: 24,
    },
    sectionTitle: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 16,
        color: '#000',
        marginTop: 24,
        marginBottom: 12,
    },
    text: {
        fontFamily: 'PlusJakartaSans_400Regular',
        fontSize: 15,
        color: '#444',
        lineHeight: 24,
    },
    spacer: {
        height: 40,
    },
    footer: {
        padding: 24,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        backgroundColor: '#FFF',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    checkboxChecked: {
        backgroundColor: '#000',
    },
    checkboxLabel: {
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 14,
        color: '#000',
    },
    continueBtn: {
        backgroundColor: '#000',
        paddingVertical: 18,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    continueBtnDisabled: {
        opacity: 0.5,
    },
    continueText: {
        fontFamily: 'PlusJakartaSans_700Bold',
        color: '#FFF',
        fontSize: 16,
    },
});
