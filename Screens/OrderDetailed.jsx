import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Dimensions, Text, ScrollView, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import axios from 'axios';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { shadowStyle } from '../Styles/styles';
import polyline from '@mapbox/polyline';


const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
const OrderDetailedView = ({ route }) => {
    const [routePoints, setRoutePoints] = useState([]);
    const { itemData } = route.params;

    console.log(itemData)

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


    const source = { latitude: itemData.listTerminal[0].lat, longitude: itemData.listTerminal[0].lon, Name: itemData.listTerminal[0].terminalName }; // Terminal lat and lon
    const destination = { latitude: itemData.listShipTo[0].lat, longitude: itemData.listShipTo[0].lon, Name: itemData.listShipTo[0].shipToName }; // ShipTo Lat and Lon


    async function getDirections(source, destination) {
        // Make an API request to the mapping service API (e.g., Google Maps Directions API)
        // Replace 'YOUR_API_KEY' with your actual API key
        const apiKey = 'AIzaSyCJE6GgHSU75KO_dq164G9gx5cD_Z73N3s';
        const apiUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${source.latitude},${source.longitude}&destination=${destination.latitude},${destination.longitude}&key=${apiKey}`;
        try {
            const response = await axios.get(apiUrl);
            const routes = response.data.routes;
            if (routes && routes.length > 0) {
                const points = routes[0].overview_polyline.points;
                // Decode the polyline points to get the route coordinates
                const decodedPoints = decodePolyline(points);
                console.log("decodedPoints", decodedPoints)
                setRoutePoints(decodedPoints);
                return decodedPoints;
            }
        } catch (error) {
            console.error('Error fetching directions:', error);
        }

        return null;
    };
    const decodePolyline = (polylineString) => {
        const decoded = polyline.decode(polylineString);
        return decoded.map((point) => ({
            latitude: point[0],
            longitude: point[1],
        }));
    };


    return (
        <View style={styles.container}>

            <View style={styles.mainViewContainer}>


                <View style={[{ backgroundColor: '#EEEEEE', margin: 5, paddingBottom: 10, height: "95%", borderRadius: 10, }]}>
                    <View style={[{ backgroundColor: '#EEEEEE', height: 40, justifyContent: 'center', margin: 5 }]}>
                        <Text style={{ marginLeft: 5, alignItems: 'center', fontFamily: 'Poppins-SemiBold' }}>#OrderNumber : {itemData.orderNumber} </Text>
                        <Text style={{ marginLeft: 5, alignItems: 'center', fontFamily: 'Poppins-SemiBold' }}>Delivery Date : {itemData.deliveryDate} </Text>
                    </View>
                    <MapView
                        style={[styles.map, shadowStyle]}
                        initialRegion={{
                            latitude: (source.latitude + destination.latitude) / 2,
                            longitude: (source.longitude + destination.longitude) / 2,
                            latitudeDelta: Math.abs(source.latitude - destination.latitude) * 2,
                            longitudeDelta: Math.abs(source.longitude - destination.longitude) * 2,
                        }}
                    >
                        {/* Source Marker */}
                        <Marker coordinate={source} title={source.Name} >
                            <MaterialCommunityIcons name="map-marker-outline" size={42} color="red" />
                        </Marker>

                        {/* Destination Marker */}
                        <Marker coordinate={destination} title={destination.Name}>
                            <MaterialCommunityIcons name="map-marker-outline" size={42} color="#1f619e" />
                        </Marker>

                        <Polyline
                            coordinates={[source, destination]}
                            strokeColor="red" // Route color
                            strokeWidth={3} // Route width
                        />
                    </MapView>

                    <ScrollView style={{ marginBottom: 20 }} scrollEnabled={true}>

                        <View style={[{ justifyContent: 'center', backgroundColor: 'white', margin: 5, borderRadius: 5, }, shadowStyle]}>
                            <Text style={{ marginLeft: 5, alignItems: 'center', fontSize: 15, marginTop: 5, color: '#1f619e', marginBottom: 5, fontFamily: 'Poppins-SemiBold', }}>Terminal Details: </Text>
                            <View>
                                {itemData.listTerminal.map((item) => (
                                    <View key={item.terminalId} style={styles.productView}>
                                        <View style={styles.itemproductContainer}>

                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                                                <Text style={[styles.itemproductGallons, { fontFamily: 'Poppins-Regular' }]}>Terminal: </Text>
                                                <Text style={styles.itemproductGallons}>
                                                    {item.terminalName}
                                                </Text>
                                            </View>

                                            <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginBottom: 8 }}>
                                                {/* <Text style={[styles.itemproductGallons, { fontFamily: 'Poppins-Regular' }]}>Terminal Address: </Text> */}
                                                <Text numberOfLines={3} style={styles.itemproductGallons}>
                                                    {item.address}, {item.city}, {item.countryCode}, {item.zip}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </View>

                        <View style={[{ justifyContent: 'center', backgroundColor: 'white', margin: 5, borderRadius: 5, }, shadowStyle]}>
                            <Text style={{ marginLeft: 5, alignItems: 'center', marginTop: 5, marginBottom: 5, color: '#1f619e', fontFamily: 'Poppins-SemiBold', }}>Product Details: </Text>
                            <View>
                                {itemData.listShipmentProduct.map((item) => (
                                    <View key={item.shipmentProductId} style={styles.productView}>
                                        <View key={item.terminalId} style={styles.itemproductContainer}>

                                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                                <Text style={[styles.itemproductGallons, { fontFamily: 'Poppins-Regular' }]}>Product: </Text>
                                                <Text style={styles.itemproductGallons}>
                                                    {item.prodDesc}
                                                </Text>
                                            </View>

                                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                                <Text style={[styles.itemproductGallons, { fontFamily: 'Poppins-Regular' }]}>Gallons: </Text>
                                                <Text style={styles.itemproductGallons}>
                                                    {item.gallons}
                                                </Text>
                                            </View>

                                            <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginBottom: 8 }}>
                                                <Text style={[styles.itemproductGallons, { fontFamily: 'Poppins-Regular' }]}>Asset Number: </Text>
                                                <Text style={styles.itemproductGallons}>
                                                    {item.assetNumber}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </View>

                        <View style={[{ justifyContent: 'center', backgroundColor: 'white', margin: 5, borderRadius: 5, }, shadowStyle]}>
                            <Text style={{ marginLeft: 5, alignItems: 'center', fontSize: 15, marginTop: 5, marginBottom: 5, color: '#1f619e', fontFamily: 'Poppins-SemiBold', }}>Shipping Details: </Text>
                            <View>
                                <View style={styles.productView}>
                                    <View style={styles.itemproductContainer}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                            <Text style={[styles.itemproductGallons, { fontFamily: 'Poppins-Regular' }]}>ShipTo Name: </Text>
                                            <Text style={styles.itemproductGallons}>
                                                {itemData.shipToName}
                                            </Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', }}>
                                            {/* <Text style={[styles.itemproductGallons, { fontFamily: 'Poppins-Regular' }]}>ShipTo Address: </Text> */}
                                            <Text style={styles.itemproductGallons}>
                                                {itemData.shipToAddress}
                                            </Text>
                                        </View>

                                    </View>
                                </View>
                            </View>
                        </View>

                        <View style={[{ justifyContent: 'center', backgroundColor: 'white', margin: 5, borderRadius: 5, }, shadowStyle]}>
                            <Text style={{ marginLeft: 5, alignItems: 'center', fontSize: 15, marginTop: 5, marginBottom: 5, color: '#1f619e', fontFamily: 'Poppins-SemiBold', }}>Supplier Name: </Text>
                            <View>
                                <View style={styles.productView}>
                                    <View style={styles.itemproductContainer}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                            <Text style={[styles.itemproductGallons, { fontFamily: 'Poppins-Regular' }]}>Carrier: </Text>
                                            <Text style={styles.itemproductGallons}>
                                                {itemData.vendorName}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>



                    </ScrollView>

                </View>



            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    map: {
        height: '30%',
        margin: 5,
        borderRadius: 6,
    },

    mainViewContainer: {
        flex: 1,
        height: deviceHeight,
        width: deviceWidth,
        backgroundColor: '#FFFFFF',
    },

    productView: {
        flexDirection: 'row',
        marginBottom: 2,
        marginLeft: 5,
        marginBottom: 5
    },

    itemproductContainer: {
        marginBottom: 8,
    },
    itemproductName: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
    },
    itemproductGallons: {
        fontSize: 14,
        flexWrap: 'wrap',
        fontFamily: 'Poppins-Regular',
        color: '#333333',
    },


    buttonview: {
        height: 40,
        borderRadius: 8,
        padding: 8,
        width: 100,
        flexDirection: "row",
        backgroundColor: "#349C42",
        justifyContent: "space-evenly",
    },

    buttonTextView: {
        fontSize: 18,
        color: "#fff",
        fontFamily: 'Poppins-Regular',
        alignSelf: "center",
        textTransform: "uppercase"
    },

});


export default OrderDetailedView;
