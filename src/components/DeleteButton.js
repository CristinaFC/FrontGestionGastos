import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import WarningModal from './Modals/WarningModal';
import { Buttons } from '../assets/styles/Buttons';
import * as Color from '../assets/styles/Colors'
import { Texts } from '../assets/styles/Texts';
const DeleteAccountButton = (props) =>
{
    const { deleting, handleChange, deleteUser, onPressCancel, buttonText, warningText } = props
    return (
        <>
            <TouchableOpacity onPress={() => handleChange(true)} style={Buttons.orangeButton}>
                <Text style={Texts.buttonWithOrangeBack}>{buttonText}</Text>
            </TouchableOpacity>
            {deleting && (
                <WarningModal
                    text={warningText}
                    button="Eliminar"
                    onPressCancel={() => onPressCancel(false)}
                    onPress={deleteUser}
                />
            )}
        </>
    );
};

export default DeleteAccountButton;
