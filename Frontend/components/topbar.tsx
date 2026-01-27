import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TopBar({
    title,
    showProfile = true,
    showBack,
    onBackPress,
    onNotificationPress,
    onMenuPress
}: {
    title: string;
    showProfile?: boolean;
    showBack?: boolean;
    onBackPress?: () => void;
    onNotificationPress?: () => void;
    onMenuPress?: () => void;
}) {
    const insets = useSafeAreaInsets();
    const router = useRouter();

    return (
        <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
            <View style={styles.content}>
                <View style={styles.leftSection}>
                    {showBack && (
                        <TouchableOpacity onPress={onBackPress || (() => router.back())} style={styles.iconBtn}>
                            <Ionicons name="arrow-back" size={24} color="#FFF" />
                        </TouchableOpacity>
                    )}
                    <Text style={styles.title}>{title}</Text>
                </View>

                <View style={styles.rightSection}>
                    {onNotificationPress !== undefined ? (
                        <TouchableOpacity onPress={onNotificationPress} style={styles.iconBtn}>
                            <Ionicons name="notifications-outline" size={24} color="#FFF" />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={() => router.push('/notifications')} style={styles.iconBtn}>
                            <Ionicons name="notifications-outline" size={24} color="#FFF" />
                        </TouchableOpacity>
                    )}

                    {onMenuPress !== undefined ? (
                        <TouchableOpacity onPress={onMenuPress} style={styles.iconBtn}>
                            <Ionicons name="menu-outline" size={24} color="#FFF" />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={() => router.push('/settings')} style={styles.iconBtn}>
                            <Ionicons name="menu-outline" size={24} color="#FFF" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
            <View style={styles.divider} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#000',
        paddingHorizontal: 24,
    },
    content: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 16,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    iconBtn: {
        padding: 4,
    },
    title: {
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        fontSize: 18,
        color: '#FFF',
        letterSpacing: 1,
    },
    profileCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileInitial: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 12,
        color: '#000',
    },
    divider: {
        height: 1,
        backgroundColor: '#111',
    }
});
