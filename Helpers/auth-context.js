import { createContext, useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';


export const AuthContext = createContext({
    UserId: '',
    UserName:'',
    DeviceId:'',
    isAuthenticated: false,
    authenticate: () => { },
    logout: () => { },
})

function AuthContextProvider({ children }) {
    const [userAuth, SetUserId] = useState();
    const [username, SetUserName] = useState();
    const [deviceId, SetDeviceId] = useState('');

    useEffect(() => {
        async function fetchUserId() {
            const userId = await AsyncStorage.getItem('UserId');
            const username = await AsyncStorage.getItem('UserName');
            const deviceid = await AsyncStorage.getItem('DeviceId');
            if (userId) {
                SetUserId(userId);
                SetUserName(username);
                SetDeviceId(deviceid);
            }
        }
        fetchUserId();
    }, []);

    function authenticate(userId, UserName, DeviceId) {
        SetUserId(userId);
        SetUserName(UserName);
        SetDeviceId(DeviceId);
        AsyncStorage.setItem('UserId', userId);
        AsyncStorage.setItem('UserName', UserName);
        AsyncStorage.setItem('DeviceId', DeviceId);
    }
    function logout() {
        SetUserId(null);
    }
    const value = {
        UserId: userAuth,
        UserName:username,
        DeviceId:deviceId,
        isAuthenticated: !!userAuth,
        authenticate: authenticate,
        logout: logout
    };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>

}

export default AuthContextProvider;