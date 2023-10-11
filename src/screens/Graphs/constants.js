export const Months = [
    { name: 'Ene', value: 1 },
    { name: 'Feb', value: 2 },
    { name: 'Mar', value: 3 },
    { name: 'Abr', value: 4 },
    { name: 'May', value: 5 },
    { name: 'Jun', value: 6 },
    { name: 'Jul', value: 7 },
    { name: 'Ago', value: 8 },
    { name: 'Sep', value: 9 },
    { name: 'Oct', value: 10 },
    { name: 'Nov', value: 11 },
    { name: 'Dic', value: 12 },
]

export const Years = []

const currentYear = new Date().getFullYear()
for (let i = currentYear; i <= currentYear + 1; i++)
    Years.push({ name: i.toString(), value: i });


