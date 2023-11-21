import React, { Component } from 'react';
import { Texts } from '../assets/styles/Texts';
import { Inputs } from '../assets/styles/Inputs';
import { Forms } from '../assets/styles/Forms';
import * as Color from '../assets/styles/Colors';

import { TextInput, Text, View } from 'react-native';
import { Style } from '../assets/styles/Style';

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
            editable,
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
            <View style={{ width: "100%", height: title != null ? 40 : 30, alignItems: "center", marginTop: text != null ? 40 : 30, marginBottom: 10 }}>
                {title ? <Text style={Texts.inputTitle}>{title}</Text> : null}
                <TextInput
                    editable={editable || true}
                    style={[Inputs.registerInput, style ? style : null]}
                    onChangeText={onChange}
                    placeholder={placeholder || ''}
                    keyboardType={keyboardType || 'default'}
                    value={inputValue}
                    multiline={multiline}
                    numberOfLines={numberOfLines}
                    secureTextEntry={secureTextEntry} />
                {text != null ? <Text style={Texts.errorText}>{text}</Text> : null}
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