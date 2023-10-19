export function generateColors(numColors)
{
    const start = parseInt('#233D4D'.slice(1), 16);
    const end = parseInt('#84C3A8'.slice(1), 16);
    let step;
    if (numColors > 1) step = (end - start) / (numColors - 1)
    else step = (end - start) / (numColors)

    const colors = [];

    for (let i = 0; i < numColors; i++)
    {
        const colorValue = Math.round(start + i * step);
        const colorHex = '#' + colorValue.toString(16).padStart(6, '0');
        colors.push(colorHex);
    }

    return colors;
}