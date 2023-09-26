import React from 'react';

import { View, Pressable, Text } from 'react-native';
import * as RootRouting from '../navigation/RootRouting'
import * as Color from '../assets/styles/Colors'
import Routing from '../navigation/Routing';
import { Buttons } from '../assets/styles/Buttons';
import { Texts } from '../assets/styles/Texts';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const { Views } = require("../assets/styles/Views");

const Header = (props) =>
{
    const { title, rightAction, rightIcon, goBack } = props;

    return (

        <View style={Views.header}>
            {goBack ?
                <Pressable onPress={() => RootRouting.goBack()} >
                    {({ pressed }) => (
                        <MaterialCommunityIcons name="arrow-left" size={30} color={pressed ? Color.button : Color.white} />
                    )}
                </Pressable>
                : null}

            <Text style={Texts.headerWithBackButtom}>{title}</Text>
            {rightIcon !== undefined ?
                <Pressable style={Buttons.headerRightButton} onPress={rightAction}>
                    {({ pressed }) => (
                        <MaterialCommunityIcons name={rightIcon} size={30} color={pressed ? Color.button : Color.white} />
                    )}
                </Pressable>
                : null}

        </View>
    )
}

export default Header