import * as ImagePicker from "expo-image-picker";

export async function pickImage(): Promise<string | null> {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) return null;

    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        base64: false,
    });
    
    if (result.canceled || !result.assets?.[0]?.uri) {
        return null
    }

    return result.assets?.[0].uri ?? null;
}

export async function captureImage(): Promise<string | null> {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) return null;

    const result = await ImagePicker.launchCameraAsync({
        quality: 1,
        base64: false,
    });

    if (result.canceled || !result.assets?.[0]?.uri) {
        return null;
    }

    return result.assets?.[0]?.uri;
}