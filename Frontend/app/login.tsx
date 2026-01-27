import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function Login() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        router.replace('/tenant');
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.topVisualContainer}>
                    <Image
                        source={require('../assets/images/RentifyLanding.jpg')}
                        style={styles.heroImage}
                        resizeMode="cover"
                    />

                    <TouchableOpacity
                        style={[styles.backButton, { top: insets.top + 16 }]}
                        onPress={() => router.back()}
                    >
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>

                    <Animated.View entering={FadeInUp.delay(300).duration(800)} style={styles.heroTextContainer}>
                        <Image
                            source={require('../assets/images/RentifyLogo.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                        <Text style={styles.heroTitle}>Welcome back</Text>
                        <Text style={styles.heroSubtitle}>Enter your details to continue your journey.</Text>
                    </Animated.View>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Phone Number</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="+250 7..."
                            placeholderTextColor="#999"
                            keyboardType="phone-pad"
                            value={phone}
                            onChangeText={setPhone}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="••••••••"
                            placeholderTextColor="#999"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />
                    </View>

                    <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
                        <Text style={styles.primaryButtonText}>LOGIN</Text>
                        <Ionicons name="arrow-forward" size={18} color="#FFF" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.linkButton} onPress={() => router.push('/register')}>
                        <Text style={styles.linkText}>New to Rentify? <Text style={styles.linkHighlight}>Create Account</Text></Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        paddingBottom: 16
    },
    topVisualContainer: {
        height: 360,
        width: '100%',
        backgroundColor: '#fff',
        position: 'relative',
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    heroTextContainer: {
        position: 'absolute',
        bottom: 120,
        left: 32,
        right: 32,
    },
    heroTitle: {
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        fontSize: 36,
        color: '#FFF',
        marginBottom: 8,
        textAlign: 'center'
    },
    heroSubtitle: {
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
        lineHeight: 24,
        textAlign: 'center'
    },
    logo: {
        width: 80,
        height: 80,
        alignSelf: 'center',
        marginBottom: 16,
    },
    backButton: {
        position: 'absolute',
        left: 24,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 5,
    },
    scrollContent: {
        flexGrow: 1,
    },
    form: {
        backgroundColor: '#FFF',
        paddingHorizontal: 32,
        paddingVertical: 36,
        gap: 24,
        borderTopLeftRadius: 48,
        borderTopRightRadius: 48,
        marginTop: -42,   
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 8,
    },
    inputContainer: {
        gap: 8,
    },
    label: {
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 13,
        color: '#888',
        letterSpacing: 0.5,
    },
    input: {
        backgroundColor: '#F8F8F8',
        borderWidth: 1,
        borderColor: '#EEE',
        borderRadius: 12,
        padding: 18,
        fontSize: 16,
        fontFamily: 'PlusJakartaSans_500Medium',
        color: '#000',
    },
    primaryButton: {
        backgroundColor: '#000',
        paddingVertical: 18,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        marginTop: 8,
    },
    primaryButtonText: {
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        color: '#FFF',
        fontSize: 14,
        letterSpacing: 1,
    },
    linkButton: {
        alignItems: 'center',
        marginTop: 16,
    },
    linkText: {
        fontFamily: 'PlusJakartaSans_500Medium',
        color: '#666',
        fontSize: 14,
    },
    linkHighlight: {
        color: '#000',
        fontFamily: 'PlusJakartaSans_700Bold',
    },
});
