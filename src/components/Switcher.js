import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Texts } from '../assets/styles/Texts';
import * as Color from '../assets/styles/Colors';
import { useNavigation } from '@react-navigation/native';
import { Style } from '../assets/styles/Style';
import { Views } from '../assets/styles/Views';


const Switcher = (props) =>
{

    const { LeftScreen, RightScreen, lButtonName, rButtonName } = props;
    const [pressedLeft, setPressedLeft] = React.useState(true);

    const navigation = useNavigation()

    return (
        <View style={styles.container}>
            {pressedLeft ?
                <LeftScreen {...props} navigation={navigation} />
                : <RightScreen  {...props} navigation={navigation} />}
            <View style={styles.switcherContainer}>
                <View style={styles.leftContainer}>
                    <Pressable
                        onPressIn={() => { setPressedLeft(true) }}
                        style={pressedLeft ? styles.pressedButton : styles.notPressedButton}>
                        <Text style={pressedLeft ? Texts.buttonTextSelected : Texts.buttonText}>{lButtonName}</Text>
                    </Pressable>
                </View>
                <View style={styles.rightContainer}>
                    <Pressable
                        onPressIn={() => setPressedLeft(false)}
                        style={pressedLeft ? styles.notPressedButton : styles.pressedButton}>
                        <Text style={pressedLeft ? Texts.buttonText : Texts.buttonTextSelected}>{rButtonName}</Text>
                    </Pressable>
                </View>
            </View >
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: Style.DEVICE_WIDTH,
        height: Style.DEVICE_HEIGHT,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    switcherContainer: {
        height: 40,
        width: "80%",
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderWidth: 1,
        borderRadius: 10,
        borderColor: 'white',
        marginTop: '2%',
        marginBottom: '2%'
    },
    pressedButton: {
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Color.button,
        borderRadius: 10
    },
    notPressedButton: {
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'transparent',
        borderRadius: 10
    },
    leftContainer: {
        flex: 0.5,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,

    },
    rightContainer: {
        flex: 0.5,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
    },


});

export default Switcher;