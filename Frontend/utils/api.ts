import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = "http://10.11.73.129:8080/api/v1";
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";


export async function apiRequest(endpoint: string, method: HttpMethod = "POST", body?: any){
    const token = await AsyncStorage.getItem("token");

    const headers : any = {
        "Content-Type": "application/json",
    };

    if(token){
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: method,
        headers: headers,
        body: body ? JSON.stringify(body) : undefined
    });

    const contentType = response.headers.get("content-type");
    let data;
    
    if (contentType && contentType.includes("application/json")) {
        data = await response.json();
    } else {
        const text = await response.text();
        try {
            data = JSON.parse(text);
        } catch {
            data = text;
        }
    }
    
    if(!response.ok){
        const errorMessage = typeof data === 'string' ? data : (data.message || data.error || "Something went wrong");
        throw new Error(errorMessage);
    }

    return data;
}
