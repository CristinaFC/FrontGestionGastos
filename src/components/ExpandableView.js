import React, { useEffect, useState } from 'react';

import
{
    SafeAreaView,
    LayoutAnimation,
    StyleSheet,
    View,
    Text,
    ScrollView,
    UIManager,
    TouchableOpacity,
    Platform,
} from 'react-native';
const ExpandableView = ({ data, onPress }) =>
{

    const [layoutHeight, setLayoutHeight] = useState(0);

    useEffect(() =>
    {
        if (data.isExpanded) setLayoutHeight(null);
        else setLayoutHeight(0);

    }, [data.isExpanded]);

    return (
        <View>
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={onPress}
                style={styles.header}>
                <Text style={styles.headerText}>
                    {data.category_name}
                </Text>
            </TouchableOpacity>
            <View
                style={{
                    height: layoutHeight,
                    overflow: 'hidden',
                }}>

                {data.subcategory.map((item, key) => (
                    <TouchableOpacity
                        key={key}
                        style={styles.content}
                        onPress={
                            () => alert('Id: ' + item.id + ' val: ' + item.val)
                        }>
                        <Text style={styles.text}>
                            {key}. {item.val}
                        </Text>
                        <View style={styles.separator} />
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

export default ExpandableView;