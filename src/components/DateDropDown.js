import React from 'react';
import { Months, Years } from '../screens/Graphs/constants';
import { View, Text } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

const DateDropDown = (props) =>
{
    const { onChangeMonth, onChangeYear, month, year } = props

    return (
        <View style={styles.container}>
            <View style={styles.dropdownContainer}>
                <Text style={styles.label}>Mes</Text>
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
            </View>

            <View style={styles.dropdownContainer}>
                <Text style={styles.label}>Año</Text>
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
        </View>
    );
};

const styles = {
    container: {
        width: "100%",
        alignItems: 'center',
        marginTop: 16,
    },
    dropdown: {
        padding: 5,
        width: "100%",
        alignSelf: 'center',
        height: 35,
        backgroundColor: 'rgba(236, 236, 236, .8)',
        borderRadius: 10
    },
    dropdownContainer: {
        width: '100%',
        marginBottom: "2%",
    },
    label: {
        marginBottom: "5%",
        fontSize: 16,
        fontWeight: 'bold',
    },
}

export default DateDropDown;