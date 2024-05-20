
import React from 'react';
import { View } from 'react-native';
import { Views } from '../assets/styles/Views';
import { MenuButton } from './MenuButton';

export const MenuView = (props) =>
{

    const { leftTitle, leftOnPress, rightTitle, rightOnPress } = props;
    return (
        <View style={Views.menuHeaderView}>
            <MenuButton title={leftTitle} onPress={leftOnPress} />
            <MenuButton title={rightTitle} onPress={rightOnPress} />
        </View>
    )
}
