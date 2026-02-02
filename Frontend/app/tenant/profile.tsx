import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert, Image } from 'react-native';
import TopBar from '../../components/topbar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { TenantService } from '@/utils/tenant.service';
import { uploadProfileImage } from '@/utils/cloudinary';
import { logDashboard, logDashboardSuccess, logDashboardError } from '@/utils/monitoring';

// User service utilities
const clearUserData = async () => {
    await AsyncStorage.multiRemove(['token', 'role', 'userId', 'fullName', 'telephone', 'profileImageUrl']);
};

export default function Profile() {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [userData, setUserData] = useState({
        name: '',
        phone: '',
        email: '',
        profileImage: ''
    });

    const [tempData, setTempData] = useState({ ...userData });
    const [uploadingImage, setUploadingImage] = useState(false);

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        const startTime = Date.now();
        setLoading(true);
        
        try {
            logDashboard('TENANT', 'Loading profile data...');
            
            const fullName = await AsyncStorage.getItem('fullName') || '';
            const telephone = await AsyncStorage.getItem('telephone') || '';
            const profileImageUrl = await AsyncStorage.getItem('profileImageUrl') || '';
            const userId = await AsyncStorage.getItem('userId') || '';
            
            const data = {
                name: fullName,
                phone: telephone,
                email: '', // Email not in backend yet
                profileImage: profileImageUrl
            };
            
            setUserData(data);
            setTempData(data);
            
            const duration = Date.now() - startTime;
            logDashboardSuccess('TENANT', 'Profile data loaded', data, duration);
        } catch (error: any) {
            const duration = Date.now() - startTime;
            logDashboardError('TENANT', 'Failed to load profile', error, duration);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await clearUserData();
            router.replace('/login');
        } catch (error) {
            console.error('Logout error:', error);
            router.replace('/login');
        }
    };

    const handleSave = async () => {
        const startTime = Date.now();
        setSaving(true);
        
        try {
            logDashboard('TENANT', 'Updating profile...');
            
            const updateData: any = {};
            if (tempData.name !== userData.name) {
                updateData.fullName = tempData.name;
            }
            // Password update can be added later if needed
            
            if (Object.keys(updateData).length > 0) {
                await TenantService.updateProfile(updateData);
                
                // Update local storage
                if (updateData.fullName) {
                    await AsyncStorage.setItem('fullName', updateData.fullName);
                    setUserData({ ...tempData });
                }
            }
            
            const duration = Date.now() - startTime;
            logDashboardSuccess('TENANT', 'Profile updated successfully', updateData, duration);
            
            setIsEditing(false);
            
            // Refresh dashboard data by navigating back and triggering reload
            Alert.alert('Success', 'Profile updated successfully! The dashboard will refresh.', [
                {
                    text: 'OK',
                    onPress: () => {
                        // Trigger a refresh by going back to dashboard
                        router.push('/tenant');
                    }
                }
            ]);
        } catch (error: any) {
            const duration = Date.now() - startTime;
            logDashboardError('TENANT', 'Failed to update profile', error, duration);
            Alert.alert('Error', error.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setTempData({ ...userData });
        setIsEditing(false);
    };

    const handlePickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission needed', 'We need camera roll permissions to upload profile images');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled && result.assets && result.assets[0]) {
            const imageUri = result.assets[0].uri;
            await handleUploadProfileImage(imageUri);
        }
    };

    const handleUploadProfileImage = async (imageUri: string) => {
        const startTime = Date.now();
        setUploadingImage(true);

        try {
            logDashboard('TENANT', 'Uploading profile image...');
            
            const userId = await AsyncStorage.getItem('userId') || '';
            const role = await AsyncStorage.getItem('role') || 'TENANT';
            
            // Upload to Cloudinary in profiles/tenants folder
            const imageUrl = await uploadProfileImage(imageUri, role as 'TENANT' | 'OWNER', userId);
            
            // Store in AsyncStorage
            await AsyncStorage.setItem('profileImageUrl', imageUrl);
            
            // Update state
            setUserData({ ...userData, profileImage: imageUrl });
            setTempData({ ...tempData, profileImage: imageUrl });
            
            const duration = Date.now() - startTime;
            logDashboardSuccess('TENANT', 'Profile image uploaded successfully', { url: imageUrl }, duration);
            
            Alert.alert('Success', 'Profile image updated successfully!');
        } catch (error: any) {
            const duration = Date.now() - startTime;
            logDashboardError('TENANT', 'Failed to upload profile image', error, duration);
            Alert.alert('Error', error.message || 'Failed to upload image. Please try again.');
        } finally {
            setUploadingImage(false);
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#000" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TopBar title="My Profile" />
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Animated.View entering={FadeInDown.delay(100).duration(800)} style={styles.profileHeader}>
                    <View style={styles.avatar}>
                        {userData.profileImage ? (
                            <Image 
                                source={{ uri: userData.profileImage }} 
                                style={styles.avatarImage}
                            />
                        ) : (
                            <Text style={styles.avatarText}>{userData.name.charAt(0) || 'T'}</Text>
                        )}
                        <TouchableOpacity 
                            style={styles.editAvatar}
                            onPress={handlePickImage}
                            disabled={uploadingImage}
                        >
                            {uploadingImage ? (
                                <ActivityIndicator size="small" color="#FFF" />
                            ) : (
                                <Ionicons name="camera" size={16} color="#FFF" />
                            )}
                        </TouchableOpacity>
                    </View>
                    {isEditing ? (
                        <View style={styles.nameInputContainer}>
                            <TextInput
                                style={styles.nameInput}
                                value={tempData.name}
                                onChangeText={(text) => setTempData({ ...tempData, name: text })}
                                autoFocus
                                placeholder="Enter your full name"
                                placeholderTextColor="#999"
                            />
                        </View>
                    ) : (
                        <Text style={styles.name}>{userData.name || 'User'}</Text>
                    )}
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>Verified Tenant</Text>
                    </View>

                    {!isEditing ? (
                        <TouchableOpacity style={styles.editBtn} onPress={() => setIsEditing(true)}>
                            <Ionicons name="create-outline" size={18} color="#000" />
                            <Text style={styles.editBtnText}>Edit Profile</Text>
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.editActions}>
                            <TouchableOpacity 
                                style={[styles.saveBtn, saving && { opacity: 0.6 }]} 
                                onPress={handleSave}
                                disabled={saving}
                            >
                                {saving ? (
                                    <ActivityIndicator size="small" color="#FFF" />
                                ) : (
                                    <Text style={styles.saveBtnText}>Save</Text>
                                )}
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel} disabled={saving}>
                                <Text style={styles.cancelBtnText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(200).duration(800)} style={styles.section}>
                    <Text style={styles.sectionTitle}>Identity & Contact</Text>
                    <View style={styles.infoBox}>
                        <View style={styles.infoRow}>
                            <View style={styles.infoIconBox}>
                                <Ionicons name="call-outline" size={18} color="#000" />
                            </View>
                            <View style={styles.infoText}>
                                <Text style={styles.label}>Phone Number</Text>
                                {isEditing ? (
                                    <TextInput
                                        style={styles.valueInputEdit}
                                        value={tempData.phone}
                                        onChangeText={(text) => setTempData({ ...tempData, phone: text })}
                                        keyboardType="phone-pad"
                                        placeholder="Enter phone number"
                                        placeholderTextColor="#999"
                                    />
                                ) : (
                                    <Text style={styles.value}>{userData.phone || 'Not provided'}</Text>
                                )}
                            </View>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.infoRow}>
                            <View style={styles.infoIconBox}>
                                <Ionicons name="mail-outline" size={18} color="#000" />
                            </View>
                            <View style={styles.infoText}>
                                <Text style={styles.label}>Email Address</Text>
                                {isEditing ? (
                                    <TextInput
                                        style={styles.valueInput}
                                        value={tempData.email}
                                        onChangeText={(text) => setTempData({ ...tempData, email: text })}
                                        keyboardType="email-address"
                                        editable={false}
                                        placeholder="Email not available"
                                    />
                                ) : (
                                    <Text style={styles.value}>{userData.email || 'Not provided'}</Text>
                                )}
                            </View>
                        </View>
                    </View>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(300).duration(800)} style={styles.section}>
                    <Text style={styles.sectionTitle}>Account Settings</Text>
                    <View style={styles.infoBox}>
                        <TouchableOpacity style={styles.settingRow}>
                            <View style={styles.settingLeft}>
                                <Ionicons name="settings-outline" size={20} color="#000" />
                                <Text style={styles.settingText}>General Settings</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={18} color="#CCC" />
                        </TouchableOpacity>
                        <View style={styles.divider} />
                        <TouchableOpacity style={styles.settingRow}>
                            <View style={styles.settingLeft}>
                                <Ionicons name="help-circle-outline" size={20} color="#000" />
                                <Text style={styles.settingText}>Help & Support</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={18} color="#CCC" />
                        </TouchableOpacity>
                    </View>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(400).duration(800)}>
                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <Ionicons name="log-out-outline" size={22} color="#FF3B30" />
                        <Text style={styles.logoutText}>Log Out Account</Text>
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
    },
    profileHeader: {
        alignItems: 'center',
        marginBottom: 32,
    },
    avatar: {
        width: 110,
        height: 110,
        borderRadius: 54,
        backgroundColor: '#F0F0F0',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        overflow: 'hidden',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },
    avatarText: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 36,
        color: '#000',
    },
    editAvatar: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#000',
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#FFF',
    },
    name: {
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        fontSize: 24,
        color: '#000',
    },
    badge: {
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        marginTop: 10,
    },
    badgeText: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 12,
        color: '#4CAF50',
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 16,
        color: '#000',
        marginBottom: 16,
    },
    infoBox: {
        backgroundColor: '#F9F9F9',
        borderRadius: 16,
        padding: 24,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    infoIconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#EEE',
    },
    label: {
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 12,
        color: '#888',
        marginBottom: 2,
    },
    value: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 15,
        color: '#000',
    },
    divider: {
        height: 1,
        backgroundColor: '#EEE',
        marginVertical: 16,
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    settingText: {
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 15,
        color: '#000',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        paddingVertical: 20,
        borderRadius: 16,
        backgroundColor: '#FFF1F0',
    },
    logoutText: {
        fontFamily: 'PlusJakartaSans_700Bold',
        color: '#FF3B30',
        fontSize: 15,
    },
    nameInputContainer: {
        width: '100%',
        alignItems: 'center',
        marginTop: 8,
    },
    nameInput: {
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        fontSize: 24,
        color: '#000',
        backgroundColor: '#F9F9F9',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 12,
        padding: 12,
        paddingHorizontal: 16,
        textAlign: 'center',
        minWidth: 200,
    },
    valueInput: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 15,
        color: '#000',
        padding: 0,
        margin: 0,
    },
    valueInputEdit: {
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 15,
        color: '#000',
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        padding: 12,
        marginTop: 4,
    },
    editBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 16,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
        backgroundColor: '#F5F5F5',
    },
    editBtnText: {
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 14,
    },
    editActions: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 16,
    },
    saveBtn: {
        backgroundColor: '#000',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 12,
    },
    saveBtnText: {
        color: '#FFF',
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    cancelBtn: {
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 12,
    },
    cancelBtnText: {
        color: '#666',
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    infoText: {
        flex: 1,
    }
});
