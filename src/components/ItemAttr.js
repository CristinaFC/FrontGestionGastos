import React from 'react';
import { Texts } from '../assets/styles/Texts';
import { View, Text } from 'react-native';
import { Style } from '../assets/styles/Style';

export const ItemAttr = (props) =>
{
    const { attrName, attrValue } = props;

    return (
        <View style={{ flexDirection: 'row', height: Style.DEVICE_TEN_PERCENT_HEIGHT, alignItems: 'flex-end' }}>
            <Text style={Texts.attrName}>{attrName}: </Text>
            <Text style={[Texts.text, { borderBottomWidth: 1, width: "70%", textAlign: 'right' }]}>{attrValue}</Text>
        </View>
    )

}