import React, { Component } from 'react';
import { Texts } from '../assets/styles/Texts';
import { Inputs } from '../assets/styles/Inputs';
import { TextInput, Text, View } from 'react-native';
import * as Color from '../assets/styles/Colors'
class TextInputValidator extends Component
{

    render()
    {
        const {
            error,
            errorKey,
            errorText,
            inputValue,
            keyboardType,
            onChange,
            style,
            placeholder,
            secureTextEntry,
            multiline,
            numberOfLines,
            editable = true,
            title
        } = this.props;

        const errorExists = this._errorExists(error, errorKey)

        let text = null
        if (errorExists !== false && errorExists !== undefined) 
        {
            if (errorText !== undefined)
                text = errorText
            else
                text = errorExists.value
        }
        return (
            <View
                style={[{
                    width: "100%",
                    alignItems: "center",
                    marginBottom: 10,
                }, style]}>
                {title ? <Text style={[Texts.inputTitle]}>{title}</Text> : null}
                <TextInput
                    editable={editable}
                    style={editable ? Inputs.registerInput : [Inputs.registerInput, { color: Color.placeholder }]}
                    onChangeText={onChange}
                    placeholder={placeholder || ''}
                    keyboardType={keyboardType || 'default'}
                    value={inputValue}
                    multiline={multiline}
                    numberOfLines={numberOfLines}
                    secureTextEntry={secureTextEntry} />
                {text != null ? <Text style={[Texts.errorText]}>{text}</Text> : null}
            </View >
        );
    }

    _errorExists(error, key)
    {
        if (error !== null)
            return error.find(er => er.key === key)
        return false;
    }
}





export { TextInputValidator };