import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = "http://192.168.1.101:8080";
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

    const data = await response.json();
    
    if(!response.ok){
        throw new Error(data.message || "Something went wrong");
    }

    return data;
}
