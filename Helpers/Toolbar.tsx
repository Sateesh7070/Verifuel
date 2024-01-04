import React, { FC } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import EntypoIcon from 'react-native-vector-icons/Entypo'
import IconIcon from 'react-native-vector-icons/Ionicons'

interface ToolbarProps {
    title: string;
    onLeftIconPress?: () => void;
    onRightIconPress?: () => void;
}

const Toolbar: FC<ToolbarProps> = ({ title, onLeftIconPress, onRightIconPress }) => {
    return (
        <View style={styles.container}>
            {onLeftIconPress && (
                <TouchableOpacity onPress={onLeftIconPress}>
                    <EntypoIcon name="menu" size={25} color="#1f619e" />
                </TouchableOpacity>
            )}
            <Text style={styles.title}>{title}</Text>
            {onRightIconPress && (
                <TouchableOpacity onPress={onRightIconPress}>
                    <IconIcon name="notifications-outline" size={25} color="#D94C44" />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 56,
        backgroundColor: '#ffffff',
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        flex: 1,
        color: '#1f619e',
        fontSize: 18,
        fontFamily: 'Poppins-SemiBold',
        textAlign: 'center',
    },
});

export default Toolbar;
