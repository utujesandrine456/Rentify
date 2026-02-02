import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Image, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLanguage } from '../context/LanguageContext';
import { apiRequest } from '@/utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Register() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const insets = useSafeAreaInsets();
    const { t } = useLanguage();
    const [role, setRole] = useState<'tenant' | 'landlord'>(params.role === 'landlord' ? 'landlord' : 'tenant');
    const [step, setStep] = useState(1);
    const [phone, setPhone] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const[showpassword,setShowpassword]=useState(false);
    

    const handleRegister = async() => {
        if(!name || !phone || !password){
            alert("Please fill all fields");
            return;
        }

        if(password.length < 6){
            alert("Password must be at least 6 characters");
            return;
        }

        try{
            await apiRequest('/auth/register', "POST", {
                fullName: name,
                telephone: phone,
                password: password,
                role: role.toUpperCase(),
            });
            
            console.log("Registration successful");
            setStep(2);
        }catch(error: any){
            alert(error.message || "Registration failed");
        }
    }

    const verifyOtp = async () => {
        if(!otp){
            alert("Please enter the OTP code");
            return;
        }

        try{
            const response = await apiRequest('/auth/verify-registration', "POST", {
                fullName: name,           
                telephone: phone,      
                password: password,      
                role: role.toUpperCase(), 
                otp: otp,
            });

            const { token, role: userRole, userId, fullName, telephone } = response;

            // Store all user data
            await AsyncStorage.setItem("token", token);
            await AsyncStorage.setItem("role", userRole);
            if (userId) await AsyncStorage.setItem("userId", userId.toString());
            if (fullName) await AsyncStorage.setItem("fullName", fullName);
            if (telephone) await AsyncStorage.setItem("telephone", telephone);
        
            console.log('[REGISTER] ✅ User data stored:', { fullName, telephone, userId, role: userRole });
            router.replace(userRole == "TENANT" ? "/tenant" : "/landlord");
        } catch(error: any){
            alert(error.message || "OTP verification failed");
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
                            {step === 1 ? t('signup_title') : 'Verify Phone'}
                        </Text>
                        <Text style={styles.heroSubtitle}>
                            {step === 1
                                ? t('signup_subtitle')
                                : `Enter the code sent to ${phone}`
                            }
                        </Text>
                    </Animated.View>
                </View>

                {step === 1 ? (
                    <Animated.View entering={FadeInDown.delay(200).duration(800)} style={styles.form}>
                        <View style={styles.roleSwitcher}>
                            <TouchableOpacity
                                style={[styles.roleButton, role === 'tenant' && styles.activeRole]}
                                onPress={() => setRole('tenant')}
                            >
                                <Text style={[styles.roleText, role === 'tenant' && styles.activeRoleText]}>{t('tenant_dashboard')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.roleButton, role === 'landlord' && styles.activeRole]}
                                onPress={() => setRole('landlord')}
                            >
                                <Text style={[styles.roleText, role === 'landlord' && styles.activeRoleText]}>{t('landlord_dashboard')}</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>{t('user_prompt')}</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="John Doe"
                                placeholderTextColor="#999"
                                value={name}
                                onChangeText={setName}
                            />
                        </View>

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

                        <Text style={styles.termsText}>
                            By continuing, you agree to our <Text style={styles.termsLink} onPress={() => router.push('/terms')}>Terms of Service</Text>
                        </Text>

                        <TouchableOpacity style={styles.primaryButton} onPress={handleRegister}>
                            <Text style={styles.primaryButtonText}>SEND CODE</Text>
                            <Ionicons name="arrow-forward" size={18} color="#FFF" />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.linkButton} onPress={() => router.push('/login' as any)}>
                            <Text style={styles.linkText}>{t('already_account')} <Text style={styles.linkHighlight}>{t('login_link')}</Text></Text>
                        </TouchableOpacity>
                    </Animated.View>
                ) : (
                    <Animated.View entering={FadeInDown.delay(200).duration(800)} style={styles.form}>
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
                        </View>

                        <TouchableOpacity style={styles.primaryButton} onPress={verifyOtp}>
                            <Text style={styles.primaryButtonText}>VERIFY & CONTINUE</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.linkButton} onPress={() => setStep(1)}>
                            <Text style={styles.linkText}>Resend Code</Text>
                        </TouchableOpacity>
                    </Animated.View>
                )}
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
        gap: 20,
        borderTopRightRadius: 48,
        borderTopLeftRadius: 48,
        marginTop: -48,
        zIndex: 50,
        elevation: 20,
    },
    roleSwitcher: {
        flexDirection: 'row',
        backgroundColor: '#000',
        padding: 6,
        borderRadius: 16,
        marginBottom: 8,
    },
    roleButton: {
        flex: 1,
        paddingVertical: 14,
        alignItems: 'center',
        borderRadius: 12,
    },
    activeRole: {
        backgroundColor: '#FFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    roleText: {
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 14,
        color: '#fff',
    },
    activeRoleText: {
        color: '#000',
        fontFamily: 'PlusJakartaSans_700Bold',
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
        marginTop: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
        elevation: 8,
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
    termsText: {
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 12,
        color: '#888',
        textAlign: 'center',
        marginTop: 8,
        lineHeight: 18,
    },
    termsLink: {
        color: '#000',
        fontFamily: 'PlusJakartaSans_700Bold',
        textDecorationLine: 'underline',
    },
});
