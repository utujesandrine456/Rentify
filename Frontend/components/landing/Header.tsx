import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useLanguage } from '../../context/LanguageContext';

export default function Header() {
    const router = useRouter();
    const { setLanguage, language } = useLanguage();

    return (
        <View style={styles.container}>
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => router.push('/')}
                style={styles.logoContainer}
            >
                <View style={styles.logoIcon}>
                    <Image
                        source={require('../../assets/images/RentifyLogo.jpg')}
                        style={styles.logoImage}
                        resizeMode="contain"
                    />
                </View>
                <Text style={styles.logoText}>TUZA</Text>
            </TouchableOpacity>

            <View style={styles.langContainer}>
                <TouchableOpacity
                    onPress={() => setLanguage('en')}
                    style={[styles.langBtn, language === 'en' && styles.activeLangBtn]}
                >
                    <Text style={[styles.langText, language === 'en' && styles.activeLangText]}>EN</Text>
                </TouchableOpacity>
                <View style={styles.langDivider} />
                <TouchableOpacity
                    onPress={() => setLanguage('rw')}
                    style={[styles.langBtn, language === 'rw' && styles.activeLangBtn]}
                >
                    <Text style={[styles.langText, language === 'rw' && styles.activeLangText]}>RW</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingTop: 64,
        zIndex: 100,
        backgroundColor: 'transparent',
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: 'rgba(255,255,255,0.9)',
        padding: 8,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    logoIcon: {
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoImage: {
        width: '120%',
        height: '120%',
    },
    logoText: {
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        fontSize: 16,
        color: '#000',
        letterSpacing: 1,
    },
    langContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    langBtn: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    activeLangBtn: {
        backgroundColor: '#FFF',
    },
    langText: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 12,
        color: '#FFF',
    },
    activeLangText: {
        color: '#000',
    },
    langDivider: {
        width: 1,
        height: 12,
        backgroundColor: 'rgba(255,255,255,0.2)',
    }
});
