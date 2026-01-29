import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import TopBar from '../components/topbar';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useLanguage } from '../context/LanguageContext';

interface SettingsItem {
    icon: string;
    label: string;
    route?: string;
    extra?: string;
    onPress?: () => void;
}

interface SettingsSection {
    title: string;
    items: SettingsItem[];
}

export default function Settings() {
    const router = useRouter();
    const { t, language, setLanguage } = useLanguage();

    const sections: SettingsSection[] = [
        {
            title: t('account'),
            items: [
                { icon: 'person-outline', label: t('edit_profile'), route: '/tenant/profile' },
                { icon: 'shield-checkmark-outline', label: t('security'), route: '/security' },
                { icon: 'notifications-outline', label: t('notifications'), route: '/notifications' }
            ]
        },
        {
            title: t('preferences'),
            items: [
                { icon: 'color-palette-outline', label: t('appearance'), extra: 'Light Mode' },
                {
                    icon: 'globe-outline',
                    label: t('language'),
                    extra: language === 'en' ? 'English' : 'Ikinyarwanda',
                    onPress: () => setLanguage(language === 'en' ? 'rw' : 'en')
                }
            ]
        },
        {
            title: t('support'),
            items: [
                { icon: 'help-circle-outline', label: t('help_center') },
                { icon: 'document-text-outline', label: t('privacy_policy') }
            ]
        }
    ];

    return (
        <View style={styles.container}>
            <TopBar
                title={t('settings')}
                showBack
                onBackPress={() => router.back()}
                showProfile={false}
            />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {sections.map((section, sIndex) => (
                    <Animated.View
                        key={section.title}
                        entering={FadeInDown.delay(sIndex * 100).duration(600)}
                        style={styles.section}
                    >
                        <Text style={styles.sectionTitle}>{section.title}</Text>
                        <View style={styles.card}>
                            {section.items.map((item, iIndex) => (
                                <View key={item.label}>
                                    <TouchableOpacity
                                        style={styles.item}
                                        onPress={() => {
                                            if (item.onPress) item.onPress();
                                            else if (item.route) router.push(item.route as any);
                                        }}
                                    >
                                        <View style={styles.itemLeft}>
                                            <View style={styles.iconBox}>
                                                <Ionicons name={item.icon as any} size={20} color="#000" />
                                            </View>
                                            <Text style={styles.itemLabel}>{item.label}</Text>
                                        </View>
                                        <View style={styles.itemRight}>
                                            {item.extra && <Text style={styles.extraText}>{item.extra}</Text>}
                                            <Ionicons name="chevron-forward" size={18} color="#CCC" />
                                        </View>
                                    </TouchableOpacity>
                                    {iIndex < section.items.length - 1 && <View style={styles.divider} />}
                                </View>
                            ))}
                        </View>
                    </Animated.View>
                ))}

                <TouchableOpacity
                    style={styles.logoutBtn}
                    onPress={() => router.replace('/login')}
                >
                    <Text style={styles.logoutText}>{t('sign_out')}</Text>
                </TouchableOpacity>
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
        padding: 24,
        paddingBottom: 40,
        gap: 32,
    },
    section: {
        gap: 16,
    },
    sectionTitle: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 14,
        color: '#999',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginLeft: 8,
    },
    card: {
        backgroundColor: '#FAFAFA',
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconBox: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#EEE',
    },
    itemLabel: {
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 15,
        color: '#000',
    },
    itemRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    extraText: {
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 13,
        color: '#999',
    },
    divider: {
        height: 1,
        backgroundColor: '#EEE',
        marginHorizontal: 16,
    },
    logoutBtn: {
        padding: 18,
        backgroundColor: '#FFF1F0',
        borderRadius: 12,
        alignItems: 'center',
    },
    logoutText: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 15,
        color: '#FF3B30',
    },
    version: {
        textAlign: 'center',
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 12,
        color: '#CCC',
        marginTop: 8,
    }
});
