import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import {
    AppState,
    StyleSheet,
    SafeAreaView, Linking,
    View, ScrollView, FlatList, ActivityIndicator,
    Text, Image, Dimensions, TouchableOpacity,
    Alert,
    TextInput, StatusBar, Platform
} from "react-native";
import GestureHandlerRootView from 'react-native-gesture-handler';
import BottomSheet from '@gorhom/bottom-sheet';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../Helpers/auth-context';
import { SaveTruckGPSDetails, GetUserDetails } from '../Helpers/auth';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Feather from 'react-native-vector-icons/Feather'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Geolocation from '@react-native-community/geolocation';
import { initBackgroundFetch } from '../Helpers/Tracking';
//import useTracking from '../Helpers/LocationTracking';
import AppStatusBar from '../Helpers/AppStatusBar';
import Toolbar from '../Helpers/Toolbar';
import { DeleteShipmentsByStatusId, InsertShipmentData, GetAllShipments, UpSertShipmentProduct, UpSertShipmentBOL, UpSertShipmentBOLProduct, upsertTerminal, UpSertShipTo } from '../Helpers/DbContext';

const THEME_COLOR = '#ffffff';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
const NUM_COLUMNS = 3;
const ITEM_WIDTH = Dimensions.get('window').width / NUM_COLUMNS;
const cardWidth = deviceWidth / 3; // Calculate the width of each card based on the screen width
const INTERVAL = 30000; // 60 seconds interval in milliseconds

let lastUpdatedTime = new Date();
const currentHour = new Date().getHours();
let greeting; // Explicitly define the type
if (currentHour < 12) {
    greeting = 'Good Morning';
} else if (currentHour < 17) {
    greeting = 'Good Afternoon';
} else {
    greeting = 'Good Evening';
}
let defaultLocation = {
    latitude: 0,
    longitude: 0
}

const CurrentLocation = {
    latitude: '',
    longitude: ''
};

const HomeScreen = ({ navigation }) => {
    const authCtx = useContext(AuthContext);
    const [locationData, setLocationData] = useState(defaultLocation);
    const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
    const [Lat, setLat] = useState('');
    const [Lon, setLon] = useState('');
    const [deviceId, setDeviceId] = useState('');
    const [UserId, setUserId] = useState('');
    const [UserName, setUserName] = useState('');
    const [isChecked, setChecked] = useState(false);
    const [Orderview, setOrderview] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [listOrders, setListData] = useState([]);
    const [OrdersCount, setOrdersCount] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [IsGPS, setGPSEnable] = useState(true);
    const [location, setLocation] = useState(null);

    const [lastUpdatedTime, setLastUpdatedTime] = useState(new Date());

    // const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);
    //const { location } = useTracking(IsGPS);
    const bottomSheetRef = useRef(null);;
    const snapPoints = ['45%']; // Define your snap points

    const handleLeftIconPress = () => {
        // Handle left icon press
        bottomSheetRef.current?.expand();
        setBottomSheetOpen(true);
    };

    const handleRightIconPress = () => {
        // Handle right icon press
        //navigation.navigate('Bottom');
        navigation.push('Settings')

    };

    const handleSheetChange = useCallback((index) => {
        console.log("handleSheetChange", index);
        if (index == -1) {
            setBottomSheetOpen(false);
            bottomSheetRef.current?.close();
        }
    }, []);


    const data = [
        { id: 1, title: 'View Orders', image: 'truck-outline' }, // MaterialCommunityIcons

        { id: 2, title: 'Create Orders', image: 'file-alt' }, //FontAwesome5

        { id: 3, title: 'Geofence', image: 'map-marker-radius-outline' },//MaterialCommunityIcons

        { id: 4, title: 'Site Validator', image: 'file-alt' }, //FontAwesome5

        { id: 5, title: 'Notifications', image: 'notifications-outline' }, //Ionicons

        { id: 6, title: 'Settings', image: 'settings-outline' }, //Ionicons

        { id: 7, title: 'Logout', image: 'logout' } //MaterialCommunityIcons
    ];

    const renderOrderItem = ({ item }) => {

        return (

            <View style={[styles.card, shadowStyle]} key={Math.round()}>
                <View style={styles.OrderView}>
                    <View style={styles.leftContainer}>
                        <Text style={styles.OrderNumber}>Order #{item.orderNumber}</Text>
                        <Text style={styles.OrderDate}>{item.deliveryWindowStart}</Text>
                    </View>
                    <View style={styles.rightContainer}>
                        <MaterialIcons name="arrow-forward-ios" size={20} color="#000000" />
                    </View>
                </View>
                <View style={{ height: 1, width: '100%', borderRadius: 1, borderWidth: 1, borderColor: 'gray', borderStyle: 'dashed', zIndex: 0, }}>
                    <View style={{ position: 'absolute', left: 0, bottom: 0, width: '100%', height: 1, backgroundColor: 'white', zIndex: 1 }} />
                </View>


                <View style={styles.itemList}>
                    {item.listTerminal.map((item) => (
                        <View key={item.terminalId} style={styles.terminalView}>
                            <View style={styles.iconContainer}>
                                <Image
                                    resizeMode="contain"
                                    source={require('../assets/terminal.png')}
                                    style={{ width: 20, height: 20, margin: 5 }}
                                />
                            </View>
                            <View style={styles.itemTerminalContainer}>
                                <Text style={styles.itemTerminalName}>{item.terminalName}</Text>
                                <Text style={styles.itemTerminalAddress}>{item.address},{item.city},{item.countryCode},{item.zip}</Text>
                            </View>
                        </View>
                    ))}
                </View>
                <View style={styles.terminalView}>
                    <View style={styles.iconContainer}>
                        <Image
                            resizeMode="contain"
                            source={require('../assets/shipto.png')}
                            style={{ width: 20, height: 20, margin: 5 }}
                        />
                    </View>
                    <View style={styles.itemTerminalContainer}>
                        <Text style={styles.itemTerminalName}>{item.shipToName}</Text>
                        <Text style={styles.itemTerminalAddress}>{item.shipToAddress}</Text>
                    </View>

                </View>


                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <TouchableOpacity style={styles.buttonview} onPress={() => navigation.navigate('Order Details', { itemData: item })}>
                        <Text style={styles.buttonTextView}>View Details</Text>
                    </TouchableOpacity>
                </View>


            </View>

        );

    };


    const handleItemClick = (item) => {
        // Handle the item click event here
        console.log('Item clicked:', item);

        if (item.title === 'Settings') {
            navigation.push('Settings')
            bottomSheetRef.current?.close();
        }

        if (item.title === 'Logout') {

            Alert.alert(
                'Confirm',
                'Are you sure you want to Logout?',
                [
                    {
                        text: 'No',
                        style: 'cancel',
                    },
                    {
                        text: 'Yes',
                        onPress: () => {
                            // Do something when "Yes" is pressed
                            authCtx.logout();
                            navigation.navigate('Login');
                        },
                    },
                ],
                { cancelable: false }
            );

        }

        if (item.title === 'Geofence') {
            navigation.navigate('Geofence')
            bottomSheetRef.current?.close();
        }

        if (item.title === 'View Orders') {
            Alert.alert(
                'Alert!',
                'We are working on it.',
                [{ text: 'OK', onPress: () => console.log('Info alert dismissed') }],
                { cancelable: false }
            );
            bottomSheetRef.current?.close();
        }
        if (item.title === 'Create Orders') {
            Alert.alert(
                'Alert!',
                'We are working on it.',
                [{ text: 'OK', onPress: () => console.log('Info alert dismissed') }],
                { cancelable: false }
            );
            bottomSheetRef.current?.close();
        }
        if (item.title === 'Site Validator') {
            navigation.navigate('Validator')
            bottomSheetRef.current?.close();
        }
        if (item.title === 'Notifications') {
            Alert.alert(
                'Alert!',
                'We are working on it.',
                [{ text: 'OK', onPress: () => console.log('Info alert dismissed') }],
                { cancelable: false }
            );
            bottomSheetRef.current?.close();
        }

    };

    const renderBottomSheetItem = ({ item }) => {

        return (
            <TouchableOpacity onPress={() => handleItemClick(item)}>
                <View style={styles.bottomitemContainer}>
                    {(item.id === 3 || item.id == 1 || item.id == 7) ? (
                        <>
                            <MaterialCommunityIcons
                                name={item.image}
                                size={30}
                                color='#1f619e'
                                style={styles.bottomitemImage}
                            />
                        </>
                    ) : (item.id === 5 || item.id === 6) ? (
                        <Ionicons
                            name={item.image}
                            size={30}
                            color='#1f619e'
                            style={styles.bottomitemImage}
                        />
                    ) : (
                        <FontAwesome5
                            name={item.image}
                            size={30}
                            color='#1f619e'
                            style={styles.bottomitemImage}
                        />
                    )}
                    <Text style={styles.bottomitemTitle}>{item.title}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    const checkLoginState = async () => {
        try {

            await AsyncStorage.getItem('userObject')
                .then((storedObject) => {
                    if (storedObject !== null) {
                        const parsedObject = JSON.parse(storedObject);
                        console.log('Retrieved userObject:', parsedObject);
                        setUserId(parsedObject.UserId);
                        setUserInfo(parsedObject);
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

    const fetchDeviceId = async () => {
        try {
            const uniqueId = await DeviceInfo.getUniqueId();
            setDeviceId(uniqueId);

            console.log('Dashboard Settings:', deviceId);
        } catch (error) {
            console.log('Error retrieving device ID:', error);
        }
    };

    const SetInterval = async () => {
        try {
            const intervalCallback = async () => {
                // console.log('Current Time:', new Date());
                console.log('Current Time::', new Date().toISOString());
                // console.log('lastUpdatedTime:', lastUpdatedTime);
                handleApiCall();
            };

            const intervalId = setInterval(intervalCallback, INTERVAL);

            return () => clearInterval(intervalId);

        } catch (error) {
            console.log('Error retrieving device ID:', error);
        }
    }

    const GetUser = async () => {
        try {
            const postData = {
                UserId: authCtx.UserId,
            }
            // Call API function and handle response
            const response = await GetUserDetails(postData);
            if (response != null || response != undefined) {
                //console.log('GetUserDetails Response:', JSON.stringify(response));
                const user = `${response.firstName} ${response.lastName}`
                setUserName(user);
            }

        } catch (error) {
            console.error('GetUserDetails', error);
        }
    }

    const handleApiCall = async () => {
        setIsLoading(true);
        try {
            const DeviceId = await DeviceInfo.getUniqueId();
            const UserId = await AsyncStorage.getItem('UserId');
            const isGPSMask = await AsyncStorage.getItem('IsMask');

            const DeviceParams = {
                Username: userInfo?.Email,
                Platform: Platform.OS,
                DeviceId: DeviceId,
                IsGPSMask: isGPSMask,
            };

            let postData;

            console.log("Gps Mask", isGPSMask)

            if (isGPSMask === "0" || isGPSMask === null) {

                Alert.alert('Location', String(location.latitude));
                console.log("Gps UnMasked",location.latitude)
                // Construct postData object
                postData = {
                    latitude: 33.985798, //location.latitude,33.985798,-83.419841
                    longitude: -83.419841, //,
                    GPSTimeStamp: new Date().toISOString(),
                    lastModified: new Date().toISOString(),
                    userID: UserId,
                    deviceId: DeviceId || '',
                    fullAddress: null,
                    notificationLastSyncDate: null,
                    shipmentLastSyncDate: null,
                    bundleName: 'com.verifuel.pod',
                    platformTypeId: Platform.OS == 'android' ? 2 : 1,
                    gpsAccuracyType: 0,
                    gpsPingInterval: 10800,
                    deviceParameters: JSON.stringify(DeviceParams), // Ensure DeviceParams is properly formatted
                    showNearbyOrders: true,
                };

            } else {

                console.log("Gps Masked")
                const latitude = await AsyncStorage.getItem('Latitude'); //28.422202;
                const longitude = await AsyncStorage.getItem('Longitude'); //-81.370692;
                // Construct postData object
                postData = {
                    latitude: latitude,
                    longitude: longitude,
                    GPSTimeStamp: new Date().toISOString(),
                    lastModified: new Date().toISOString(),
                    userID: UserId,
                    deviceId: DeviceId || '',
                    fullAddress: null,
                    notificationLastSyncDate: null,
                    shipmentLastSyncDate: null,
                    bundleName: 'com.verifuel.pod',
                    platformTypeId: Platform.OS == 'android' ? 2 : 1,
                    gpsAccuracyType: 0,
                    gpsPingInterval: 10800,
                    deviceParameters: JSON.stringify(DeviceParams), // Ensure DeviceParams is properly formatted
                    showNearbyOrders: true,
                };

            }

            DeleteShipmentsByStatusId(7)
                .then(() => {
                    console.log('Shipments deleted successfully');
                    // Perform further actions after deletion
                })
                .catch((error) => {
                    console.error('Error deleting shipments:', error);
                });
            // Call API function and handle response
            const response = await SaveTruckGPSDetails(postData);
            if (response != null || response != undefined) {

                console.log('response.listShipment', response.listShipment);

                const resp = response.listShipment.filter((t) => {
                    console.log(t.statusId, typeof t.statusId);
                    return t.statusId !== 7;
                })

                if (resp != null) {

                    setListData(resp);

                    resp.forEach((orders) => {

                        //console.log('Json Data Response:', JSON.stringify(response.listShipment));

                        InsertShipmentData(orders);

                        orders.listShipmentProduct.forEach((shipmentProduct) => {
                            UpSertShipmentProduct(shipmentProduct);
                        });

                        orders.listBOL.forEach((orderBol) => {
                            //console.log("Server BOL", orders.listBOL)
                            UpSertShipmentBOL(orderBol, orders.shipmentId);
                            orderBol.listBOLProduct.forEach((orderBolProduct) => {
                                UpSertShipmentBOLProduct(orderBolProduct);
                            })
                        });

                        orders.listShipTo.forEach((orderShipTo) => {
                            UpSertShipTo(orderShipTo);
                        });

                        orders.listTerminal.forEach((orderTerminal) => {
                            //console.log(' orders.listTerminal', orders.listTerminal);
                            upsertTerminal(orderTerminal);
                        });

                    });
                    setOrdersCount(resp?.length == null ? 0 : resp?.length)

                    GetAllShipments()
                        .then((shipmentModels) => {
                            console.log('All Shipments:', JSON.stringify(shipmentModels));
                            // Perform further actions with the fetched shipment models
                        })
                        .catch((error) => {
                            console.error('Error fetching shipments:', error);
                        });
                    setOrderview(true);
                } else {
                    setOrderview(false);
                }
            }
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.error('handleApiCall', error);
        }
    };

    const handleLocationUpdate = (location) => {
        // Use the location data as needed
        console.log("Received location update:", location.coords);
        if (location && location.coords) {
            console.log("Received location update11111111:", location.coords);
            setLocation(location.coords);
        }        // You can update your component's state or perform any other action here
    };

    useEffect(() => {

        initBackgroundFetch(handleLocationUpdate);

        GetUser();

        checkLoginState();

        fetchDeviceId();

        SetInterval();

    }, [location]);

    const renderEmptyList = () => (
        <View style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: 'red', flex: 1 }}>
            <Text style={{ textAlign: 'center' }} >No items to display</Text>
        </View>
    );


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

    return (
        <>
            <SafeAreaView style={styles.topSafeArea} />
            <SafeAreaView style={styles.bottomSafeArea}>
                <AppStatusBar backgroundColor={THEME_COLOR} barStyle="default" />

                <Toolbar
                    title="DashBaord"
                    onLeftIconPress={handleLeftIconPress}
                    onRightIconPress={handleRightIconPress}
                />

                <View style={[styles.mainViewContainer, { backgroundColor: bottomSheetOpen ? '#ffffff' : '#ffffff' }]}>

                    <View style={[{ backgroundColor: '#EEEEEE', paddingBottom: 10, borderBottomLeftRadius: 6, borderBottomRightRadius: 6, }]}>

                        <View style={[{ backgroundColor: '#EEEEEE', height: 35, justifyContent: 'center' }]}>
                            <Text style={{ marginLeft: 10, alignItems: 'center', fontSize: 15, fontFamily: 'Poppins-SemiBold', color: '#000000', fontWeight: '700', }}>{greeting}, {UserName}</Text>
                        </View>

                        <View style={styles.headerBoxrow}>
                            <View style={styles.headercard}>
                                <TouchableOpacity>
                                    <View style={styles.itemContainer}>

                                        <Text style={styles.itemTitle}>Total Orders: {OrdersCount}</Text>
                                        <Feather
                                            name='truck'
                                            size={24}
                                            color='#1f619e'
                                            style={styles.itemImage}
                                        />
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.headercard}>
                                <TouchableOpacity>
                                    <View style={styles.itemContainer}>

                                        <MaterialCommunityIcons
                                            name='map-marker-distance'
                                            size={24}
                                            color='#1f619e'
                                            style={styles.itemImage}
                                        />

                                        <Text style={styles.itemTitle}>Time</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.headercard}>
                                <TouchableOpacity>
                                    <View style={styles.itemContainer}>

                                        <Feather
                                            name='clock'
                                            size={24}
                                            color='#1f619e'
                                            style={styles.itemImage}
                                        />

                                        <Text style={styles.itemTitle}>Duration</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>

                        </View>

                    </View>

                    <View style={[{ backgroundColor: '#EEEEEE', margin: 5, paddingBottom: 10, height: "78%", borderRadius: 8, }, shadowStyle]}>
                        <View style={styles.todaysOrdercontainer}>
                            <Text style={styles.todaysOrdertext}>Today's orders</Text>
                            {isLoading ? (
                                <ActivityIndicator style={styles.todaysOrderindicator} size="small" color="#000000" />
                            ) : null}

                        </View>

                        <FlatList
                            data={listOrders}
                            renderItem={renderOrderItem}
                            keyExtractor={(item) => item.OrderNumber}
                            contentContainerStyle={{ justifyContent: 'center', width: '100%' }}
                        />

                    </View>

                    {bottomSheetOpen && <View style={styles.overlay} />}
                </View>


                <BottomSheet
                    ref={bottomSheetRef}
                    index={-1}
                    snapPoints={snapPoints}
                    onChange={handleSheetChange}>

                    <ScrollView>
                        <View style={styles.bottomSheetContentContainer}>
                            <FlatList
                                data={data}
                                nestedScrollEnabled={true}
                                scrollEnabled={false}
                                renderItem={renderBottomSheetItem}
                                keyExtractor={(item) => item.id.toString()}
                                numColumns={NUM_COLUMNS}
                                contentContainerStyle={styles.bottomSheetContainer}
                            />
                        </View>
                    </ScrollView>
                </BottomSheet>

            </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({

    topSafeArea: {
        flex: 0,
        backgroundColor: THEME_COLOR
    },
    bottomSafeArea: {
        flex: 1,
        backgroundColor: 'white'
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust the color and opacity as needed
    },

    bottomSheetContentContainer: {
        flex: 1,
        backgroundColor: '#f3f3f3',
    },

    bottomSheetContent: {
        padding: 16,
        backgroundColor: 'white',
        borderRadius: 10,
    },

    bottomSheetContainer: {
        flex: 1,
        backgroundColor: 'white',
    },

    bottomitemContainer: {
        width: ITEM_WIDTH - 10,
        height: 100,
        margin: 5,
        borderWidth: 2,
        borderRadius: 10,
        borderColor: '#d4e6f7',
        backgroundColor: 'white',
        verticalAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },

    bottomitemImage: {
        borderRadius: 8,
    },

    bottomitemTitle: {
        marginTop: 8,
        fontSize: 12,
        fontWeight: 'bold',
        color: '#1f619e'
    },

    mainViewContainer: {
        flex: 1,
        backgroundColor: '#f2f2f2',
    },

    headerBoxrow: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    headercard: {
        width: cardWidth,
        marginHorizontal: 1,
    },

    itemContainer: {
        width: ITEM_WIDTH - 10,
        height: 100,
        margin: 5,
        borderWidth: 2,
        borderRadius: 10,
        borderColor: '#d4e6f7',
        backgroundColor: '#000000',
        verticalAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',

    },

    itemImage: {
        borderRadius: 8,
        position: 'absolute',
        bottom: 15,
        right: 5,
        width: 35,
    },

    itemTitle: {
        margin: 8,
        fontSize: 12,
        fontFamily: 'Poppins-Bold',
        color: 'white',
        position: 'absolute',
        top: 10,
        left: 10,
    },

    todaysOrdercontainer: {
        flexDirection: 'row',
        paddingVertical: 10,
    },
    todaysOrdertext: {
        flex: 1,
        marginLeft: 10,
        fontSize: 13,
        fontWeight: '700',
        fontFamily: 'Poppins-Bold',
    },
    todaysOrderindicator: {
        marginLeft: 10,
        marginRight: 10,
    },

    card: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        margin: 5,
        // Add other card styles as needed
    },

    OrderView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 2
    },

    leftContainer: {
        flex: 1,
    },
    rightContainer: {
        flex: 0,
    },

    itemList: {
        marginTop: 12,
        marginBottom: 12,
    },

    itemTerminalContainer: {
        marginBottom: 8,
    },
    itemTerminalName: {
        fontSize: 14,
        fontFamily: 'Poppins-SemiBold',
        color: '#000000',
    },
    itemTerminalAddress: {
        fontSize: 12,
        fontFamily: 'Poppins-Regular',
        color: '#333333',
    },

    OrderNumber: {
        textAlign: 'left',
        fontSize: 14,
        marginBottom: 5,
        color: '#000000',
        fontFamily: 'Poppins-SemiBold',
    },
    OrderDate: {
        textAlign: 'left',
        fontSize: 12,
        fontFamily: 'Poppins-Regular',
        color: 'gray',
    },
    terminalView: {
        flexDirection: 'row',
        marginBottom: 2
    },
    iconContainer: {
        width: 30,
        height: 30,
        borderRadius: 25,
        borderWidth: 1,
        marginRight: 5,
        borderColor: '#e2e2e2',
        justifyContent: 'center',
        alignItems: 'center',
    },

    buttonview: {
        borderRadius: 8,
        padding: 8,
        marginLeft: 'auto',
        flexDirection: "row",
        backgroundColor: "#000000",
        justifyContent: "space-evenly",
    },

    buttonTextView: {
        fontSize: 14,
        color: "white",
        backgroundColor: '#000000',
        fontFamily: 'Poppins-SemiBold',
        alignSelf: "center",
    },


});

export default HomeScreen;
