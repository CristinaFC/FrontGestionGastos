
import React, { Component } from 'react';
import
{
    ImageBackground, SafeAreaView, View, ActivityIndicator,
    Text, StyleSheet, ScrollView, TouchableOpacity, PermissionsAndroid, Image
} from 'react-native';

import { Views } from '../../../assets/styles/Views';
import Header from '../../../components/Header';
import { localAssets } from '../../../assets/images/assets';
import { connect } from 'react-redux';
import { apiGetExpensesByCategoryAndDate, clearGraphData, } from '../../../modules/Graph/GraphActions';

import { BarChart } from "react-native-chart-kit";
import * as Color from '../../../assets/styles/Colors'
import * as RootRouting from '../../../navigation/RootRouting'
import Routing from '../../../navigation/Routing';
import { toTwoDecimals } from '../../../services/api/Helpers';
import DateSelectorModal from '../../../components/Modals/DateSelectorModal';
import { Style } from '../../../assets/styles/Style';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Months } from '../constants';
import { captureRef } from 'react-native-view-shot';

class ExpensesPerMonthsGraphScreen extends Component
{

    constructor(props)
    {
        super(props);

        this.state = {
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1,
            prevMonthExpenses: [],
            expenses: [],
            modal: false,
            pdfModal: false,
            pdfModalMsg: '',
            image: ''
        }
    }
    scrollViewRef = React.createRef();

    componentDidMount() { this._getData() }

    _handleChange(name, value)
    {
        this.setState({ [name]: value })
    }

    componentWillUnmount() { this.props.clearGraphData() }


    _getData()
    {
        const { year, month } = this.state
        this.props.apiGetExpensesByCategoryAndDate(month - 1, year)
            .then(() =>
            {
                const prevMonthExpenses = this.props.expenses;
                this.setState({ prevMonthExpenses }, () =>
                {
                    this.props.apiGetExpensesByCategoryAndDate(month, year)
                });

            })
            .catch(error =>
            {
                console.error(error);
            });
        this.setState({ modal: false });
    }

    setGraphData()
    {
        const expenses = Array.isArray(this.props.expenses) ? [...this.props.expenses] : undefined;
        const data = {
            labels: [],
            datasets: [
                { data: [] }
            ]
        }
        expenses?.forEach((expense) =>
        {
            data.labels.push(expense.category)
            data.datasets[0].data.push(expense.total)
        })
        return data
    }

    summaryInfo()
    {
        const { month, year, prevMonthExpenses } = this.state
        const { expenses } = this.props
        let prevAmount = 0, amount = 0

        prevMonthExpenses?.forEach((expense) => { prevAmount += expense.total })
        expenses?.forEach((expense) => { amount += expense.total })

        const saving = amount < prevAmount ? true : false

        return (
            this.props.isLoadingExpenses ? <ActivityIndicator /> :
                <View style={{ width: Style.DEVICE_NINETY_FIVE_PERCENT_WIDTH, marginTop: 10, alignSelf: 'center' }}>
                    <View style={Views.squareBackground}>
                        <Text style={styles.summaryText}>
                            En comparación al mes anterior, {saving ? 'has ahorrado' : 'tus gastos se han incrementado en'}
                            <Text style={[
                                saving ? styles.summaryTextButton : styles.summaryTextRed,
                            ]}>
                                {` ${saving ?
                                    toTwoDecimals(prevAmount - amount).replace('.', ',')
                                    : toTwoDecimals(amount - prevAmount).replace('.', ',')}€ \n`}
                            </Text>
                            Si quieres ver la comparación con el mes anterior pincha
                            <Text style={{ fontWeight: 'bold' }}
                                onPress={() =>
                                {
                                    RootRouting.navigate(Routing.expensesDatesComparationGraphScreen, { month, year })
                                }}> aquí
                            </Text>
                        </Text>
                    </View>
                </View>
        )
    }

    _getReportData()
    {
        const { expenses } = this.props
        let data = {
            total: 0,
            categories: {}
        }
        expenses.forEach(exp =>
        {
            let { category, amount } = exp
            data.total += exp.amount

            if (data.categories[category]) data.categories[category] += amount;
            else data.categories[category] = amount;
        })
        return data
    }

    async createPDF()
    {
        this.setState({ pdfModal: true })
        let isPermitted = await this._isPermitted()
        let msg = ''


        //if (isPermitted)
        //{
        //let data = this._getReportData()
        // let options = {
        //     html: `<!DOCTYPE html>
        //     <html>
        //       <h1>Hola,</h1>
        //       <h2> A continuación, te mostramos un reporte mensual de tus gastos en ${Months[this.state.month - 1].name}</h2>
        //       <span>Los gastos totales han sido de ${data.total}€</span><br>
        //       <table>
        //       ${Object.keys(data.categories).map((name) =>

        //     (`<tr>
        //             <th style="padding: 10px; background-color: #f2f2f2; border: 1px solid #ddd;">${name}</th>
        //             <td style="padding: 10px; border: 1px solid #ddd;">${data.categories[name]}€</td>
        //         </tr>`)
        //     )}
        //         <tr>
        //           <th style="padding: 10px; background-color: #f2f2f2; border: 1px solid #ddd;">TOTAL</th>
        //           <td style="padding: 10px; border: 1px solid #ddd;">${data.total}€</td>
        //         </tr>
        //       </table>
        //       <h2>Desgloce de los gastos:</h2>
        //       <table style="width:100%">
        //         <tr>
        //           <th style="padding: 10px; background-color: #f2f2f2; border: 1px solid #ddd;">Concepto</th>
        //           <th style="padding: 10px; background-color: #f2f2f2; border: 1px solid #ddd;">Categoría</th>
        //           <th style="padding: 10px; background-color: #f2f2f2; border: 1px solid #ddd;">Fecha</th>
        //           <th style="padding: 10px; background-color: #f2f2f2; border: 1px solid #ddd;">Cuenta</th>
        //         </tr>
        //         ${this.props.expenses.map(expense =>

        //     (`<tr>
        //         <td style="padding: 10px; border: 1px solid #ddd;">${expense.concept}</td>
        //         <td style="padding: 10px; border: 1px solid #ddd;">${expense.category.name}</td>
        //         <td style="padding: 10px; border: 1px solid #ddd;">${expense.date}</td>
        //         <td style="padding: 10px; border: 1px solid #ddd;">${expense.account.name}</td>
        //     </tr>`
        //     ))}
        //       </table>
        //     </html> `,
        //     //File Name
        //     fileName: 'test',
        //     //File directory
        //     directory: 'docs',
        // };
        //     try
        //     {
        //         await RNHTMLtoPDF.convert(options);
        //         msg = 'PDF exportado'
        //     } catch (e)
        //     {
        //         this.setState({ pdfModalMsg: 'Error. Intenéntelo más tarde' })
        //     }
        // } else msg = 'Permiso denegado'

        this.setState({ pdfModalMsg: msg })
    }

    generatePDF = async (graphImageUri) =>
    {
        try
        {
            // Generate HTML content with the captured graph image
            const htmlContent = `
            <html>
              <head>
                <title>PDF Document</title>
              </head>
              <body>
                <h1>PDF Document with Graph</h1>
                <img src="${graphImageUri}" />
                <p>This is an example PDF document generated with a graph.</p>
              </body>
            </html>
          `;

            // Convert HTML to PDF
            const options = {
                html: htmlContent,
                fileName: 'graph_document',
                directory: 'Documents',
            };
            const pdf = await RNHTMLtoPDF.convert(options);
        } catch (error)
        {
            console.error('Error generating PDF:', error);
        }
    };

    async _isPermitted()
    {
        if (Platform.OS === 'android')
        {
            try
            {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                    {
                        title: 'External Storage Write Permission',
                        message: 'App needs access to Storage data',
                    },
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err)
            {
                alert('Write permission err', err);
                return false;
            }
        } else
        {
            return true;
        }
    }

    async handleClick()
    {
        this.setState({ xlsxModal: true })
        let msg = ''
        try
        {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                {
                    title: "Storage permission needed",
                    buttonNeutral: "Preguntar más tarde",
                    buttonNegative: "Cancelar",
                    buttonPositive: "Aceptar"
                }
            );

            msg = granted === PermissionsAndroid.RESULTS.GRANTED ?
                this.exportDataToExcel() : 'Permiso denegado'
        } catch (e)
        {
            msg = 'Error. Inténtelo más tarde'
        }
        this.setState({ xlsxModalMsg: msg })
        return

    };

    render()
    {
        const { isLoadingExpenses, expenses } = this.props;
        const { year, month, modal, image } = this.state;
        let data = this.setGraphData()
        const barChartWidth = Style.DEVICE_WIDTH * 1.5 * data.labels.length / 6
        return (
            <SafeAreaView style={Views.container}>
                <Header goBack={true} title="Gráficos" />
                <ImageBackground source={localAssets.background} resizeMode="cover" style={Views.imageHeader} blurRadius={40}>
                    <DateSelectorModal
                        modal={modal}
                        onOpenModal={() => this.setState({ modal: !modal })}
                        onClose={() => this.setState({ modal: false })}
                        month={month}
                        year={year}
                        onChangeMonth={(item) => this._handleChange('month', item.value)}
                        onChangeYear={(item) => this._handleChange('year', item.value)}
                        onSubmit={() => this._getData()} />
                    <TouchableOpacity onPress={() => this.handleCaptureGraph(barChartWidth)}>
                        <MaterialCommunityIcons name="file-pdf-box" size={30} color={Color.white} />
                    </TouchableOpacity>
                </ImageBackground>

                <ScrollView  >
                    {isLoadingExpenses ? <ActivityIndicator /> : null}
                    {image && <Image
                        source={{ uri: image }}
                        style={{ width: Style.DEVICE_WIDTH, height: 350 }}
                    />}


                    {expenses?.length == 0 ?
                        <Text>No existen gastos</Text> :
                        <ScrollView style={Views.verticalGraphScrollView} >
                            <ScrollView ref={this.scrollViewRef} horizontal contentContainerStyle={{ alignItems: 'center' }}
                                style={Views.horizontalGraphScrollView}>
                                <BarChart
                                    data={data}
                                    width={barChartWidth}
                                    height={350}
                                    yAxisSuffix=" €"
                                    showValuesOnTopOfBars
                                    fromZero
                                    style={{
                                        paddingTop: 20,
                                        paddingLeft: 20,
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}
                                    chartConfig={{
                                        backgroundColor: Color.white,
                                        backgroundGradientFrom: Color.white,
                                        backgroundGradientTo: Color.white,
                                        decimalPlaces: 2,
                                        color: (opacity = 1) => Color.button,
                                        labelColor: (opacity = 1) => Color.firstText,
                                        barRadius: 10,
                                        propsForDots: {
                                            r: "6",
                                            strokeWidth: "2",
                                            stroke: Color.button
                                        }
                                    }}
                                    verticalLabelRotation={0}
                                />
                            </ScrollView>
                        </ScrollView>


                    }
                    {this.summaryInfo()}
                </ScrollView>
            </SafeAreaView >
        );
    }
}

const styles = StyleSheet.create({
    summaryText: {
        fontSize: 14,
        color: Color.firstText,
        lineHeight: 30,
        textAlign: 'center',
        padding: 10
    },
    summaryTextRed: {
        fontSize: 14,
        lineHeight: 24,
        color: "red",

    },
    summaryTextButton: {
        fontSize: 14,
        lineHeight: 30,
        color: "#6AA58C",
    },
});


const mapStateToProps = ({ GraphReducer }) =>
{
    const { expenses, isLoadingExpenses } = GraphReducer;

    return { expenses, isLoadingExpenses };

};

const mapStateToPropsAction = {
    apiGetExpensesByCategoryAndDate,
    clearGraphData
};



export default connect(mapStateToProps, mapStateToPropsAction)(ExpensesPerMonthsGraphScreen);
