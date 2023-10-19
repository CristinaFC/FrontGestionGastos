import { Text as SvgText } from 'react-native-svg'

const YAXISBarChart = ({ x, y, bandwidth, data, cutoff }) => (

    data.map((value, index) => (
        <SvgText
            key={index}
            x={x(index) + (bandwidth / 2)}
            y={value.total < cutoff ? y(value.total) - 10 : y(value.total) + 15}
            fontSize={14}
            fill={value.total >= cutoff ? 'white' : 'black'}
            alignmentBaseline={'middle'}
            textAnchor={'middle'}
        >
            {value.total}
        </SvgText>
    ))
)

export default YAXISBarChart;