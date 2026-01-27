import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import TopBar from '../../components/topbar';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function PropertyDetails() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { id, name, location, units, occupied } = params;

    const [unitList, setUnitList] = useState<any[]>([]);

    useEffect(() => {
        if (units) {
            setUnitList(
                Array.from({ length: Number(units) }, (_, i) => ({
                    id: i + 1,
                    status: i < Number(occupied) ? 'Occupied' : 'Vacant',
                    tenant: i < Number(occupied) ? ['T. Stark', 'B. Banner', 'N. Romanoff'][i] || 'Anonymous' : 'None',
                    phone: i < Number(occupied) ? '+250 788 000 00' + (i + 1) : '',
                    rent: '150,000',
                    startDate: '2026-01-01'
                }))
            );
        }
    }, [id, units, occupied]);

    // Modal State
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedUnit, setSelectedUnit] = useState<any>(null);
    const [editTenant, setEditTenant] = useState('');
    const [editPhone, setEditPhone] = useState('');
    const [editRent, setEditRent] = useState('');
    const [editStatus, setEditStatus] = useState('Occupied');
    const [editStartDate, setEditStartDate] = useState('');

    const openManageModal = (unit: any) => {
        setSelectedUnit(unit);
        setEditTenant(unit.tenant === 'None' ? '' : unit.tenant);
        setEditPhone(unit.phone);
        setEditRent(unit.rent.replace(/,/g, ''));
        setEditStatus(unit.status);
        setEditStartDate(unit.startDate);
        setIsModalVisible(true);
    };

    const handleSaveUnit = () => {
        if (!editRent) {
            Alert.alert('Error', 'Rent amount is required');
            return;
        }

        const updatedList = unitList.map(u => {
            if (u.id === selectedUnit.id) {
                return {
                    ...u,
                    tenant: editStatus === 'Occupied' ? (editTenant || 'Anonymous') : 'None',
                    phone: editStatus === 'Occupied' ? editPhone : '',
                    rent: Number(editRent).toLocaleString(),
                    status: editStatus as 'Occupied' | 'Vacant',
                    startDate: editStatus === 'Occupied' ? editStartDate : ''
                };
            }
            return u;
        });

        setUnitList(updatedList);
        setIsModalVisible(false);
        Alert.alert('Success', `Unit ${selectedUnit.id} updated successfully!`);
    };

    return (
        <View style={styles.container}>
            <TopBar title="Property Details" showBack />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.infoCard}>
                    <View style={styles.headerRow}>
                        <View style={styles.iconBox}>
                            <Ionicons name="business" size={32} color="#000" />
                        </View>
                        <View style={styles.titleInfo}>
                            <Text style={styles.propName}>{name}</Text>
                            <Text style={styles.propLoc}>{location}</Text>
                        </View>
                    </View>

                    <View style={styles.statsGrid}>
                        <View style={styles.statLine}>
                            <Text style={styles.statLabel}>Total Units</Text>
                            <Text style={styles.statValue}>{units}</Text>
                        </View>
                        <View style={styles.statLine}>
                            <Text style={styles.statLabel}>Occupied</Text>
                            <Text style={[styles.statValue, { color: '#4CD964' }]}>
                                {unitList.filter(u => u.status === 'Occupied').length}
                            </Text>
                        </View>
                        <View style={styles.statLine}>
                            <Text style={styles.statLabel}>Vacant</Text>
                            <Text style={[styles.statValue, { color: '#FF3B30' }]}>
                                {unitList.filter(u => u.status === 'Vacant').length}
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.financeCard}>
                    <Text style={styles.sectionTitle}>Financial Summary (Monthly)</Text>
                    <View style={styles.financeRow}>
                        <Text style={styles.financeLabel}>Expected Rent</Text>
                        <Text style={styles.financeValue}>RWF {(unitList.length * 150000).toLocaleString()}</Text>
                    </View>
                    <View style={styles.financeRow}>
                        <Text style={styles.financeLabel}>Collected Rent</Text>
                        <Text style={[styles.financeValue, { color: '#4CD964' }]}>
                            RWF {(unitList.filter(u => u.status === 'Occupied').length * 150000).toLocaleString()}
                        </Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.financeRow}>
                        <Text style={styles.financeLabel}>Outstanding</Text>
                        <Text style={[styles.financeValue, { color: '#FF3B30' }]}>
                            RWF {(unitList.filter(u => u.status === 'Vacant').length * 150000).toLocaleString()}
                        </Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Unit Breakdowns</Text>
                {unitList.map((unit) => (
                    <View key={unit.id} style={styles.unitCard}>
                        <View style={styles.unitHeader}>
                            <Text style={styles.unitName}>Unit {unit.id}</Text>
                            <View style={[styles.statusBadge, { backgroundColor: unit.status === 'Occupied' ? '#E8F5E9' : '#FFF3E0' }]}>
                                <Text style={[styles.statusText, { color: unit.status === 'Occupied' ? '#4CAF50' : '#FF9800' }]}>
                                    {unit.status}
                                </Text>
                            </View>
                        </View>
                        {unit.status === 'Occupied' && (
                            <View style={styles.unitDetails}>
                                <View style={styles.detailRow}>
                                    <Ionicons name="person-outline" size={14} color="#666" />
                                    <Text style={styles.detailText}>Tenant: {unit.tenant}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Ionicons name="call-outline" size={14} color="#666" />
                                    <Text style={styles.detailText}>Contact: {unit.phone}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Ionicons name="cash-outline" size={14} color="#666" />
                                    <Text style={styles.detailText}>Rent: {unit.rent} RWF</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Ionicons name="calendar-outline" size={14} color="#666" />
                                    <Text style={[styles.detailText, { color: '#007AFF' }]}>
                                        Next Due: {new Date(new Date(unit.startDate).getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                                    </Text>
                                </View>
                            </View>
                        )}
                        <TouchableOpacity
                            style={styles.editUnitBtn}
                            onPress={() => openManageModal(unit)}
                        >
                            <Text style={styles.editUnitText}>Manage Unit</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>

            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.modalOverlay}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Manage Unit {selectedUnit?.id}</Text>
                            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                                <Ionicons name="close" size={24} color="#000" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalForm}>
                            <Text style={styles.inputLabel}>Occupancy Status</Text>
                            <View style={styles.statusToggleRow}>
                                <TouchableOpacity
                                    style={[styles.statusToggle, editStatus === 'Occupied' && styles.statusToggleActive]}
                                    onPress={() => setEditStatus('Occupied')}
                                >
                                    <Text style={[styles.statusToggleText, editStatus === 'Occupied' && styles.statusToggleTextActive]}>Occupied</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.statusToggle, editStatus === 'Vacant' && styles.statusToggleActive]}
                                    onPress={() => setEditStatus('Vacant')}
                                >
                                    <Text style={[styles.statusToggleText, editStatus === 'Vacant' && styles.statusToggleTextActive]}>Vacant</Text>
                                </TouchableOpacity>
                            </View>

                            {editStatus === 'Occupied' && (
                                <>
                                    <Text style={styles.inputLabel}>Tenant Name</Text>
                                    <TextInput
                                        style={styles.textInput}
                                        value={editTenant}
                                        onChangeText={setEditTenant}
                                        placeholder="e.g. John Doe"
                                    />

                                    <Text style={styles.inputLabel}>Phone Number</Text>
                                    <TextInput
                                        style={styles.textInput}
                                        value={editPhone}
                                        onChangeText={setEditPhone}
                                        placeholder="+250 788 000 000"
                                        keyboardType="phone-pad"
                                    />

                                    <Text style={styles.inputLabel}>Start Date (YYYY-MM-DD)</Text>
                                    <TextInput
                                        style={styles.textInput}
                                        value={editStartDate}
                                        onChangeText={setEditStartDate}
                                        placeholder="2026-01-27"
                                    />
                                </>
                            )}

                            <Text style={styles.inputLabel}>Monthly Rent (RWF)</Text>
                            <TextInput
                                style={styles.textInput}
                                value={editRent}
                                onChangeText={setEditRent}
                                placeholder="150000"
                                keyboardType="numeric"
                            />

                            <TouchableOpacity
                                style={styles.saveBtn}
                                onPress={handleSaveUnit}
                            >
                                <Text style={styles.saveBtnText}>Save Changes</Text>
                            </TouchableOpacity>
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
        paddingBottom: 120,
        gap: 20,
    },
    infoCard: {
        backgroundColor: '#000',
        borderRadius: 24,
        padding: 24,
    },
    headerRow: {
        flexDirection: 'row',
        gap: 16,
        alignItems: 'center',
        marginBottom: 24,
    },
    iconBox: {
        width: 64,
        height: 64,
        borderRadius: 16,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleInfo: {
        flex: 1,
    },
    propName: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 24,
        color: '#FFF',
        marginBottom: 4,
    },
    propLoc: {
        fontFamily: 'PlusJakartaSans_400Regular',
        fontSize: 14,
        color: '#AAA',
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 24,
        borderTopWidth: 1,
        borderTopColor: '#333',
    },
    statLine: {
        alignItems: 'flex-start',
    },
    statLabel: {
        fontFamily: 'PlusJakartaSans_400Regular',
        fontSize: 12,
        color: '#888',
        marginBottom: 4,
    },
    statValue: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 20,
        color: '#FFF',
    },
    financeCard: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 20,
        gap: 12,
    },
    sectionTitle: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 18,
        color: '#000',
        marginBottom: 8,
    },
    financeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    financeLabel: {
        fontFamily: 'PlusJakartaSans_400Regular',
        fontSize: 14,
        color: '#666',
    },
    financeValue: {
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 16,
        color: '#000',
    },
    divider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginVertical: 4,
    },
    unitCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        gap: 12,
        borderWidth: 1,
        borderColor: '#EEE',
    },
    unitHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    unitName: {
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 16,
        color: '#000',
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
    },
    statusText: {
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 12,
    },
    unitDetails: {
        gap: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#F5F5F5',
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    detailText: {
        fontFamily: 'PlusJakartaSans_400Regular',
        fontSize: 14,
        color: '#444',
    },
    editUnitBtn: {
        marginTop: 4,
        alignItems: 'center',
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: '#F9F9F9',
    },
    editUnitText: {
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 14,
        color: '#000',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
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
        marginBottom: 24,
    },
    modalTitle: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 20,
        color: '#000',
    },
    modalForm: {
        gap: 16,
    },
    inputLabel: {
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 14,
        color: '#666',
        marginTop: 16,
        marginBottom: 8,
    },
    textInput: {
        backgroundColor: '#F9F9F9',
        borderWidth: 1,
        borderColor: '#EEE',
        borderRadius: 12,
        padding: 16,
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 16,
    },
    statusToggleRow: {
        flexDirection: 'row',
        gap: 12,
    },
    statusToggle: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#EEE',
    },
    statusToggleActive: {
        backgroundColor: '#000',
        borderColor: '#000',
    },
    statusToggleText: {
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 14,
        color: '#666',
    },
    statusToggleTextActive: {
        color: '#FFF',
    },
    saveBtn: {
        backgroundColor: '#000',
        paddingVertical: 18,
        borderRadius: 16,
        alignItems: 'center',
        marginTop: 32,
    },
    saveBtnText: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 16,
        color: '#FFF',
    },
});
