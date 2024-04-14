
import React, { useState, useEffect } from 'react';
import { TextInput, Button, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { TextInputValidator } from './TextInputValidator';
import { Style } from '../assets/styles/Style';
import * as Color from '../assets/styles/Colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SubmitButton from './SubmitButton';

const RecipientForm = ({ onSubmit, recipient, title, closeModal, formErrors = [] }) =>
{
    const [name, setName] = useState('');
    const [newInfoType, setNewInfoType] = useState(null);
    const [newInfoValue, setNewInfoValue] = useState(null);
    const [recipientInfo, setRecipientInfo] = useState([{ type: newInfoType, value: newInfoValue }]);

    useEffect(() =>
    {
        if (recipient)
        {
            setName(recipient.name);
            setRecipientInfo(recipient.recipientInfo);
        }
    }, [recipient]);

    const handleSubmit = () =>
    {
        const newRecipient = { name, recipientInfo };
        onSubmit(newRecipient);
    };

    const handleAddInfo = () =>
    {
        const newInfo = { type: newInfoType, value: newInfoValue };
        setRecipientInfo([...recipientInfo, newInfo]);
        setNewInfoType('');
        setNewInfoValue('');
    };

    const handleRemoveInfo = (index) =>
    {
        const updatedInfo = [...recipientInfo];
        updatedInfo.splice(index, 1);
        setRecipientInfo(updatedInfo);
    };

    const handleInfoValueChange = (index, value) =>
    {
        const updatedInfo = [...recipientInfo];
        updatedInfo[index].value = value;
        setRecipientInfo(updatedInfo);
    };
    return (
        <ScrollView>
            <View style={{ flexDirection: 'row', width: "100%", justifyContent: 'space-between', alignContent: 'center' }}>
                <Text style={{ fontSize: Style.FONT_SIZE_TITLE, marginBottom: 20, color: Color.firstText, borderBottomWidth: 1 }}>{title}</Text>
                <TouchableOpacity onPress={closeModal}>
                    <MaterialCommunityIcons name="close" size={25} color={Color.orange} />
                </TouchableOpacity>
            </View>
            <TextInputValidator
                multiline={false}
                numberOfLines={4}
                error={formErrors}
                errorKey="name"
                inputValue={name}
                keyboardType="ascii-capable"
                onChange={setName}
                placeholder="Nombre"
                title="Nombre"
            />
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20 }}>
                <Text style={{ fontSize: Style.FONT_SIZE_MEDIUM, color: Color.firstText }}>Información de contacto</Text>
                <TouchableOpacity onPress={handleAddInfo} style={{ borderRadius: 100, borderWidth: 1, borderColor: Color.button }} >
                    <MaterialCommunityIcons name="plus" size={25} color={Color.button} />
                </TouchableOpacity >
            </View>
            {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TextInputValidator
                    multiline={false}
                    numberOfLines={4}
                    error={formErrors}
                    errorKey="recipientInfo"
                    inputValue={newInfoValue}
                    keyboardType="ascii-capable"
                    onChange={setNewInfoValue}
                    placeholder="Campo de contacto"
                    title="Campo de contacto"
                />
            </View> */}

            {recipientInfo.map((info, index) => (
                <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TextInputValidator
                        multiline={true}
                        numberOfLines={4}
                        error={index === 0 ? formErrors : []}
                        errorKey="recipientInfo"
                        inputValue={info.value}
                        keyboardType="ascii-capable"
                        onChange={(text) => handleInfoValueChange(index, text)}
                        placeholder="Campo de contacto"
                        title="Campo de contacto"
                        style={{ width: '90%' }}
                    />
                    {index === 0 ? null :
                        <TouchableOpacity onPress={() => handleRemoveInfo(index)}>
                            <MaterialCommunityIcons name="delete" size={25} color={Color.orange} />
                        </TouchableOpacity>
                    }
                </View>
            ))}

            <SubmitButton title="Guardar" onPress={handleSubmit} />
        </ScrollView>
    );
};

export default RecipientForm;
