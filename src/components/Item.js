import React from "react";
import { View, TouchableOpacity, Text, StyleSheet, Modal } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Color from '../assets/styles/Colors';
import { formatCurrency, formatDate } from "../services/api/Helpers";

const textStyles = {
    fontSize: 16,
    color: Color.firstText,
    textAlignVertical: 'center',
};

const smallTextStyles = {
    fontSize: 12,
    color: Color.firstText,
    textAlignVertical: 'center',
};



export const Item = (props) =>
{
    const { item, action, type } = props;
    const { amount, category, date, concept, account } = item;
    const formattedAmount = formatCurrency(amount);
    return (
        <TouchableOpacity style={styles.item} onPress={action}>
            <View style={styles.rowContainer}>
                <View style={styles.iconContainer} >
                    <MaterialCommunityIcons name={category?.icon} size={20} color={Color.button} />
                </View>
                <Text style={{ ...textStyles, width: "60%" }}>{concept}</Text>
                <Text style={{ ...textStyles, width: "30%", fontWeight: 'bold', textAlign: 'right' }}>
                    {formattedAmount}€
                </Text>
            </View>

            <View style={styles.rowContainer}>
                <Text style={{ ...smallTextStyles, width: "70%", textAlign: 'left' }}>
                    {type == "Income" ? 'Ingresado en la cuenta:' : 'Ha sido pagado:'}  <Text style={{ fontWeight: 'bold' }}>{account.name}</Text>
                </Text>
                <Text style={{ ...smallTextStyles, width: "30%", textAlign: 'right' }}>
                    {formatDate(date)}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    item: {
        width: "100%",
        flexDirection: "column",
        alignItems: "center",
        borderRadius: 0,
        padding: "5%",
        borderBottomWidth: 1,
        backgroundColor: Color.white,
    },
    rowContainer: {
        flexDirection: 'row',
        width: "100%",
    },
    iconContainer: {
        width: "10%",
        justifyContent: 'center',
        alignItems: 'center',
        alignItems: 'flex-start',
    },
});
