import { jwtDecode } from 'jwt-decode'
import { Months } from '../../screens/Graphs/constants';

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

export const fillAllMonths = (expenses) =>
{
    let data = Array.isArray(expenses) ? [...expenses] : undefined;
    Months.forEach((month) =>
    {
        if (!expenses?.some(obj => obj.month === month.value)) data?.push({ total: 0, month: month.value })
    })
    data?.sort((a, b) =>
    {
        if (a.month > b.month) return 1;
        if (a.month < b.month) return -1;
        return 0;
    })
    return data
}


export const generateRandomColor = () =>
{
    const letters = '0123456789ABCDEF';
    let color = '#';

    for (let i = 0; i < 6; i++)
    {
        color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
};

export const formatError = (errorsArray) =>
{
    return errorsArray?.map(error =>
    {
        const { path, msg, ...rest } = error;
        return { ...rest, key: path, value: msg };
    });
}