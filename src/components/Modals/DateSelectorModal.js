import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Months } from '../../screens/Graphs/constants';
import SubmitButton from '../SubmitButton';
import DateDropDown from '../DateDropDown';
import * as Color from '../../assets/styles/Colors';
import { Style } from '../../assets/styles/Style';
import { Views } from '../../assets/styles/Views';


const DateSelectorModal = ({ modal, onClose, month, year, onChangeMonth, onChangeYear, onSubmit, onOpenModal }) =>
{
    return (
        <>
            <TouchableOpacity onPress={onOpenModal} style={{ flexDirection: 'row' }}>
                <MaterialCommunityIcons name="calendar-cursor" size={26} color="white" />
                <Text style={styles.title}>{Months[month - 1].name} {year}</Text>
            </TouchableOpacity>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modal}
                onRequestClose={onClose}
            >
                <View style={Views.modalContainer}>
                    <View style={Views.modalContent}>
                        <TouchableOpacity onPress={onClose} style={{ width: "100%", alignItems: "flex-end" }}>
                            <MaterialCommunityIcons name="close" size={25} color={Color.orange} />
                        </TouchableOpacity>
                        <DateDropDown
                            month={month}
                            year={year}
                            onChangeMonth={onChangeMonth}
                            onChangeYear={onChangeYear}
                        />
                        <SubmitButton title="Guardar" onPress={onSubmit} />
                    </View>
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({

    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Color.white,
        marginLeft: 5
    },

});
export default DateSelectorModal;
