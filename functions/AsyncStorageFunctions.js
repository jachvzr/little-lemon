import AsyncStorage from "@react-native-async-storage/async-storage";

export const writeData = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, value);
        
    }
    catch(error) {
        console.log(error);
    }
    
};

export const readData = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
            return value;
        }
    }
    catch(error) {
        console.log(error);
    }
    
};

export const removeItem = async (key) => {
    try {
        await AsyncStorage.removeItem(key);
    }
    catch(error) {
        console.log(error);
    }
}

export const clearData = async () => {
    try {
        await AsyncStorage.clear()
    } catch(error) {
        console.log(error);
    }
}