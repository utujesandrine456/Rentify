import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLanguage } from '../../context/LanguageContext';

const { width } = Dimensions.get('window');

export default function ResidenceDetails() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { t } = useLanguage();

    const houseDetails = {
        title: 'Luxury Apartment 4B',
        location: 'Kigali, Kicukiro, Niboye, St 12',
        price: '150,000',
        description: 'Your current cozy home in the heart of Kicukiro. This apartment features a spacious master bedroom, a modern open-plan kitchen, and a private balcony with a stunning view of the city. The area is secure and close to all essential amenities.',
        landlord: {
            name: 'John Mugisha',
            phone: '+250 788 000 000',
        },
        features: [
            { icon: 'bed-outline', label: '2 Bedrooms' },
            { icon: 'water-outline', label: 'Water Included' },
            { icon: 'flashlight-outline', label: 'Stable Power' },
            { icon: 'shield-checkmark-outline', label: '24/7 Security' },
            { icon: 'wifi-outline', label: 'Hi-Speed WiFi' }
        ]
    };

    function handleCall(){
        Linking.openURL(`tel:${houseDetails.landlord.phone}`);
    }
    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={styles.imageContainer}>
                    <Image
                        source={require('../../assets/images/RentifyLanding.jpg')}
                        style={styles.mainImage}
                    />

                    <TouchableOpacity
                        style={[styles.backButton, { top: insets.top + 16 }]}
                        onPress={() => router.back()}
                    >
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                </View>

                <Animated.View
                    entering={FadeInUp.delay(200).duration(800)}
                    style={styles.infoSection}
                >
                    <View style={styles.headerRow}>
                        <View>
                            <Text style={styles.title}>{houseDetails.title}</Text>
                            <View style={styles.locationRow}>
                                <Ionicons name="location" size={16} color="#888" />
                                <Text style={styles.locationText}>{houseDetails.location}</Text>
                            </View>
                        </View>
                    </View>

                    <Animated.View entering={FadeInDown.delay(300).duration(800)} style={styles.priceCard}>
                        <View>
                            <Text style={styles.priceLabel}>{t('monthly_rent')}</Text>
                            <Text style={styles.priceValue}>{houseDetails.price} Frw</Text>
                        </View>
                        <View style={styles.paidBadge}>
                            <Ionicons name="checkmark-circle" size={16} color="#4CD964" />
                            <Text style={styles.paidText}>PAID</Text>
                        </View>
                    </Animated.View>

                    <Animated.View entering={FadeInDown.delay(400).duration(800)} style={styles.section}>
                        <Text style={styles.sectionTitle}>{t('description')}</Text>
                        <Text style={styles.descriptionText}>{houseDetails.description}</Text>
                    </Animated.View>

                    <Animated.View entering={FadeInDown.delay(500).duration(800)} style={styles.section}>
                        <Text style={styles.sectionTitle}>{t('features')}</Text>
                        <View style={styles.featuresGrid}>
                            {houseDetails.features.map((feature, index) => (
                                <View key={index} style={styles.featureItem}>
                                    <View style={styles.featureIconBox}>
                                        <Ionicons name={feature.icon as any} size={20} color="#000" />
                                    </View>
                                    <Text style={styles.featureLabel}>{feature.label}</Text>
                                </View>
                            ))}
                        </View>
                    </Animated.View>

                    <View style={styles.landlordSection}>
                        <Text style={styles.sectionTitle}>{t('landlord')}</Text>
                        <View style={styles.landlordCard}>
                            <View style={styles.landlordInfo}>
                                <Text style={styles.landlordName}>{houseDetails.landlord.name}</Text>
                                <Text style={styles.landlordRole}>{t('verified_landlord')}</Text>
                            </View>
                            <TouchableOpacity style={styles.contactBtn} onPress={() => { handleCall() }}>
                                <Ionicons name="call-outline" size={24} color="#000" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.bottomBar}>
                        <TouchableOpacity
                            style={styles.primaryAction}
                            onPress={() => router.push('/tenant/pay' as any)}
                        >
                            <Ionicons name="card-outline" size={24} color="#FFF" />
                            <Text style={styles.primaryActionText}>{t('pay_now')}</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
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
        paddingBottom: 120,
    },
    imageContainer: {
        height: 350,
        width: width,
        position: 'relative',
    },
    mainImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    backButton: {
        position: 'absolute',
        left: 20,
        backgroundColor: '#FFF',
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    statusBadge: {
        position: 'absolute',
        bottom: 24,
        left: 24,
        backgroundColor: '#4CD964',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
    },
    statusText: {
        color: '#FFF',
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        fontSize: 12,
        letterSpacing: 1,
    },
    infoSection: {
        padding: 24,
        marginTop: -32,
        backgroundColor: '#FFF',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
    },
    headerRow: {
        marginBottom: 24,
    },
    title: {
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        fontSize: 24,
        color: '#000',
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 8,
    },
    locationText: {
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 15,
        color: '#888',
    },
    priceCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F9F9F9',
        padding: 24,
        borderRadius: 24,
        marginBottom: 32,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    priceLabel: {
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 14,
        color: '#888',
    },
    priceValue: {
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        fontSize: 18,
        color: '#000',
        marginTop: 4,
    },
    paidBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#E8FAEF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    paidText: {
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        fontSize: 12,
        color: '#4CD964',
    },
    section: {
        marginBottom: 32,
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
    featuresGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    featureItem: {
        width: (width - 64) / 2,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: '#F9F9F9',
        padding: 8,
        borderRadius: 8,
    },
    featureIconBox: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#EEE',
    },
    featureLabel: {
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 13,
        color: '#333',
    },
    landlordSection: {
        marginBottom: 16,
    },
    landlordCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#000',
        padding: 20,
        borderRadius: 16,
        gap: 16,
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        fontSize: 20,
        color: '#000',
    },
    landlordInfo: {
        flex: 1,
    },
    landlordName: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 18,
        color: '#FFF',
    },
    landlordRole: {
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 13,
        color: 'rgba(255,255,255,0.6)',
        marginTop: 2,
    },
    contactBtn: {
        width: 48,
        height: 48,
        borderRadius: 8,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomBar: {
        backgroundColor: 'rgba(255,255,255,0.95)',
        paddingHorizontal: 8,
        paddingTop: 16,
    },
    primaryAction: {
        backgroundColor: '#000',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        paddingVertical: 16,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
        elevation: 10,
    },
    primaryActionText: {
        color: '#FFF',
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        fontSize: 16,
        letterSpacing: 0.5,
    }
});
