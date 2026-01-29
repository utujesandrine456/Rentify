import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import TopBar from '../components/topbar';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';

export default function Notifications() {
    const router = useRouter();

    const notifications = [
        {
            id: 1,
            title: 'Rent Reminder',
            message: 'Your rent for February 2026 is due in 3 days.',
            time: '2 hours ago',
            type: 'alert',
            icon: 'calendar'
        },
        {
            id: 2,
            title: 'Payment Confirmed',
            message: 'Your payment of 150,000 Frw for January has been processed.',
            time: '1 day ago',
            type: 'success',
            icon: 'checkmark-circle'
        },
        {
            id: 3,
            title: 'Maintenance Update',
            message: 'The scheduled elevator maintenance is now complete.',
            time: '3 days ago',
            type: 'info',
            icon: 'information-circle'
        }
    ];

    return (
        <View style={styles.container}>
            <TopBar
                title="Notifications"
                showBack
                onBackPress={() => router.back()}
                showProfile={false}
            />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {notifications.map((notif, index) => (
                    <Animated.View
                        key={notif.id}
                        entering={FadeInDown.delay(index * 100).duration(600)}
                        style={styles.notifCard}
                    >
                        <View style={[styles.iconBox, { backgroundColor: notif.type === 'alert' ? '#FFF1F0' : '#F0F9FF' }]}>
                            <Ionicons
                                name={notif.icon as any}
                                size={22}
                                color={notif.type === 'alert' ? '#FF3B30' : '#007AFF'}
                            />
                        </View>
                        <View style={styles.content}>
                            <View style={styles.header}>
                                <Text style={styles.notifTitle}>{notif.title}</Text>
                                <Text style={styles.time}>{notif.time}</Text>
                            </View>
                            <Text style={styles.notifMessage}>{notif.message}</Text>
                        </View>
                    </Animated.View>
                ))}
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
        gap: 16,
    },
    notifCard: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: '#FAFAFA',
        borderRadius: 20,
        gap: 8,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    iconBox: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flex: 1,
        gap: 2,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    notifTitle: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 16,
        color: '#000',
    },
    time: {
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 11,
        color: '#999',
    },
    notifMessage: {
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 12,
        color: '#666',
        lineHeight: 24,
    }
});
