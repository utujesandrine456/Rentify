import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Animated as RNAnimated } from 'react-native';
import TopBar from '../../components/topbar';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useRouter } from 'expo-router';

export default function LandlordSearch() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const router = useRouter();

    const handleSearch = () => {
        if (searchQuery.length > 5) {
            setIsSearching(true);
            setTimeout(() => {
                router.push({
                    pathname: '/tenant/[id]/public',
                    params: { id: '1' }
                } as any);
                setIsSearching(false);
            }, 1000);
        } else {
            alert('Please enter a valid phone number');
        }
    };

    return (
        <View style={styles.container}>
            <TopBar title="Search Tenant" />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Animated.View entering={FadeInDown.delay(100).duration(800)} style={styles.headerSection}>
                    <Text style={styles.title}>Verify Your Next Tenant</Text>
                    <Text style={styles.subtitle}>Enter a tenant's phone number to see their reliability score and payment history.</Text>
                </Animated.View>

                <Animated.View entering={FadeInUp.delay(200).duration(800)} style={styles.searchContainer}>
                    <View style={styles.inputWrapper}>
                        <Ionicons name="call-outline" size={20} color="#888" style={styles.searchIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="+250 788 000 000"
                            placeholderTextColor="#999"
                            keyboardType="phone-pad"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.searchBtn, searchQuery.length < 8 && styles.searchBtnDisabled]}
                        onPress={handleSearch}
                        disabled={isSearching || searchQuery.length < 8}
                    >
                        {isSearching ? (
                            <Text style={styles.searchBtnText}>SEARCHING...</Text>
                        ) : (
                            <>
                                <Text style={styles.searchBtnText}>VIEW PROFILE</Text>
                                <Ionicons name="arrow-forward" size={18} color="#FFF" />
                            </>
                        )}
                    </TouchableOpacity>
                </Animated.View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FB',
    },
    scrollContent: {
        padding: 24,
        paddingBottom: 120,
    },
    headerSection: {
        marginBottom: 32,
    },
    title: {
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        fontSize: 24,
        color: '#000',
        marginBottom: 12,
        textAlign: 'center'
    },
    subtitle: {
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
    searchContainer: {
        backgroundColor: '#FFF',
        padding: 24,
        borderRadius: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.05,
        shadowRadius: 20,
        elevation: 5,
        marginBottom: 32,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F7F7F7',
        borderRadius: 16,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#EEE',
        marginBottom: 16,
    },
    searchIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        height: 56,
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 16,
        color: '#000',
    },
    searchBtn: {
        backgroundColor: '#000',
        height: 56,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    searchBtnDisabled: {
        opacity: 0.5,
    },
    searchBtnText: {
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        color: '#FFF',
        fontSize: 14,
        letterSpacing: 1,
    },
    infoSection: {
        gap: 20,
    },
    infoTitle: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 18,
        color: '#000',
        marginBottom: 16,
    },
    infoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 20,
        borderRadius: 24,
        gap: 16,
    },
    infoIconWrapper: {
        width: 50,
        height: 50,
        borderRadius: 12,
        backgroundColor: '#F8F9FB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    infoContent: {
        flex: 1,
    },
    infoPointTitle: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 16,
        color: '#000',
        marginBottom: 4,
    },
    infoPointDesc: {
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 13,
        color: '#666',
        lineHeight: 18,
    },
});
