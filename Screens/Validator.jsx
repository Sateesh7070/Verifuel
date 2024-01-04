import React, { useState, useEffect, useContext } from 'react';
import {
    StyleSheet, Alert, FlatList,
    View, Dimensions, Modal,
    Text, Image, Platform,
    TouchableOpacity,
    TextInput, KeyboardAvoidingView
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { RadioButton } from 'react-native-paper';

import MapView, { Marker, Polyline } from 'react-native-maps';
import { Dropdown } from 'react-native-element-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GetCustomers, GetShipTos, GetShipToServiceTypes, GetShipToAssets } from '../Helpers/auth';
import Loader from '../Helpers/Loder';
import CheckBox from '../Helpers/CheckboxHelper';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const Validator = ({ navigation }) => {
    const initialCoordinates = { latitude: 37.78825, longitude: -122.4324, Name: "Default Location" };
    const [location, setLocation] = useState(initialCoordinates);

    const [UserId, setUserId] = useState('');
    const [isFocus, setIsFocus] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [shiptos, setShipTos] = useState([]);
    const [serviceTypes, setServiceTypes] = useState([]);
    const [shipToAssets, setShipToAssets] = useState([]);

    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedShipTo, setSelectedShipTo] = useState(null);
    const [ShipToLocation, setShipToLocation] = useState(null);

    const [customer, setCustomer] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const [nextButton, setNextButtonText] = useState('Next');
    const [cancelButton, setCancelButtonText] = useState('Cancel');
    const [isBackButton, setIsBackButton] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const [checked, setChecked] = useState('Tank');

    const [currentStep, setCurrentStep] = useState(1);

    const dynamicStyles = {
        justifyContent: isBackButton ? 'space-between' : 'flex-end',
    };


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

    //#region API Calls

    const shipToPostData = {
        lastSyncDate: null,
        latitude: 0,
        longitude: 0,
        diffMiles: 100,
        UserId: UserId
    };

    const handelShipToServiceTypesAPI = async (shiToId) => {

        const serviceTypesPostData = {
            shipToId: shiToId,
            userId: UserId,
        };
        const serviceTypesResponse = await GetShipToServiceTypes(serviceTypesPostData);
        if (serviceTypesResponse != null || serviceTypesResponse != undefined) {
            setServiceTypes(null);
            setServiceTypes(serviceTypesResponse.listShipToServiceType)
        }
    }

    const handelShipToAssetsAPI = async (shiToId) => {

        const shipToAssetsPostData = {
            shipToId: shiToId,
            userId: UserId,
        };
        console.log("shipToAssetsResponse", shipToAssetsPostData)
        const shipToAssetsResponse = await GetShipToAssets(shipToAssetsPostData);
        if (shipToAssetsResponse != null || shipToAssetsResponse != undefined) {
            setShipToAssets(shipToAssetsResponse)
            Alert.alert("shipToAssetsResponse", JSON.stringify(shipToAssetsResponse))
        }
    }


    const handleShipToAPICall = async (custID) => {
        try {
            setIsLoading(true);
            const shiptoresponse = await GetShipTos(shipToPostData);
            if (shiptoresponse != null) { // or if (shiptoresponse !== null)
                const shipTosByCustomer = shiptoresponse.filter(item => item.customerID === custID);
                setShipTos(shipTosByCustomer);
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Error handling ship-to call:', error);
        }
    };

    const handleCustomerAPICall = async (UserId) => {
        const customerPostData = {
            UserId: UserId
        };
        const custresponse = await GetCustomers(customerPostData);
        if (custresponse != null || custresponse != undefined) {
            setCustomers(custresponse)
        }
    }

    //#endregion

    //#region RenderingItems

    const renderServiceTypeItem = ({ item }) => (
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
            <CheckBox
                text={item.name}
                checked={item.isSelected}
                onClick={(isChecked) => handleCheckBoxChange(item, isChecked)}
                checkBoxColor="#1f619e"
            />
        </View>
    );


    const renderShipToAssetItem = ({ item, index }) => {

        return (

            <View style={[styles.card, shadowStyle]} key={index.toString()}>
                <View style={styles.AssetView}>
                    <View style={styles.leftContainer}>
                        <Text style={styles.AssetNumber}>AsserNumber: {item.assetNumber}</Text>
                        {item.assetTypeId === 1 ? (
                            <Text style={styles.AssetNumber}>Capacity: {item.capacity}</Text>
                        ) : (
                            <Text style={styles.AssetNumber}>Odometer: {item.odometer}</Text>
                        )}
                    </View>
                    <View style={styles.rightContainer}>
                        <MaterialIcons name="arrow-forward-ios" size={20} color="#1f619e" />
                    </View>
                </View>
                {/* <View style={{ height: 1, width: '100%', borderRadius: 1, borderWidth: 1, borderColor: '#1f619e', borderStyle: 'dashed', zIndex: 0, }}>
                    <View style={{ position: 'absolute', left: 0, bottom: 0, width: '100%', height: 1, backgroundColor: 'white', zIndex: 1 }} />
                </View> */}
            </View>

        );

    };

    //#endregion

    //#region HandelEvents

    const fabToggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    function handelCancel() {
        setNextButtonText("Next");
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
            if (currentStep == 2) {
                setIsBackButton(false);
            } else {
                setIsBackButton(true);
            }
        }
    }

    async function handelSave() {
        try {
            setIsLoading(true);
            setIsBackButton(true);

            console.log(selectedCustomer);
            setCancelButtonText("Back");
            if (currentStep < 3) {
                setCurrentStep(currentStep + 1);

                if (currentStep == 2) {
                    setNextButtonText("Save");
                } else {
                    setNextButtonText("Next");
                }
            }
            setIsLoading(false);
        } catch (error) {
            console.log('handelSave:', error);
            setIsLoading(false);
        }
    }

    const handleCheckBoxChange = (clickedItem, isChecked) => {
        console.log('handleCheckBoxChange called:', clickedItem, isChecked);

        const updatedServiceTypes = serviceTypes.map((serviceType) => {
            if (serviceType.serviceTypeId === clickedItem.serviceTypeId) {
                return { ...serviceType, isSelected: isChecked };
            }
            return serviceType;
        });

        // Update the state or data source with the new serviceTypes array
        setServiceTypes(updatedServiceTypes);

    };

    const handleCustomerChange = async (item) => {

        try {
            setSelectedCustomer(item);
            setIsFocus(false);
            setShipToLocation(null)
            await handleShipToAPICall(item.customerId);
            setIsLoading(false);

        } catch (error) {

        }
    }

    const handleShipToChange = async (item) => {

        try {
            setSelectedShipTo(item);
            setShipToLocation(`${item.address1}, ${item.city}, ${item.stateCode}, ${item.county}, ${item.zip}`);
            const newCoordinates = { latitude: item.lat, longitude: item.lon, Name: item.shipToName };
            setLocation(newCoordinates);
            mapViewRef.current.animateToRegion({
                latitude: newCoordinates.latitude,
                longitude: newCoordinates.longitude,
                latitudeDelta: Math.abs(newCoordinates.latitude) * 2,
                longitudeDelta: Math.abs(newCoordinates.longitude) * 2,
            });
            await handelShipToServiceTypesAPI(item.shiptoID)
            await handelShipToAssetsAPI(item.shiptoID)
            setIsFocus(false);
            setIsLoading(false);
        } catch (error) {

            console.log(error)
        }
    }


    //#endregion

    const mapViewRef = React.useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await checkLoginState();
            } catch (error) {
                console.error('Error in useEffect:', error);
                // Handle errors appropriately
            }
        };


        fetchData(); // Call the async function inside useEffect
        setIsLoading(false);

        return () => {
            // Cleanup logic (if needed)
        };
    }, []);

    //#region Getting UserId
    const checkLoginState = async () => {
        try {

            await AsyncStorage.getItem('userObject')
                .then((storedObject) => {
                    if (storedObject !== null) {
                        const parsedObject = JSON.parse(storedObject);
                        console.log('Retrieved userObject:', parsedObject);
                        setUserId(parsedObject.UserId)
                        handleCustomerAPICall(parsedObject.UserId);
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
    //#endregion

    return (
        <View style={styles.container}>

            <View style={styles.mainViewContainer}>

                {currentStep === 1 && (
                    <View style={[{ backgroundColor: 'white', height: "90%", borderRadius: 10, }, shadowStyle]}>

                        <MapView
                            ref={mapViewRef}
                            style={[styles.map]}
                            initialRegion={{
                                latitude: (location.latitude),
                                longitude: (location.longitude),
                                latitudeDelta: Math.abs(location.latitude) * 2,
                                longitudeDelta: Math.abs(location.longitude) * 2,
                            }}>

                            {/* Destination Marker */}
                            <Marker coordinate={location} title={location.Name}>
                                <MaterialCommunityIcons name="map-marker-outline" size={42} color="#1f619e" />
                            </Marker>

                        </MapView>
                        <View style={[{ margin: 10 }, shadowStyle]}>

                            <Text style={styles.inputHeaderTextView} >Customer:</Text>
                            <Dropdown
                                style={[styles.dropdown]}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                iconStyle={styles.iconStyle}
                                data={customers}
                                search
                                maxHeight={300}
                                value={selectedCustomer}
                                labelField="customerName"
                                valueField="customerId"
                                placeholder={'Select Customer'}
                                searchPlaceholder="Search..."
                                onChange={handleCustomerChange}
                            />
                            <Text style={styles.inputHeaderTextView} >ShiTo:</Text>
                            <Dropdown
                                style={[styles.dropdown]}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                iconStyle={styles.iconStyle}
                                data={shiptos}
                                search
                                maxHeight={300}
                                value={selectedShipTo}
                                labelField="shipToName"
                                valueField="shiptoID"
                                onEndReachedThreshold={0.1}
                                placeholder={'Select ShipTo'}
                                searchPlaceholder="Search..."
                                onChange={handleShipToChange}
                            />

                            <Text style={styles.inputHeaderTextView} >Address:</Text>
                            <TextInput
                                style={[styles.dropdown]}
                                placeholder="Enter Address"
                                autoCapitalize="none"
                                editable={false}
                                value={ShipToLocation}
                                placeholderTextColor="#929292"
                            />


                            <FlatList
                                data={serviceTypes}
                                keyExtractor={(item) => item.serviceTypeId.toString()}
                                renderItem={renderServiceTypeItem}
                                numColumns={2}
                            />


                        </View>

                    </View>
                )}
                {currentStep === 2 && (
                    <View style={[{ backgroundColor: 'white', height: "90%", borderRadius: 10, }, shadowStyle]}>
                        <View>
                            <FlatList
                                data={shipToAssets}
                                renderItem={renderShipToAssetItem}
                                keyExtractor={(item, index) => { return item.assetId.toString() }}
                                contentContainerStyle={{ justifyContent: 'center', width: '100%' }}
                            />
                        </View>


                        <Modal
                            transparent={true}
                            animationType="slide"
                            visible={isModalVisible}
                            onRequestClose={fabToggleModal}
                        >
                            <View style={styles.centeredView}>
                                <View style={styles.modalView}>

                                    <View style={[styles.addAssetCard, shadowStyle, styles.inputView]}>
                                        <Text style={styles.inputHeaderTextView} >Email:</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Email"
                                            editable={false}
                                            autoCapitalize="none"
                                            placeholderTextColor="#929292"
                                        />
                                        <Text style={styles.inputHeaderTextView} >UserId:</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="UserId"
                                            editable={false}
                                            autoCapitalize="none"
                                            placeholderTextColor="#929292"
                                        />
                                        <Text style={styles.inputHeaderTextView} >DeviceId:</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="DeviceId"
                                            autoCapitalize="none"
                                            editable={false}
                                            placeholderTextColor="#929292"
                                        />
                                       
                                    </View>


                                    <View style={[styles.fixToText, dynamicStyles]}>

                                        <TouchableOpacity style={styles.buttonCancelview} onPress={fabToggleModal}>
                                            <Text style={styles.buttonTextView}>Close</Text>
                                        </TouchableOpacity>


                                        <TouchableOpacity style={styles.buttonview}>

                                            <Text style={styles.buttonTextView}>Save</Text>

                                        </TouchableOpacity>
                                    </View>

                                </View>


                            </View>
                        </Modal>



                        <TouchableOpacity style={styles.fab} onPress={fabToggleModal}>
                            <MaterialIcons name="add" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>
                )}
                {currentStep === 3 && (
                    <View style={[{ backgroundColor: 'white', height: "90%", borderRadius: 10, }, shadowStyle]}>
                        <Text>Step 3</Text>
                        {/* Add content for Step 3 */}
                    </View>
                )}

                <View style={[styles.fixToText, dynamicStyles]}>

                    {isBackButton && (
                        <TouchableOpacity style={styles.buttonCancelview} onPress={handelCancel}>
                            <Text style={styles.buttonTextView}>{cancelButton}</Text>
                        </TouchableOpacity>

                    )}

                    <TouchableOpacity style={styles.buttonview} onPress={handelSave}>

                        <Text style={styles.buttonTextView}>{nextButton}</Text>

                    </TouchableOpacity>
                </View>





            </View>

            {isLoading && <Loader />}


        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3f3f3',
        height: deviceHeight,
        width: deviceWidth
    },

    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 8,
        marginBottom: 10
    },

    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },

    icon: {
        marginRight: 5,
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
    },
    map: {
        height: '30%',
        margin: 5,
        borderRadius: 6,
    },

    mainViewContainer: {
        flex: 1,
        padding: 10,
        height: deviceHeight,
        width: deviceWidth,
        backgroundColor: '#f2f2f2',
    },
    inputHeaderTextView: {
        marginBottom: 5,
        fontSize: 14,
        fontWeight: '600',
    },

    serviceTypeItemTitle: {
        marginLeft: 8,
        fontFamily: 'Roboto-Bold',
    },

    fixToText: {
        width: "100%",
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 25,
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
    },

    buttonCancelview: {
        height: 40,
        width: 100,
        justifyContent: 'space-evenly',
        borderRadius: 8,
        backgroundColor: "red",
    },

    buttonview: {
        height: 40,
        borderRadius: 8,
        padding: 8,
        width: 100,
        backgroundColor: "#349C42",
    },

    buttonTextView: {
        fontSize: 18,
        color: "#fff",
        alignSelf: "center",
    },


    card: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        margin: 5,
        // Add other card styles as needed
    },

    AssetView: {
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

    AssetNumber: {
        textAlign: 'left',
        fontSize: 14,
        marginBottom: 5,
    },

    fab: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        backgroundColor: '#1f619e', // FAB background color
        borderRadius: 30, // Make it circular
        padding: 16,
        elevation: 4, // Shadow for Android
    },

    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        padding: 10,
        height: '80%',
        width: '90%',
        marginTop: 20,
        marginLeft: '5%',
        marginRight: '5%',
        backgroundColor: 'white',
        borderRadius: 10,
    },

    inputView: {
        padding: 12
    },

    addAssetCard: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        marginLeft: 5,
        marginRight: 5,
        width: '97%',
    },

    input: {
        height: 50,
        borderRadius: 10,
        fontSize: 14,
        marginTop: 8,
        textAlign: 'left',
        padding: 12,
        marginBottom: 10,
        color: "#929292",
        backgroundColor: "#f3f3f3",
        textAlignVertical: "center",
    },


});

export default Validator;



