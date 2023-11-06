import { jwtDecode } from 'jwt-decode'

// Función para verificar si el token ha expirado
export const isTokenExpired = (token) =>
{

    try
    {
        if (token)
        {

            const decodedToken = jwtDecode(token);
            if (!decodedToken)
            {
                // El token no pudo ser decodificado, lo tratamos como expirado
                return true;
            }

            const currentTime = Math.floor(Date.now() / 1000); // Tiempo actual en segundos
            return decodedToken.exp < currentTime;
        }
    } catch (error)
    {
        console.log(error);
        // Manejar errores al decodificar el token
        // return true; // En caso de error, asumimos que el token ha expirado
    }
};


export const toTwoDecimals = (number) =>
{
    return parseFloat(number).toFixed(2)
}

