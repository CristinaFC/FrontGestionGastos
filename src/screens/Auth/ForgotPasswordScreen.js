
import * as React from 'react';
import { ImageBackground, StyleSheet, Text, TextInput, SafeAreaView, View } from 'react-native';
import { Inputs } from '../../assets/styles/Inputs';
import { useNavigation } from '@react-navigation/native';
import Routing from '../../navigation/Routing';
import SubmitButton from '../../components/SubmitButton';
import { localAssets } from '../../assets/images/assets';
import { Forms } from '../../assets/styles/Forms';
import { Style } from '../../assets/styles/Style';

const ForgotPasswordScreen = () =>
{
    const navigation = useNavigation()
    const [email, setEmail] = React.useState('')
    return (

        <SafeAreaView style={Views.container}>
            <ImageBackground source={localAssets.background} resizeMode="cover" style={styles.image} blurRadius={40}>
                <View style={Forms.forgotPasswordFormContainer}>

                    <Text style={{ alignSelf: 'flex-start', margin: "7%", fontSize: Style.FONT_SIZE_SMALL }}>Introduzca su correo para recuperar su contraseña</Text>
                    <TextInput
                        style={Inputs.forgotPasswordInput}
                        onChangeText={setEmail}
                        placeholder={'Correo electrónico'}
                        keyboardType={'default'}
                        value={email}
                    />
                    <SubmitButton

                        title={"Recuperar contraseña"}
                        onPress={() => navigation.navigate(Routing.login)} />
                </View>
            </ImageBackground>
        </SafeAreaView >
    )
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


export default ForgotPasswordScreen;