import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native';
import TopBar from '../../components/topbar';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useLanguage } from '../../context/LanguageContext';

const { width } = Dimensions.get('window');

export default function LandlordSearch() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const router = useRouter();
    const { t } = useLanguage();

    const handleSearch = () => {
        if (searchQuery.length > 5) {
            setIsSearching(true);
            // Simulate API call
            setTimeout(() => {
                router.push({
                    pathname: '/tenant/[id]/public',
                    params: { id: '1' } // Mock ID
                } as any);
                setIsSearching(false);
            }, 1200);
        } else {
            alert(t('valid_phone_msg'));
        }
    };

    const clearSearch = () => {
        setSearchQuery('');
    };

    const INFO_CARDS = [
        {
            icon: 'shield-checkmark-outline',
            title: 'Verified Identity',
            desc: 'Ensure your future tenant is who they say they are.',
            color: '#E8F5E9',
            iconColor: '#2E7D32'
        },
        {
            icon: 'wallet-outline',
            title: 'Payment History',
            desc: 'View past rent payment behaviors and credit reliability.',
            color: '#FFF3E0',
            iconColor: '#F57C00'
        },
        {
            icon: 'star-outline',
            title: 'Community Rating',
            desc: 'See feedback from previous landlords.',
            color: '#E3F2FD',
            iconColor: '#1565C0'
        }
    ];

    return (
        <View style={styles.container}>
            <TopBar title={t('search_tenant')} />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.headerSpacer} />

                <Animated.View entering={FadeInDown.delay(100).duration(800)} style={styles.headerSection}>
                    <Text style={styles.title}>{t('verify_tenant_title')}</Text>
                    <Text style={styles.subtitle}>{t('verify_tenant_subtitle')}</Text>
                </Animated.View>

                <Animated.View entering={FadeInUp.delay(200).duration(800)} style={styles.searchContainer}>
                    <View style={styles.inputLabelRow}>
                        <Text style={styles.inputLabel}>Tenant Phone Number</Text>
                    </View>

                    <View style={[styles.inputWrapper, searchQuery.length > 0 && styles.inputWrapperActive]}>
                        <Ionicons name="call-outline" size={20} color="#666" style={styles.searchIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="+250 788 000 000"
                            placeholderTextColor="#AAA"
                            keyboardType="phone-pad"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity onPress={clearSearch} style={styles.clearBtn}>
                                <Ionicons name="close-circle" size={20} color="#CCC" />
                            </TouchableOpacity>
                        )}
                    </View>

                    <TouchableOpacity
                        style={[styles.searchBtn, searchQuery.length < 8 && styles.searchBtnDisabled]}
                        onPress={handleSearch}
                        disabled={isSearching || searchQuery.length < 8}
                        activeOpacity={0.8}
                    >
                        {isSearching ? (
                            <View style={styles.loadingRow}>
                                <Ionicons name="reload" size={20} color="#FFF" style={styles.spinningIcon} />
                                <Text style={styles.searchBtnText}>{t('searching')}</Text>
                            </View>
                        ) : (
                            <>
                                <Text style={styles.searchBtnText}>{t('view_profile')}</Text>
                                <Ionicons name="arrow-forward" size={20} color="#FFF" />
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
        backgroundColor: '#F8FAFC',
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingBottom: 120,
    },
    headerSpacer: {
        height: 32,
    },
    headerSection: {
        alignItems: 'center',
        marginBottom: 32,
    },
    iconCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    title: {
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        fontSize: 24,
        color: '#1A1A1A',
        marginBottom: 8,
        textAlign: 'center',
        letterSpacing: -0.5,
    },
    subtitle: {
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 15,
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 22,
        maxWidth: '90%',
    },
    searchContainer: {
        backgroundColor: '#FFF',
        padding: 24,
        borderRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 24,
        elevation: 8,
        marginBottom: 40,
    },
    inputLabelRow: {
        marginBottom: 8,
    },
    inputLabel: {
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 13,
        color: '#64748B',
        marginLeft: 4,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
        paddingHorizontal: 16,
        borderWidth: 1.5,
        borderColor: '#ccc',
        marginBottom: 20,
        height: 60,
    },
    inputWrapperActive: {
        borderColor: '#000',
    },
    searchIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        height: '100%',
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 18,
        color: '#000',
    },
    clearBtn: {
        padding: 4,
    },
    searchBtn: {
        backgroundColor: '#000',
        height: 56,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 4,
    },
    searchBtnDisabled: {
        backgroundColor: '#ccc',
        shadowOpacity: 0,
        elevation: 0,
    },
    loadingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    searchBtnText: {
        fontFamily: 'PlusJakartaSans_700Bold',
        color: '#FFF',
        fontSize: 16,
    },
    infoSection: {
        gap: 16,
    },
    sectionTitle: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 18,
        color: '#000',
        marginLeft: 4,
    },
    cardsGrid: {
        gap: 16,
    },
    infoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 1,
        gap: 16,
    },
    cardIconBox: {
        width: 48,
        height: 48,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardContent: {
        flex: 1,
        gap: 4,
    },
    cardTitle: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 16,
        color: '#1A1A1A',
    },
    cardDesc: {
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 13,
        color: '#64748B',
        lineHeight: 18,
    },
});
