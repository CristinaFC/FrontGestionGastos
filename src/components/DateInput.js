import React, { useState } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { Texts } from '../assets/styles/Texts';
import { Inputs } from '../assets/styles/Inputs';
import * as Color from '../assets/styles/Colors';
const DateInput = ({ date, onChange, style, title, disabled = false }) =>
{
    const [showDate, setShowDate] = useState(false);

    const handleChange = (selectedDate) =>
    {
        setShowDate(false);
        onChange(selectedDate);
    };

    return (
        <View>
            <Text style={[Texts.inputTitle]}>{title}</Text>
            <View style={[Inputs.registerInput, style]}>
                <TouchableOpacity onPress={() => setShowDate(true)} style={styles.datePicker} disabled={disabled}>
                    {disabled ? (
                        <Text style={[styles.dateData, { color: 'gray' }]}>{date.toLocaleDateString('es-ES')}</Text>
                    ) : (
                        <Text style={styles.dateData}>{date.toLocaleDateString('es-ES')}</Text>
                    )}
                </TouchableOpacity >
                <DatePicker
                    modal
                    locale='es'
                    open={showDate}
                    date={date}
                    mode="date"
                    onConfirm={handleChange}
                    onCancel={() => setShowDate(false)}
                />
            </View>
        </View>
    );
};


const styles = {
    datePicker: {
        width: "100%",
        height: "100%",
        justifyContent: 'flex-end',
        marginBottom: "10%"
    },
    dateData: {
        color: Color.firstText,
        fontSize: 16,
        paddingBottom: 5
    },
};


export default DateInput;
