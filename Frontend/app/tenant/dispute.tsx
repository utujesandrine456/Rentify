import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import TopBar from '../../components/topbar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function DisputeFlow() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [message, setMessage] = useState('');

    const payments = [
        { id: 'TXN-98234', month: 'Feb 2026', amount: '150,000' },
        { id: 'TXN-98233', month: 'Jan 2026', amount: '150,000' },
    ];

    const handleSubmit = () => {
        Alert.alert("Success", "Your dispute has been submitted for review.", [
            { text: "OK", onPress: () => router.back() }
        ]);
    };

    return (
        <View style={styles.container}>
            <TopBar
                title="Disputes"
                showBack={true}
                onBackPress={() => router.back()}
            />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {step === 1 ? (
                    <>
                        <Text style={styles.sectionTitle}>Select Payment to Dispute</Text>
                        <View style={styles.list}>
                            {payments.map((p) => (
                                <TouchableOpacity
                                    key={p.id}
                                    style={styles.paymentItem}
                                    onPress={() => setStep(2)}
                                >
                                    <View>
                                        <Text style={styles.itemTitle}>{p.month}</Text>
                                        <Text style={styles.itemId}>{p.id}</Text>
                                    </View>
                                    <Text style={styles.itemAmount}>RWF {p.amount}</Text>
                                    <Ionicons name="chevron-forward" size={20} color="#CCC" />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </>
                ) : (
                    <View style={styles.form}>
                        <Text style={styles.sectionTitle}>Explain the Issue</Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Message</Text>
                            <TextInput
                                style={styles.textarea}
                                placeholder="Describe what happened..."
                                multiline
                                numberOfLines={6}
                                value={message}
                                onChangeText={setMessage}
                            />
                        </View>

                        <TouchableOpacity style={styles.uploadBtn}>
                            <Ionicons name="cloud-upload-outline" size={24} color="#000" />
                            <Text style={styles.uploadText}>Upload Proof (Image/PDF)</Text>
                        </TouchableOpacity>

                        <View style={styles.buttonGroup}>
                            <TouchableOpacity style={styles.cancelBtn} onPress={() => setStep(1)}>
                                <Text style={styles.cancelText}>Back</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
                                <Text style={styles.submitText}>Submit Dispute</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F7F7',
    },
    scrollContent: {
        padding: 24,
    },
    sectionTitle: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 20,
        color: '#000',
        marginBottom: 24,
    },
    list: {
        gap: 16,
    },
    paymentItem: {
        backgroundColor: '#FFF',
        padding: 20,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    itemTitle: {
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 16,
        color: '#000',
    },
    itemId: {
        fontFamily: 'PlusJakartaSans_400Regular',
        fontSize: 12,
        color: '#888',
    },
    itemAmount: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 16,
        color: '#000',
        marginLeft: 'auto',
        marginRight: 12,
    },
    form: {
        gap: 24,
    },
    inputGroup: {
        gap: 8,
    },
    label: {
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 14,
        color: '#333',
    },
    textarea: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#EEE',
        borderRadius: 12,
        padding: 16,
        minHeight: 120,
        textAlignVertical: 'top',
        fontFamily: 'PlusJakartaSans_400Regular',
    },
    uploadBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        borderWidth: 1,
        borderColor: '#000',
        borderStyle: 'dashed',
        padding: 20,
        borderRadius: 12,
    },
    uploadText: {
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 14,
    },
    buttonGroup: {
        flexDirection: 'row',
        gap: 16,
        marginTop: 24,
    },
    cancelBtn: {
        flex: 1,
        padding: 16,
        alignItems: 'center',
    },
    cancelText: {
        fontFamily: 'PlusJakartaSans_600SemiBold',
        color: '#666',
    },
    submitBtn: {
        flex: 2,
        backgroundColor: '#000',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    submitText: {
        fontFamily: 'PlusJakartaSans_600SemiBold',
        color: '#FFF',
    },
});
