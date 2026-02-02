const CLOUDINARY_CLOUD_NAME = 'dwscg19sa';
const CLOUDINARY_API_KEY = 'yw-zcLiDkjmnhn0AyHV1KqAD5yA';
const CLOUDINARY_API_SECRET = '241289178275474';

/**
 * Upload image to Cloudinary with folder organization
 * @param imageUri - Local image URI
 * @param folder - Folder path in Cloudinary (e.g., 'profiles/tenants', 'profiles/landlords', 'properties')
 * @param fileName - Optional custom file name
 */
export const uploadImageToCloudinary = async (
    imageUri: string, 
    folder: string = 'general',
    fileName?: string
): Promise<string> => {
    const startTime = Date.now();
    
    try {
        console.log(`[CLOUDINARY] 📤 Starting image upload to folder: ${folder}`);       

        const formData = new FormData();
        formData.append('file', {
            uri: imageUri,
            type: 'image/jpeg',
            name: fileName || `image-${Date.now()}.jpg`,
        } as any);
        formData.append('api_key', CLOUDINARY_API_KEY);
        formData.append('timestamp', Math.floor(Date.now() / 1000).toString());
        formData.append('upload_preset', 'TUZA-IMAGES');
        
        // Add folder organization
        if (folder) {
            formData.append('folder', folder);
        }
        
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
            {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        
        const data = await response.json();
        const duration = Date.now() - startTime;
        
        if (!response.ok || data.error) {
            throw new Error(data.error?.message || 'Upload failed');
        }
        
        console.log(`[CLOUDINARY] ✅ Image uploaded successfully in ${duration}ms`, {
            url: data.secure_url,
            public_id: data.public_id,
            folder: folder
        });
        
        return data.secure_url;
    } catch (error: any) {
        const duration = Date.now() - startTime;
        console.error(`[CLOUDINARY] ❌ Upload failed after ${duration}ms:`, error);
        throw new Error(`Image upload failed: ${error.message || 'Unknown error'}`);
    }
};

/**
 * Upload profile image for tenant or landlord
 */
export const uploadProfileImage = async (imageUri: string, role: 'TENANT' | 'OWNER', userId: string): Promise<string> => {
    const folder = role === 'TENANT' ? 'profiles/tenants' : 'profiles/landlords';
    const fileName = `profile-${userId}-${Date.now()}.jpg`;
    return await uploadImageToCloudinary(imageUri, folder, fileName);
};

/**
 * Upload multiple images to Cloudinary
 * @param imageUris - Array of local image URIs
 * @param folder - Folder path in Cloudinary (default: 'general')
 */
export const uploadMultipleImages = async (
    imageUris: string[], 
    folder: string = 'general'
): Promise<string[]> => {
    console.log(`[CLOUDINARY] 📤 Uploading ${imageUris.length} images to folder: ${folder}...`);
    const uploadPromises = imageUris.map((uri, index) => 
        uploadImageToCloudinary(uri, folder, `image-${Date.now()}-${index}.jpg`)
    );
    const results = await Promise.all(uploadPromises);
    console.log(`[CLOUDINARY] ✅ All ${imageUris.length} images uploaded successfully`);
    return results;
};

