import React from 'react';
import { Months, Years } from '../screens/Graphs/constants';
import { StyleSheet, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import * as Color from '../assets/styles/Colors';


const DateDropDown = (props) =>
{
    const { onChangeMonth, onChangeYear, month, year } = props

    return (
        <View style={styles.view}>
            <Dropdown
                style={styles.dropdown}
                data={Months}
                value={month}
                labelField="name"
                valueField="value"
                maxHeight={300}
                placeholder="Seleccionar mes..."
                onChange={onChangeMonth}
            />
            <Dropdown
                style={styles.dropdown}
                data={Years}
                value={year}
                labelField="name"
                valueField="value"
                maxHeight={300}
                placeholder="Seleccionar año..."
                onChange={onChangeYear}
            />
        </View>
    );
};

const styles = StyleSheet.create({

    view: {
        width: "100%",
        height: 40,
        justifyContent: "space-evenly",
        alignItems: "center", flexDirection: 'row',
        margin: 20
    },
    dropdown: {
        padding: 5,
        width: 150,
        alignSelf: 'flex-end',
        height: 40,
        borderColor: Color.white,
        borderWidth: 1,
        marginTop: "2%",
        backgroundColor: 'rgba(236, 236, 236, .8)',
        borderRadius: 10
    },
    dropdownContainer: {
        paddingHorizontal: "10%",
        width: "100%",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    dropdownText: {
        color: Color.firstText,
        fontSize: 16
    },

})

export default DateDropDown;