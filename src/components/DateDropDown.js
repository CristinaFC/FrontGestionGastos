import React from 'react';
import { Months, Years } from '../screens/Graphs/constants';
import { StyleSheet, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Inputs } from '../assets/styles/Inputs';


const DateDropDown = (props) =>
{
    const { onChangeMonth, onChangeYear, month, year } = props

    return (
        <View style={styles.view}>
            <Dropdown
                style={Inputs.middleDropdown}
                data={Months}
                value={month}
                labelField="name"
                valueField="value"
                maxHeight={300}
                placeholder="Seleccionar mes..."
                onChange={onChangeMonth}
            />
            <Dropdown
                style={Inputs.middleDropdown}
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
        width: "90%",
        height: 45,
        justifyContent: "space-between",
        alignItems: "center", flexDirection: 'row',
        borderRadius: 10,
        marginVertical: 10,
        paddingHorizontal: 5,
        backgroundColor: 'rgba(236, 236, 236, .8)',
        borderColor: 'white'
    },

})

export default DateDropDown;