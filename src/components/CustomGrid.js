import { Line, G } from 'react-native-svg';

const CustomGrid = ({ x, y, data }) => (
    <G>
        {data[0].data?.map((_, index) => (
            <Line
                key={index}
                x1={x(index)}
                x2={x(index)}
                y1={180}
                y2={190} // Ajusta la altura de acuerdo a tus datos
                stroke="black" // Color de la línea divisoria
            />
        ))}
    </G>
);

export default CustomGrid;