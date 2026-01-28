import { Tabs } from 'expo-router';
import React from 'react';
import BottomBar from '../../components/bottombar';

export default function LandlordLayout() {
    return (
        <Tabs
            screenOptions={{ headerShown: false }}
            tabBar={(props) => {
                const routeName = props.state.routes[props.state.index].name;

                let activeTab: 'home' | 'payments' | 'history' | 'profile' | 'properties' | 'tenants' | 'search' = 'home';

                if (routeName === 'index') activeTab = 'home';
                else if (routeName === 'properties') activeTab = 'properties';
                else if (routeName === 'tenants') activeTab = 'tenants';
                else if (routeName === 'search') activeTab = 'search';
                else if (routeName === 'profile') activeTab = 'profile';

                return (
                    <BottomBar
                        role="landlord"
                        activeTab={activeTab as any}
                        onTabPress={(tab) => {
                            // Navigate
                            if (tab === 'overview' || tab === 'home') props.navigation.navigate('index');
                            else if (tab === 'properties') props.navigation.navigate('properties');
                            else if (tab === 'tenants') props.navigation.navigate('tenants');
                            else if (tab === 'search') props.navigation.navigate('search');
                            else if (tab === 'profile') props.navigation.navigate('profile');
                        }}
                    />
                );
            }}
        >
            <Tabs.Screen name="index" />
            <Tabs.Screen name="properties" />
            <Tabs.Screen name="tenants" />
            <Tabs.Screen name="search" />
            <Tabs.Screen name="profile" />
        </Tabs>
    );
}
