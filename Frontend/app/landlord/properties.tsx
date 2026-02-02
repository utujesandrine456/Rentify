import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, KeyboardAvoidingView, Platform, ActivityIndicator, Alert, Image, RefreshControl } from 'react-native';
import TopBar from '../../components/topbar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { LandlordService } from '@/context/landlord.service';
import { uploadImageToCloudinary } from '@/utils/cloudinary';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logDashboard, logDashboardSuccess, logDashboardError } from '@/utils/monitoring';

interface Property {
    id: string;
    description: string;
    location: string;
    rentAmount: number;
    dueDay: number;
    bedrooms?: number;
    bathrooms?: number;
    status: string;
    createdAt?: string;
}

export default function Properties() {
    const router = useRouter();
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [properties, setProperties] = useState<Property[]>([]);

    const [newPropName, setNewPropName] = useState('');
    const [newPropLoc, setNewPropLoc] = useState('');
    const [newPropBedrooms, setNewPropBedrooms] = useState('');
    const [newPropBathrooms, setNewPropBathrooms] = useState('');
    const [newPropRent, setNewPropRent] = useState('');
    const [newPropDueDay, setNewPropDueDay] = useState('');
    const [selectedImages, setSelectedImages] = useState<string[]>([]);

    useEffect(() => {
        loadProperties();
    }, []);

    const loadProperties = async () => {
        const startTime = Date.now();
        setLoading(true);
        
        try {
            logDashboard('LANDLORD', 'Loading properties...');
            
            const propertiesData = await LandlordService.getMyProperties();
            setProperties(Array.isArray(propertiesData) ? propertiesData : []);
            
            const duration = Date.now() - startTime;
            logDashboardSuccess('LANDLORD', 'Properties loaded', { count: propertiesData.length }, duration);
        } catch (error: any) {
            const duration = Date.now() - startTime;
            logDashboardError('LANDLORD', 'Failed to load properties', error, duration);
        } finally {
            setLoading(false);
        }
    };

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission needed', 'We need camera roll permissions to upload images');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            quality: 0.8,
        });

        if (!result.canceled && result.assets) {
            const uris = result.assets.map(asset => asset.uri);
            setSelectedImages([...selectedImages, ...uris]);
        }
    };

    const removeImage = (index: number) => {
        setSelectedImages(selectedImages.filter((_, i) => i !== index));
    };

    const handleAddProperty = async () => {
        if (!newPropName || !newPropLoc || !newPropRent || !newPropDueDay) {
            Alert.alert('Validation Error', 'Please fill in all required fields');
            return;
        }

        const startTime = Date.now();
        setUploading(true);

        try {
            logDashboard('LANDLORD', 'Creating new property...');

            // Upload images to Cloudinary first (in properties folder)
            let imageUrls: string[] = [];
            if (selectedImages.length > 0) {
                logDashboard('LANDLORD', `Uploading ${selectedImages.length} images to Cloudinary...`);
                const userId = await AsyncStorage.getItem('userId') || '';
                const uploadPromises = selectedImages.map((uri, index) => 
                    uploadImageToCloudinary(uri, 'properties', `property-${userId}-${Date.now()}-${index}.jpg`)
                );
                imageUrls = await Promise.all(uploadPromises);
                logDashboardSuccess('LANDLORD', 'Images uploaded to Cloudinary', { count: imageUrls.length });
            }

            // Create property with image URLs (store in description or as separate field)
            // Note: Backend PropertyDTO doesn't have image field yet, so we'll append to description
            const description = imageUrls.length > 0 
                ? `${newPropName} [IMAGES:${imageUrls.join(',')}]`
                : newPropName;

            const propertyData = {
                description: description,
                location: newPropLoc,
                rentAmount: parseFloat(newPropRent),
                dueDay: parseInt(newPropDueDay),
                bedrooms: newPropBedrooms ? parseInt(newPropBedrooms) : null,
                bathrooms: newPropBathrooms ? parseInt(newPropBathrooms) : null,
                status: 'AVAILABLE'
            };

            await LandlordService.addProperty(propertyData);

            const duration = Date.now() - startTime;
            logDashboardSuccess('LANDLORD', 'Property created successfully', propertyData, duration);

            // Reset form
            setNewPropName('');
            setNewPropLoc('');
            setNewPropBedrooms('');
            setNewPropBathrooms('');
            setNewPropRent('');
            setNewPropDueDay('');
            setSelectedImages([]);
            setModalVisible(false);

            // Reload properties
            await loadProperties();

            Alert.alert('Success', 'Property added successfully!');
        } catch (error: any) {
            const duration = Date.now() - startTime;
            logDashboardError('LANDLORD', 'Failed to create property', error, duration);
            Alert.alert('Error', error.message || 'Failed to add property. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteProperty = async (id: string) => {
        Alert.alert(
            'Delete Property',
            'Are you sure you want to delete this property?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            logDashboard('LANDLORD', `Deleting property ${id}...`);
                            await LandlordService.deleteProperty(id);
                            logDashboardSuccess('LANDLORD', 'Property deleted successfully');
                            await loadProperties();
                        } catch (error: any) {
                            logDashboardError('LANDLORD', 'Failed to delete property', error);
                            Alert.alert('Error', error.message || 'Failed to delete property');
                        }
                    }
                }
            ]
        );
    };


    if (loading && properties.length === 0) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#000" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TopBar title="Properties" />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={loadProperties} />
                }
            >
                <View style={styles.headerRow}>
                    <Text style={styles.sectionTitle}>My Properties</Text>
                    <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                        <Ionicons name="add" size={24} color="#FFF" />
                    </TouchableOpacity>
                </View>

                {properties.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="business-outline" size={48} color="#CCC" />
                        <Text style={styles.emptyText}>No properties yet</Text>
                        <Text style={styles.emptySubtext}>Add your first property to get started</Text>
                    </View>
                ) : (
                    properties.map((prop) => (
                        <View key={prop.id} style={styles.card}>
                            <View style={styles.cardHeader}>
                                <View style={styles.iconBox}>
                                    <Ionicons name="business" size={24} color="#000" />
                                </View>
                                <View style={styles.cardInfo}>
                                    <Text style={styles.propName}>{prop.description}</Text>
                                    <Text style={styles.propLoc}>{prop.location}</Text>
                                </View>
                                <TouchableOpacity onPress={() => handleDeleteProperty(prop.id)}>
                                    <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.divider} />
                            <View style={styles.statsRow}>
                                <View style={styles.stat}>
                                    <Text style={styles.statLabel}>Rent</Text>
                                    <Text style={styles.statVal}>{(prop.rentAmount || 0).toLocaleString()} Frw</Text>
                                </View>
                                <View style={styles.stat}>
                                    <Text style={styles.statLabel}>Due Day</Text>
                                    <Text style={styles.statVal}>{prop.dueDay || 'N/A'}</Text>
                                </View>
                                <View style={styles.stat}>
                                    <Text style={styles.statLabel}>Status</Text>
                                    <Text style={[styles.statVal, { color: prop.status === 'AVAILABLE' ? '#4CD964' : '#FF3B30' }]}>
                                        {prop.status}
                                    </Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                style={styles.viewBtn}
                                onPress={() => router.push({
                                    pathname: '/landlord/details',
                                    params: { id: prop.id }
                                })}
                            >
                                <Text style={styles.viewBtnText}>Manage Details</Text>
                            </TouchableOpacity>
                        </View>
                    ))
                )}
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
                            <TouchableOpacity onPress={() => setModalVisible(false)} disabled={uploading}>
                                <Ionicons name="close" size={24} color="#000" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalForm}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Property Name *</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="e.g. Green Heights"
                                    value={newPropName}
                                    onChangeText={setNewPropName}
                                    placeholderTextColor="#999"
                                    editable={!uploading}
                                />
                            </View>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Location *</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="e.g. Kigali, Kicukiro"
                                    value={newPropLoc}
                                    onChangeText={setNewPropLoc}
                                    placeholderTextColor="#999"
                                    editable={!uploading}
                                />
                            </View>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Monthly Rent (RWF) *</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="150000"
                                    value={newPropRent}
                                    onChangeText={setNewPropRent}
                                    keyboardType="numeric"
                                    placeholderTextColor="#999"
                                    editable={!uploading}
                                />
                            </View>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Due Day (1-31) *</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="1"
                                    value={newPropDueDay}
                                    onChangeText={setNewPropDueDay}
                                    keyboardType="numeric"
                                    placeholderTextColor="#999"
                                    editable={!uploading}
                                />
                            </View>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Bedrooms (Optional)</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="2"
                                    value={newPropBedrooms}
                                    onChangeText={setNewPropBedrooms}
                                    keyboardType="numeric"
                                    placeholderTextColor="#999"
                                    editable={!uploading}
                                />
                            </View>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Bathrooms (Optional)</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="1"
                                    value={newPropBathrooms}
                                    onChangeText={setNewPropBathrooms}
                                    keyboardType="numeric"
                                    placeholderTextColor="#999"
                                    editable={!uploading}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Property Images</Text>
                                <TouchableOpacity style={styles.imagePickerBtn} onPress={pickImage} disabled={uploading}>
                                    <Ionicons name="image-outline" size={20} color="#000" />
                                    <Text style={styles.imagePickerText}>Select Images</Text>
                                </TouchableOpacity>
                                {selectedImages.length > 0 && (
                                    <ScrollView horizontal style={styles.imagePreviewContainer}>
                                        {selectedImages.map((uri, index) => (
                                            <View key={index} style={styles.imagePreview}>
                                                <Image source={{ uri }} style={styles.previewImage} />
                                                <TouchableOpacity
                                                    style={styles.removeImageBtn}
                                                    onPress={() => removeImage(index)}
                                                >
                                                    <Ionicons name="close-circle" size={20} color="#FF3B30" />
                                                </TouchableOpacity>
                                            </View>
                                        ))}
                                    </ScrollView>
                                )}
                            </View>

                            <View style={styles.modalActions}>
                                <TouchableOpacity 
                                    style={styles.cancelBtn} 
                                    onPress={() => setModalVisible(false)}
                                    disabled={uploading}
                                >
                                    <Text style={styles.cancelText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={[styles.saveBtn, uploading && { opacity: 0.6 }]} 
                                    onPress={handleAddProperty}
                                    disabled={uploading}
                                >
                                    {uploading ? (
                                        <ActivityIndicator size="small" color="#FFF" />
                                    ) : (
                                        <Text style={styles.saveText}>Save Property</Text>
                                    )}
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
    cardInfo: {
        flex: 1,
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
        marginBottom: 16,
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
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        gap: 12,
    },
    emptyText: {
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 18,
        color: '#000',
    },
    emptySubtext: {
        fontFamily: 'PlusJakartaSans_400Regular',
        fontSize: 14,
        color: '#888',
    },
    imagePickerBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: 16,
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#EEE',
    },
    imagePickerText: {
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 14,
        color: '#000',
    },
    imagePreviewContainer: {
        marginTop: 12,
        gap: 12,
    },
    imagePreview: {
        position: 'relative',
        marginRight: 12,
    },
    previewImage: {
        width: 100,
        height: 100,
        borderRadius: 12,
    },
    removeImageBtn: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: '#FFF',
        borderRadius: 12,
    },
});
