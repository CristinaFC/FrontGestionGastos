import React, { Component } from 'react';
import { ImageBackground, SafeAreaView, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';

import { Views } from '../../assets/styles/Views';
import Header from '../../components/Header';
import { localAssets } from '../../assets/images/assets';
import { connect } from 'react-redux';
import { LineChart } from "react-native-chart-kit";
import * as Color from '../../assets/styles/Colors'
import * as RootRouting from '../../navigation/RootRouting'
import Routing from '../../navigation/Routing';
import { fillMissingMonths } from '../../services/api/Helpers';
import { Style } from '../../assets/styles/Style';
import { MenuView } from '../../components/MenuView';
import { clearGraphData, apiGetGraphOverview } from '../../modules/Graph/GraphActions';

class MainGraphsScreen extends Component
{
    constructor(props)
    {
        super(props);


        this.state = {
            incomesData: [],
            expensesData: []
        }
    }

    async componentDidMount() { await this.props.clearGraphData(); await this._getData() }



    componentWillUnmount() { this.props.clearGraphData() }


    async _getData()
    {
        try
        {
            await this.props.clearGraphData();

            await this.props.apiGetGraphOverview();

            const { incomes, expenses } = this.props.data

            let incomesData = Array.isArray(incomes) ? [...incomes] : undefined;
            let expensesData = Array.isArray(expenses) ? [...expenses] : undefined;

            incomesData = fillMissingMonths(incomesData);
            expensesData = fillMissingMonths(expensesData);
            this.setState({ incomesData, expensesData })
        } catch (error)
        {
            console.error(error);
        }

    }

    setGraphData()
    {

        const { incomesData, expensesData } = this.state
        let data1 = incomesData.map(item => item.total)
        let data2 = expensesData.map(item => item.total)

        let data = {
            labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
            datasets: [
                {
                    data: data1,
                    color: () => Color.button
                },
                {
                    data: data2,
                    color: () => Color.orange
                }
            ],
            legend: ["Ingresos", "Gastos"]
        }

        return data
    }



    render()
    {
        const { isLoadingOverview } = this.props;
        let data = [], chartWidth;
        if (!isLoadingOverview)
        {
            data = this.setGraphData()
            chartWidth = Style.DEVICE_WIDTH * 1.5 * data.labels.length / 8
        }

        return (
            <SafeAreaView style={Views.container}>
                <Header title="Gráficos" />
                <ImageBackground
                    source={localAssets.background} resizeMode="cover" style={Views.imageHeader} blurRadius={40}>
                    <MenuView
                        leftTitle="Gastos"
                        leftOnPress={() => RootRouting.navigate(Routing.expenseGraphsMenu)}
                        rightTitle="Ingresos"
                        rightOnPress={() => RootRouting.navigate(Routing.incomesGraphsMenu)} />
                </ImageBackground>

                <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
                    {isLoadingOverview ? <ActivityIndicator /> :
                        data?.datasets[0].data?.length != 0 &&
                        <ScrollView style={Views.verticalGraphScrollView} >
                            <ScrollView horizontal={true} contentContainerStyle={{ alignItems: 'center' }}>
                                <LineChart
                                    bezier
                                    withHorizontalLabels={true}
                                    withVerticalLabels={true}
                                    data={data}
                                    width={Style.DEVICE_WIDTH}
                                    height={400}
                                    yAxisLabel="€"
                                    style={{
                                        borderRadius: 20,
                                        padding: 10,
                                    }}
                                    chartConfig={{
                                        backgroundColor: Color.white,
                                        backgroundGradientFrom: Color.white,
                                        backgroundGradientTo: Color.white,
                                        decimalPlaces: 2,
                                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,

                                        propsForDots: {
                                            r: "6",
                                            strokeWidth: "2",
                                        }
                                    }}
                                />

                            </ScrollView>
                        </ScrollView>
                    }

                </ScrollView>
            </SafeAreaView >
        );
    }

}



const mapStateToProps = ({ GraphReducer }) =>
{

    const { data, isLoadingOverview } = GraphReducer;

    return { data, isLoadingOverview };

};

const mapStateToPropsAction = {
    clearGraphData,
    apiGetGraphOverview
};


const styles = StyleSheet.create({

    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    item: {
        // display: 'flex',
        width: "100%",
        flexDirection: "column",
        alignItems: "center",
        borderRadius: 10, padding: "5%",
        marginTop: "5%",
        backgroundColor: 'rgba(236, 236, 236, .8)',
    },
    buttonContainer: {
        display: 'flex',
        flexDirection: "row",
        margin: "2%",
        alignItems: 'center',
    },
    title: {
        width: "60%",
        justifyContent: 'center',
        alignItems: 'flex-start',
        display: 'flex',
        paddingLeft: 0,
    },
    rightButton: {
        width: "20%",
        alignItems: 'flex-end',
        justifyContent: 'center',
        display: 'flex'
    }

});

export default connect(mapStateToProps, mapStateToPropsAction)(MainGraphsScreen);
