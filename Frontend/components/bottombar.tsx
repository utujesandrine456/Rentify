import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function BottomBar({
    role,
    activeTab,
    onTabPress
}: {
    role: 'tenant' | 'landlord';
    activeTab?: string;
    onTabPress?: (tab: string) => void;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const insets = useSafeAreaInsets();

    const tabs = role === 'tenant' ? [
        { name: 'Home', icon: 'home-outline', activeIcon: 'home', path: '/tenant' },
        { name: 'Explore', icon: 'search-outline', activeIcon: 'search', path: '/tenant/explore' },
        { name: 'Pay', icon: 'wallet-outline', activeIcon: 'wallet', path: '/tenant/pay' },
        { name: 'History', icon: 'time-outline', activeIcon: 'time', path: '/tenant/history' },
        { name: 'Profile', icon: 'person-outline', activeIcon: 'person', path: '/tenant/profile' },
    ] : [
        { name: 'Overview', icon: 'grid-outline', activeIcon: 'grid', path: '/landlord' },
        { name: 'Tenants', icon: 'people-outline', activeIcon: 'people', path: '/landlord/tenants' },
        { name: 'Search', icon: 'search-outline', activeIcon: 'search', path: '/landlord/search' },
        { name: 'Properties', icon: 'business-outline', activeIcon: 'business', path: '/landlord/properties' },
        { name: 'Profile', icon: 'person-outline', activeIcon: 'person', path: '/landlord/profile' },
    ];

    return (
        <View style={[styles.container, { bottom: insets.bottom }]}>
            <View style={styles.dock}>
                {tabs.map((tab) => {
                    const isActive = pathname === tab.path;
                    return (
                        <TouchableOpacity
                            key={tab.name}
                            style={styles.tab}
                            onPress={() => {
                                if (onTabPress) {
                                    let target = tab.name.toLowerCase();
                                    if (tab.name === 'Pay') target = 'pay';
                                    onTabPress(target);
                                } else {
                                    router.push(tab.path as any);
                                }
                            }}
                        >
                            <Ionicons
                                name={(isActive ? tab.activeIcon : tab.icon) as any}
                                size={22}
                                color={isActive ? '#FFF' : '#888'}
                            />
                            {isActive && <View style={styles.activeDot} />}
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 10,
        right: 10,
        backgroundColor: '#000',
        borderRadius: 16,
        height: 64,
        elevation: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        borderWidth: 1,
        borderColor: '#222',
        overflow: 'hidden',
    },
    dock: {
        backgroundColor: 'transparent',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: 64,
        width: '100%',
    },
    tab: {
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        flex: 1,
    },
    activeDot: {
        position: 'absolute',
        bottom: 12,
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#FFF',
    }
});
