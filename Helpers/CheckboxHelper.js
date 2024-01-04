import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const CheckBox = ({ text, checked, onClick, checkBoxColor }) => {
  return (
    <TouchableOpacity onPress={() => onClick(!checked)}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View
          style={{
            width: 20,
            height: 20,
            borderRadius: 5,
            borderWidth: 1,
            borderColor: checkBoxColor || '#000',
            backgroundColor: checked ? checkBoxColor || '#000' : 'transparent',
            marginRight: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {checked && (
            <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>✓</Text>
          )}
        </View>
        <Text>{text}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default CheckBox;
