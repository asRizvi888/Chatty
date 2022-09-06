import * as React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getUser = async () => {
    const [user, setUser] = React.useState(null);

    try {
        const response = await AsyncStorage.getItem('CURRENT_USER');
        setUser(response);
        //const response = (jsonValue != null) ? JSON.parse(jsonValue) : null;
        //console.log(`RESPONSE:${response}`);
        return user;
    } catch (e) {
        // error reading value
        console.error(e);
        return null;
    }
}

const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {

    const userData = getUser();
    const [user, setUser] = React.useState(userData);

    return (
        <AuthContext.Provider
            value={{ user, setUser }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export { AuthContext, AuthProvider, getUser };