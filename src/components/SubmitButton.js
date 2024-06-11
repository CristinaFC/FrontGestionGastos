import React from 'react';
import { Text, Pressable } from 'react-native';
import { Buttons } from '../assets/styles/Buttons';
import { Texts } from '../assets/styles/Texts';

const SubmitButton = (props) =>
{
    const { onPress, title, style, onPressIn } = props;
    return (

        <Pressable
            style={({ pressed }) => 
            {

                return [
                    pressed
                        ? Buttons.pressedButton
                        : Buttons.submitButton,

                ];

            }}
            children={({ pressed }) => (
                <Text Text style={[pressed ? Texts.buttonTextSelected : Texts.buttonText, style]}>
                    {title}
                </Text>)
            }
            onPress={onPress} />
    );

}


export default SubmitButton;