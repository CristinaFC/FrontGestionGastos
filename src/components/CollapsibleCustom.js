import React from 'react';
import { Text, TouchableOpacity, FlatList } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Color from '../assets/styles/Colors'
import Collapsible from 'react-native-collapsible';
import { Views } from '../assets/styles/Views';

const CollapsibleCustom = (props) =>
{
    const { title, onPressCollapsible, onPressItem, expanded, data, Item } = props
    return (
        <>
            <TouchableOpacity style={Views.collapseHeaderView} onPress={onPressCollapsible}>
                <Text style={Views.collapseHeaderText}>{title}</Text>
                {expanded ? <MaterialCommunityIcons name="chevron-down" size={30} color={Color.white} /> : <MaterialCommunityIcons name="chevron-right" size={30} color={Color.white} />}
            </TouchableOpacity>

            <Collapsible collapsed={expanded}>
                <FlatList
                    data={data}
                    renderItem={({ item }) => (
                        <Item data={item} onPress={onPressItem} />
                    )}
                    keyExtractor={(item, index) => index.toString()}
                />
            </Collapsible>
        </>
    )
}

export default CollapsibleCustom