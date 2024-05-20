import React, { useState } from 'react';
import { Modal, StyleSheet, Text, Pressable, View } from 'react-native';
import { Buttons } from '../../assets/styles/Buttons';
import { Texts } from '../../assets/styles/Texts';
import { useNavigation } from '@react-navigation/native';
import Routing from '../../navigation/Routing';
import * as RootRouting from '../../navigation/RootRouting'
import { Inputs } from '../../assets/styles/Inputs';
import { Style } from '../../assets/styles/Style';
import * as Color from '../../assets/styles/Colors'
const WarningModal = (props) =>
{
    const { text, button, onPress, onPressCancel } = props
    const [modalVisible, setModalVisible] = useState(true);
    console.log(button)
    return (
        <View style={styles.centeredView}>
            <Modal
                animationType="slide"
                transparent={true}
                presentationStyle="overFullScreen"
                visible={modalVisible}
                onRequestClose={() =>
                {
                    Alert.alert('Modal has been closed.');
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>{text}</Text>
                        <View style={styles.buttons}>
                            <Pressable
                                style={[Buttons.blueButton, { width: "45%" }]}
                                onPress={() =>
                                {
                                    onPressCancel();
                                    setModalVisible(!modalVisible);
                                }}>
                                <Text style={styles.textStyle}>Cancelar</Text>
                            </Pressable>
                            <Pressable
                                style={[Buttons.orangeButton, { width: "45%" }]}
                                onPress={onPress}>
                                <Text style={styles.textStyle}>{button}</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    buttons: {
        flexDirection: 'row',
        width: '100%',
        marginTop: 30,
        justifyContent: 'space-evenly'
    },
    modalView: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
        flexDirection: 'column',
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
        color: Color.white,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        textAlign: 'center',
        fontSize: Style.FONT_SIZE_MEDIUM,
        fontFamily: Style.FONT_FAMILY
    },
});


export default WarningModal;