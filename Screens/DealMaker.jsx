import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import {
    AppState,
    StyleSheet,
    SafeAreaView,
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
import { SaveTruckGPSDetails, GetUserDetails, GetMobileBuyerDeals } from '../Helpers/auth';

import AppLogoWithLoader from '../Helpers/NewLoader';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Feather from 'react-native-vector-icons/Feather'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

import useTracking from '../Helpers/LocationTracking';
import AppStatusBar from '../Helpers/AppStatusBar';
import Toolbar from '../Helpers/Toolbar';
import { InsertShipmentData, GetAllShipments, UpSertShipmentProduct, UpSertShipmentBOL, UpSertShipmentBOLProduct, UpSertTerminals, UpSertShipTo } from '../Helpers/DbContext';

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

const DealMaker = ({ navigation }) => {
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
    const [lstBuyerDeals, setBuyerDeals] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [lastUpdatedTime, setLastUpdatedTime] = useState(new Date());

    const { location } = useTracking(true);

    const bottomSheetRef = useRef(null);;
    const snapPoints = ['45%']; // Define your snap points

    const handelQuoteCreate = () => {

        try {
            navigation.navigate('QuickQuote')
        } catch (error) {
            
        }
    };

    const handelonChatEvent = () => {

        try {
            navigation.navigate('Chat')
        } catch (error) {
            
        }
    };

    


    const handleLeftIconPress = () => {
        // Handle left icon press
        bottomSheetRef.current?.expand();
        setBottomSheetOpen(true);
    };

    const handleRightIconPress = () => {
        // Handle right icon press
        //navigation.navigate('Bottom');
        //navigation.push('Settings')

    };

    const handleSheetChange = useCallback((index) => {
        console.log("handleSheetChange", index);
        if (index == -1) {
            setBottomSheetOpen(false);
            bottomSheetRef.current?.close();
        }
    }, []);


    const data = [
        { id: 1, title: 'Create Quote', image: 'create' }, // FontAwesome5

        { id: 2, title: 'Manage Quotes', image: 'file-alt' }, //FontAwesome5

        { id: 3, title: 'Logout', image: 'logout' } //MaterialCommunityIcons
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Draft':
                return styles.pendingColor;
            case 'New':
                return styles.inProgressColor;
            case 'Completed':
                return styles.completedColor;
            default:
                return styles.defaultColor;
        }
    };

    const renderdealsItem = ({ item, index }) => {

        return (

            <View style={[styles.card, shadowStyle]} key={Math.random()}>
                <View style={styles.OrderView}>
                    <View style={styles.leftContainer}>
                        <Text style={styles.OrderNumber}>{item.name}</Text>
                        <Text style={styles.OrderDate}>{item.startDate}</Text>
                    </View>
                    <View style={styles.rightContainer}>

                        <Text style={[styles.statusColor, getStatusColor(item.status)]}>{item.status}</Text>
                    </View>
                </View>
                <View style={{ height: 1, width: '100%', borderRadius: 1, borderWidth: 1, borderColor: 'gray', borderStyle: 'dashed', zIndex: 0, }}>
                    <View style={{ position: 'absolute', left: 0, bottom: 0, width: '100%', height: 1, backgroundColor: 'white', zIndex: 1 }} />
                </View>

                <View style={styles.itemTerminalContainer}>
                    <Text style={styles.itemTerminalName}>Customer: {item.custName}</Text>
                    <Text style={styles.itemTerminalAddress}>Location: {item.companyName}</Text>
                </View>



                {/* <View style={styles.itemList}>
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
                </View> */}


            </View>

        );

    };


    const handleItemClick = (item) => {
        // Handle the item click event here
        console.log('Item clicked:', item);

        if (item.title === 'Settings') {
            navigation.push('Settings')
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

        if (item.title === 'Create Quote') {
            Alert.alert(
                'Alert!',
                'We are working on it.',
                [{ text: 'OK', onPress: () => console.log('Info alert dismissed') }],
                { cancelable: false }
            );
            bottomSheetRef.current?.close();
        }

        if (item.title === 'Manage Quotes') {
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
                    {(item.id === 3 || item.id == 7) ? (
                        <>
                            <MaterialCommunityIcons
                                name={item.image}
                                size={30}
                                color='#000000'
                                style={styles.bottomitemImage}
                            />
                        </>
                    ) : (item.id === 5 || item.id === 6) ? (
                        <Ionicons
                            name={item.image}
                            size={30}
                            color='#000000'
                            style={styles.bottomitemImage}
                        />
                    ) : (item.id == 1) ? (
                        <MaterialIcons
                            name={item.image}
                            size={30}
                            color='#000000'
                            style={styles.bottomitemImage}
                        />

                    ) : (
                        <FontAwesome5
                            name={item.image}
                            size={30}
                            color='#000000'
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
                try {
                    if (new Date().getTime() - lastUpdatedTime.getTime() > INTERVAL) {
                        // const isGPSMask = await AsyncStorage.getItem('IsMask');

                        // if (isGPSMask === '1') {
                        //     setGPSEnable(false);
                        //     const latValue = await AsyncStorage.getItem('Latitude');
                        //     const lonValue = await AsyncStorage.getItem('Longitude');
                        //     const lat: string | null = latValue; // Replace with your logic to get latValue
                        //     // Handle null case and provide a default value if needed
                        //     const actualLatValue: string = lat !== null ? lat : '';
                        //     const lot: string | null = lonValue; // Replace with your logic to get latValue
                        //     // Handle null case and provide a default value if needed
                        //     const actualLotValue: string = lot !== null ? lot : '';
                        //     CurrentLocation.latitude = actualLatValue;
                        //     CurrentLocation.longitude = actualLotValue;
                        //     console.log('Condition every 30 seconds', CurrentLocation);
                        // } else {
                        //     setGPSEnable(true);
                        //     CurrentLocation.latitude = location.latitude.toString();
                        //     CurrentLocation.longitude = location.longitude.toString();
                        //     console.log('Executing condition every 30 seconds', location);
                        // }
                        getBuyerDeals();
                        console.log('lastUpdatedTime::', lastUpdatedTime);
                        setLastUpdatedTime(new Date());
                    }
                } catch (error) {
                    console.log('Error in intervalCallback:', error);
                }
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

                console.log("Gps UnMasked", location)
                // Construct postData object
                postData = {
                    latitude: 33.985798, //location.latitude,33.985798,-83.419841
                    longitude: -83.419841, //location.longitude,
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

            // Call API function and handle response
            const response = await SaveTruckGPSDetails(postData);
            if (response != null || response != undefined) {

                if (response.listShipment != null) {

                    setListData(response.listShipment);

                    // response.listShipment.forEach((orders) => {

                    //     //console.log('Json Data Response:', JSON.stringify(response.listShipment));

                    //     InsertShipmentData(orders);

                    //     orders.listShipmentProduct.forEach((shipmentProduct) => {
                    //         UpSertShipmentProduct(shipmentProduct);
                    //     });

                    //     orders.listBOL.forEach((orderBol) => {
                    //         UpSertShipmentBOL(orderBol);
                    //         orderBol.listBOLProduct.forEach((orderBolProduct) => {
                    //             UpSertShipmentBOLProduct(orderBolProduct);
                    //         })
                    //     });

                    //     orders.listShipTo.forEach((orderShipTo) => {
                    //         UpSertShipTo(orderShipTo);
                    //     });

                    //     orders.listTerminal.forEach((orderTerminal) => {
                    //         UpSertTerminals(orderTerminal);
                    //     });

                    // });
                    setOrdersCount(response.listShipment?.length == null ? 0 : response.listShipment?.length)
                    console.log('orderscount', listOrders.length)
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

    const getBuyerDeals = async () => {

        try {
            const req = {
                companyID: 170,
                pageCount: 50,
                pageNumber: 1
            };
            const lstBuyerDeals = await GetMobileBuyerDeals(req);
            if (lstBuyerDeals != null) { // or if (shiptoresponse !== null)
                setBuyerDeals(lstBuyerDeals.getMobileBuyerDeals);
                //console.log(lstBuyerDeals.getMobileBuyerDeals)
            }
        } catch (error) {
            console.error('Error handling ship-to call:', error);
        }
    };


    useEffect(() => {

        GetUser();

        checkLoginState();

        fetchDeviceId();

        SetInterval();

        getBuyerDeals();

    }, []);

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
                    title="Dashboard"
                    onLeftIconPress={handleLeftIconPress}
                    onRightIconPress={handleRightIconPress}
                />

                <View style={[styles.mainViewContainer, { backgroundColor: bottomSheetOpen ? '#ffffff' : '#ffffff' }]}>

                    <View style={[{backgroundColor: '#EEEEEE', paddingBottom:10, borderBottomLeftRadius: 6,borderBottomRightRadius: 6,}]}>

                        <View style={[{ height: 35, justifyContent: 'center' }]}>
                            <Text style={{ alignItems: 'center', marginLeft: 5, fontFamily:'Poppins-SemiBold', color: '#000000', fontSize: 15, }}>{greeting},{UserName}</Text>
                        </View>

                        <View style={styles.headerBoxrow}>
                            <View style={styles.headercard}>
                                <TouchableOpacity onPress={handelQuoteCreate}>
                                    <View style={styles.itemContainer}>

                                        <Text style={styles.itemTitle}>Quick Quote</Text>

                                        <Image
                                            source={require('../assets/truck.png')}
                                            resizeMode="contain"
                                            style={styles.itemImage}
                                        />
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.headercard}>
                                <TouchableOpacity >
                                    <View style={styles.itemContainer}>

                                        <Text style={styles.itemTitle}>Analyzer</Text>

                                        <Image
                                            source={require('../assets/graph.png')}
                                            resizeMode="contain"
                                            style={styles.itemImage}
                                        />

                                    </View>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.headercard}>
                                <TouchableOpacity onPress={handelonChatEvent}>
                                    <View style={styles.itemContainer}>
                                        <Text style={styles.itemTitle}>MIRA</Text>

                                        <Image
                                            source={require('../assets/chatbot.png')}
                                            resizeMode="contain"
                                            style={styles.itemImage}
                                        />

                                    </View>
                                </TouchableOpacity>
                            </View>

                        </View>


                    </View>

                    <View style={[{ backgroundColor: '#EEEEEE', marginTop: 5, paddingBottom: 10, borderRadius: 8, }, shadowStyle]}>
                        <View style={styles.todaysOrdercontainer}>
                            <Text style={styles.todaysOrdertext}>Draft Deals:</Text>
                            {isLoading ? (
                                <ActivityIndicator style={styles.todaysOrderindicator} size="small" color="#000000" />
                            ) : null}

                        </View>

                        <FlatList
                            data={lstBuyerDeals}
                            renderItem={renderdealsItem}
                            keyExtractor={(item, index) => { item.name }}
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
        backgroundColor: '#FFFFFF'
    },
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust the color and opacity as needed
    },

    bottomSheetContentContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },

    bottomSheetContent: {
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
    },

    bottomSheetContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },

    bottomitemContainer: {
        width: ITEM_WIDTH - 10,
        height: 100,
        margin: 5,
        borderWidth: 2,
        borderRadius: 10,
        borderColor: '#000000',
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
        fontFamily: 'Poppins-Regular',
        color: '#000000'
    },

    mainViewContainer: {
        flex: 1,
    },

    headerBoxrow: {
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#EEEEEE'
    },
    headercard: {
        width: cardWidth,
        marginHorizontal: 1,

    },

    itemContainer: {
        width: ITEM_WIDTH - 10,
        height: 90,
        margin: 5,
        opacity: 0.82,
        backgroundColor: '#000000',
        borderRadius: 10,
        borderWidth:1,
        borderColor:'black',
        position: 'relative',

    },

    itemImage: {
        borderRadius: 8,
        position: 'absolute',
        bottom: 0,
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
        fontSize: 15,
        color:'#393939',
        fontFamily: 'Poppins-SemiBold',
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
        backgroundColor:'white',
        // Add other card styles as needed
    },

    OrderView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'white',
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
        marginTop: 5,
        color: '#000000',
        fontFamily: 'Poppins-Regular',
    },
    itemTerminalAddress: {
        fontSize: 14,
        marginTop: 5,
        color: '#000000',
        fontFamily: 'Poppins-Regular',
    },

    OrderNumber: {
        textAlign: 'left',
        fontSize: 14,
        fontFamily: 'Poppins-Medium',
        marginBottom: 5,
        color: '#000000',
    },
    statusColor: {
        textAlign: 'left',
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        marginBottom: 5,
        color: 'white',
        fontWeight: 'bold'
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
        backgroundColor: "#1f619e",
        justifyContent: "space-evenly",
    },

    buttonTextView: {
        fontSize: 14,
        color: "#fff",
        fontFamily: 'Roboto-Bold',
        alignSelf: "center",
    },

    pendingColor: {
        color: 'orange', // Set the color for the 'Pending' status
    },
    inProgressColor: {
        color: 'blue', // Set the color for the 'InProgress' status
    },
    completedColor: {
        color: 'green', // Set the color for the 'Completed' status
    },
    defaultColor: {
        color: 'black', // Set the default color for other statuses
    },


});

export default DealMaker;
