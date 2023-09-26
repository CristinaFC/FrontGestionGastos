import React from 'react';
import { ImageBackground, SafeAreaView, StyleSheet } from 'react-native';
import { localAssets } from '../../assets/images/assets';
import LoginScreen from './LoginScreen';
import RegisterScreen from '../User/RegisterScreen';
import Switcher from '../../components/Switcher';

const AuthScreen = () =>
{
    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground source={localAssets.background} resizeMode="cover" style={styles.image} blurRadius={40}>
                <Switcher
                    LeftScreen={LoginScreen}
                    lButtonName={"Inciar sesión"}
                    RightScreen={RegisterScreen}
                    rButtonName={"Registro"} />
            </ImageBackground>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default AuthScreen;