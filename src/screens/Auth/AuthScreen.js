import React from 'react';
import { ImageBackground, SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import { localAssets } from '../../assets/images/assets';
import LoginScreen from './LoginScreen';
import RegisterScreen from '../User/RegisterScreen';
import Switcher from '../../components/Switcher';
import { Views } from '../../assets/styles/Views';

const AuthScreen = () =>
{
    return (
        <SafeAreaView style={Views.container}>
            <ImageBackground source={localAssets.background} resizeMode="cover" style={styles.image} blurRadius={40}>
                <ScrollView keyboardShouldPersistTaps="handled">
                    <Switcher
                        LeftScreen={LoginScreen}
                        lButtonName={"Inciar sesión"}
                        RightScreen={RegisterScreen}
                        rButtonName={"Registro"} />
                </ScrollView>
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