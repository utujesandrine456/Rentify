import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

const features = [
    {
        id: 1,
        title: 'Zero Latency',
        desc: 'Real-time syncing between tenant and landlord.',
        icon: 'sync-outline',
        size: 'small',
    },
    {
        id: 2,
        title: 'Trust Scores',
        desc: 'Build your reputation with timely payments.',
        icon: 'shield-checkmark-outline',
        size: 'small',
    },
    {
        id: 3,
        title: 'Digital Receipts',
        desc: 'Automated legal-grade documentation for every transaction.',
        icon: 'document-text-outline',
        size: 'wide',
    }
];

import { useLanguage } from '../../context/LanguageContext';

export default function BentoFeatures() {
    const { width } = useWindowDimensions();
    const { t } = useLanguage();
    const isMobile = width < 768;

    return (
        <View style={styles.container}>
            <Animated.View
                entering={FadeInDown.duration(800)}
                style={styles.header}
            >
                <Text style={styles.label}>{t('features').toUpperCase()}</Text>
                <Text style={styles.title}>{t('features_title').toUpperCase()}</Text>
                <Text style={styles.cardDesc}>{t('features_subtitle')}</Text>
            </Animated.View>

            <View style={styles.grid}>
                {features.map((item, index) => (
                    <Animated.View
                        key={item.id}
                        entering={FadeInDown.delay(index * 100).duration(800)}
                        style={[
                            styles.card,
                            item.size === 'large' && styles.cardLarge,
                            item.size === 'wide' && styles.cardWide,
                        ]}
                    >
                        <Ionicons name={item.icon as any} size={24} color="#FFF" />
                        <View>
                            <Text style={styles.cardTitle}>{item.title}</Text>
                            <Text style={styles.cardDesc}>{item.desc}</Text>
                        </View>
                    </Animated.View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#000',
        paddingHorizontal: 32,
        paddingVertical: 16,
    },
    header: {
        marginBottom: 64,
    },
    label: {
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 10,
        color: '#666',
        letterSpacing: 2,
        marginBottom: 16,
    },
    title: {
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        fontSize: 32,
        color: '#FFF',
        lineHeight: 40,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
    },
    card: {
        backgroundColor: '#111',
        padding: 32,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#222',
        flex: 1,
        minWidth: 150,
        justifyContent: 'space-between',
        height: 200,
    },
    cardLarge: {
        minWidth: '100%',
        height: 240,
        backgroundColor: '#FFF',
        borderWidth: 0,
    },
    cardWide: {
        minWidth: '100%',
        height: 180,
    },
    cardTitle: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 16,
        color: '#FFF',
        marginBottom: 8,
        marginTop: 24,
    },
    cardDesc: {
        fontFamily: 'PlusJakartaSans_400Regular',
        fontSize: 14,
        color: '#888',
        lineHeight: 20,
    },
});
