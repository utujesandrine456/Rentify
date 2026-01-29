import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import TopBar from '../../components/topbar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function Profile() {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);

    const [userData, setUserData] = useState({
        name: 'Tony Manero',
        phone: '+250 788 123 456',
        email: 'tony.m@rentify.com'
    });

    const [tempData, setTempData] = useState({ ...userData });

    const handleLogout = () => {
        router.replace('/login');
    };

    const handleSave = () => {
        setUserData({ ...tempData });
        setIsEditing(false);
    };

    const handleCancel = () => {
        setTempData({ ...userData });
        setIsEditing(false);
    };

    return (
        <View style={styles.container}>
            <TopBar title="My Profile" />
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Animated.View entering={FadeInDown.delay(100).duration(800)} style={styles.profileHeader}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{userData.name.charAt(0)}</Text>
                        <TouchableOpacity style={styles.editAvatar}>
                            <Ionicons name="camera" size={16} color="#FFF" />
                        </TouchableOpacity>
                    </View>
                    {isEditing ? (
                        <TextInput
                            style={styles.nameInput}
                            value={tempData.name}
                            onChangeText={(text) => setTempData({ ...tempData, name: text })}
                            autoFocus
                        />
                    ) : (
                        <Text style={styles.name}>{userData.name}</Text>
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
                            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                                <Text style={styles.saveBtnText}>Save</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
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
                                        style={styles.valueInput}
                                        value={tempData.phone}
                                        onChangeText={(text) => setTempData({ ...tempData, phone: text })}
                                        keyboardType="phone-pad"
                                    />
                                ) : (
                                    <Text style={styles.value}>{userData.phone}</Text>
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
                                    />
                                ) : (
                                    <Text style={styles.value}>{userData.email}</Text>
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
    nameInput: {
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        fontSize: 24,
        color: '#000',
        borderBottomWidth: 1,
        borderColor: '#EEE',
    },
    valueInput: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 15,
        color: '#000',
        padding: 0,
        margin: 0,
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
