
import React from 'react';
import { Text, Pressable } from 'react-native';

import { Texts } from '../assets/styles/Texts';
import { Buttons } from '../assets/styles/Buttons';

export const MenuButton = ({ title, onPress, style, stylePressed }) =>
{

    return (

        <Pressable
            onPress={onPress}
            style={({ pressed }) =>
            {
                return [
                    pressed
                        ? stylePressed ? stylePressed : Buttons.homeButtonPressed
                        : style ? style : Buttons.homeButton
                ];
            }}>
            {({ pressed }) => (<Text style={pressed ? Texts.buttonTextSelected : Texts.buttonText}>{title}</Text>)}
        </Pressable >
    )
}

