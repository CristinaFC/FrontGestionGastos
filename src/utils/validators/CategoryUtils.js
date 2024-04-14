

export function createCategoriesEnum(categories)
{
    const catEnum = [];
    catEnum.RESET = { label: "-- Restablecer --", value: 'reset' };
    categories.forEach((category) =>
    {
        catEnum[category.name.toUpperCase()] = { label: category.name, value: category.uid };
    });
    return catEnum
}