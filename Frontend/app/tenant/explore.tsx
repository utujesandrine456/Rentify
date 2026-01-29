import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, FlatList, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import TopBar from '../../components/topbar';
import { useLanguage } from '../../context/LanguageContext';

const MOCK_DATA = [
    {
        id: '1',
        type: 'houses',
        title: 'Modern Villa',
        location: 'Kigali, Nyarutarama',
        price: 450000,
        image: require('../../assets/images/RentifyLanding.jpg'),
        rating: '4.8',
    },
    {
        id: '2',
        type: 'houses',
        title: 'Cozy Apartment',
        location: 'Kigali, Kacyiru',
        price: 150000,
        image: require('../../assets/images/RentifyLanding.jpg'),
        rating: '4.5',
    },
    {
        id: '4',
        type: 'houses',
        title: 'Luxury Penthouse',
        location: 'Kigali, Kimihurura',
        price: 850000,
        image: require('../../assets/images/RentifyLanding.jpg'),
        rating: '5.0',
    },
];

export default function Explore() {
    const router = useRouter();
    const { t } = useLanguage();

    const [searchText, setSearchText] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [activePriceRange, setActivePriceRange] = useState('all');

    const PRICE_RANGES = [
        { id: 'all', label: t('all_prices') },
        { id: 'low', label: t('under_100k') },
        { id: 'mid', label: t('mid_range') },
        { id: 'high', label: t('high_range') },
    ];

    useEffect(() => {
        const handler = setTimeout(() => {
            setSearchQuery(searchText);
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [searchText]);

    const filteredData = MOCK_DATA.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.location.toLowerCase().includes(searchQuery.toLowerCase());

        let matchesPrice = true;
        if (activePriceRange === 'low') matchesPrice = item.price < 100000;
        else if (activePriceRange === 'mid') matchesPrice = item.price >= 100000 && item.price <= 500000;
        else if (activePriceRange === 'high') matchesPrice = item.price > 500000;

        return matchesSearch && matchesPrice;
    });

    const renderItem = ({ item }: { item: typeof MOCK_DATA[0] }) => (
        <View style={styles.card}>
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => router.push({ pathname: '/tenant/explore/[id]', params: { id: item.id } } as any)}
            >
                <Image source={item.image} style={styles.cardImage} />
                <View style={styles.cardContent}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>{item.title}</Text>
                        <View style={styles.ratingBox}>
                            <Ionicons name="star" size={12} color="#FFCC00" />
                            <Text style={styles.ratingText}>{item.rating}</Text>
                        </View>
                    </View>
                    <View style={styles.locationRow}>
                        <Ionicons name="location-outline" size={14} color="#888" />
                        <Text style={styles.cardLocation}>{item.location}</Text>
                    </View>
                    <View style={styles.priceRow}>
                        <Text style={styles.priceLabel}>{t('price')}</Text>
                        <Text style={styles.priceValue}>
                            {item.price.toLocaleString()} Frw
                            {item.type === 'cars' ? ' / day' : ''}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <TopBar
                title={t('explore')}
                onNotificationPress={() => router.push('/notifications')}
            />

            {/* Fixed Header Section */}
            <View style={styles.headerContainer}>
                <View style={styles.searchSection}>
                    <View style={styles.searchBar}>
                        <Ionicons name="search-outline" size={20} color="#666" />
                        <TextInput
                            style={styles.searchInput}
                            placeholder={`${t('search')} properties...`}
                            value={searchText}
                            onChangeText={setSearchText}
                            placeholderTextColor="#999"
                        />
                        {searchText.length > 0 && (
                            <TouchableOpacity onPress={() => setSearchText('')}>
                                <Ionicons name="close-circle" size={20} color="#CCC" />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                <View style={styles.filterSection}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersContent}>
                        {PRICE_RANGES.map((range, index) => (
                            <Animated.View key={range.id} entering={FadeInRight.delay(index * 100).duration(400)}>
                                <TouchableOpacity
                                    style={[styles.filterChip, activePriceRange === range.id && styles.activeFilterChip]}
                                    onPress={() => setActivePriceRange(range.id)}
                                >
                                    <Text style={[styles.filterText, activePriceRange === range.id && styles.activeFilterText]}>
                                        {range.label}
                                    </Text>
                                </TouchableOpacity>
                            </Animated.View>
                        ))}
                    </ScrollView>
                </View>
            </View>

            <FlatList
                data={filteredData}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="search-outline" size={48} color="#EEE" />
                        <Text style={styles.emptyText}>{t('no_results')}</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    headerContainer: {
        backgroundColor: '#F8FAFC',
        paddingBottom: 8,
        zIndex: 100, // Ensure header is above list
    },
    searchSection: {
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 8,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 52,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    searchInput: {
        flex: 1,
        marginLeft: 12,
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 16,
        color: '#1A1A1A',
    },
    filterSection: {
        paddingBottom: 8,
    },
    filtersContent: {
        paddingHorizontal: 20,
        gap: 8,
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    activeFilterChip: {
        backgroundColor: '#1A1A1A',
        borderColor: '#1A1A1A',
        elevation: 2,
    },
    filterText: {
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 13,
        color: '#64748B',
    },
    activeFilterText: {
        color: '#FFF',
        fontFamily: 'PlusJakartaSans_600SemiBold',
    },
    listContent: {
        padding: 20,
        paddingTop: 8,
        paddingBottom: 120,
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        marginBottom: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#F0F0F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 2,
    },
    cardImage: {
        width: '100%',
        height: 200,
        backgroundColor: '#F1F5F9',
    },
    cardContent: {
        padding: 16,
        gap: 10,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardTitle: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 18,
        color: '#1A1A1A',
    },
    ratingBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF9E6',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        gap: 4,
    },
    ratingText: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 12,
        color: '#F59E0B',
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    cardLocation: {
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 14,
        color: '#64748B',
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    priceLabel: {
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 13,
        color: '#94A3B8',
    },
    priceValue: {
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        fontSize: 18,
        color: '#1A1A1A',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        gap: 16,
    },
    emptyText: {
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 16,
        color: '#94A3B8',
    }
});
