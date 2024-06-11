const { localAssets } = require("../images/assets");
import * as Color from './Colors';

export const htmlStyles = `
    header {
        background-image: url('data:image/png;base64,${localAssets.header}');
        background-size: contain;
        background-repeat: no-repeat;
        text-align: center;
        color: white;
    }
    body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #f9f9f9;
    color: #333;
  }
  h1, h2 {
    color: ${Color.button};
  }
  .section {
    margin-bottom: 40px;
    flex: 1;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
  }
  th, td {
    padding: 10px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }
  th {
    background-color: #f2f2f2;
    font-weight: bold;
    color: ${Color.headerBackground}
  }
  tbody tr:nth-child(even) {
    background-color: #f9f9f9;
  }
  tbody tr:hover {
    background-color: #f2f2f2;
  }
  .highlight-row {
    background-color: #ffc107;
  }
  .summary {
    font-weight: bold;
  }
  .chartContainer {
    display: flex;
    justify-content: space-around;
  }
  .chartSection {
    width: 45%;
    margin-bottom: 40px;
  }
  .chart {
    display: flex;
    flex-direction: column;
  }
  .bar {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    width: 100%;
  }
  .bar-label {
    width: 35%;
    text-align: right; 
    margin-right: 10px;
}

.bar-wrapper {
    width: 60%; /* Ancho fijo para el wrapper de la barra */
    height: 20px;
    background-color: #f2f2f2; /* Color de fondo para el wrapper de la barra */
    display: flex; /* Para que la barra se alinee a la izquierda */
}

.bar-fill {
    height: 100%; /* La barra ocupa todo el alto del wrapper */
    background-color: #007bff; /* Color de la barra */
}

.bar-percentage {
    min-width: 40px; /* Ancho mínimo para el porcentaje */
    margin-left: 5%; /* Espacio a la izquierda del porcentaje */
    font-size: 14px;
}`