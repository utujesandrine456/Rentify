import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import TopBar from '../components/topbar';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TenantService } from '../utils/tenant.service';
import { LandlordService } from '../context/landlord.service';
import { logPageLoad, logPageAction, logPageError } from '../utils/monitoring';


interface Notification {
    id: string;
    message: string;
    type: string;
    isRead: boolean;
    createdAt: string;
}


export default function Notifications() {
    const router = useRouter();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [userRole, setUserRole] = useState<string>('');

    useEffect(() => {
        loadUserRole();
    }, []);

    useEffect(() => {
        if (userRole) {
            loadNotifications();
        }
    }, [userRole]);

    const loadUserRole = async () => {
        try {
            const role = await AsyncStorage.getItem('role');
            setUserRole(role || '');
        } catch (error) {
            console.error('Failed to load user role:', error);
        }
    };

    const loadNotifications = useCallback(async () => {
        const startTime = Date.now();
        setLoading(true);
        logPageLoad('Notifications', 'Loading notifications', { role: userRole });

        try {
            let data: Notification[] = [];
            
            if (userRole === 'TENANT') {
                data = await TenantService.getNotifications();
            } else if (userRole === 'OWNER' || userRole === 'LANDLORD') {
                try {
                    data = await LandlordService.getNotifications();
                } catch (landlordError: any) {
                    // If landlord notification endpoint doesn't exist yet, show empty state
                    if (landlordError.message?.includes('404') || landlordError.message?.includes('Not Found')) {
                        logPageAction('Notifications', 'Landlord notification endpoint not available yet', { role: userRole });
                        data = [];
                    } else {
                        throw landlordError;
                    }
                }
            } else {
                logPageAction('Notifications', 'Unknown user role', { role: userRole });
                data = [];
            }

            setNotifications(data);
            
            const duration = Date.now() - startTime;
            logPageAction('Notifications', 'Notifications loaded successfully', {
                count: data.length,
                role: userRole
            }, duration);

        } catch (error: any) {
            const duration = Date.now() - startTime;
            logPageError('Notifications', 'Failed to load notifications', error, duration);
            // Don't show alert for 404 errors (endpoint might not exist yet)
            if (!error.message?.includes('404') && !error.message?.includes('Not Found')) {
                Alert.alert('Error', error.message || 'Failed to load notifications.');
            }
            setNotifications([]); // Set empty array on error
        } finally {
            setLoading(false);
        }
    }, [userRole]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadNotifications();
        setRefreshing(false);
    }, [loadNotifications]);

    const handleMarkAsRead = async (notificationId: string) => {
        logPageAction('Notifications', 'Marking notification as read', { notificationId });
        
        try {
            if (userRole === 'TENANT') {
                await TenantService.markNotificationAsRead(notificationId);
            } else if (userRole === 'OWNER' || userRole === 'LANDLORD') {
                await LandlordService.markNotificationAsRead(notificationId);
            }

            // Update local state
            setNotifications(prev => 
                prev.map(notif => 
                    notif.id === notificationId ? { ...notif, isRead: true } : notif
                )
            );

            logPageAction('Notifications', 'Notification marked as read', { notificationId });
        } catch (error: any) {
            logPageError('Notifications', 'Failed to mark notification as read', error);
            Alert.alert('Error', 'Failed to mark notification as read.');
        }
    };

    const getNotificationIcon = (type: string): string => {
        const typeUpper = type.toUpperCase();
        if (typeUpper.includes('RENT_REMINDER') || typeUpper.includes('REMINDER')) {
            return 'calendar-outline';
        } else if (typeUpper.includes('PAYMENT') || typeUpper.includes('RECEIVED')) {
            return 'checkmark-circle-outline';
        } else if (typeUpper.includes('PROPERTY') || typeUpper.includes('ASSIGNED')) {
            return 'home-outline';
        } else if (typeUpper.includes('ALERT') || typeUpper.includes('WARNING')) {
            return 'alert-circle-outline';
        }
        return 'information-circle-outline';
    };

    const getNotificationTypeColor = (type: string, isRead: boolean): { bg: string; icon: string } => {
        const typeUpper = type.toUpperCase();
        if (typeUpper.includes('RENT_REMINDER') || typeUpper.includes('REMINDER') || typeUpper.includes('ALERT')) {
            return { bg: '#FFF1F0', icon: '#FF3B30' };
        } else if (typeUpper.includes('PAYMENT') || typeUpper.includes('RECEIVED')) {
            return { bg: '#E8F5E9', icon: '#4CD964' };
        } else if (typeUpper.includes('PROPERTY') || typeUpper.includes('ASSIGNED')) {
            return { bg: '#E3F2FD', icon: '#007AFF' };
        }
        return { bg: '#F0F9FF', icon: '#007AFF' };
    };

    const getNotificationTitle = (type: string): string => {
        const typeUpper = type.toUpperCase();
        if (typeUpper.includes('RENT_REMINDER')) return 'Rent Reminder';
        if (typeUpper.includes('PAYMENT_RECEIVED')) return 'Payment Received';
        if (typeUpper.includes('PROPERTY_ASSIGNED')) return 'Property Assigned';
        if (typeUpper.includes('PAYMENT')) return 'Payment Update';
        return 'Notification';
    };

    const formatTimeAgo = (dateString: string): string => {
        if (!dateString) return 'Recently';
        
        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffInMs = now.getTime() - date.getTime();
            const diffInMinutes = Math.floor(diffInMs / 60000);
            const diffInHours = Math.floor(diffInMs / 3600000);
            const diffInDays = Math.floor(diffInMs / 86400000);

            if (diffInMinutes < 1) return 'Just now';
            if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
            if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
            if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
            
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined });
        } catch (error) {
            return 'Recently';
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#000" />
                <Text style={{ marginTop: 16, fontFamily: 'PlusJakartaSans_500Medium', color: '#888' }}>
                    Loading notifications...
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TopBar
                title="Notifications"
                showBack
                onBackPress={() => router.back()}
                showProfile={false}
            />
            <ScrollView 
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {notifications.length === 0 ? (
                    <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.emptyContainer}>
                        <Ionicons name="notifications-outline" size={48} color="#EEE" />
                        <Text style={styles.emptyText}>No notifications yet</Text>
                        <Text style={styles.emptySubtext}>You'll see updates here when they arrive</Text>
                    </Animated.View>
                ) : (
                    notifications.map((notif, index) => {
                        const colors = getNotificationTypeColor(notif.type, notif.isRead);
                        const icon = getNotificationIcon(notif.type);
                        const title = getNotificationTitle(notif.type);

                        return (
                            <TouchableOpacity
                                key={notif.id}
                                activeOpacity={0.7}
                                onPress={() => !notif.isRead && handleMarkAsRead(notif.id)}
                            >
                                <Animated.View
                                    entering={FadeInDown.delay(index * 100).duration(600)}
                                    style={[
                                        styles.notifCard,
                                        !notif.isRead && styles.unreadCard
                                    ]}
                                >
                                    <View style={[styles.iconBox, { backgroundColor: colors.bg }]}>
                                        <Ionicons
                                            name={icon as any}
                                            size={22}
                                            color={colors.icon}
                                        />
                                    </View>
                                    <View style={styles.content}>
                                        <View style={styles.header}>
                                            <View style={styles.titleRow}>
                                                <Text style={styles.notifTitle}>{title}</Text>
                                                {!notif.isRead && <View style={styles.unreadDot} />}
                                            </View>
                                            <Text style={styles.time}>{formatTimeAgo(notif.createdAt)}</Text>
                                        </View>
                                        <Text style={styles.notifMessage}>{notif.message}</Text>
                                    </View>
                                </Animated.View>
                            </TouchableOpacity>
                        );
                    })
                )}
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
    },
    unreadCard: {
        backgroundColor: '#F5F9FF',
        borderColor: '#E0E8FF',
        borderWidth: 1.5,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#007AFF',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 80,
    },
    emptyText: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 18,
        color: '#888',
        marginTop: 16,
    },
    emptySubtext: {
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 14,
        color: '#AAA',
        marginTop: 8,
    },
});
