import React, { useState, useEffect, useContext } from 'react';
import {
    StyleSheet, Alert,
    View, Dimensions, ScrollView,
    Text, Image, Platform,
    TouchableOpacity,
    TextInput, KeyboardAvoidingView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../Helpers/auth-context';
import Loader from '../Helpers/Loder';
import CheckBox from 'react-native-check-box';
import DeviceInfo from 'react-native-device-info';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

export default function SettingsScreen({ navigation }: any) {
    // Sample data for orders
    const [userinfo, setUserInfo] = useState('');
    const [isChecked, setChecked] = useState(false);
    const [LatLon, setLatLon] = useState('');
    const [deviceId, setDeviceId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [UserId, setUserId] = useState('');
    const [UserMail, setEmail] = useState('');



    const shadowStyle = Platform.select({
        ios: {
            shadowColor: 'rgba(99, 99, 99, 0.2)',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 1,
            shadowRadius: 8,
        },
        android: {
            elevation: 8,
        },
    });

    function handelCancel() {
        navigation.goBack();
    }

    const handleCheckBoxChange = () => {
        setChecked(!isChecked);
    };

    async function handelSave() {
        try {
            setIsLoading(true);

            if (!LatLon) {
                Alert.alert('Please Enter LatLon.');
                setIsLoading(false);
                return false;
            }

            const [latitude, longitude] = LatLon.split(',');
            await AsyncStorage.setItem('Latitude', latitude?.trim() || '');
            await AsyncStorage.setItem('Longitude', longitude?.trim() || '');

            await AsyncStorage.setItem('IsMask', isChecked ? '1' : '0');
            navigation.goBack();
            setIsLoading(false);
        } catch (error) {
            console.log('handelSave:', error);
            setIsLoading(false);
        }
    }

    useEffect(() => {
        try {
            // Function to get the device ID
            const fetchDeviceId = async () => {
                DeviceInfo.getUniqueId().then((uniqueId) => {
                    // iOS: "FCDBD8EF-62FC-4ECB-B2F5-92C9E79AC7F9"
                    // Android: "dd96dec43fb81c97"
                    // Windows: "{2cf7cb3c-da7a-d508-0d7f-696bb51185b4}"
                    setDeviceId(uniqueId);
                    console.log(uniqueId)
                });

                const lat = await AsyncStorage.getItem('Latitude');
                const lon = await AsyncStorage.getItem('Longitude');

                const isGPSMask = await AsyncStorage.getItem('IsMask');
                let latlonValue;
                if(lat != null && lon != null){
                    latlonValue = `${lat},${lon}`;
                }else{
                    latlonValue = '';
                }
                 
                setLatLon(latlonValue);
                if (isGPSMask == '1') {
                    setChecked(true);
                } else {
                    setChecked(false);
                }
                console.log('deviceid:', latlonValue, await AsyncStorage.getItem('Latitude'), await AsyncStorage.getItem('Longitude'), isGPSMask, await AsyncStorage.getItem('DeviceId'));
            };
            fetchDeviceId();
            checkLoginState();
        } catch (error) {
            console.log('Error retrieving device ID:', error);
        }
    }, []);

    const checkLoginState = async () => {
        try {

            await AsyncStorage.getItem('userObject')
                .then((storedObject) => {
                    if (storedObject !== null) {
                        const parsedObject = JSON.parse(storedObject);
                        console.log('Retrieved userObject:', parsedObject);
                        setUserId(parsedObject.UserId)
                        setEmail(parsedObject.Email)
                    } else {
                        console.log('userObject not found');
                    }
                })
                .catch((error) => {
                    console.error('Error retrieving object:', error);
                });
        } catch (error) {
            console.log('Error reading user token:', error);
        }
    };

    // Rest of your code ...

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }} // Make sure the container has flex: 1 to take up available space
            behavior="padding"  // Or "height" depending on your use case
        >
            <View style={styles.container}>
                <View style={styles.Itemcontainer}>
                    <View style={styles.Imagecontainer}>
                        <View style={styles.imageShadow}>
                            <Image
                                resizeMode="contain"
                                source={require('../assets/vflogo.png')}
                                style={styles.imageContainerImage}
                            />
                        </View>
                    </View>

                    <ScrollView scrollEnabled={true}>
                        <View style={[styles.card, styles.inputView]}>
                            <Text style={styles.inputHeaderTextView} >Email:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Email"
                                editable={false}
                                autoCapitalize="none"
                                placeholderTextColor="#929292"
                                value={UserMail}
                            />
                            <Text style={styles.inputHeaderTextView} >UserId:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="UserId"
                                editable={false}
                                autoCapitalize="none"
                                placeholderTextColor="#929292"
                                value={UserId}
                            />
                            <Text style={styles.inputHeaderTextView} >DeviceId:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="DeviceId"
                                autoCapitalize="none"
                                editable={false}
                                value={deviceId}
                                placeholderTextColor="#929292"
                            />
                            <Text style={styles.inputHeaderTextView} >Lat/Lon:</Text>
                            <View style={styles.checkboxContainer}>
                                <TextInput
                                    style={styles.checkboxInput}
                                    placeholder="Enter Lat/Lon"
                                    autoCapitalize="none"
                                    value={LatLon}
                                    placeholderTextColor="#929292"
                                    onChangeText={text => setLatLon(text)}
                                />

                                <CheckBox
                                    isChecked={isChecked}
                                    onClick={handleCheckBoxChange}
                                    checkBoxColor="#1f619e" // Change this to your desired color
                                    style={styles.checkbox}
                                />

                            </View>
                        </View>
                    </ScrollView>

                    <View style={styles.fixToText}>
                        <TouchableOpacity style={styles.buttonCancelview} onPress={handelCancel}>
                            <Text style={styles.buttonCancelTextView}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.buttonview} onPress={handelSave}>

                            <Text style={styles.buttonTextView}>Save</Text>

                        </TouchableOpacity>
                    </View>
                </View>


                {isLoading && <Loader />}
            </View>

        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        height: deviceHeight,
        width: deviceWidth
    },

    checkbox: {
        alignSelf: 'center',
    },
    //#region Toolbar Styles

    toolbar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1f619e',
        height: 56,
        paddingHorizontal: 16,
    },

    toolbarTitle: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
        justifyContent: 'center'
    },

    //#endregion Toolbar Styles

    //#region Top Image Style

    Imagecontainer: {
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        margin: 5,
        marginBottom: 30
    },

    imageContainerImage: {
        justifyContent: 'center',
        height: 120,
        width: 120,
        margin: 5,
        padding: 8,
    },

    imageShadow: {
        height: 120,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#d4e6f7',
        shadowColor: '#d4e6f7',
    },

    //#endregion Top Image Style

    Itemcontainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },

    card: {
        backgroundColor: '#EEEEEE',
        borderRadius: 8,
        padding: 16,
        marginLeft: 5,
        marginRight: 5,
        width: '97%',
    },

    shadowProp: {
        borderWidth: 1,
        borderRadius: 15,
        borderColor: '#ddd',
        borderBottomWidth: 0,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.9,
        shadowRadius: 3,
        elevation: 3,
    },

    inputView: {
        padding: 12
    },

    inputHeaderTextView: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 14,
        fontWeight: '600',
    },

    input: {
        height: 50,
        borderRadius: 10,
        fontSize: 14,
        marginTop: 8,
        textAlign: 'left',
        padding: 12,
        fontFamily: 'Poppins-Regular',
        marginBottom: 10,
        color: "#929292",
        backgroundColor: "#FFFFFF",
        textAlignVertical: "center",
    },

    footer: {
        height: 70,
    },

    checkboxContainer: {
        backgroundColor: '#EEEEEE',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    checkboxview: {
        alignSelf: 'center',
        margin: 8,
    },

    checkboxInput: {
        height: 50,
        borderRadius: 10,
        fontSize: 14,
        width: "85%",
        marginTop: 8,
        padding: 12,
        marginBottom: 10,
        color: "#929292",
        backgroundColor: "#FFFFFF",
        textAlignVertical: "center",
    },
    buttonCancelTextView: {
        fontSize: 14,
        color: "#000000",
        fontFamily: 'Poppins-Bold',
        alignSelf: "center",
    },

    fixToText: {
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 25,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        textAlign: 'center',
        justifyContent: 'space-between',
    },

    buttonCancelview: {
        height: 40,
        width: 100,
        alignItems: 'center',
        borderColor: '#000000',
        borderWidth: 1,
        backgroundColor: "#FFFFFF",
        justifyContent: 'space-evenly',
        flexDirection: 'row',
        borderRadius: 8,
    },

    buttonview: {
        height: 40,
        borderRadius: 8,
        padding: 8,
        width: 100,
        flexDirection: "row",
        backgroundColor: "#000000",
        justifyContent: "space-evenly",
    },

    buttonTextView: {
        fontSize: 14,
        color: "#fff",
        fontFamily: 'Poppins-Bold',
        alignSelf: "center",
    },
});

