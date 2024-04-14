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
        if (!isValidString(description)) error.push({ key: 'description', value: "Campo obligatorio" })
        if (!isNumeric(amount)) error.push({ key: 'amount', value: "Cantidad no válida" })
        if (isUndefined(account)) error.push({ key: 'account', value: "Campo obligatorio" })
        if (isUndefined(category)) error.push({ key: 'category', value: "Campo obligatorio" })

        if (error.length !== 0) return error;
        return [];
    }

    static formFixedExpense = (props) =>
    {

        let { amount, account, category, initDate, period, endDate, hasEndDate, concept } = props;
        const error = [];
        initDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);
        let currentDate = new Date()
        currentDate.setHours(0, 0, 0, 0);

        const sameYear = endDate.getFullYear() <= initDate.getFullYear();
        const month = initDate.getMonth();
        const sameMonth = endDate.getMonth() === month
        const endMonth = endDate.getMonth();
        const endDay = endDate.getDate();
        const day = initDate.getDate();

        if (initDate.getTime() < currentDate.getTime())
            error.push({ key: 'initDate', value: "La fecha de inicio no puede ser anterior al día de hoy" })

        if (endDate.getTime() < currentDate.getTime())
            error.push({ key: 'endDate', value: "La fecha de fin debe ser posterior al día de hoy" })

        if (endDate.getTime() < initDate.getTime())
            error.push({ key: 'endDate', value: "La fecha de fin debe ser posterior a la fecha de inicio" })

        if (period === '')
            error.push({ key: 'period', value: "Campo obligatorio para gastos fijos" })

        if (period !== '' && hasEndDate)
        {
            if (period === 3 && sameYear && endMonth <= month && endDay <= day)
            {
                error.push({
                    key: 'endDate',
                    value: "Si es anual, la fecha de fin debe ser mínimo un año posterior al gasto "
                })
            } else if (period === 2 && sameYear && sameMonth && endDay <= day)
            {
                error.push({
                    key: 'endDate',
                    value: "Si es mensual, la fecha de fin debe ser mínimo un mes posterior al gasto "
                })
            } else if (period === 1 && sameYear && sameMonth && endDay - day < 7)
            {
                error.push({
                    key: 'endDate',
                    value: "Si es semanal, la fecha de fin debe ser mínimo una semana posterior al gasto "
                })
            } else if (period === 0 && sameYear && sameMonth && endDay - day < 1)
            {
                error.push({
                    key: 'endDate',
                    value: "Si es diario, la fecha de fin debe ser mínimo un día posterior al gasto "
                })
            }
        }

        if (isEmpty(concept)) error.push({ key: 'concept', value: "Campo obligatorio" })
        if (!isNumeric(amount)) error.push({ key: 'amount', value: "Cantidad no válida" })
        if (isUndefined(account)) error.push({ key: 'account', value: "Campo obligatorio" })
        if (isUndefined(category)) error.push({ key: 'category', value: "Campo obligatorio" })

        if (error.length !== 0) return error;
        return [];
    }
}
