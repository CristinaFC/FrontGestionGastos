import React from "react";

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

import * as Color from '../assets/styles/Colors'

export const Item = (props) =>
{
    const { item, action } = props

    return (
        <View style={styles.item}>
            <TouchableOpacity onPress={action}>
                <Text style={{
                    fontWeight: 'bold', fontSize: 18, color: Color.firstText, alignSelf: 'flex-start'
                }}> {item.amount.toString().replace('.', ',')}€</Text>
                <View style={{ borderWidth: 0.5, width: 290, alignSelf: 'flex-start', marginTop: 5 }}></View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonContainer} onPress={action}>
                <TouchableOpacity style={{ width: "20%", justifyContent: 'center', alignItems: 'center' }} onPress={action}>
                    <MaterialCommunityIcons name={item.category.icon} size={30} color={Color.firstText} />
                </TouchableOpacity>
                <TouchableOpacity style={{ width: "60%", justifyContent: 'center', alignItems: 'center' }} onPress={action}>
                    <Text style={{ fontSize: 16, color: Color.firstText }}>
                        {item.category.name}
                    </Text>
                    <Text style={{ fontSize: 14, color: Color.firstText, marginTop: "5%", fontStyle: 'italic' }}>
                        {new Date(item.date).toLocaleDateString('es-ES')}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ width: "10%" }} onPress={action}>
                    <MaterialCommunityIcons name="arrow-right" size={30} color={Color.orange} />
                </TouchableOpacity>
            </TouchableOpacity>
        </View >)
}

const styles = StyleSheet.create({
    item: {
        // display: 'flex',
        width: "100%",
        flexDirection: "column",
        alignItems: "center",
        borderRadius: 10, padding: "5%",
        marginTop: "5%",
        backgroundColor: 'rgba(236, 236, 236, .8)',
    },
    buttonContainer: {
        display: 'flex',
        flexDirection: "row",
        margin: "2%",
        alignItems: 'center',
    },
    title: {
        width: "60%",
        justifyContent: 'center',
        alignItems: 'flex-start',
        display: 'flex',
        paddingLeft: 0,
    },
    rightButton: {
        width: "20%",
        alignItems: 'flex-end',
        justifyContent: 'center',
        display: 'flex'
    }

});