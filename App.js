/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { useEffect, useState, useContext } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AntDesign from 'react-native-vector-icons/AntDesign'
import LoginScreen from './Screens/Login';
import HomeScreen from './Screens/Home';
import SettingsScreen from './Screens/Settings';
import Geofence from './Screens/Geofence';
import OrderDetailedView from './Screens/OrderDetailed';
import Validator from './Screens/Validator';
import QuickQuote from './Screens/QuickQuote';
import ChatBoat from './Screens/Chatboat';
import AuthContextProvider, { AuthContext } from './Helpers/auth-context';
import { createShipmentTable, createTerminalTable, createShipToTable, createShipmentProductTable, createBOLTable, createBOLProductTable } from './Helpers/DbContext';
import { LogLevel, OneSignal } from 'react-native-onesignal';
import axios from 'axios';
import DeviceInfo from 'react-native-device-info';
import SplashScreen from 'react-native-splash-screen';

const Stack = createStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerTitleAlign: 'center', headerShown: false, }} />
    </Stack.Navigator>
  );
}

const HeaderTitleWithIcon = (title) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Image source={require('./assets/d1.png')} style={{ marginRight: 4, width: 25, height: 25 }} />
      <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#000000' }}>{title}</Text>
    </View>
  );
};

function AuthenticatedStack() {
  return (
    <Stack.Navigator>

      <Stack.Screen name="Home" component={HomeScreen} options={{ headerTitleAlign: 'center', headerShown: false, }} />

      <Stack.Screen name="Settings" component={SettingsScreen} options={{
        headerStyle: {
          backgroundColor: '#000000',
        },
        // presentation:'modal',
        headerTitleAlign: 'center',
        headerTintColor: '#f3f3f3',
        headerBackTitleVisible: false,
        animationEnabled: true,
        headerBackImage: () => (
          <AntDesign name="left" style={{ marginLeft: 0 }} size={28} color="white" />
        ),
      }} />

      <Stack.Screen name="Geofence" component={Geofence} options={{
        headerStyle: {
          backgroundColor: '#000000',
        },
        headerTitle: 'Geofence',
        // presentation:'modal',
        headerTitleAlign: 'center',
        headerTintColor: '#f3f3f3',
        headerBackTitleVisible: false,
        headerBackImage: () => (
          <AntDesign name="left" style={{ marginLeft: 0 }} size={28} color="white" />
        ),
      }} />

      <Stack.Screen name="Order Details" component={OrderDetailedView} options={{
        headerStyle: {
          backgroundColor: '#000000',
        },
        headerTitle: 'Order Details',
        // presentation:'modal',
        headerTitleAlign: 'center',
        headerTintColor: '#f3f3f3',
        headerBackTitleVisible: false,
        headerBackImage: () => (
          <AntDesign name="left" style={{ marginLeft: 0 }} size={28} color="white" />
        ),
      }} />

      <Stack.Screen name="Validator" component={Validator} options={{
        headerStyle: {
          backgroundColor: '#1f619e',
        },
        title: 'Delivery Site Validator',
        // presentation:'modal',
        headerTitleAlign: 'center',
        headerTintColor: '#f3f3f3',
        headerBackTitleVisible: false,
        headerBackImage: () => (
          <AntDesign name="left" style={{ marginLeft: 0 }} size={28} color="white" />
        ),
      }} />

      <Stack.Screen name="QuickQuote" component={QuickQuote} options={{
        headerStyle: {
          backgroundColor: 'white',
        },
        title: '',
        // presentation:'modal',
        headerTitleAlign: 'center',
        headerTintColor: '#000000',
        headerBackTitleVisible: false,
        headerBackImage: () => (
          <AntDesign name="left" style={{ marginLeft: 0 }} size={28} color="#000000" />
        ),
        headerTitle: (title) => (
          <HeaderTitleWithIcon {...props} />
        ),
      }} />

      <Stack.Screen name="Chat" component={ChatBoat} options={{
        headerStyle: {
          backgroundColor: '#343541',
        },
        title: 'MIRA',
        // presentation:'modal',
        headerTitleAlign: 'center',
        headerTintColor: 'white',
        headerBackTitleVisible: false,
        headerBackImage: () => (
          <AntDesign name="left" style={{ marginLeft: 0 }} size={28} color="white" />
        ),
      }} />

    </Stack.Navigator>

  );
}

function Navigation() {

  const authCtx = useContext(AuthContext);

  console.log(authCtx);

  return (
    <NavigationContainer>
      {!authCtx.isAuthenticated && <AuthStack />}
      {authCtx.isAuthenticated && <AuthenticatedStack />}
    </NavigationContainer>
  );
}

const App = () => {

  const [OneSignalUserId, SetOnesignalUserId] = useState('');

  // OneSignal Initialization
  OneSignal.initialize("c0b6af88-83e4-42b2-a0a6-f46cf8c3f0f2");

  OneSignal.Debug.setLogLevel(LogLevel.Verbose);

  // requestPermission will show the native iOS or Android notification permission prompt.
  // We recommend removing the following code and instead using an In-App Message to prompt for notification permission
  OneSignal.Notifications.requestPermission(true);

  // Method for listening for notification clicks
  OneSignal.Notifications.addEventListener('click', (event) => {
    console.log('OneSignal: notification clicked:', event);
  });

  async function SetOneSignalExternalID() {
    try {
      const uniqueId = await DeviceInfo.getUniqueId();
      const externalId = uniqueId; // Your unique external ID

      OneSignal.getDeviceState(deviceState => {
        const oneSignalUserId = deviceState.userId;
        SetOnesignalUserId(oneSignalUserId);
        console.log('OneSignalUserId:', oneSignalUserId);
      });

      const apiUrl = `https://onesignal.com/api/v1/players/${OneSignalUserId}`;
      const headers = {
        'Authorization': 'Basic Mzc1M2I1YzktNDU2Ni00MWM0LTk2N2YtNTM5YThmMjc4OGEw', // Your OneSignal REST API Key
        'Content-Type': 'application/json',
      };

      const requestBody = {
        app_id: 'c0b6af88-83e4-42b2-a0a6-f46cf8c3f0f2',
        external_user_id: externalId,
      };

      axios({
        method: 'put',
        url: apiUrl,
        headers: headers,
        data: requestBody,
      })
        .then(response => {
          console.log('External ID set successfully', response.data);
        })
        .catch(error => {
          console.error('Error setting external ID', error);
        });

    } catch (error) {
      console.log("SetOneSignalExternalID", error)
    }
  }

  SetOneSignalExternalID();

  useEffect(() => {
    SplashScreen.hide();
    createShipmentTable(); //create the table
    createTerminalTable(),
      createShipToTable(),
      createShipmentProductTable(),
      createBOLTable(),
      createBOLProductTable()
  })


  return (
    <AuthContextProvider>
      <Navigation />
    </AuthContextProvider>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
