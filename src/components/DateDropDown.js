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
        width: "100%",
        height: 40,
        justifyContent: "space-around",
        alignItems: "center", flexDirection: 'row',
        marginVertical: 10
    },

})

export default DateDropDown;