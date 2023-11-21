import React from "react";

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

import * as Color from '../assets/styles/Colors'

export const Item = (props) =>
{
    const { item, action, deleteAction } = props
    let { amount, category, date } = item

    amount = parseFloat(amount).toFixed(2)

    return (
        <View style={styles.item}>
            <View style={{ flexDirection: 'row', width: "85%" }}>
                <TouchableOpacity onPress={action} style={{ width: "50%" }}>
                    <Text style={{
                        fontWeight: 'bold', fontSize: 18, color: Color.firstText,
                        width: "100%",
                    }}>
                        {amount.toString().replace('.', ',')}€
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ width: "50%", alignItems: 'flex-end' }} onPress={deleteAction}>
                    <MaterialCommunityIcons name="delete" size={25} color={Color.firstText} />
                </TouchableOpacity>
            </View>
            <View style={{ borderWidth: 0.5, width: 290, marginTop: 5 }}></View>

            <TouchableOpacity style={styles.buttonContainer} onPress={action}>
                <TouchableOpacity style={{ width: "20%", justifyContent: 'center', alignItems: 'center' }} onPress={action}>
                    <MaterialCommunityIcons name={category.icon} size={30} color={Color.firstText} />
                </TouchableOpacity>
                <TouchableOpacity style={{ width: "60%", justifyContent: 'center', alignItems: 'center' }} onPress={action}>
                    <Text style={{ fontSize: 16, color: Color.firstText }}>
                        {category.name}
                    </Text>
                    <Text style={{ fontSize: 14, color: Color.firstText, marginTop: "5%", fontStyle: 'italic' }}>
                        {new Date(date).toLocaleDateString('es-ES')}
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