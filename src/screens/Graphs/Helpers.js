import * as Color from '../../assets/styles/Colors'
export function generateColors(numColors)
{
    const start = parseInt(Color.orange.slice(1), 16);
    const end = parseInt(Color.button.slice(1), 16);
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

export function findMaxValue(data)
{
    let maxValue = 0;
    for (const item of data)
    {
        for (const dataPoint of item.data)
        {
            if (dataPoint.total > maxValue)
            {
                maxValue = dataPoint.total;
            }
        }
    }
    return maxValue;
}
export function findMinValue(data)
{
    let minValue = 0;
    for (const item of data)
    {
        for (const dataPoint of item.data)
        {
            if (dataPoint.total > minValue)
            {
                minValue = dataPoint.total;
            }
        }
    }
    return minValue;
}

export function calculatePercentage(data)
{
    const totalSum = data.reduce((total, item) => total + item.value, 0);

    const newData = data.map(item =>
    {
        console.log('item', item)
        const percentage = ((item.value / totalSum) * 100).toFixed(2);
        return {
            ...item,
            value: parseFloat(percentage)
        };
    });

    return newData;

}