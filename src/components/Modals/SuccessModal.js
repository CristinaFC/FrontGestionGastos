import React, { useState } from 'react';
import { Alert, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Buttons } from '../../assets/styles/Buttons';
import { Texts } from '../../assets/styles/Texts';
import * as RootRouting from '../../navigation/RootRouting'
import { useNavigation } from '@react-navigation/native';

const SuccessModal = (props) =>
{
    const { text, buttom, route } = props
    const [modalVisible, setModalVisible] = useState(true);
    const navigation = useNavigation()
    return (
        <View style={styles.centeredView}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() =>
                {
                    Alert.alert('Modal has been closed.');
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>{text}</Text>
                        <TouchableOpacity
                            style={[Buttons.submitButton, Buttons.pressedButton]}
                            onPress={() => { navigation.navigate(route); setModalVisible(!modalVisible); }}>
                            <Text style={Texts.buttonTextSelected}>{buttom}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal >
            {/* <Pressable
                style={[styles.button, styles.buttonOpen]}
                onPress={() => setModalVisible(true)}>
                <Text style={styles.textStyle}>Show Modal</Text>
            </Pressable> */}
        </View >
    );
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
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
});


export default SuccessModal;