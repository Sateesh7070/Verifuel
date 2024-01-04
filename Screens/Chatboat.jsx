import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Image, StyleSheet, View, Text, FlatList, Dimensions, TextInput, TouchableOpacity, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { ChatBot } from '../Helpers/auth';
import TextAnimator from '../Helpers/VibrationText';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
const ChatBoat = () => {

    const today = new Date()
    const PresentTime = today.getHours() + ":" + today.getMinutes()
    const [inputMsg, setInputMsg] = useState("")
    const [messageList, setMessageList] = useState([{ text: "Hi! I am MIRA, how may i help you today?", Id: Math.random(), time: PresentTime }]);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const _onFinish = () => {
        // Alert.alert('Animation', 'It is done!');
    };


    const handleChatBotAPICall = async () => {
        try {
            setIsLoading(true);
            const localMessage = { text: inputMsg, Id: null, time: new Date().getHours() + ":" + new Date().getMinutes() };
            setMessageList(prevMessages => [...prevMessages, localMessage]);

            const req = {
                messageRequest: inputMsg
            };

            const response = await ChatBot(req);

            if (response != null) {
                setInputMsg("");

                const newMessage = { text: response.messageResponse, Id: Math.random(), time: new Date().getHours() + ":" + new Date().getMinutes() };
                setMessageList(prevMessages => [...prevMessages, newMessage]);
                setIsLoading(false);
                console.log('messageList', messageList);
            }
        } catch (error) {
            setIsLoading(false);
            console.error('Error handling chat bot API call:', error);
        }
    };

    const handleItemClick = async (item) => {

        try {
            setIsLoading(true);
            const localMessage = { text: item.text, Id: null, time: new Date().getHours() + ":" + new Date().getMinutes() };
            setMessageList(prevMessages => [...prevMessages, localMessage]);

            const req = {
                messageRequest: item.text
            };

            const response = await ChatBot(req);

            if (response != null) {
                setInputMsg("");

                const newMessage = { text: response.messageResponse, Id: Math.random(), time: new Date().getHours() + ":" + new Date().getMinutes() };
                setMessageList(prevMessages => [...prevMessages, newMessage]);
                setIsLoading(false);
                console.log('messageList', messageList);
            }
        } catch (error) {
            setIsLoading(false);
            console.error('Error handling chat bot API call:', error);
        }

    };

    const renderBottomItem = useCallback(({ item }) => {
        return (
            <TouchableOpacity onPress={() => handleItemClick(item)}>

                <View style={styles.item}>
                    <Text style={{
                        color: '#e3e3e3', fontSize: 10, padding: 5, color: '#ffffff',
                        fontFamily: 'Poppins-SemiBold',
                    }}>{item.text}</Text>
                </View>

            </TouchableOpacity>
        )
    }, [messageList])


    const renderItem = useCallback(({ item, index }) => {
        console.log("item", item);
        return (

            <View style={{ marginBottom: 10 }}>

                <View style={{
                    flexDirection: "row",
                    alignItems: "center"
                }}>

                    {item.Id != null ? (
                        <>
                            {/* <Image source={require('../assets/d1.png')} style={{ width: 20, height: 20 }} /> */}

                            <FontAwesome5Icon
                                name='user-circle'
                                size={20}
                                color='gray'
                            />

                            <Text style={[{ color: 'white', fontFamily: 'Poppins-Bold', marginLeft: 10 }, styles.text]}>MIRA:</Text>
                        </>
                    ) : (
                        <>
                            <FontAwesome5Icon
                                name='user-circle'
                                size={20}
                                color='gray'
                            />
                            <Text style={[{ color: 'white', fontFamily: 'Poppins-SemiBold', marginLeft: 10 }, styles.text]}>You:</Text>
                        </>
                    )}
                </View>

                <View style={styles.textMsg}>
                    <TextAnimator
                        content={item.text}
                        textStyle={styles.textStyle}
                        style={styles.containerStyle}
                        duration={500}
                        onFinish={_onFinish}
                    />
                </View>
            </View>
        )
    }, [messageList])

    const data = [
        { id: '1', text: 'What is my loading number?' },
        { id: '2', text: 'How does the traffic look to my ShipTo?' },
        { id: '3', text: 'What\'s my GM/HR at this location?' },
        { id: '4', text: 'Give me the details for Order# 5842502' }, 
        { id: '5', text: 'What is the BOLNumber of Order# 5842502' }, 
        { id: '6', text: 'What is the status of Order# 4902365' },
        { id: '7', text: 'Which Products are in Order# 4902365' },
    ];
    return (

        <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={100} style={styles.container}>
            <View style={styles.mainViewContainer}>
                <View style={[{ backgroundColor: '#343541', height: "85%", borderRadius: 6, }]}>
                    <FlatList
                        data={messageList}
                        keyExtractor={(item, index) => index}
                        renderItem={renderItem}
                    />
                </View>

                <View style={[styles.horizontalCardstyle]}>

                    <View>
                        <FlatList
                            data={data}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item) => item.id}
                            renderItem={renderBottomItem}
                        />
                    </View>


                </View>


                <View style={[styles.shiptostyle, styles.dropdown]}>
                    <TextInput
                        style={[{ width: '95%', fontFamily: 'Poppins-Regular' }]}
                        onChangeText={(e) => setInputMsg(e)} value={inputMsg}
                        placeholder="Message"
                        multiline
                        numberOfLines={4}
                        placeholderTextColor="#929292"
                    />
                    <View style={{ justifyContent: 'flex-end' }}>
                        {isLoading ? (
                            <ActivityIndicator style={styles.todaysOrderindicator} size="small" color="#000000" />
                        ) :
                            <TouchableOpacity onPress={handleChatBotAPICall}>
                                <Image source={require('../assets/send.png')} style={{ width: 25, height: 25 }} color="#000000" />
                            </TouchableOpacity>
                        }
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EEEEEE',
        height: deviceHeight,
        width: deviceWidth
    },
    mainViewContainer: {
        flex: 1,
        padding: 10,
        height: deviceHeight,
        width: deviceWidth,
        backgroundColor: '#343541',
    },

    item: {
        height: 40,
        width: Dimensions.get('window').width / 3, // Divide by the number of items you want to display horizontally
        marginHorizontal: 5,
        backgroundColor: '#000000',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },

    text: {
        alignSelf: "flex-start",
        fontSize: 15,
        width: '90%',
        color: 'white',
        fontFamily: 'Poppins-Regular',
        overflow: 'hidden',
        margin: 'auto',
    },

    textMsg: {
        width: "90%",
        marginLeft: 10,
        marginTop: 8,
        flexDirection: "row",
        justifyContent: "space-between"
    },

    horizontalCardstyle: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        height: '5%',
    },


    shiptostyle: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        height: '10%',
    },
    dropdown: {
        height: '7%',
        borderColor: '#e3e3e3',
        backgroundColor: 'white',
        backgroundColor: 'white',
        borderWidth: 1,
        marginTop: 10,
        borderRadius: 8,
        fontFamily: 'Poppins-Regular',
        paddingHorizontal: 8,
        marginBottom: 10
    },
    containerStyle: {
        marginLeft: 20,
    },
    textStyle: {
        fontSize: 15,
        color: 'white',
        fontFamily: 'Poppins-Regular',
    },
});

export default ChatBoat;
