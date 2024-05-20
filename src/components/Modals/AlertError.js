import { Alert } from "react-native";

export const AlertError = () =>
{
    Alert.alert(
        `Error`,
        `Ha ocurrido un error. Reinicie la app e inténtelo más tarde`,
        [{
            text: 'Aceptar'
        }]
    );
}