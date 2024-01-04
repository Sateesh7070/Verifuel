import React, { useState, useEffect, useContext } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View, ScrollView,
  Text, Image, ImageBackground,
  TouchableOpacity, KeyboardAvoidingView,
  TextInput, StatusBar, Alert
} from "react-native";
import Loader from '../Helpers/Loder';
import { ValidateUser } from '../Helpers/auth'
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../Helpers/auth-context';
import CheckBox from 'react-native-check-box';
import Video from 'react-native-video';


const PlaceholderImage = require('../assets/loginlogo.png');

const LoginScreen = ({ navigation }) => {
  const [username, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const authCtx = useContext(AuthContext);

  const [isChecked, setRememberMe] = useState(false);

  const handleCheckboxToggle = () => {
    setRememberMe(!isChecked);
  };

  const validateForm = () => {
    setError('');

    if (!username) {
      Alert.alert('Please Enter UserName.')
      return false;
    }

    if (!password) {
      Alert.alert('Please Enter Password.')
      return false;
    }

    // Perform additional validation checks for email format, password strength, etc.

    return true;
  };
  const handleLogin = async () => {
    // Simulate a login process and get an authentication token
    setLoading(true)
    if (validateForm()) {
      const data = { UserName: username, Password: password }; // Replace with your data object
      console.log(data);
      // Replace ValidateUser with your actual API call function
      ValidateUser(data)
        .then(async response => {
          if (response.status == 200) {
            if (response.data.Error_Code == 1) {
              Alert.alert(response.data.Error_Msg);
            } else {
              //SyncData(response.data.UserId);
              //GetSyncData(response.data.UserId);
              authCtx.authenticate(response.data.UserId, response.data.UserName, deviceId);
              console.log(response.data); // Do something with the response data
              AsyncStorage.setItem('UserId', response.data.UserId);
              AsyncStorage.setItem('userObject', JSON.stringify(response.data))
                .then(() => {
                  console.log('Object stored successfully');
                })
                .catch((error) => {
                  console.error('Error storing object:', error);
                });
              console.log("response.data.Roles", response.data.Roles);
              navigation.navigate('Home')
            }
          }
        })
        .catch(error => {
          setLoading(false);
          console.log(error.message); // Handle the error
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  };

  const fetchDeviceId = async () => {
    try {

      DeviceInfo.getUniqueId().then((uniqueId) => {
        // iOS: "FCDBD8EF-62FC-4ECB-B2F5-92C9E79AC7F9"
        // Android: "dd96dec43fb81c97"
        // Windows: "{2cf7cb3c-da7a-d508-0d7f-696bb51185b4}"
        setDeviceId(uniqueId);
        
        
      });
      //const uniqueId = await DeviceInfo.getUniqueId();
      // console.log('Dashboard Settings:', deviceId);
    } catch (error) {
      console.log('Error retrieving device ID:', error);
    }
  };

  useEffect(() => {
    fetchDeviceId();
  }, []);


  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }} // Make sure the container has flex: 1 to take up available space
      behavior="padding"  // Or "height" depending on your use case
    >
      <Video
        source={require('../assets/mans.mp4')}
        style={styles.backgroundVideo}
        resizeMode="cover"
        muted={true}
        repeat={true}
      />
      <SafeAreaView style={styles.overlay}>
        <ScrollView>
          <View>
            <StatusBar
              backgroundColor="#1f619e"
              barStyle="light-content"
            />
            <View style={styles.imageContainer}>
              <Image
                resizeMode="contain"
                source={PlaceholderImage}
                style={styles.image}
              />
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                <Text style={[{ color: 'white', fontFamily: 'Poppins-Regular', marginTop: 30 }]}>Already have an account?</Text>
                <Text style={[{ fontWeight: 'bold', fontFamily: 'Poppins-Regular', color: 'white', fontSize: 13, marginLeft: 10, marginTop: 30 }]} >Sign In</Text>
              </View>

            </View>

            <View style={styles.form}>

              {/* https://docs.expo.io/guides/icons */}

              <Text style={[{ color: 'white', fontFamily: 'Poppins-Regular', fontSize: 14, marginBottom: 5 }]}>Email / Phone Number:</Text>

              <TextInput
                style={styles.inputEmail}
                placeholder="Email"
                returnKeyType={'next'}
                autoCapitalize="none"
                placeholderTextColor="#929292"
                onChangeText={text => setEmail(text)}
              />

              <Text style={[{ color: 'white', fontFamily: 'Poppins-Regular', fontSize: 14, marginBottom: 5, marginTop: 10 }]}>Password:</Text>

              <TextInput
                style={styles.inputPassword}
                placeholder="Password"
                autoCorrect={false}
                secureTextEntry={true}
                returnKeyType="go"
                autoCapitalize="none"
                placeholderTextColor="#929292"
                onChangeText={text => setPassword(text)}
              />

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, marginTop: 10 }}>

                <View style={{ flexDirection: 'row', justifyContent: "space-evenly", alignItems: 'center' }}>

                  <CheckBox
                    isChecked={isChecked}
                    onClick={handleCheckboxToggle}
                    checkBoxColor="white" // Change this to your desired color
                    style={styles.checkbox}
                  />
                  <Text style={[{ color: 'white', fontFamily: 'Poppins-Regular', }]}> Remember Me</Text>
                </View>

                <View style={[{ flexDirection: 'row', justifyContent: "space-evenly", alignItems: 'center' }]}>
                  <TouchableOpacity>
                    <Text style={styles.forgotText}>Forget Password?</Text>
                  </TouchableOpacity>
                </View>


              </View>

              {/* https://reactnative.dev/docs/touchableopacity */}

              <TouchableOpacity style={styles.buttonLogin} onPress={handleLogin}>
                <Text style={{ alignSelf: "center", fontFamily: 'Poppins-SemiBold', color: "#000000", fontSize: 18 }} >Login</Text>
              </TouchableOpacity>

              <View style={[{ alignItems: 'center' }]}>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                  <Text style={[{ color: 'white', fontFamily: 'Poppins-Regular', marginTop: 10 }]}>Already have an account?</Text>
                  <Text style={[{ fontWeight: 'bold', fontFamily: 'Poppins-Regular', color: '#F22E2E', fontSize: 13, marginLeft: 10, marginTop: 10 }]} >Sign up?</Text>
                </View>

              </View>

            </View>

          </View>
        </ScrollView>

        <View style={[{ justifyContent: 'space-between', alignItems: 'center' }]}>

          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', maxWidth: 400 }}>
            <Text style={[{ color: 'gray', fontFamily: 'Poppins-Regular', marginTop: 10 }]}>By clicking on Login you are agreeing to </Text>
            <Text style={[{ fontWeight: 'bold', fontFamily: 'Poppins-Regular', color: 'gray', fontSize: 13, textDecorationLine: 'underline', marginTop: 10 }]}>Our Terms </Text>
            <Text style={[{ color: 'gray', fontFamily: 'Poppins-Regular', marginTop: 10 }]}> & </Text>
            <Text style={[{ fontWeight: 'bold', fontFamily: 'Poppins-Regular', color: 'gray', fontSize: 13, textDecorationLine: 'underline', marginTop: 10 }]}> Conditions</Text>
          </View>

          <Text style={[{ color: 'gray', fontSize: 10, marginTop: 8 }]}>Version 5.0.3</Text>


        </View>

        {loading && (
          <Loader />
        )}
      </SafeAreaView>


    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({

  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  overlay: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)', // Semi-transparent overlay
  },

  backgroundImage: {
    flex: 1, // Make the background image take the entire screen
    resizeMode: 'repeat', // or 'stretch' for different resizing options
  },
  checkbox: {
    alignSelf: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 40
  },

  image: {
    width: 200,
    height: 100,
    marginTop: 30,

  },

  form: {
    flex: 1,
    padding: 25,
    marginTop: 30,
    justifyContent: "flex-start",
    borderRadius: 10
  },

  inputEmail: {
    height: 45,
    borderRadius: 5,
    fontSize: 18,
    paddingHorizontal: 12,
    marginTop: 5,
    marginBottom: 10,
    fontFamily: 'Poppins-Regular',
    color: "white",
    borderColor: "#FFFFFF", // Correct property name
    borderWidth: 1,
    textAlign: "left",
  },
  inputPassword: {
    height: 45,
    borderRadius: 5,
    marginTop: 5,
    paddingHorizontal: 12,
    fontSize: 18,
    color: 'white',
    fontFamily: 'Poppins-Regular',
    textAlign: "left",
    borderColor: "#FFFFFF", // Correct property name
    borderWidth: 1,
    textAlignVertical: "center",
  },
  buttonLogin: {
    height: 40,
    borderRadius: 6,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
  },
  buttonLoginText: {
    fontSize: 18,
    color: "#0060AF",
    fontFamily: 'Poppins-Regular',
    fontWeight: 600,
    alignSelf: "center",
  },
  forgotText: {
    textDecorationLine: 'underline',
    fontFamily: 'Poppins-Regular',
    color: '#0060AF',
    fontWeight: '600'
  }
});

export default LoginScreen;
