import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Linking, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, withRepeat, withSequence, withTiming, withSpring } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function Contact() {
    const [email, setEmail] = useState('');

    const callIconStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: withRepeat(withSequence(withTiming(1.1, { duration: 1000 }), withTiming(1, { duration: 1000 })), -1, true) }
        ],
    }));

    const handleCall = () => {
        Linking.openURL('tel:+250788123456');
    };

    const handleEmailSub = () => {
        if (email.includes('@')) {
            alert('Thank you! We will reach out soon.');
            setEmail('');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.glassContainer}>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>LET'S CONNECT</Text>
                </View>
                <Text style={styles.title}>Ready to transform your renting experience?</Text>

                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your email"
                        placeholderTextColor="#AAA"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <TouchableOpacity style={styles.sendBtn} onPress={handleEmailSub}>
                        <Ionicons name="send" size={20} color="#000" />
                    </TouchableOpacity>
                </View>

                <View style={styles.divider}>
                    <View style={styles.line} />
                    <Text style={styles.orText}>OR</Text>
                    <View style={styles.line} />
                </View>

                <TouchableOpacity style={styles.callCard} onPress={handleCall}>
                    <Animated.View style={[styles.callIconWrapper, callIconStyle]}>
                        <Ionicons name="call" size={24} color="#000" />
                    </Animated.View>
                    <View style={styles.callContent}>
                        <Text style={styles.callTitle}>Call Now</Text>
                        <Text style={styles.callSub}>Get instant help from our experts</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#666" />
                </TouchableOpacity>

                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>24/7</Text>
                        <Text style={styles.statLabel}>Support</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>15min</Text>
                        <Text style={styles.statLabel}>Avg. Response</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 24,
        paddingBottom: 40,
        backgroundColor: '#000',
    },
    glassContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        alignItems: 'center',
    },
    badge: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginBottom: 24,
    },
    badgeText: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 12,
        color: '#FFF',
        letterSpacing: 2,
    },
    title: {
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        fontSize: 22,
        color: '#FFF',
        textAlign: 'center',
        lineHeight: 32,
        marginBottom: 16,
    },
    subtitle: {
        fontFamily: 'PlusJakartaSans_400Regular',
        fontSize: 16,
        color: '#AAA',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
    },
    inputWrapper: {
        flexDirection: 'row',
        width: '100%',
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 16,
        padding: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        marginVertical: 16,
    },
    input: {
        flex: 1,
        paddingHorizontal: 16,
        color: '#FFF',
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 16,
    },
    sendBtn: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: 32,
        gap: 16,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    orText: {
        fontFamily: 'PlusJakartaSans_700Bold',
        color: '#444',
        fontSize: 12,
    },
    callCard: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        backgroundColor: '#FFF',
        padding: 20,
        borderRadius: 16,
        marginBottom: 32,
        gap: 16,
    },
    callIconWrapper: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#F0F0F0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    callContent: {
        flex: 1,
    },
    callTitle: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 18,
        color: '#000',
    },
    callSub: {
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 12,
        color: '#666',
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 32,
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        fontSize: 20,
        color: '#FFF',
    },
    statLabel: {
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 12,
        color: '#666',
    },
    statDivider: {
        width: 1,
        height: 30,
        backgroundColor: 'rgba(255,255,255,0.1)',
    }
});
