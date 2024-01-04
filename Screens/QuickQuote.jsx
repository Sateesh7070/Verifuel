import React, { useState, useEffect, useContext } from 'react';
import {
    StyleSheet, Alert, FlatList,
    View, Dimensions, Modal,
    Text, Image, Platform,
    TouchableOpacity, ScrollView,
    TextInput, KeyboardAvoidingView
} from 'react-native'; import Toolbar from '../Helpers/Toolbar';
import { DeliveryTypes, UsagePeriods } from '../Helpers/staticList';
import { Dropdown } from 'react-native-element-dropdown';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { GetSyncData, GetPricingBasis, GetIndexProducts, SaveToDealDesk } from '../Helpers/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../Helpers/Loder';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import DateTimePicker from '@react-native-community/datetimepicker';



const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const NUM_COLUMNS = 3;
const ITEM_WIDTH = Dimensions.get('window').width / NUM_COLUMNS;
const cardWidth = deviceWidth / 3; // Calculate the width of each card based on the screen width
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
const today = new Date()
const PresentTime = today.getHours() + ":" + today.getMinutes()

const futureTime = new Date(today);
futureTime.setHours(today.getHours() + 1);

const futureTimeString = futureTime.getHours() + ":" + futureTime.getMinutes();


const QuickQuote = ({ navigation }) => {

    const [loading, setLoading] = useState(false);
    const [address, setAddress] = useState('');
    const [addressComponents, setAddressComponents] = useState({
        address1: '',
        city: '',
        state: '',
        country: '',
        zip: '',
    });
    const [sessionId, setGuid] = useState();
    const [UserId, setUserId] = useState('');
    const [currentStep, setCurrentStep] = useState(1);
    const [isBackButton, setIsBackButton] = useState(false);
    const [selectedTime, setSelectedTime] = useState(new Date());

    const [nextButton, setNextButtonText] = useState('Next');
    const [cancelButton, setCancelButtonText] = useState('Cancel');
    const [serviceTypes, setServiceTypes] = useState([]);

    const [paymentTerms, setPaymentTerms] = useState([]);
    const [selectedPaymentTerm, setSelectedPaymentTerm] = useState(null);

    const [SettleThrough, setSettleThrough] = useState([]);
    const [selectedSettleThrough, setSelectedSettleThrough] = useState(null);

    const [ProductCategoryTypes, setProductCategoryTypes] = useState([]);

    const [productCatTypes, setProductCatTypes] = useState([]);
    const [selectedProductCatType, setSelectedProductCatTypes] = useState(null);

    const [productSubCatTypes, setProductSubCatTypes] = useState([]);
    const [selectedProductSubCatType, setSelectedProductSubCatTypes] = useState(null);

    const [EquipmentTypes, setEquipmentTypes] = useState([]);
    const [selectedEquipmentCatType, setSelectedEquipmentTypes] = useState(null);

    const [PricingIndexs, setPricingIndexs] = useState([]);
    const [selectedPricingIndex, setSelectedPricingIndex] = useState(1);


    const [Countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(1);

    const [racks, setRacks] = useState([]);
    const [selectedRack, setSelectedRack] = useState('531');


    const [states, setStates] = useState([]);
    const [selectedState, setSelectedState] = useState(8);

    const [indexCities, setIndexCities] = useState([]);
    const [SelectedIndexCities, setSelectedIndexCities] = useState(null);

    const [priceBasis, setPriceBasis] = useState([]);
    const [selectedPriceBasis, setSelectedPriceBasis] = useState(null);

    const [dayBasis, setDayBasis] = useState([]);
    const [selectedDayBasis, setSelectedDayBasis] = useState(4);

    const [indexProduct, setIndexProduct] = useState([]);
    const [selectedIndexProduct, setSelectedIndexProduct] = useState(null);

    const [SelectedServiceType, setSelectedServiceType] = useState(null)

    const [usagePeriods, setUsagePeriods] = useState([]);
    const [usagePeriod, setSelectedusagePeriod] = useState(4)

    const [additionalViews, setAdditionalViews] = useState([]);

    const [selectedItems, setSelectedItems] = useState([]);
    const [services, setServices] = useState([]);
    const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

    const [selectedFromTime, setSelectedFromTime] = useState(new Date());
    const [selectedToTime, setSelectedToTime] = useState(new Date());

    const [ShipToAddress, setShipToAddress] = useState('');
    const [ShipToName, setShipToName] = useState('');
    const [QuoteName, setQuoteName] = useState('');
    const [estmatedDelvery, setEstmatedDelvery] = useState('1000');
    const [UnitestobeFuel, setUnitestobeFuel] = useState('');

    const [AdditiveCost, setAdditiveCost] = useState('');
    const [FrtPerGallon, setftrPerGallon] = useState('');

    const [dealTerms, setDealTerms] = useState([]);

    let prodSubCatTypes = [];
    const dynamicStyles = {
        justifyContent: isBackButton ? 'space-between' : 'flex-end',
    };

    const [serviceData, SetServiceData] = useState([
        { id: 1, title: 'Monday', IsSelected: false },
        { id: 2, title: 'Tuesday', IsSelected: false },
        { id: 3, title: 'Wednesday', IsSelected: false },
        { id: 4, title: 'Thursday', IsSelected: false },
        { id: 5, title: 'Friday', IsSelected: false },
        { id: 6, title: 'Saturday', IsSelected: false },
        { id: 7, title: 'Sunday', IsSelected: false },
        { id: 8, title: 'Will Call', IsSelected: false },
        { id: 9, title: 'As Needed', IsSelected: false }
    ]);

    const renderServiceItem = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => handleItemClick(item)}>
                <View style={[
                    styles.bottomitemContainer,
                    item.IsSelected ? { borderColor: 'black' } : { borderColor: 'transparent' },
                ]}>
                    <Text style={styles.bottomitemTitle}>{item.title}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    const handleItemClick = (clickedItem) => {

        console.log('serviceData', serviceData);

        SetServiceData((prevServiceData) =>
            prevServiceData.map((item) =>
                item.id === clickedItem.id ? { ...item, IsSelected: !item.IsSelected } : item
            )
        );
    };

    const removeView = (indexToRemove) => {
        const updatedViews = additionalViews.filter((_, index) => index !== indexToRemove);
        setAdditionalViews(updatedViews);
    };


    const handleServiceTypeChange = async (item) => {

        try {
            setSelectedServiceType(item);

        } catch (error) {

        }
    }

    const handleSettleThrough = async (item) => {

        try {
            setSelectedSettleThrough(item);

        } catch (error) {

        }
    }

    const handlePricingIndex = async (item) => {

        try {
            setSelectedPricingIndex(item);

        } catch (error) {

        }
    }

    const handleCountrySelect = async (item) => {

        try {
            setSelectedCountry(item);

        } catch (error) {

        }
    }

    const handleStateSelect = async (item) => {

        try {
            setSelectedState(item);
            const filterRacks = racks.filter((t) => t.stateID === item.stateId);
            setRacks(filterRacks);

        } catch (error) {

        }
    }

    const handleRackSelect = async (item) => {

        try {

            setSelectedRack(item);

            console.log('item', item);

            const req = {
                priceIndexID: 1,
            };
            const resp = await GetPricingBasis(req);
            setPriceBasis(resp);

        } catch (error) {

        }
    }

    const handleIndexProduct = async (item) => {

        try {
            setSelectedIndexProduct(item);

        } catch (error) {

        }
    }

    const handleDayBasis = async (item) => {

        try {
            setSelectedDayBasis(item);

        } catch (error) {

        }
    }

    const handlePriceBasis = async (item) => {

        try {
            setSelectedPriceBasis(item);
            const currentDate = new Date(); // Get the current date

            // // Calculate the start date by subtracting 2 days
            // const startDate = new Date(currentDate);
            // startDate.setDate(currentDate.getDate() - 2);

            // // Calculate the end date by adding 2 days
            // const endDate = new Date(currentDate);
            // endDate.setDate(currentDate.getDate() + 2);
            const req = {
                PriceIndexID: selectedPricingIndex.id, //1
                RackID: selectedRack.rackID, //453
                IndexTypeID: '1',//selectedPriceBasis.indexId, //'1'
                ProductCategoryID: selectedProductCatType.id, //1
                StartDate: '12/12/2023', //startDate, // 12/12/2023
                EndDate: '12/12/2023'// endDate, // 12/12/2023
            };

            console.log('req', req)

            const response = await GetIndexProducts(req);
            setIndexProduct(response);

        } catch (error) {
            console.log('req', error)

        }
    }

    const handleIndexCities = async (item) => {

        try {
            setSelectedIndexCities(item);

        } catch (error) {

        }
    }

    const handlePaymentTerms = async (item) => {

        try {
            setSelectedPaymentTerm(item);

        } catch (error) {

        }
    }

    const handelEquipmentTypes = async (item) => {
        try {
            setSelectedEquipmentTypes(item);

        } catch (error) {

        }
    }

    const handleUsagePeriodChange = async (item) => {

        try {
            setSelectedusagePeriod(item);

        } catch (error) {

        }
    }

    const handleProductSubCatChange = async (item) => {

        try {
            setSelectedProductSubCatTypes(item)

        } catch (error) {

        }
    }
    const handleProductCatChange = async (item) => {

        try {
            setSelectedProductCatTypes(item);

            const filteredItems = ProductCategoryTypes.filter((t) => t.parentCategoryID === item.id && t.catType === 2);
            setProductSubCatTypes(filteredItems);

        } catch (error) {
            console.log('error.id:', error);
        }
    }

    function handelCancel() {
        setNextButtonText("Next");
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
            if (currentStep == 2) {

                setCancelButtonText("Cancel");
                setIsBackButton(false);
            } else {
                setCancelButtonText("Back");
                setIsBackButton(true);
            }
        }
    }

    async function handelSave() {
        try {

            setIsBackButton(true);
            if (currentStep === 1) {
                setNextButtonText("Next");
                setCancelButtonText("Back");
                setCurrentStep(currentStep + 1);
            } else if (currentStep === 2) {
                setNextButtonText("Next");
                setCancelButtonText("Back");
                if (selectedProductCatType !== null) {
                    setCurrentStep(currentStep + 1);
                } else {
                    Alert.alert('Please Select ProductCategory!')
                }
            } else if (currentStep === 3) {
                setNextButtonText("Save");
                setCancelButtonText("Back");
                setCurrentStep(currentStep + 1);
            } else {
                OnTermsAndServiceScheduleSaveClick();
            }


        } catch (error) {
            console.log('handelSave:', error);
        }
    }

    const handelGetSyncDataAPI = async (userId) => {

        setLoading(true);
        const req = {
            userId: userId,
        };
        const response = await GetSyncData(req);
        if (response != null || response != undefined) {
            setProductCategoryTypes(response.listProductCategory);
            const filteredItems = response.listProductCategory.filter(t => t.catType === 1);
            setProductCatTypes(filteredItems)
            // const subProdutcat = response.listProductCategory.filter(t => t.catType === 2);
            // setProductSubCatTypes(subProdutcat)
            setEquipmentTypes(response.listUnitName);
            setPaymentTerms(response.listPaymentTerms);
            setSettleThrough(response.listSettleThrough);
            setPricingIndexs(response.listPricingIndex);
            setCountries(response.listCountry);
            setStates(response.listState);
            setRacks(response.listRack);
            setDayBasis(response.listDayBasis);
            setLoading(false);
        }
    }

    //#region Getting UserId
    const checkLoginState = async () => {
        try {

            await AsyncStorage.getItem('userObject')
                .then((storedObject) => {
                    if (storedObject !== null) {
                        const parsedObject = JSON.parse(storedObject);
                        console.log('Retrieved userObject:', parsedObject);
                        setUserId(parsedObject.UserId)
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

    const onLocationClick = () => {
        // Geolocation.requestAuthorization();

        // // Fetch the current location
        // Geolocation.getCurrentPosition(
        //     async (position) => {
        //         const { latitude, longitude } = position.coords;

        //         // Fetch address using reverse geocoding
        //         try {
        //             const response = await fetch(
        //                 `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyCJE6GgHSU75KO_dq164G9gx5cD_Z73N3s`
        //             );
        //             const data = await response.json();
        //             const firstResult = data.results[0];

        //             console.log('onLocationClick', data)
        //             const formattedAddress = firstResult.formatted_address;
        //             setShipToAddress(formattedAddress);
        //         } catch (error) {
        //             console.error('Error fetching address:', error);
        //         }
        //     },
        //     (error) => console.error('Error getting location:', error),
        //     { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        // );
    }

    const parseAddressComponents = (addressComponents) => {
        const result = {
            address1: '',
            city: '',
            state: '',
            country: '',
            zip: '',
        };

        addressComponents.forEach((component) => {
            const types = component.types;

            if (types.includes('street_number') || types.includes('route')) {
                // Address line 1
                result.address1 += component.long_name + ' ';
            } else if (types.includes('locality')) {
                // City
                result.city = component.long_name;
            } else if (types.includes('administrative_area_level_1')) {
                // State
                result.state = component.short_name;
            } else if (types.includes('country')) {
                // Country
                result.country = component.long_name;
            } else if (types.includes('postal_code')) {
                // ZIP code
                result.zip = component.long_name;
            }
        });

        return result;
    };


    const OnTermsAndServiceScheduleSaveClick = async () => {

        try {
            setLoading(true);
            const _dealTerms = [{

                UserID: UserId,
                DeliveryType: SelectedServiceType.ID,
                EstimatedDeliveriesPerPeriod: '1000',
                UsagePeriodID: 4,
                CreatedDate: '2023-12-15',
                SSLAID: 0,
                SessionID: sessionId,
            }]


            setDealTerms(_dealTerms);

            console.log('_dealTerms', _dealTerms)

            const newServices = serviceData.map((item) => {
                return {
                    SessionID: sessionId,
                    UserID: UserId, // You need to replace this with your logic to get the user ID
                    DeliveryType: SelectedServiceType.ID,
                    WeekType: 1,
                    SSLAID: null,
                    DayofWeek: item.id,
                    IsSelected: item.IsSelected,
                };
            });

            setServices(newServices);

            console.log('newServices', newServices)

            const _tempDealPriceIndex = [{

                FromTime: '2023-12-15',
                ToTime: '2023-12-15',
                BillingAgencyID: selectedSettleThrough.billingAgencyId,
                PaymentTermsID: 1,
                DeliveryType: SelectedServiceType.ID,
                UserID: UserId,
                SessionID: sessionId,
            }]
            console.log('tempDealPriceIndex', _tempDealPriceIndex)

            const __dealProduct = [{
                UserID: UserId,
                SessionID: sessionId,
                DeliveryType: SelectedServiceType.ID,
                ProductCategoryId: selectedProductCatType.id,
                ProductSubCategory1: selectedProductSubCatType.id,
                DeliveriesPerPeriod: usagePeriod.ID,
                EstimatedGallonsPerPeriod: estmatedDelvery,
                UnitTypeID: selectedEquipmentCatType.id,
                UnitsToBeFueled: UnitestobeFuel,
                AdditiveCostPerGal: AdditiveCost,
                FreightPerGallon: FrtPerGallon,
                CreatedDate: PresentTime,
                PricingBasisTypeID: selectedPricingIndex.id,
                CountryID: selectedCountry.countryId,
                StateID: selectedState.stateId,
                IndexCityID: selectedRack.rackID,
                IndexCity: selectedRack.rackName,
                PricingBasisID: selectedPriceBasis.indexId,
                DayBasisID: selectedDayBasis.id,
                IndexProductID: selectedIndexProduct.productID,
                ProductID: selectedIndexProduct.productID,
                SSLAID: null,
            }]
            console.log('__dealProduct', __dealProduct)


            const req = {
                UserID: UserId,
                CompanyID: 170,
                SessionID: sessionId,
                DeliveryType: SelectedServiceType.ID,
                ServiceType: SelectedServiceType.ID,
                Name: QuoteName,
                StartDate: '2023-12-15',
                EndDate: '2023-12-15',
                RFPEndDate: null,
                Description: '',
                ShipToName: ShipToName,
                ShipToAddress: ShipToAddress,
                Description: '',
                SSLATerms: _dealTerms,
                SSLAProducts: __dealProduct,
                SSLAPriceIndexes: _tempDealPriceIndex,
                SSLAServices: newServices,
            }

            console.log('Saveto Deal Desk', req)

            const resp = await SaveToDealDesk(req);

            if (resp.errorId === 0) {
                setLoading(false);
                navigation.goBack();
            } else {
                Alert.alert(resp.errorMsg);
            }

            setLoading(false);

            console.log('response', resp)


        } catch (error) {
            setLoading(false);
            console.log('error', error)
        }


    }

    const showTimePicker = () => {
        setTimePickerVisibility(true);
    };

    const hideTimePicker = () => {
        setTimePickerVisibility(false);
    };

    const handleTimeConfirm = (event, date) => {
        hideTimePicker();
        if (date !== undefined) {
            setSelectedTime(date);
        }
    };




    function guidGenerator() {
        const S4 = function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    }

    useEffect(() => {

        // Example usage:
        const newGUID = guidGenerator();
        setGuid(newGUID);

        console.log('newGUID', newGUID);

        const fetchData = async () => {
            try {
                await checkLoginState();
            } catch (error) {
                console.error('Error in useEffect:', error);
                // Handle errors appropriately
            }
        };

        fetchData(); // Call the async function inside useEffect

        const handelAPI = async () => {
            try {
                console.log('UserId', UserId);
                await handelGetSyncDataAPI(UserId);
            } catch (error) {
                console.error('Error in useEffect:', error);
                // Handle errors appropriately
            }
        };
        handelAPI();
        setServiceTypes(DeliveryTypes);
        setUsagePeriods(UsagePeriods);
        return () => {
            // Cleanup logic (if needed)
        };
    }, [UserId]);


    return (
        <View style={styles.container}>

            <View style={styles.mainViewContainer}>

                {currentStep === 1 && (
                    <View style={[{ backgroundColor: 'white', height: "90%", borderRadius: 10, }, shadowStyle]}>


                        <TextInput
                            style={[styles.dropdown]}
                            placeholder="Quote Name"
                            autoCapitalize="none"
                            value={QuoteName}
                            placeholderTextColor="#929292"
                            onChangeText={text => setQuoteName(text)}
                        />

                        <Dropdown
                            style={[styles.dropdown]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            iconStyle={styles.iconStyle}
                            data={serviceTypes}
                            search
                            maxHeight={300}
                            value={SelectedServiceType}
                            labelField="Name"
                            valueField="ID"
                            placeholder={'Select ServiceType'}
                            searchPlaceholder="Search..."
                            onChange={handleServiceTypeChange}
                        />

                        <TextInput
                            style={[styles.dropdown]}
                            placeholder="ShipTo Name"
                            autoCapitalize="none"
                            value={ShipToName}
                            placeholderTextColor="#929292"
                            onChangeText={text => setShipToName(text)}
                        />

                        <View style={[styles.shiptostyle, styles.Addressdropdown]}>
                            <TextInput
                                style={[{ width: '95%', fontFamily: 'Poppins-Regular' }]}
                                placeholder="ShipTo Address"
                                autoCapitalize="none"
                                height='70'
                                multiline
                                numberOfLines={4}
                                value={ShipToAddress}
                                placeholderTextColor="#929292"
                                onChangeText={text => setShipToAddress(text)}
                            />
                            <View style={{ justifyContent: 'flex-end' }}>
                                {/* Replace 'yourImageSource' with the actual source of your image */}
                                <TouchableOpacity onPress={onLocationClick}>
                                    <MaterialIcons name="my-location" size={20} color="#000000" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={{
                            flexDirection: 'row',
                            textAlign: 'center',
                            marginLeft: 10,
                            marginRight: 10,
                            justifyContent: 'space-evenly',
                        }} >

                            <View style={[{ width: '50%', fontFamily: 'Poppins-Regular' }, styles.dropdown]} >
                                <DateTimePicker
                                    style={[{ justifyContent: 'flex-start', backgroundColor: '#ffffff', width: '60%', fontFamily: 'Poppins-Regular' }]}
                                    value={selectedFromTime}
                                    backgroundColor='#f3f3f3f3'
                                    placeholder='Select From Time'
                                    mode="time"
                                    acentcol
                                    is24Hour={true}
                                    display="clock"
                                    onChange={handleTimeConfirm}
                                />
                            </View>

                            <View style={[{ width: '50%', fontFamily: 'Poppins-Regular' }, styles.dropdown]} >
                                <DateTimePicker
                                    style={[{ justifyContent: 'flex-start', backgroundColor: '#ffffff', width: '50%', fontFamily: 'Poppins-Regular' }]}
                                    value={selectedToTime}
                                    placeholder='Select From Time'
                                    mode="time"
                                    is24Hour={true}
                                    display="clock"
                                    onChange={handleTimeConfirm}
                                />
                            </View>
                        </View>


                        <TextInput
                            style={[styles.dropdown]}
                            placeholder="Enter Notes"
                            autoCapitalize="none"
                            placeholderTextColor="#929292"
                        />

                        <Text style={styles.inputHeaderTextView} >Estimated Gallons:</Text>

                        <TextInput
                            style={[styles.dropdown]}
                            placeholder="Estimated Deslivery"
                            autoCapitalize="none"
                            placeholderTextColor="#929292"
                            value={estmatedDelvery}
                            onChangeText={text => setEstmatedDelvery(text)}
                        />

                        <Dropdown
                            style={[styles.dropdown]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            iconStyle={styles.iconStyle}
                            data={usagePeriods}
                            search
                            maxHeight={300}
                            value={usagePeriod}
                            labelField="Name"
                            valueField="ID"
                            placeholder={'Select Usage Period'}
                            searchPlaceholder="Search..."
                            onChange={handleUsagePeriodChange}
                        />



                    </View>
                )}
                {currentStep === 2 && (
                    <View style={[{ backgroundColor: 'white', height: "90%", borderRadius: 10, }, shadowStyle]}>

                        <ScrollView style={{ marginBottom: 20 }} scrollEnabled={true}>

                            <View style={styles.topheader}>
                                <Text style={styles.leftText}>Products:</Text>

                                {/* <TouchableOpacity onPress={addView}>
                                    <FontAwesome5Icon name="plus-circle" style={styles.rightImage} size={20} color="#000000" />
                                </TouchableOpacity> */}

                            </View>

                            {/* Bottom strip */}
                            <View style={styles.bottomStrip} />

                            <View>

                                <Dropdown
                                    style={[styles.dropdown]}
                                    placeholderStyle={styles.placeholderStyle}
                                    selectedTextStyle={styles.selectedTextStyle}
                                    inputSearchStyle={styles.inputSearchStyle}
                                    iconStyle={styles.iconStyle}
                                    data={productCatTypes}
                                    search
                                    maxHeight={300}
                                    value={selectedProductCatType}
                                    labelField="productCategory"
                                    valueField="id"
                                    placeholder={'Select Product Category'}
                                    searchPlaceholder="Search..."
                                    onChange={handleProductCatChange}
                                />

                                <Dropdown
                                    style={[styles.dropdown]}
                                    placeholderStyle={styles.placeholderStyle}
                                    selectedTextStyle={styles.selectedTextStyle}
                                    inputSearchStyle={styles.inputSearchStyle}
                                    iconStyle={styles.iconStyle}
                                    data={productSubCatTypes}
                                    search
                                    maxHeight={300}
                                    value={selectedProductSubCatType}
                                    labelField="productCategory"
                                    valueField="id"
                                    placeholder={'Select Product Sub Category'}
                                    searchPlaceholder="Search..."
                                    onChange={handleProductSubCatChange}
                                />

                                <TextInput
                                    style={[styles.dropdown]}
                                    placeholder="Enter Estimated Gallons"
                                    autoCapitalize="none"
                                    placeholderTextColor="#929292"
                                    value={estmatedDelvery}
                                    onChangeText={text => setEstmatedDelvery(text)}
                                />


                                <Dropdown
                                    style={[styles.dropdown]}
                                    placeholderStyle={styles.placeholderStyle}
                                    selectedTextStyle={styles.selectedTextStyle}
                                    inputSearchStyle={styles.inputSearchStyle}
                                    iconStyle={styles.iconStyle}
                                    data={EquipmentTypes}
                                    search
                                    maxHeight={300}
                                    value={selectedEquipmentCatType}
                                    labelField="unitName"
                                    valueField="id"
                                    placeholder={'Select Unite Type'}
                                    searchPlaceholder="Search..."
                                    onChange={handelEquipmentTypes}
                                />

                                <TextInput
                                    style={[styles.dropdown]}
                                    placeholder="Units to be Fueled"
                                    autoCapitalize="none"
                                    placeholderTextColor="#929292"
                                    value={UnitestobeFuel}
                                    onChangeText={text => setUnitestobeFuel(text)}
                                />

                                <TextInput
                                    style={[styles.dropdown]}
                                    placeholder="Additive Cost/Gal"
                                    autoCapitalize="none"
                                    value={AdditiveCost}
                                    placeholderTextColor="#929292"
                                    onChangeText={text => setAdditiveCost(text)}
                                />

                                <TextInput
                                    style={[styles.dropdown]}
                                    placeholder="Frt/Gal"
                                    autoCapitalize="none"
                                    value={FrtPerGallon}
                                    placeholderTextColor="#929292"
                                    onChangeText={text => setftrPerGallon(text)}
                                />

                                {/* <View style={[styles.fixToText]}>

                        <TouchableOpacity style={styles.buttonview} onPress={() => removeView(additionalViews.length)}>

                            <Text style={styles.buttonTextView}>Remove</Text>

                        </TouchableOpacity>
                    </View> */}

                            </View>

                        </ScrollView>

                    </View>
                )}
                {currentStep === 3 && (
                    <View style={[{ backgroundColor: 'white', height: "90%", borderRadius: 10, }, shadowStyle]}>

                        <View style={styles.topheader}>
                            <Text style={styles.leftText}>Pricing:</Text>

                            {/* <TouchableOpacity onPress={addView}>
                                    <FontAwesome5Icon name="plus-circle" style={styles.rightImage} size={20} color="#000000" />
                                </TouchableOpacity> */}

                        </View>
                        <TextInput
                            style={[styles.dropdown]}
                            placeholder="Product SubCategory"
                            autoCapitalize="none"
                            placeholderTextColor="#929292"
                            editable={false}
                            value={selectedProductCatType.productCategory}
                        />

                        <Dropdown
                            style={[styles.dropdown]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            iconStyle={styles.iconStyle}
                            data={PricingIndexs}
                            search
                            maxHeight={300}
                            value={selectedPricingIndex}
                            labelField="indexName"
                            valueField="id"
                            placeholder={'Select PricingIndex'}
                            searchPlaceholder="Search..."
                            onChange={handlePricingIndex}
                        />


                        <Dropdown
                            style={[styles.dropdown]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            iconStyle={styles.iconStyle}
                            data={Countries}
                            search
                            maxHeight={300}
                            value={selectedCountry}
                            labelField="countryName"
                            valueField="countryId"
                            placeholder={'Select Country'}
                            searchPlaceholder="Search..."
                            onChange={handleCountrySelect}
                        />

                        <Dropdown
                            style={[styles.dropdown]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            iconStyle={styles.iconStyle}
                            data={states}
                            search
                            maxHeight={300}
                            value={selectedState}
                            labelField="stateName"
                            valueField="stateId"
                            placeholder={'Select State/Province'}
                            searchPlaceholder="Search..."
                            onChange={handleStateSelect}
                        />

                        <Dropdown
                            style={[styles.dropdown]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            iconStyle={styles.iconStyle}
                            data={racks}
                            search
                            maxHeight={300}
                            value={selectedRack}
                            labelField="rackName"
                            valueField="rackID"
                            placeholder={'Select Index City'}
                            searchPlaceholder="Search..."
                            onChange={handleRackSelect}
                        />

                        <Dropdown
                            style={[styles.dropdown]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            iconStyle={styles.iconStyle}
                            data={priceBasis}
                            search
                            maxHeight={300}
                            value={selectedPriceBasis}
                            labelField="indexNm"
                            valueField="indexId"
                            placeholder={'Select Price Basis'}
                            searchPlaceholder="Search..."
                            onChange={handlePriceBasis}
                        />

                        <Dropdown
                            style={[styles.dropdown]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            iconStyle={styles.iconStyle}
                            data={dayBasis}
                            search
                            maxHeight={300}
                            value={selectedDayBasis}
                            labelField="name"
                            valueField="id"
                            placeholder={'Select Day Basis'}
                            searchPlaceholder="Search..."
                            onChange={handleDayBasis}
                        />

                        <Dropdown
                            style={[styles.dropdown]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            iconStyle={styles.iconStyle}
                            data={indexProduct}
                            search
                            maxHeight={300}
                            value={selectedIndexProduct}
                            labelField="prodName"
                            valueField="productID"
                            placeholder={'Select Index Product'}
                            searchPlaceholder="Search..."
                            onChange={handleIndexProduct}
                        />

                    </View>
                )}
                {currentStep === 4 && (
                    <View style={[{ backgroundColor: 'white', height: "90%", borderRadius: 10, }, shadowStyle]}>

                        <Text style={styles.leftText}>Service Schedule:</Text>

                        <View style={{
                            flexDirection: 'row',
                            textAlign: 'center',
                            marginLeft: 10,
                            marginRight: 10,
                            justifyContent: 'space-evenly',
                        }} >

                            <View style={[{ width: '50%', fontFamily: 'Poppins-Regular' }, styles.dropdown]} >
                                <DateTimePicker
                                    style={[{ justifyContent: 'flex-start', backgroundColor: '#ffffff', width: '50%', fontFamily: 'Poppins-Regular' }]}
                                    value={selectedFromTime}
                                    placeholder='Select From Time'
                                    mode="time"
                                    is24Hour={true}
                                    display="clock"
                                    onChange={handleTimeConfirm}
                                />
                            </View>

                            <View style={[{ width: '50%', fontFamily: 'Poppins-Regular' }, styles.dropdown]} >
                                <DateTimePicker
                                    style={[{ justifyContent: 'flex-start', backgroundColor: '#ffffff', width: '50%', fontFamily: 'Poppins-Regular' }]}
                                    value={selectedToTime}
                                    placeholder='Select From Time'
                                    mode="time"
                                    is24Hour={true}
                                    display="clock"
                                    onChange={handleTimeConfirm}
                                />
                            </View>
                        </View>

                        <TextInput
                            style={[styles.dropdown]}
                            placeholder="To Notes"
                            multiline
                            numberOfLines={4}
                            autoCapitalize="none"
                            placeholderTextColor="#929292"
                        />


                        <Dropdown
                            style={[styles.dropdown]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            iconStyle={styles.iconStyle}
                            data={SettleThrough}
                            search
                            maxHeight={300}
                            value={selectedSettleThrough}
                            labelField="baName"
                            valueField="billingAgencyId"
                            placeholder={'Select Settle Through'}
                            searchPlaceholder="Search..."
                            onChange={handleSettleThrough}
                        />


                        <Dropdown
                            style={[styles.dropdown]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            iconStyle={styles.iconStyle}
                            data={paymentTerms}
                            search
                            maxHeight={300}
                            value={selectedPaymentTerm}
                            labelField="paymentTerms"
                            valueField="paymentTerms"
                            placeholder={'Select Payment Terms'}
                            searchPlaceholder="Search..."
                            onChange={handlePaymentTerms}
                        />

                        <FlatList
                            data={serviceData}
                            renderItem={renderServiceItem}
                            keyExtractor={(item, index) => item.id.toString()}
                            contentContainerStyle={{ justifyContent: 'center', width: '100%' }}
                            numColumns={3}
                        />


                    </View>
                )}


                <View style={[styles.fixToText,dynamicStyles]}>

                    {isBackButton && (
                        <TouchableOpacity style={styles.buttonCancelview} onPress={handelCancel}>
                            <Text style={styles.buttonCancelTextView}>{cancelButton}</Text>
                        </TouchableOpacity>

                    )}


                    <TouchableOpacity style={styles.buttonview} onPress={handelSave}>

                        <Text style={styles.buttonTextView}>{nextButton}</Text>

                    </TouchableOpacity>
                </View>

            </View>

            {loading && (
                <Loader />
            )}

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        height: deviceHeight,
        width: deviceWidth
    },
    mainViewContainer: {
        flex: 1,
        padding: 10,
        height: deviceHeight,
        width: deviceWidth,
        backgroundColor: '#FFFFFF',
    },

    topheader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    leftText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 14,
        justifyContent: 'flex-start',
        margin: 10,
    },
    rightImage: {
        justifyContent: 'flex-end',
        width: 30,
    },
    bottomStrip: {
        height: 0.18,
        backgroundColor: '#e3e3e3', // Adjust the color as needed
    },

    fixToText: {
        marginTop: 10,
        flexDirection: 'row',
        textAlign: 'center',
        justifyContent: 'space-between',
    },

    buttonCancelview: {
        height: 40,
        width: 80,
        borderRadius: 5,
        borderColor: '#000000',
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'space-evenly',
        flexDirection: 'row',
        borderRadius: 8,
        backgroundColor: "#FFFFFF",
    },

    buttonview: {
        height: 40,
        borderRadius: 5,
        padding: 8,
        width: 80,
        flexDirection: "row",
        backgroundColor: "#000000",
        justifyContent: "space-evenly",
    },

    buttonCancelTextView: {
        fontSize: 14,
        color: "#000000",
        fontFamily: 'Poppins-Bold',
        alignSelf: "center",
    },

    buttonTextView: {
        fontSize: 14,
        color: "#fff",
        fontFamily: 'Poppins-Bold',
        alignSelf: "center",
    },

    Addressdropdown: {
        height: 80,
        borderColor: '#686868',
        borderWidth: 1,
        borderRadius: 8,
        margin: 8,
        fontFamily: 'Poppins-Regular',
        paddingHorizontal: 8,
        marginBottom: 10
    },

    dropdown: {
        height: 40,
        borderColor: '#686868',
        borderWidth: 1,
        borderRadius: 8,
        margin: 8,
        fontFamily: 'Poppins-Regular',
        paddingHorizontal: 8,
        marginBottom: 10
    },

    placeholderStyle: {
        fontSize: 14,
        color: '#929292',
        fontFamily: 'Poppins-Regular'
    },
    selectedTextStyle: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular'
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
        fontFamily: 'Poppins-Regular'
    },

    shiptostyle: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    image: {
        width: 20, // Adjust the width as needed
        height: 20, // Adjust the height as needed
    },

    inputHeaderTextView: {
        marginBottom: 5,
        fontSize: 14,
        margin: 10,
        fontFamily: 'Poppins-Bold',
    },

    bottomitemContainer: {
        width: ITEM_WIDTH - 10,
        height: 100,
        margin: 2,
        borderWidth: 1,
        borderRadius: 6,
        backgroundColor: '#FAFAFA',
        ...Platform.select({
            ios: {
                shadowColor: '#465883',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.5,
                shadowRadius: 2,
            },
            android: {
                elevation: 2,
            },
        }),
        alignItems: 'center',
        justifyContent: 'center'
    },

    bottomitemTitle: {
        marginTop: 8,
        fontSize: 12,
        fontFamily: 'Poppins-Regular',
        color: '#686868'
    },
});

export default QuickQuote;
