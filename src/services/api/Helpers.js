import { jwtDecode } from 'jwt-decode'

export const isTokenExpired = (token) =>
{
    try
    {
        if (token)
        {
            const decodedToken = jwtDecode(token);

            if (!decodedToken) return true;

            const currentTime = Math.floor(Date.now() / 1000);

            return decodedToken.exp < currentTime;
        }
    } catch (error) { console.log(error) };

};


export const toTwoDecimals = (number) =>
{
    return parseFloat(number).toFixed(2)
}

