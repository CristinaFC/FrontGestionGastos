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
                <TouchableOpacity onPress={action} style={{ width: "15%", marginRight: 20 }}>
                    <MaterialCommunityIcons name={icon} size={30} color={Color.firstText} />
                </TouchableOpacity>
                <TouchableOpacity onPress={action} style={styles.title}>
                    <Text style={Texts.buttonText}>{title}</Text>
                </TouchableOpacity>
                <View style={styles.rightButtons}>
                    {secondIcon ?
                        <Pressable
                            onPress={secondAction}
                            style={({ pressed }) =>
                            {
                                return [
                                    pressed
                                        ? styles.rightButtonPressed
                                        : styles.rightButton

                                ];
                            }}>
                            {({ pressed }) => (<MaterialCommunityIcons name="square-edit-outline" size={25} color={pressed ? Color.button : Color.orange} />)}
                        </Pressable >

                        : null}
                    {!readOnly ?
                        <Pressable
                            onPress={action}
                            style={({ pressed }) =>
                            {
                                return [
                                    pressed
                                        ? styles.rightButtonPressed
                                        : styles.rightButton

                                ];
                            }}>
                            {({ pressed }) => (<MaterialCommunityIcons name="eye-outline" size={25} color={pressed ? Color.button : Color.orange} />)}
                        </Pressable >
                        : null}
                </View>
            </TouchableOpacity>
        </View >
    )
}




const styles = StyleSheet.create({

    container: {
        height: 85,
        width: 350,
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 20, padding: "5%",
        marginTop: "5%",
        backgroundColor: 'rgba(236, 236, 236, .8)',
    },
    buttonContainer: {
        flexDirection: "row",
        margin: "2%",
    },
    title: {
        width: "55%",
        justifyContent: 'center',
        alignItems: 'flex-start',
        display: 'flex',
        paddingLeft: 0,
    },
    rightButtons: {
        width: "25%",
        flexDirection: "row",
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    rightButton: {
        width: "50%",
        flexDirection: 'row',
        display: 'flex'
    },
    rightButtonPressed: {
        width: "50%",
        flexDirection: 'row',
        display: 'flex'
    }
});
