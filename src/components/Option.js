import React from "react";
import { View, TouchableOpacity, Text, StyleSheet, Pressable } from "react-native";

import * as Color from '../assets/styles/Colors'
import { Texts } from "../assets/styles/Texts";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';



export const Option = (props) =>
{
    const { action,
        icon,
        title,
        readOnly = false,
        secondIcon = false,
        secondAction,
    } = props;
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={action} style={styles.buttonContainer}>
                <TouchableOpacity onPress={action} style={{ marginRight: 5 }}>
                    {icon && <MaterialCommunityIcons name={icon} size={26} color={Color.firstText} />}
                </TouchableOpacity>
                <TouchableOpacity onPress={action} style={styles.title}>
                    <Text style={Texts.optionText}>{title}</Text>
                </TouchableOpacity>
                <View style={styles.rightButtons}>
                    {secondIcon ?
                        <TouchableOpacity onPress={secondAction}>
                            <MaterialCommunityIcons name="square-edit-outline" size={25} color={Color.firstText} />
                        </TouchableOpacity >

                        : null}
                    {!readOnly ?
                        <TouchableOpacity onPress={action}>
                            <MaterialCommunityIcons name="eye-outline" size={25} color={Color.button} />
                        </TouchableOpacity >
                        : null}
                </View>
            </TouchableOpacity>
        </View >
    )
}




const styles = StyleSheet.create({

    container: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 2,
        borderColor: Color.white,
        backgroundColor: 'rgba(236, 236, 236, .8)',
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
