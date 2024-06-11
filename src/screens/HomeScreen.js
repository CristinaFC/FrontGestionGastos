import React, { Component } from 'react';
import
{
    SafeAreaView, StyleSheet, View, ScrollView, Text,
    PermissionsAndroid,
    Platform,
    ActivityIndicator,
    Alert,
} from 'react-native';
import SplashScreen from 'react-native-splash-screen'
import * as Color from '../assets/styles/Colors';

import { connect } from 'react-redux';
import { apiLogout, clearDataLogin } from '../modules/Auth/AuthActions';
import { apiGetBalance, apiGetPrediction, clearBalanceData } from '../modules/Balance/BalanceActions';
import { Views } from '../assets/styles/Views';

import Header from '../components/Header';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import RNHTMLtoPDF from 'react-native-html-to-pdf';
import
{
    LineChart,
    ProgressChart
} from "react-native-chart-kit";
import { apiGetCategoriesWithLimit, clearCategoriesData } from '../modules/Category/CategoryActions';
import { Style } from '../assets/styles/Style';
import { Texts } from '../assets/styles/Texts';
import { fillMissingMonths, formatCurrency } from '../services/api/Helpers';
import { apiGetGraphOverview } from '../modules/Graph/GraphActions';
import { Months } from './Graphs/constants';

class HomeScreen extends Component
{

    constructor(props)
    {
        super(props);
        this.state = {
            filePath: '',
            htmlContent: '',
        }
    }

    async componentDidMount()
    {
        SplashScreen.hide();
        await this._getData()
    }
    async _getData()
    {
        await this.props.apiGetBalance()
        await this.props.apiGetCategoriesWithLimit()
        await this.props.apiGetPrediction()
        await this.props.apiGetGraphOverview()

        const { expenses, lastYearExpenses } = this.props.data

        const expensesData = fillMissingMonths(expenses)
        const lastYearExpensesData = fillMissingMonths(lastYearExpenses)
        let actualExpformattedData = expensesData?.map(item => item.total) || []
        let lastYearExpformattedData = lastYearExpensesData?.map(item => item.total) || []

        const graphData = {
            labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
            datasets: [
                {
                    data: actualExpformattedData,
                    color: (opacity = 1) => Color.button,
                },
                {
                    data: lastYearExpformattedData,
                    color: (opacity = 1) => Color.firstText,
                },
            ],
        };

        const predictionValue = this.props.prediction;

        const predictionData = {
            data: Array(graphData.labels.length).fill(predictionValue),
            color: (opacity = 1) => Color.orange,
            legend: "Predicción"
        };
        const lastYear = new Date().getFullYear() - 1
        const combinedData = {
            labels: graphData.labels,
            datasets: [...graphData.datasets, predictionData],
            legend: ["Gastos", `Gastos ${lastYear}`, "Predicción"]
        };

        this.setState({ combinedData })

    }


    async createPDF()
    {
        let isPermitted = await this._isPermitted()
        if (isPermitted)
        {
            let options = {
                //Content to print
                html: `<!DOCTYPE html>
                <html>
                  <h1>Hola,</h1>
                  <h2> A continuación, te mostramos un reporte mensual de tus gastos en ${this.state.month}</h2>

                </html>`,
                //File Name
                fileName: 'test',
                //File directory
                directory: 'docs',
            };
            let file = await RNHTMLtoPDF.convert(options);

            this.setState({ filePath: file.filePath })
        }
    }


    async _isPermitted()
    {
        if (Platform.OS === 'android')
        {
            try
            {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
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

    render()
    {

        const { totalAmount, totalExpenses, totalIncomes, } = this.props.balance[0]
        const { combinedData = [] } = this.state
        const chartConfig = {
            backgroundColor: Color.headerBackground,
            backgroundGradientFrom: Color.button,
            backgroundGradientTo: Color.headerBackground,
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            progressColor: (opacity = 1) => Color.white,
        }

        const { isLoadingCategories, initCategories = [], isLoadingPrediction, isLoadingOverview } = this.props
        const predictionValue = this.props.prediction;

        const month = new Date().getMonth() + 1;
        const year = new Date().getFullYear();



        return (
            <SafeAreaView style={Views.container}>
                <Header title="GestiónGastos" goBack={false} />
                <ScrollView style={{ flex: 1, height: Style.DEVICE_HEIGHT }}>
                    {isLoadingOverview ? <ActivityIndicator /> : <View style={[styles.overviewContent]}>
                        <View style={styles.overview}>
                            <Text style={styles.overviewTitle}>Saldo</Text>
                            <Text style={totalAmount >= 0 ? Texts.overviewTextPositive : Texts.overviewTextNegative}>{formatCurrency(totalAmount)}€
                            </Text>
                        </View>
                        <View style={styles.overview}>
                            <Text style={styles.overviewTitle}>Ingresos</Text>
                            <Text style={totalIncomes > 0 ? Texts.overviewTextPositive : Texts.overviewTextNegative}>{formatCurrency(totalIncomes)}€</Text>
                        </View>
                        <View style={styles.overview}>
                            <Text style={styles.overviewTitle}>Gastos</Text>
                            <Text style={totalExpenses <= 0 ? Texts.overviewTextPositive : Texts.overviewTextNegative}>{formatCurrency(totalExpenses)}€</Text>
                        </View>
                    </View>
                    }
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        {combinedData.length == 0 || isLoadingOverview ? <ActivityIndicator /> :
                            <LineChart
                                data={combinedData}
                                width={Style.DEVICE_NINETY_FIVE_PERCENT_WIDTH}
                                height={256}
                                fromZero
                                hasLegend={true}
                                onDataPointClick={({ value, getColor, index }) =>
                                {
                                    const month = Months[index].name
                                    if (getColor() == Color.orange && new Date().getMonth() === index)
                                    {
                                        return Alert.alert(
                                            `Predicción gastos ${month}`,
                                            `La predicción de gastos para el mes de ${month} es de ${formatCurrency(predictionValue)}€`,
                                            [{
                                                text: 'Aceptar', cancel: 'Cancelar'
                                            }]
                                        );
                                    } else if (getColor() == Color.button)
                                    {
                                        return Alert.alert(
                                            `Gastos de ${month}`,
                                            `Los gastos de ${month} son de ${formatCurrency(value)}€`,
                                            [{
                                                text: 'Aceptar', cancel: 'Cancelar'
                                            }]
                                        );
                                    }
                                }}
                                chartConfig={{
                                    backgroundColor: '#ffffff',
                                    backgroundGradientFrom: '#ffffff',
                                    backgroundGradientTo: '#ffffff',
                                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                    strokeWidth: 2,
                                }}
                                bezier
                            />
                        }

                        <View style={[styles.overviewContent, { marginBottom: 10, flex: 1 }]}>
                            {isLoadingCategories ? < ActivityIndicator /> :
                                <ScrollView horizontal={true}  >
                                    {initCategories?.map((category, index) =>
                                    {
                                        const currentMonthlyExpense = category.monthlyExpenses.find(expense => expense.month === month && expense.year === year);

                                        const total = currentMonthlyExpense ? currentMonthlyExpense.total : 0;
                                        const limit = currentMonthlyExpense?.limit;
                                        const percentage = (total / limit) * 100;
                                        const reachedLimit = (percentage / 100) > 1
                                        return (
                                            <View key={index} style={{ justifyContent: 'center', alignItems: 'center', marginRight: 10 }}>
                                                <ProgressChart
                                                    data={{ data: [Math.min(percentage / 100, 1)], colors: reachedLimit ? [Color.orange] : [Color.white] }}
                                                    width={40}
                                                    height={40}
                                                    strokeWidth={3}
                                                    radius={10}
                                                    withCustomBarColorFromData={true}
                                                    chartConfig={{
                                                        backgroundColor: Color.headerBackground,
                                                        backgroundGradientFrom: Color.button,
                                                        backgroundGradientTo: Color.headerBackground,
                                                        decimalPlaces: 2,
                                                        color: (opacity = 0) => `rgba(255, 255, 255, ${opacity})`,
                                                        labelColor: (opacity = 1) => Color.white,
                                                    }}
                                                    hideLegend={true}
                                                    style={{ borderRadius: 100 }}
                                                />
                                                <Text style={[Texts.text, { marginBottom: 0 }]}>{category.name}</Text>
                                                <Text style={reachedLimit ? [Texts.overviewTextNegative, { textAlign: 'center' }] : [Texts.text, { marginBottom: 0 }]}><MaterialCommunityIcons name={category.icon} size={15} color={reachedLimit ? Color.orange : Color.firstText} />  {percentage.toFixed(0)}%</Text>
                                            </View>
                                        );
                                    })}

                                </ScrollView>
                            }
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView >)

    }
}


const styles = StyleSheet.create({
    menuView: {
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: 'space-around',
        flexDirection: "column",
        marginVertical: 10,
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
        width: "100%",
        height: "50%",
        justifyContent: 'center',
        alignItems: 'center'
    },
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: Color.bodyBackground,
    },
    overview: {
        width: "33%",
        marginHorizontal: 1,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(236, 236, 236, .8)',
        backgroundColor: 'rgba(236, 236, 236, .8)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10
    },
    overviewTitle: {
        fontSize: Style.FONT_SIZE_SMALL, color: Color.firstText, marginBottom: 2
    },
    overviewContent: {
        width: Style.DEVICE_NINETY_FIVE_PERCENT_WIDTH,
        flexDirection: 'row',
        backgroundColor: Color.white,
        padding: 10,
        borderRadius: 10,
        margin: 10,
        height: "15%",
        justifyContent: 'center',
        alignContent: 'center'
    }
});

const mapStateToProps = ({ BalanceReducer, CategoryReducer, GraphReducer }) =>
{
    const { data, isLoadingOverview } = GraphReducer
    const { initCategories, isLoadingCategory } = CategoryReducer
    const { balance, isLoadingPrediction, prediction } = BalanceReducer;

    return { balance, initCategories, isLoadingCategory, isLoadingPrediction, prediction, data, isLoadingOverview }
}
const mapStateToPropsAction = {
    apiLogout,
    clearDataLogin,
    clearCategoriesData,
    apiGetBalance,
    apiGetCategoriesWithLimit,
    apiGetPrediction,
    apiGetGraphOverview,
    clearBalanceData
};


export default connect(mapStateToProps, mapStateToPropsAction)(HomeScreen);