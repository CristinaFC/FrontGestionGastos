export const accountIcons = ['cash', 'credit-card',]


export const Filters = {
    RESET: { label: "-- Restablecer --", value: 'reset' },
    AMOUNT_ASC: { label: "Cantidad: menor a mayor", value: 'amountAsc' },
    AMOUNT_DESC: { label: "Cantidad: mayor a menor", value: 'amountDesc' },
    DATE_ASC: { label: "Fecha: más antiguos", value: 'dateAsc' },
    DATE_DESC: { label: "Fecha: más recientes", value: 'dateDesc' },
};

// export const Filters = Object.freeze([
//     { name: "Título", value: 'title' },
//     { name: "Cantidad: menor a mayor", value: 'amountAsc' },
//     { name: "Cantidad: mayor a menor", value: 'amountDesc' },
//     { name: "Fecha: más antiguos", value: 'dateAsc' },
//     { name: "Fecha: más recientes", value: 'dateAsc' },
//     { name: "Cuenta", value: 'account' },
// ])

export const Periods = [
    { name: "Diario", value: 0 },
    { name: "Semanal", value: 1 },
    { name: "Mensual", value: 2 },
    { name: "Anual", value: 3 }
]