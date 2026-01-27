import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MinimalFooter() {
    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <Text style={styles.logo}>RENTIFY</Text>
                <View style={styles.links}>
                    <Text style={styles.link}>TERMS</Text>
                    <Text style={styles.link}>PRIVACY</Text>
                    <Text style={styles.link}>CONTACT</Text>
                </View>
            </View>
            <View style={styles.divider} />
            <Text style={styles.copyright}>
                © 2026 RENTIFY TECHNOLOGIES. ALL RIGHTS RESERVED.
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#000',
        paddingHorizontal: 32,
        paddingVertical: 48,
        borderTopWidth: 1,
        borderColor: '#111',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
    },
    logo: {
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        fontSize: 16,
        color: '#FFF',
        letterSpacing: 2,
    },
    links: {
        flexDirection: 'row',
        gap: 24,
    },
    link: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 10,
        color: '#666',
        letterSpacing: 1,
    },
    divider: {
        height: 1,
        backgroundColor: '#111',
        marginBottom: 32,
    },
    copyright: {
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 9,
        color: '#333',
        letterSpacing: 1,
        textAlign: 'center'
    }
});
