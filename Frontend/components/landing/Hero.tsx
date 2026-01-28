import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';

export default function Hero() {
    const router = useRouter();
    const { height } = useWindowDimensions();

    const scrollAnim = useSharedValue(0);

    const animatedScrollStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: scrollAnim.value }]
    }));

    useEffect(() => {
        scrollAnim.value = withRepeat(
            withSequence(
                withTiming(10, { duration: 1000 }),
                withTiming(0, { duration: 1000 })
            ),
            -1
        );
    }, []);

    return (
        <View style={[styles.container, { height }]}>
            <View style={styles.gridOverlay}>
                <View style={styles.vGrid}>
                    {[...Array(8)].map((_, i) => (
                        <View key={`v-${i}`} style={styles.vLine} />
                    ))}
                </View>
                <View style={styles.hGrid}>
                    {[...Array(12)].map((_, i) => (
                        <View key={`h-${i}`} style={styles.hLine} />
                    ))}
                </View>
            </View>

            <Animated.View
                entering={FadeInDown.duration(1000).springify()}
                style={styles.content}
            >
                <Text style={styles.title}>
                    REDEFINING{'\n'}
                    <Text style={styles.hollowText}>URBAN</Text>{'\n'}
                    LIVING.
                </Text>

                <Text style={styles.description}>
                    A minimalist ecosystem for seamless rent management,
                    transaction tracking, and landlord-tenant harmony.
                </Text>

                <View style={styles.buttonStack}>
                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            style={styles.mainBtn}
                            onPress={() => router.push('/terms')}
                        >
                            <Text style={styles.mainBtnText}>GET STARTED</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.outlineBtn}
                            onPress={() => { }}
                        >
                            <Text style={styles.outlineBtnText}>VIEW DEMO</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={styles.loginBtnHero}
                        onPress={() => router.push('/login')}
                    >
                        <Text style={styles.loginBtnHeroText}>ALREADY HAVE AN ACCOUNT? LOGIN</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>

            <Animated.View style={[styles.scrollIndicator, animatedScrollStyle]}>
                <Ionicons name="chevron-down" size={32} color="#b0b0b0ff" />
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#000',
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingTop: 96
    },
    gridOverlay: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.1,
    },
    vGrid: {
        ...StyleSheet.absoluteFillObject,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    hGrid: {
        ...StyleSheet.absoluteFillObject,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    vLine: {
        width: 1,
        height: '100%',
        backgroundColor: '#FFF',
    },
    hLine: {
        height: 1,
        width: '100%',
        backgroundColor: '#FFF',
    },
    content: {
        zIndex: 1,
    },
    badge: {
        borderWidth: 1,
        borderColor: '#333',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 4,
        marginBottom: 32,
        alignSelf: 'flex-start',
    },
    badgeText: {
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 10,
        color: '#FFF',
        letterSpacing: 2,
    },
    title: {
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        fontSize: 48,
        color: '#FFF',
        lineHeight: 64,
        marginBottom: 32,
    },
    hollowText: {
        color: 'transparent',
        textShadowColor: '#FFF',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 1
    },
    description: {
        fontFamily: 'PlusJakartaSans_400Regular',
        fontSize: 16,
        color: '#888',
        lineHeight: 24,
        maxWidth: 300,
        marginBottom: 48,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 16,
    },
    mainBtn: {
        backgroundColor: '#FFF',
        paddingHorizontal: 32,
        paddingVertical: 18,
        borderRadius: 4,
    },
    mainBtnText: {
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        fontSize: 14,
        color: '#000',
    },
    outlineBtn: {
        borderWidth: 1,
        borderColor: '#333',
        paddingHorizontal: 32,
        paddingVertical: 18,
        borderRadius: 4,
    },
    outlineBtnText: {
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        fontSize: 14,
        color: '#FFF',
    },
    footer: {
        position: 'absolute',
        bottom: 48,
        left: 32,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    buttonStack: {
        gap: 20,
    },
    loginBtnHero: {
        alignSelf: 'center',
        marginVertical: 24,
    },
    loginBtnHeroText: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 10,
        color: '#666',
        letterSpacing: 1.5,
        textAlign: 'center'
    },
    scrollIndicator: {
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
