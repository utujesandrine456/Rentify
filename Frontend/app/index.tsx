import React from 'react';
import { View, ScrollView, StyleSheet, useWindowDimensions, StatusBar } from 'react-native';
import Header from '../components/landing/Header';
import Hero from '../components/landing/Hero';
import BentoFeatures from '../components/landing/BentoFeatures';
import Contact from '../components/landing/Contact';
import FinalCTA from '../components/landing/FinalCTA';
import MinimalFooter from '../components/landing/MinimalFooter';

export default function LandingPage() {
    const { height } = useWindowDimensions();

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000" />
            <Header />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                decelerationRate="normal"
                bounces={true}
            >
                <Hero />
                <BentoFeatures />
                <Contact />
                <FinalCTA />
                <MinimalFooter />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    scrollContent: {
        flexGrow: 1,
    },
});
