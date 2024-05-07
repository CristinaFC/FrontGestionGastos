import React from 'react';

import { View, Pressable, Text, ImageBackground, StyleSheet } from 'react-native';
import * as RootRouting from '../navigation/RootRouting'
import * as Color from '../assets/styles/Colors'
import { Buttons } from '../assets/styles/Buttons';
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

                <Text style={styles.headerWithBackButtom}>{title}</Text>
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


const styles = StyleSheet.create({
    headerWithBackButtom: {
        fontSize: 25,
        color: Color.white,
        fontWeight: 'bold',
        margin: 'auto',
        textAlign: 'center',
        paddingLeft: "10%",
        fontFamily: 'Montserrat',
        justifyContent: 'flex-start'
    },
})


export default Header