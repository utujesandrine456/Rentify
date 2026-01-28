import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const MOCK_DETAILS = {
    '1': {
        title: 'Modern Villa with Garden',
        location: 'Kigali, Nyarutarama, St 450',
        price: '450,000',
        description: 'A beautiful modern villa located in the heart of Nyarutarama. This property features 4 spacious bedrooms, 3 bathrooms, a modern kitchen, and a large private garden perfect for family gatherings. The neighborhood is extremely safe and quiet.',
        images: [
            require('../../../assets/images/RentifyLanding.jpg'),
            require('../../../assets/images/RentifyLanding.jpg'),
            require('../../../assets/images/RentifyLanding.jpg'),
        ],
        landlord: {
            name: 'Robert Mugisha',
            phone: '+250 788 000 000',
            avatar: 'R'
        },
        features: ['4 Bedrooms', '3 Bathrooms', 'Private Garden', 'Security System', 'Garage']
    },
    '2': {
        title: 'Cozy Smart Apartment',
        location: 'Kigali, Kacyiru, Near US Embassy',
        price: '150,000',
        description: 'Modern 1-bedroom apartment with smart home features. Perfect for young professionals. High-speed internet included.',
        images: [
            require('../../../assets/images/RentifyLanding.jpg'),
            require('../../../assets/images/RentifyLanding.jpg'),
        ],
        landlord: {
            name: 'Sarah Umutoni',
            phone: '+250 788 111 222',
            avatar: 'S'
        },
        features: ['1 Bedroom', 'Fully Furnished', 'Smart Locks', 'Gym Access']
    }
};

export default function ExploreDetails() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const insets = useSafeAreaInsets();

    // Fallback to ID 1 if not found in mock
    const details = MOCK_DETAILS[id as keyof typeof MOCK_DETAILS] || MOCK_DETAILS['1'];

    const handleCall = () => {
        Linking.openURL(`tel:${details.landlord.phone}`);
    };

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={styles.imageContainer}>
                    <ScrollView
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                    >
                        {details.images.map((img, index) => (
                            <Image key={index} source={img} style={styles.mainImage} />
                        ))}
                    </ScrollView>

                    <TouchableOpacity
                        style={[styles.backButton, { top: insets.top + 16 }]}
                        onPress={() => router.back()}
                    >
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>

                    <View style={styles.imageBadge}>
                        <Text style={styles.imageBadgeText}>{details.images.length} Photos</Text>
                    </View>
                </View>

                <View style={styles.infoSection}>
                    <Animated.View entering={FadeInUp.duration(600)}>
                        <Text style={styles.title}>{details.title}</Text>
                        <View style={styles.locationRow}>
                            <Ionicons name="location" size={16} color="#000" />
                            <Text style={styles.locationText}>{details.location}</Text>
                        </View>
                    </Animated.View>

                    <Animated.View entering={FadeInUp.delay(100).duration(600)} style={styles.priceCard}>
                        <Text style={styles.priceLabel}>Monthly Rent</Text>
                        <Text style={styles.priceValue}>RWF {details.price}</Text>
                    </Animated.View>

                    <Animated.View entering={FadeInUp.delay(200).duration(600)} style={styles.section}>
                        <Text style={styles.sectionTitle}>Description</Text>
                        <Text style={styles.descriptionText}>{details.description}</Text>
                    </Animated.View>

                    <Animated.View entering={FadeInUp.delay(300).duration(600)} style={styles.section}>
                        <Text style={styles.sectionTitle}>Key Features</Text>
                        <View style={styles.featureGrid}>
                            {details.features.map((feature, index) => (
                                <View key={index} style={styles.featureItem}>
                                    <Ionicons name="checkmark-circle-outline" size={16} color="#4CD964" />
                                    <Text style={styles.featureText}>{feature}</Text>
                                </View>
                            ))}
                        </View>
                    </Animated.View>

                    <Animated.View entering={FadeInUp.delay(400).duration(600)} style={styles.landlordSection}>
                        <View style={styles.landlordInfo}>
                            <View style={styles.avatar}>
                                <Text style={styles.avatarText}>{details.landlord.avatar}</Text>
                            </View>
                            <View>
                                <Text style={styles.landlordName}>{details.landlord.name}</Text>
                                <Text style={styles.landlordType}>Verified Landlord</Text>
                            </View>
                        </View>
                    </Animated.View>
                </View>
            </ScrollView>

            <View style={[styles.bottomAction, { paddingBottom: insets.bottom + 16 }]}>
                <TouchableOpacity style={styles.callButton} onPress={handleCall}>
                    <Ionicons name="call" size={20} color="#FFF" />
                    <Text style={styles.callButtonText}>CALL LANDLORD</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    scrollContent: {
        paddingBottom: 120,
    },
    imageContainer: {
        height: 400,
        position: 'relative',
    },
    mainImage: {
        width: width,
        height: 400,
        resizeMode: 'cover',
    },
    backButton: {
        position: 'absolute',
        left: 24,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    imageBadge: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    imageBadgeText: {
        color: '#FFF',
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 12,
    },
    infoSection: {
        padding: 32,
        marginTop: -32,
        backgroundColor: '#FFF',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
    },
    title: {
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        fontSize: 28,
        color: '#000',
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 12,
    },
    locationText: {
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 16,
        color: '#888',
    },
    priceCard: {
        backgroundColor: '#F8F1FF',
        padding: 24,
        borderRadius: 24,
        marginTop: 32,
        borderWidth: 1,
        borderColor: '#E8D5FF',
    },
    priceLabel: {
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 14,
        color: '#000',
        marginBottom: 4,
    },
    priceValue: {
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        fontSize: 32,
        color: '#000',
    },
    section: {
        marginTop: 32,
    },
    sectionTitle: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 18,
        color: '#000',
        marginBottom: 16,
    },
    descriptionText: {
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 15,
        color: '#666',
        lineHeight: 24,
    },
    featureGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F7F7F7',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        gap: 8,
    },
    featureText: {
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 14,
        color: '#000',
    },
    landlordSection: {
        marginTop: 40,
        paddingTop: 32,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    landlordInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        fontSize: 20,
        color: '#FFF',
    },
    landlordName: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 18,
        color: '#000',
    },
    landlordType: {
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 14,
        color: '#888',
    },
    bottomAction: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFF',
        paddingHorizontal: 24,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    callButton: {
        backgroundColor: '#000',
        paddingVertical: 20,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
        elevation: 8,
    },
    callButtonText: {
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        color: '#FFF',
        fontSize: 15,
        letterSpacing: 1,
    }
});
