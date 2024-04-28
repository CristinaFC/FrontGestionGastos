import React from 'react';

import { View, Pressable, Text, ImageBackground } from 'react-native';
import * as RootRouting from '../navigation/RootRouting'
import * as Color from '../assets/styles/Colors'
import Routing from '../navigation/Routing';
import { Buttons } from '../assets/styles/Buttons';
import { Texts } from '../assets/styles/Texts';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { localAssets } from '../assets/images/assets';

const { Views } = require("../assets/styles/Views");

const Header = (props) =>
{
    const { title, rightAction, rightIcon, goBack, reloadData, otherContent } = props;

    return (

        <ImageBackground source={localAssets.background} resizeMode="cover" style={Views.imageHeader} blurRadius={40}>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>

                {goBack ?
                    <Pressable onPress={() => { RootRouting.goBack(); reloadData && reloadData(); }} >
                        {({ pressed }) => (
                            <MaterialCommunityIcons name="arrow-left" size={30} color={pressed ? Color.button : Color.white} />
                        )}
                    </Pressable>
                    : null}

                <Text style={Texts.headerWithBackButtom}>{title}</Text>
            </View>

            <View style={{ flexDirection: 'row', }}>

                {Array.isArray(rightIcon) ?
                    rightIcon.map((icon, index) =>
                    (<Pressable style={[Buttons.headerRightButton, { marginLeft: 20 }]} onPress={rightAction[index]}>
                        {({ pressed }) => (
                            <MaterialCommunityIcons name={icon} size={30} color={pressed ? Color.headerBackground : Color.white} />
                        )}
                    </Pressable>))
                    : rightIcon !== undefined &&
                    <Pressable style={Buttons.headerRightButton} onPress={rightAction}>
                        {({ pressed }) => (
                            <MaterialCommunityIcons name={rightIcon} size={30} color={pressed ? Color.headerBackground : Color.white} />
                        )}
                    </Pressable>
                }
            </View>
            {otherContent}
        </ImageBackground>

    )
}

const areMultipleIcons = (rightAction, rightIcon) =>
{
    let objects = {}
    if (Array.isArray(rightIcon))
    {
        rightIcon.forEach((icon, index) => objects[`icon${index}`] = icon)
    }
    if (Array.isArray(rightAction))
    {
        rightAction.forEach((action, index) => objects[`action${index}`] = action)
    }
    return objects
}

export default Header