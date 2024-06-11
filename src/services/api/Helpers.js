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

export const formatDate = (date) => new Date(date).toLocaleDateString('es-ES');
export const formatCurrency = (amount) => parseFloat(amount).toFixed(2).replace('.', ',');
export const calculatePorcentage = (amount, total) => { return (amount * 100 / total).toFixed(2) }
export function calculateChangePercentage(currentValue, previousValue)
{
    if (previousValue === 0) return 100;

    return ((previousValue - currentValue) / previousValue) * 100;
}

export function fillMissingMonths(data)
{
    if (data)
    {

        Months.forEach((month, index) =>
        {
            if (!data.find(item => item.month === month.value))
            {
                data.push({
                    month: month.value,
                    total: 0
                });
            }
        });
        data.sort((a, b) => a.month - b.month);
    }

    return data
}

export const calculateReportData = (expenses, incomes) =>
{
    if (expenses.length > 0)
    {
        let data = {
            totalExpAmount: 0,
            totalIncAmount: 0,
            expGroupedByCategory: [],
            expGroupedByAccount: [],
            categories: [],
            accounts: [],
        }
        incomes.forEach(({ amount }) =>
        {
            data.totalIncAmount += amount;
        })
        expenses.forEach((exp) =>
        {
            let { category, amount, account } = exp;

            data.totalExpAmount += amount;

            //Gastos agrupados por categoría
            const existingExpGroupedByCategory = data.expGroupedByCategory.findIndex(exp => exp._id === category._id)
            if (existingExpGroupedByCategory !== -1)
                data.expGroupedByCategory[existingExpGroupedByCategory].amount += amount;
            else
                data.expGroupedByCategory.push({ _id: category._id, name: category.name, amount })

            //Gastos agrupados por cuenta
            const existingExpGroupedByAccount = data.expGroupedByAccount.findIndex(exp => exp._id === account._id)
            if (existingExpGroupedByAccount !== -1)
                data.expGroupedByAccount[existingExpGroupedByAccount].amount += amount;
            else
                data.expGroupedByAccount.push({ _id: account._id, name: account.name, amount })

            //Categorías 
            const existingCategoryIndex = data.categories.findIndex(cat => cat._id === category._id);
            if (existingCategoryIndex === -1)
                data.categories.push(category);
            //Cuentas 
            const existingAccountIndex = data.accounts.findIndex(acc => acc._id === account._id);
            if (existingAccountIndex === -1)
                data.accounts.push(account);

        })

        return data
    } return
}