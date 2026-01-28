import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import TopBar from '../../components/topbar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function Properties() {
    const router = useRouter();
    const [modalVisible, setModalVisible] = useState(false);

    const [properties, setProperties] = useState([
        { id: 1, name: 'Sunset Apartments', location: 'Kigali, Nyarutarama', units: 4, occupied: 3 },
        { id: 2, name: 'Kiyovu Villa', location: 'Kigali, Kiyovu', units: 1, occupied: 1 },
        { id: 3, name: 'Urban Suite', location: 'Kigali, Rebero', units: 3, occupied: 2 },
    ]);

    const [newPropName, setNewPropName] = useState('');
    const [newPropLoc, setNewPropLoc] = useState('');
    const [newPropUnits, setNewPropUnits] = useState('');
    const [newPropRent, setNewPropRent] = useState('');
    const [newPropPhone, setNewPropPhone] = useState('');
    const [newPropStart, setNewPropStart] = useState('');

    const handleAddProperty = () => {
        if (!newPropName || !newPropUnits) return;
        const newProp = {
            id: properties.length + 1,
            name: newPropName,
            location: newPropLoc,
            units: Number(newPropUnits),
            occupied: 0
        };
        setProperties([...properties, newProp]);
        setModalVisible(false);
        setNewPropName('');
        setNewPropLoc('');
        setNewPropUnits('');
        setNewPropRent('');
    };

    return (
        <View style={styles.container}>
            <TopBar title="Properties" />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.headerRow}>
                    <Text style={styles.sectionTitle}>My Properties</Text>
                    <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                        <Ionicons name="add" size={24} color="#FFF" />
                    </TouchableOpacity>
                </View>

                {properties.map((prop) => (
                    <View key={prop.id} style={styles.card}>
                        <View style={styles.cardHeader}>
                            <View style={styles.iconBox}>
                                <Ionicons name="business" size={24} color="#000" />
                            </View>
                            <View>
                                <Text style={styles.propName}>{prop.name}</Text>
                                <Text style={styles.propLoc}>{prop.location}</Text>
                            </View>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.statsRow}>
                            <View style={styles.stat}>
                                <Text style={styles.statLabel}>Units</Text>
                                <Text style={styles.statVal}>{prop.units}</Text>
                            </View>
                            <View style={styles.stat}>
                                <Text style={styles.statLabel}>Occupied</Text>
                                <Text style={styles.statVal}>{prop.occupied}</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.viewBtn}
                                onPress={() => router.push({
                                    pathname: '/landlord/details',
                                    params: {
                                        id: prop.id,
                                        name: prop.name,
                                        location: prop.location,
                                        units: prop.units,
                                        occupied: prop.occupied
                                    }
                                })}
                            >
                                <Text style={styles.viewBtnText}>Manage Details</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </ScrollView>

            {/* Add Property Modal */}
            <Modal visible={modalVisible} animationType="slide" transparent>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.modalOverlay}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Add New Property</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Ionicons name="close" size={24} color="#000" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalForm}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Property Name</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="e.g. Green Heights"
                                    value={newPropName}
                                    onChangeText={setNewPropName}
                                    placeholderTextColor="#999"
                                />
                            </View>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Location</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="e.g. Kigali, Kicukiro"
                                    value={newPropLoc}
                                    onChangeText={setNewPropLoc}
                                    placeholderTextColor="#999"
                                />
                            </View>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Number of Units</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="e.g. 3"
                                    value={newPropUnits}
                                    onChangeText={setNewPropUnits}
                                    keyboardType="numeric"
                                    placeholderTextColor="#999"
                                />
                            </View>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Monthly Rent (RWF)</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="150000"
                                    value={newPropRent}
                                    onChangeText={setNewPropRent}
                                    keyboardType="numeric"
                                    placeholderTextColor="#999"
                                />
                            </View>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Tenant Phone Number (Optional Linking)</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="+250 78X XXX XXX"
                                    value={newPropPhone}
                                    onChangeText={setNewPropPhone}
                                    keyboardType="phone-pad"
                                    placeholderTextColor="#999"
                                />
                            </View>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Tenant Start Date (YYYY-MM-DD)</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="2026-01-27"
                                    value={newPropStart}
                                    onChangeText={setNewPropStart}
                                    placeholderTextColor="#999"
                                />
                            </View>

                            <View style={styles.modalActions}>
                                <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                                    <Text style={styles.cancelText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.saveBtn} onPress={handleAddProperty}>
                                    <Text style={styles.saveText}>Save Property</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
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
        paddingBottom: 140,
        gap: 16,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    sectionTitle: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 20,
        color: '#000',
    },
    addButton: {
        width: 40, height: 40, borderRadius: 20, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center',
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        gap: 16,
        alignItems: 'center',
        marginBottom: 16,
    },
    iconBox: {
        width: 48, height: 48, borderRadius: 12, backgroundColor: '#F5F5F5', alignItems: 'center', justifyContent: 'center',
    },
    propName: {
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 16,
        color: '#000',
    },
    propLoc: {
        fontFamily: 'PlusJakartaSans_400Regular',
        fontSize: 12,
        color: '#888',
    },
    divider: { height: 1, backgroundColor: '#F0F0F0', marginBottom: 16 },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    stat: {
        alignItems: 'flex-start',
    },
    statLabel: {
        fontFamily: 'PlusJakartaSans_400Regular',
        fontSize: 12,
        color: '#888',
    },
    statVal: {
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 16,
        color: '#000',
    },
    viewBtn: {
        paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#000', borderRadius: 8,
    },
    viewBtnText: {
        color: '#FFF', fontFamily: 'PlusJakartaSans_500Medium', fontSize: 12,
    },
    modalOverlay: {
        flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end'
    },
    modalContent: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 24,
        paddingBottom: 40,
        maxHeight: '90%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalForm: {
        gap: 16,
    },
    modalTitle: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 20,
        marginBottom: 8,
    },
    inputGroup: { gap: 8 },
    label: { fontFamily: 'PlusJakartaSans_500Medium', fontSize: 14, color: '#333' },
    input: {
        backgroundColor: '#FAFAFA', borderWidth: 1, borderColor: '#EEE', borderRadius: 12, padding: 16, fontFamily: 'PlusJakartaSans_400Regular',
    },
    modalActions: {
        flexDirection: 'row', gap: 16, marginTop: 16,
    },
    cancelBtn: { flex: 1, padding: 16, alignItems: 'center' },
    cancelText: { fontFamily: 'PlusJakartaSans_600SemiBold', color: '#666' },
    saveBtn: { flex: 1, padding: 16, backgroundColor: '#000', borderRadius: 12, alignItems: 'center' },
    saveText: { fontFamily: 'PlusJakartaSans_600SemiBold', color: '#FFF' },
});
