import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, FlatList, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import TopBar from '../../components/topbar';

const { width } = Dimensions.get('window');

const CATEGORIES = [
    { id: 'houses', label: 'Houses', icon: 'home-outline' },
    { id: 'cars', label: 'Cars', icon: 'car-outline' },
];

const PRICE_RANGES = [
    { id: 'all', label: 'All Prices' },
    { id: 'low', label: 'Under 100k' },
    { id: 'mid', label: '100k - 500k' },
    { id: 'high', label: '500k+' },
];

const MOCK_DATA = [
    {
        id: '1',
        type: 'houses',
        title: 'Modern Villa',
        location: 'Kigali, Nyarutarama',
        price: '450,000',
        image: require('../../assets/images/RentifyLanding.jpg'),
        rating: '4.8',
    },
    {
        id: '2',
        type: 'houses',
        title: 'Cozy Apartment',
        location: 'Kigali, Kacyiru',
        price: '150,000',
        image: require('../../assets/images/RentifyLanding.jpg'),
        rating: '4.5',
    },
    {
        id: '3',
        type: 'cars',
        title: 'Toyota RAV4',
        location: 'Kigali, Gikondo',
        price: '50,000 / day',
        image: require('../../assets/images/RentifyLanding.jpg'),
        rating: '4.9',
    },
    {
        id: '4',
        type: 'houses',
        title: 'Luxury Penthouse',
        location: 'Kigali, Kimihurura',
        price: '850,000',
        image: require('../../assets/images/RentifyLanding.jpg'),
        rating: '5.0',
    },
];

export default function Explore() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('houses');
    const [activePriceRange, setActivePriceRange] = useState('all');

    const filteredData = MOCK_DATA.filter(item => {
        const matchesType = item.type === activeCategory;
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.location.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesType && matchesSearch;
    });

    const renderItem = ({ item, index }: { item: typeof MOCK_DATA[0], index: number }) => (
        <Animated.View
            entering={FadeInDown.delay(index * 100).duration(800)}
            style={styles.card}
        >
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
                        <Text style={styles.priceLabel}>Price</Text>
                        <Text style={styles.priceValue}>RWF {item.price}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );

    return (
        <View style={styles.container}>
            <TopBar
                title="Explore"
                onNotificationPress={() => router.push('/notifications')}
            />

            <View style={styles.searchSection}>
                <View style={styles.searchBar}>
                    <Ionicons name="search-outline" size={20} color="#888" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder={`Search ${activeCategory}...`}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor="#999"
                    />
                </View>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoriesScroll}
                contentContainerStyle={styles.categoriesContent}
            >
                {CATEGORIES.map((cat) => (
                    <TouchableOpacity
                        key={cat.id}
                        style={[styles.categoryBtn, activeCategory === cat.id && styles.activeCategoryBtn]}
                        onPress={() => setActiveCategory(cat.id)}
                    >
                        <Ionicons
                            name={cat.icon as any}
                            size={18}
                            color={activeCategory === cat.id ? '#FFF' : '#000'}
                        />
                        <Text style={[styles.categoryText, activeCategory === cat.id && styles.activeCategoryText]}>
                            {cat.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <View style={styles.filterSection}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersContent}>
                    {PRICE_RANGES.map((range) => (
                        <TouchableOpacity
                            key={range.id}
                            style={[styles.filterChip, activePriceRange === range.id && styles.activeFilterChip]}
                            onPress={() => setActivePriceRange(range.id)}
                        >
                            <Text style={[styles.filterText, activePriceRange === range.id && styles.activeFilterText]}>
                                {range.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
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
                        <Text style={styles.emptyText}>No results found</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    searchSection: {
        paddingHorizontal: 24,
        paddingTop: 16,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F8F8',
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 56,
        borderWidth: 1,
        borderColor: '#EEE',
    },
    searchInput: {
        flex: 1,
        marginLeft: 12,
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 16,
        color: '#000',
    },
    categoriesScroll: {
        maxHeight: 60,
        marginTop: 16,
    },
    categoriesContent: {
        paddingHorizontal: 24,
        gap: 12,
    },
    categoryBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F8F8',
        paddingHorizontal: 20,
        height: 44,
        borderRadius: 12,
        gap: 8,
        borderWidth: 1,
        borderColor: '#EEE',
    },
    activeCategoryBtn: {
        backgroundColor: '#000',
        borderColor: '#000',
    },
    categoryText: {
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 14,
        color: '#000',
    },
    activeCategoryText: {
        color: '#FFF',
    },
    filterSection: {
        marginTop: 12,
    },
    filtersContent: {
        paddingHorizontal: 24,
        gap: 8,
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 10,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#EEE',
    },
    activeFilterChip: {
        backgroundColor: '#000',
        borderColor: '#000',
    },
    filterText: {
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 13,
        color: '#666',
    },
    activeFilterText: {
        color: '#FFF',
        fontFamily: 'PlusJakartaSans_600SemiBold',
    },
    listContent: {
        padding: 24,
        paddingBottom: 100,
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        marginBottom: 24,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#F0F0F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    cardImage: {
        width: '100%',
        height: 200,
        backgroundColor: '#F0F0F0',
    },
    cardContent: {
        padding: 20,
        gap: 12,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardTitle: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 18,
        color: '#000',
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
        color: '#FFCC00',
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    cardLocation: {
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 13,
        color: '#888',
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
        fontSize: 12,
        color: '#999',
    },
    priceValue: {
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        fontSize: 18,
        color: '#000',
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
        color: '#CCC',
    }
});
