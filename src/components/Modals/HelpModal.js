import React, { useState } from 'react';
import { Modal, StyleSheet, Text, Pressable, View } from 'react-native';
import { Buttons } from '../../assets/styles/Buttons';
import { Texts } from '../../assets/styles/Texts';
import * as RootRouting from '../../navigation/RootRouting'
import { useNavigation } from '@react-navigation/native';
import SubmitButton from '../SubmitButton';

export const HelpModal = ({ openModal, action, text }) =>
{
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={openModal}
            onRequestClose={action}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={Texts.text}>{text}</Text>
                    <SubmitButton onPress={action} title="Aceptar" />
                </View>
            </View>
        </Modal>
    )

}


const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
});
