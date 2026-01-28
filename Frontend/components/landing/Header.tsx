import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function Header() {
    const router = useRouter();

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
                <Text style={styles.logoText}>RENTIFY</Text>
            </TouchableOpacity>
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
        justifyContent: 'center',
        paddingHorizontal: 32,
        paddingTop: 64,
        zIndex: 100,
        backgroundColor: 'transparent',
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: '#FFF',
        padding: 8,
        borderRadius: 8,
    },
    logoIcon: {
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoImage: {
        width: '160%',
        height: '160%',
    },
    logoText: {
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        fontSize: 18,
        color: '#000',
        letterSpacing: 1.5,
    }
});
