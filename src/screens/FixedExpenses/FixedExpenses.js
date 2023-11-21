
import React, { Component } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { MenuButton } from '../../components/MenuButton';
import * as RootRouting from '../../navigation/RootRouting'
import { Collapse, CollapseHeader, CollapseBody } from 'accordion-collapse-react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Color from '../../assets/styles/Colors'

import { Views } from '../../assets/styles/Views';
import Routing from '../../navigation/Routing';
import { apiGetFixedExpenses, clearFixedExpenseData } from '../../modules/FixedExpenses/FixedExpenseActions';
import { connect } from 'react-redux';
import { Buttons } from '../../assets/styles/Buttons';
import { Texts } from '../../assets/styles/Texts';
import { toTwoDecimals } from '../../services/api/Helpers';
import { Style } from '../../assets/styles/Style';
class FixedExpensesScreen extends Component
{

    constructor(props) { super(props); }

    componentDidMount()
    {
        this._getData()
    }

    _getData() { this.props.apiGetFixedExpenses() }

    componentWillUnmount() { this.props.clearFixedExpenseData() }

    render()
    {
        const { fixedExpenses, isLoadingFixedExpenses } = this.props;

        const endFixedExpenses = []
        fixedExpenses?.map((expense) =>
        {
            if (!expense.active) endFixedExpenses.push(expense)
        })
        return (
            <SafeAreaView style={Views.container}>

                <View style={styles.button}>
                    <MenuButton title="Añadir"
                        style={Buttons.fullWithButton}
                        stylePressed={Buttons.pressedFullWithButton}
                        onPress={() => RootRouting.navigate(Routing.addFixedExpense)} />

                </View>

                {isLoadingFixedExpenses ? <ActivityIndicator /> :
                    <SafeAreaView style={styles.safeContainer}>
                        <ScrollView contentContainerStyle={styles.scrollview}>
                            <View style={styles.content}>
                                <Collapse>
                                    <CollapseHeader style={Views.collapseHeader}>
                                        <CollapseHeaderTitle name="Activos" />
                                    </CollapseHeader>
                                    <CollapseBody style={{ paddingBottom: 30 }}>
                                        {fixedExpenses?.length > 0
                                            ? fixedExpenses.map((data, index) => (

                                                data.active ?
                                                    <CollapseBodyData key={index} data={data}
                                                        onPress={
                                                            () => RootRouting.navigate(Routing.detailsIncome, { id: data.uid })
                                                        }
                                                    />

                                                    : null
                                            ))
                                            : <Text style={Views.collapseBodyNoData}>No hay gastos fijos activos</Text>}

                                    </CollapseBody>
                                </Collapse>
                            </View>
                        </ScrollView>

                        <ScrollView contentContainerStyle={styles.scrollview}>
                            <View style={styles.content}>
                                <Collapse>
                                    <CollapseHeader style={Views.collapseHeader}>
                                        <CollapseHeaderTitle name="Finalizados" />
                                    </CollapseHeader>
                                    <CollapseBody style={{ paddingBottom: 30 }}>
                                        {endFixedExpenses?.length > 0
                                            ? endFixedExpenses.map((data, index) => (

                                                !data.active ?
                                                    <CollapseBodyData key={index} data={data}
                                                        onPress={
                                                            () => RootRouting.navigate(Routing.detailsIncome, { id: data.uid })
                                                        }
                                                    /> : null
                                            ))
                                            : <Text style={Views.collapseBodyNoData}>No hay gastos fijos finalizados</Text>}
                                    </CollapseBody>
                                </Collapse>
                            </View>
                        </ScrollView>
                    </SafeAreaView>

                }


            </SafeAreaView >
        );
    }

}
const CollapseHeaderTitle = ({ name }) => (
    <View style={Views.collapseHeaderView} >
        <Text style={Views.collapseHeaderText}>{name}</Text>
        <MaterialCommunityIcons name="chevron-down" size={30} color={Color.headerBackground} />
    </View>
)


const CollapseBodyData = (props) =>
{

    const { data, onPress } = props
    let { amount, category, date, nextInsertion, description } = data
    amount = toTwoDecimals(amount).replace('.', ',')
    return (
        <TouchableOpacity style={Views.collapseBodyView} onPress={onPress}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: "100%", alignItems: 'flex-end' }}>
                <MaterialCommunityIcons name={category.icon} size={30} color={Color.firstText} />
                <Text style={[Views.collapseBodyText, Views.collapseBodyTextCategory, { textAlign: 'left', marginLeft: 15 }]}>{category.name}</Text>
                <Text style={[Views.collapseBodyText, { textAlign: 'center', }]}>{amount}€</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: "100%" }}>
                {nextInsertion ? <Text style={Views.collapseBodyText}>Próx: {new Date(nextInsertion).toLocaleDateString()}</Text> : null}
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: "100%" }}>
                <Text style={Views.collapseBodyText}>{description.slice(0, 10)}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: "100%" }}>
                <Text styles={Texts.text}>Fecha de Incio: {new Date(date).toLocaleDateString()}</Text>
            </View>
        </TouchableOpacity>


    )
}

const mapStateToProps = ({ FixedExpenseReducer }) =>
{

    const { fixedExpenses, isLoadingFixedExpenses, } = FixedExpenseReducer;

    return { fixedExpenses, isLoadingFixedExpenses, };

};

const mapStateToPropsAction = {
    apiGetFixedExpenses,
    clearFixedExpenseData
};


const styles = StyleSheet.create({

    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        flex: 0.1,
        width: "90%",
        height: "7%",
        justifyContent: 'center',
        alignContent: 'center',
        marginVertical: 15,
    },
    body: {
        flex: 0.9, width: "90%", justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        backgroundColor: 'rgba(236, 236, 236, .4)',
        width: "90%",
        display: 'flex',
    },
    collapseBodyView: {
        height: 50,
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 5,
        marginHorizontal: 5,
        alignItems: 'center',
        backgroundColor: Color.bodyBackground,
        paddingHorizontal: 30
    },
    scrollview: {
        width: Style.DEVICE_WIDTH,
        flexDirection: 'column',
        alignItems: 'center',
        display: 'flex',
    },
    safeContainer: {
        width: Style.DEVICE_WIDTH,
        flex: 1,
        marginBottom: 10,
        marginTop: "5%",
    },

});

export default connect(mapStateToProps, mapStateToPropsAction)(FixedExpensesScreen);