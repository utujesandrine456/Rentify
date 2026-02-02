import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, {FadeInUp, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLanguage } from '../context/LanguageContext';
import { apiRequest } from '@/utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Login() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { t } = useLanguage();
    const [step, setStep] = useState(1); // 1 = login form, 2 = OTP verification
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [showpassword, setShowpassword] = useState(false);
    const [loading, setLoading] = useState(false);

    
    const handleLogin = async() => {
        if(!phone || !password){
            alert("Please fill in all fields");
            return;
        }

        setLoading(true);
        try{
            const response = await apiRequest('/auth/login', "POST", {
                telephone: phone,
                password: password
            });

            const {token, role, userId, fullName, telephone} = response;

            // Store all user data
            await AsyncStorage.setItem("token", token);
            await AsyncStorage.setItem("role", role);
            if (userId) await AsyncStorage.setItem("userId", userId.toString());
            if (fullName) await AsyncStorage.setItem("fullName", fullName);
            if (telephone) await AsyncStorage.setItem("telephone", telephone);

        
            router.replace(role == "TENANT" ? '/tenant' : '/landlord');
            
        }catch(error: any){
            const errorMessage = error.message || "Login failed";
            
            if (errorMessage.includes("Phone number not verified") || errorMessage.includes("not verified")) {
                try {
                    const otpResponse = await apiRequest('/auth/send-otp', "POST", {
                        telephone: phone
                    });
                    
                    console.log('[LOGIN] OTP sent:', otpResponse);
                    setStep(2); 
                } catch (otpError: any) {
                    console.error('[LOGIN] Failed to send OTP:', otpError);
                    alert("Failed to send verification code: " + (otpError.message || "Please try again."));
                }
            } else {
                alert(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if(!otp || otp.length !== 6){
            alert("Please enter a valid 6-digit OTP code");
            return;
        }

        setLoading(true);
        try {
            const response = await apiRequest('/auth/verify-otp', "POST", {
                telephone: phone,
                otp: otp
            });

            const { token, role, userId, fullName, telephone } = response;

            await AsyncStorage.setItem("token", token);
            await AsyncStorage.setItem("role", role);
            if (userId) await AsyncStorage.setItem("userId", userId.toString());
            if (fullName) await AsyncStorage.setItem("fullName", fullName);
            if (telephone) await AsyncStorage.setItem("telephone", telephone);

            router.replace(role == "TENANT" ? '/tenant' : '/landlord');
        } catch (error: any) {
            alert(error.message || "OTP verification failed");
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        try {
            await apiRequest('/auth/send-otp', "POST", {
                telephone: phone
            });
            alert("OTP code has been resent to your phone");
        } catch (error: any) {
            alert(error.message || "Failed to resend OTP");
        }
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
                            source={require('../assets/images/RentifyLogo.jpg')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                        <Text style={styles.heroTitle}>
                            {step === 1 ? t('login_title') : 'Verify Phone Number'}
                        </Text>
                    </Animated.View>
                </View>

                <View style={styles.form}>
                    {step === 1 ? (
                        <Animated.View entering={FadeInUp.delay(200).duration(800)}>
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>{t('phone_prompt')}</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="07..."
                                    placeholderTextColor="#999"
                                    keyboardType="phone-pad"
                                    value={phone}
                                    onChangeText={setPhone}
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={[styles.label, { flex: 1 }]}>{t('password_label')}</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="••••••••"
                                    placeholderTextColor="#999"
                                    secureTextEntry = {!showpassword}
                                    value={password}
                                    onChangeText={setPassword}
                                />

                                <TouchableOpacity onPress={() => setShowpassword(!showpassword)} style={{ position: 'absolute', right: 16, top: 40 }}>
                                    <Ionicons name={showpassword ? "eye-off" : "eye"} size={24} color="#bbb" style={{}} />
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity 
                                style={[styles.primaryButton, loading && styles.buttonDisabled]} 
                                onPress={handleLogin}
                                disabled={loading}
                            >
                                {loading ? (
                                    <Text style={styles.primaryButtonText}>LOGGING IN...</Text>
                                ) : (
                                    <>
                                        <Text style={styles.primaryButtonText}>{t('login_btn').toUpperCase()}</Text>
                                        <Ionicons name="arrow-forward" size={18} color="#FFF" />
                                    </>
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.linkButton} onPress={() => router.push('/register' as any)}>
                                <Text style={styles.linkText}>{t('no_account')} <Text style={styles.linkHighlight}>{t('signup_link')}</Text></Text>
                            </TouchableOpacity>
                        </Animated.View>
                    ) : (
                        <Animated.View entering={FadeInDown.delay(200).duration(800)}>
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>OTP Code</Text>
                                <TextInput
                                    style={[styles.input, { textAlign: 'center', letterSpacing: 8, fontSize: 24 }]}
                                    placeholder="000000"
                                    placeholderTextColor="#DDD"
                                    keyboardType="number-pad"
                                    maxLength={6}
                                    value={otp}
                                    onChangeText={setOtp}
                                    autoFocus
                                />
                                <Text style={styles.phoneHint}>Code sent to {phone}</Text>
                            </View>

                            <TouchableOpacity 
                                style={[styles.primaryButton, loading && styles.buttonDisabled]} 
                                onPress={handleVerifyOtp}
                                disabled={loading}
                            >
                                {loading ? (
                                    <Text style={styles.primaryButtonText}>VERIFYING...</Text>
                                ) : (
                                    <Text style={styles.primaryButtonText}>VERIFY & CONTINUE</Text>
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.linkButton} onPress={handleResendOtp}>
                                <Text style={styles.linkText}>Resend Code</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.linkButton} onPress={() => setStep(1)}>
                                <Text style={styles.linkText}>Back to Login</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    )}
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
    buttonDisabled: {
        opacity: 0.6,
    },
    phoneHint: {
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 12,
        color: '#999',
        textAlign: 'center',
        marginTop: 8,
    },
});
