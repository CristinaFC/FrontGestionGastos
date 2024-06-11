import React from "react";
import { View, TouchableOpacity, Text, StyleSheet, Pressable } from "react-native";

import * as Color from '../assets/styles/Colors'
import { Texts } from "../assets/styles/Texts";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Style } from "../assets/styles/Style";



export const Option = (props) =>
{
    const { action,
        icon,
        title,
        readOnly = false,
        rightIcons,
        rightActions,
    } = props;
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={action} style={styles.buttonContainer}>
                <TouchableOpacity onPress={action} style={{ marginRight: 5, width: "8%" }}>
                    {icon && <MaterialCommunityIcons name={icon} size={26} color={Color.firstText} />}
                </TouchableOpacity>
                <TouchableOpacity onPress={action} style={styles.title}>
                    <Text style={Texts.optionText}>{title}</Text>
                </TouchableOpacity>
                <View style={styles.rightButtons}>
                    {Array.isArray(rightIcons) && rightIcons.map((icon, index) => (
                        <TouchableOpacity onPress={rightActions[index]} style={{ alignSelf: 'flex-end' }} key={index}>
                            <MaterialCommunityIcons name={icon} size={25} color={Color.firstText} />
                        </TouchableOpacity >
                    ))

                    }
                    {/* {!readOnly ?
                        <TouchableOpacity onPress={action} style={{ alignSelf: 'flex-end' }}>
                            <MaterialCommunityIcons name="eye-outline" size={25} color={Color.button} />
                        </TouchableOpacity >
                        : null} */}
                </View>
            </TouchableOpacity>
        </View >
    )
}




const styles = StyleSheet.create({

    container: {
        width: Style.DEVICE_WIDTH,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'space-between',
        borderBottomWidth: 2,
        borderColor: Color.borderButton,
        backgroundColor: Color.white
    },
    buttonContainer: {
        alignItems: 'center',
        flexDirection: "row",
        margin: 10,
    },
    title: {
        width: "70%",
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        display: 'flex',
        paddingLeft: 0,
    },
    rightButtons: {
        width: "22%",
        flexDirection: "row",
        justifyContent: 'space-around',
        alignItems: 'center',
    },

});
