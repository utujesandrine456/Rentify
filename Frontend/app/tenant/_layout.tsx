import { Tabs } from 'expo-router';
import React from 'react';
import BottomBar from '../../components/bottombar';

export default function TenantLayout() {
    return (
        <Tabs
            screenOptions={{ headerShown: false }}
            tabBar={(props) => {
                const routeName = props.state.routes[props.state.index].name;

                let activeTab: 'home' | 'payments' | 'history' | 'profile' | 'properties' | 'tenants' = 'home';

                if (routeName === 'index') activeTab = 'home';
                else if (routeName === 'pay') activeTab = 'payments';
                else if (routeName === 'history') activeTab = 'history';
                else if (routeName === 'profile') activeTab = 'profile';

                return (
                    <BottomBar
                        role="tenant"
                        activeTab={activeTab as any}
                        onTabPress={(tab) => {
                            if (tab === 'home') props.navigation.navigate('index');
                            else if (tab === 'payments') props.navigation.navigate('pay');
                            else if (tab === 'history') props.navigation.navigate('history');
                            else if (tab === 'profile') props.navigation.navigate('profile');
                        }}
                    />
                );
            }}
        >
            <Tabs.Screen name="index" />
            <Tabs.Screen name="pay" />
            <Tabs.Screen name="history" />
            <Tabs.Screen name="profile" />
        </Tabs>
    );
}
