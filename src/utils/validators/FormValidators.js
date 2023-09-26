

export const isValidString = (text) =>
{
    if (!text || typeof text !== 'string') return false;
    return text.length > 0;
}

export const isValidEmail = (email) =>
{
    const regex =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!email || typeof email !== 'string') return false;

    return regex.test(email);
}

export const isValidPassword = (password) =>
{
    if (!password || typeof password !== 'string') return false;

    return password.length >= 6;
}

export const isNumeric = (number) =>
{
    if (!number || isNaN(parseFloat(number)) || number < 0) return false;
    return true;
}

export const isEmpty = (value) => { return value.length < 0; }

export const isUndefined = (value) => { return value === undefined; }

export const isValidDate = (date) =>
{
    if (!date || typeof date !== 'object') return false;
    return date.length > 0;
}

export const isBoolean = (boolean) =>
{
    if (!boolean || typeof date !== 'boolean') return false;
    return boolean.length > 0;
}

export const isValidLogin = (email, password) => { return isValidEmail(email) && isValidPassword(password) }
