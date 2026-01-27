import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function FinalCTA() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Animated.View
                entering={FadeInUp.duration(1000)}
                style={styles.card}
            >
                <Text style={styles.title}>
                    READY TO UPGRADE YOUR{'\n'}
                    RENTAL JOURNEY?
                </Text>

                <TouchableOpacity style={styles.button} onPress={() => router.push('/register')}>
                    <Text style={styles.buttonText}>CREATE  ACCOUNT</Text>
                </TouchableOpacity>

                <Text style={styles.smallPrint}>
                    No hidden fees. No paperwork. Just Rentify.
                </Text>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#000',
        padding: 32,
        paddingBottom: 60,
    },
    card: {
        backgroundColor: '#FFF',
        padding: 48,
        borderRadius: 4,
        alignItems: 'center',
    },
    title: {
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        fontSize: 20,
        color: '#000',
        textAlign: 'center',
        marginBottom: 32,
    },
    button: {
        backgroundColor: '#000',
        paddingHorizontal: 36,
        paddingVertical: 12,
        borderRadius: 4,
        marginBottom: 24,
    },
    buttonText: {
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        fontSize: 12,
        lineHeight: 24,
        color: '#FFF',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    smallPrint: {
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 10,
        color: '#999',
        letterSpacing: 1,
        textAlign: 'center'
    }
});
