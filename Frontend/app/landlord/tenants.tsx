import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Linking } from 'react-native';
import TopBar from '../../components/topbar';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function Tenants() {
    const [searchText, setSearchText] = useState('');

    const tenants = [
        { id: 1, name: 'Alice M.', property: 'Sunset Apts #4', status: 'PAID', lastPayment: 'Feb 02', phone: '+250780000001' },
        { id: 2, name: 'John D.', property: 'Kiyovu Villa', status: 'LATE', lastPayment: 'Jan 05', phone: '+250780000002' },
        { id: 3, name: 'Grace K.', property: 'Sunset Apts #2', status: 'PENDING', lastPayment: 'Jan 30', phone: '+250780000003' },
    ];

    const filteredTenants = tenants.filter(t =>
        t.name.toLowerCase().includes(searchText.toLowerCase()) ||
        t.property.toLowerCase().includes(searchText.toLowerCase())
    );

    const handleCall = (phone: string) => {
        Linking.openURL(`tel:${phone}`);
    };

    return (
        <View style={styles.container}>
            <TopBar title="Tenants" />

            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search name or property..."
                    value={searchText}
                    onChangeText={setSearchText}
                    placeholderTextColor="#888"
                />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {filteredTenants.map((tenant, index) => (
                    <Animated.View
                        key={tenant.id}
                        entering={FadeInDown.delay(index * 100).duration(600)}
                        style={styles.card}
                    >
                        <View style={styles.row}>
                            <View style={styles.avatar}>
                                <Text style={styles.avatarText}>{tenant.name.charAt(0)}</Text>
                            </View>
                            <View style={styles.info}>
                                <Text style={styles.name}>{tenant.name}</Text>
                                <Text style={styles.prop}>{tenant.property}</Text>
                            </View>
                            <View style={[styles.statusBadge,
                            tenant.status === 'PAID' ? styles.statusPaid :
                                tenant.status === 'LATE' ? styles.statusLate : styles.statusPending
                            ]}>
                                <Text style={styles.statusText}>{tenant.status}</Text>
                            </View>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.footer}>
                            <Text style={styles.lastPaymentLabel}>Last Payment: {tenant.lastPayment}</Text>
                            <TouchableOpacity
                                style={styles.callButton}
                                onPress={() => handleCall(tenant.phone)}
                            >
                                <Ionicons name="call" size={16} color="#FFF" />
                                <Text style={styles.callButtonText}>Call</Text>
                            </TouchableOpacity>
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
        backgroundColor: '#F7F7F7',
    },
    scrollContent: {
        padding: 24,
        paddingBottom: 140,
        gap: 16,
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginBottom: 16,
    },
    avatar: {
        width: 48, height: 48, borderRadius: 24, backgroundColor: '#F0F0F0', alignItems: 'center', justifyContent: 'center',
    },
    avatarText: {
        fontFamily: 'PlusJakartaSans_700Bold', fontSize: 20, color: '#000',
    },
    info: { flex: 1 },
    name: { fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 16, color: '#000' },
    prop: { fontFamily: 'PlusJakartaSans_400Regular', fontSize: 12, color: '#888' },
    statusBadge: {
        paddingHorizontal: 12, paddingVertical: 6, borderRadius: 100,
    },
    statusPaid: { backgroundColor: '#E0F8E3' }, // green light
    statusLate: { backgroundColor: '#FFEDED' }, // red light
    statusPending: { backgroundColor: '#FFF4E0' }, // orange light
    statusText: {
        fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 10, color: '#000',
    },
    divider: { height: 1, backgroundColor: '#F5F5F5', marginBottom: 12 },
    footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    lastPaymentLabel: {
        fontFamily: 'PlusJakartaSans_400Regular', fontSize: 12, color: '#888',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        margin: 24,
        marginBottom: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#EEE',
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 15,
        color: '#000',
    },
    callButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#000',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
    },
    callButtonText: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 13,
        color: '#FFF',
    }
});
