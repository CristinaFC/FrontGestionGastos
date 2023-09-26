import { isValidEmail, isValidString, isValidPassword, isNumeric, isValidDate, isBoolean, isEmpty, isUndefined } from "./FormValidators";

export default class FormValidatorsManager
{
    static formRegister = (props) =>
    {
        const { name, lastName, email, password } = props;

        const error = [];

        if (!isValidEmail(email))
            error.push({ key: 'email', value: "Email no válido" });

        if (!isValidPassword(password))
            error.push({ key: 'password', value: "Contraseña no válida" });

        if (!isValidString(name))
            error.push({ key: 'name', value: "Nombre no válido" });

        if (!isValidString(lastName))
            error.push({ key: 'lastName', value: "Apellido no válido" });

        if (error.length !== 0) return error;

        return null;

    }

    static formProfile = (props) =>
    {
        const { name, lastName, email } = props;

        const error = [];

        if (!isValidEmail(email))
            error.push({ key: 'email', value: "Email no válido" });


        if (!isValidString(name))
            error.push({ key: 'name', value: "Nombre no válido" });

        if (!isValidString(lastName))
            error.push({ key: 'lastName', value: "Apellido no válido" });

        if (error.length !== 0) return error;

        return [];
    }

    static formLogin = (props) =>
    {
        const { email, password } = props;
        const error = [];

        if (!isValidEmail(email.trim()))
            error.push({ key: 'email', value: "Email no válido" });


        if (!isValidPassword(password))
            error.push({ key: 'password', value: "Contraseña no válida" });


        if (error.length !== 0) return error;


        return null;
    }

    static formCategory = (props) =>
    {
        const { name, icon, type } = props;

        const error = [];
        if (!isValidString(name)) error.push({ key: 'name', value: "Campo obligatorio" })
        if (!isValidString(icon)) error.push({ key: 'icon', value: "Campo obligatorio" })
        if (!isValidString(type)) error.push({ key: 'type', value: "Campo obligatorio" })

        if (error.length !== 0) return error;
        return [];
    }

    static formAccount = (props) =>
    {
        const { name, icon } = props;

        const error = [];
        if (!isValidString(name)) error.push({ key: 'name', value: "Campo obligatorio" })
        if (!isValidString(icon)) error.push({ key: 'icon', value: "Campo obligatorio" })


        if (error.length !== 0) return error;
        return [];
    }

    static formExpenseIncome = (props) =>
    {
        const { amount, account, category, description } = props;

        const error = [];
        // if (!isValidString(description)) error.push({ key: 'description', value: "Campo obligatorio" })
        if (!isNumeric(amount)) error.push({ key: 'amount', value: "Cantidad no válida" })
        if (isUndefined(account)) error.push({ key: 'account', value: "Campo obligatorio" })
        if (isUndefined(category)) error.push({ key: 'category', value: "Campo obligatorio" })

        if (error.length !== 0) return error;
        return [];
    }
}
