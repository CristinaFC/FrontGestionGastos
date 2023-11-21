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

        const { amount, account, category } = props;
        const error = [];

        if (!isNumeric(amount)) error.push({ key: 'amount', value: "Cantidad no válida" })
        if (isUndefined(account)) error.push({ key: 'account', value: "Campo obligatorio" })
        if (isUndefined(category)) error.push({ key: 'category', value: "Campo obligatorio" })

        if (error.length !== 0) return error;
        return [];
    }

    static formFixedExpense = (props) =>
    {

        const { amount, account, category, dateEndOf, period, date, hasEndDate } = props;
        const error = [];

        const sameYear = dateEndOf.getFullYear() === date.getFullYear();
        const month = date.getMonth();
        const sameMonth = dateEndOf.getMonth() === month
        const endMonth = dateEndOf.getMonth();
        const endDay = dateEndOf.getDate();
        const day = date.getDate();
        if (date < new Date()) error.push({ key: 'date', value: "La fecha no puede ser anterior" })

        if (period === '') error.push({ key: 'period', value: "Campo obligatorio para gastos fijos" })

        if (period !== '' && hasEndDate)
        {
            if (period === 3 && sameYear && endMonth <= month && endDay <= day)
            {
                error.push({
                    key: 'dateEndOf',
                    value: "Si es anual, la fecha de finalización debe ser mínimo un año posterior al gasto "
                })
            } else if (period === 2 && sameYear && sameMonth && endDay <= day)
            {
                error.push({
                    key: 'dateEndOf',
                    value: "Si es mensual, la fecha de finalización debe ser mínimo un mes posterior al gasto "
                })
            } else if (period === 1 && sameYear && sameMonth && endDay - day < 7)
            {
                error.push({
                    key: 'dateEndOf',
                    value: "Si es semanal, la fecha de finalización debe ser mínimo una semana posterior al gasto "
                })
            } else if (period === 0 && sameYear && sameMonth && endDay - day < 1)
            {
                error.push({
                    key: 'dateEndOf',
                    value: "Si es diario, la fecha de finalización debe ser mínimo un día posterior al gasto "
                })
            }
        }
        if (!isNumeric(amount)) error.push({ key: 'amount', value: "Cantidad no válida" })
        if (isUndefined(account)) error.push({ key: 'account', value: "Campo obligatorio" })
        if (isUndefined(category)) error.push({ key: 'category', value: "Campo obligatorio" })

        if (error.length !== 0) return error;
        return [];
    }
}
