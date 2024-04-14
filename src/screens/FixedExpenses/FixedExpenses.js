
import React, { Component } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
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
import { Periods } from '../Expenses/constants';
import { HorizontalLine } from '../../components/HorizontalLine';
import { localAssets } from '../../assets/images/assets';
import { Item } from '../../components/Item';

class FixedExpensesScreen extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            isActiveExpanded: false,
            isEndendExpanded: false,
        }
    }

    componentDidMount()
    {
        this._getData()
    }

    _getData() { this.props.apiGetFixedExpenses() }

    componentWillUnmount() { this.props.clearFixedExpenseData() }

    render()
    {
        const { fixedExpenses, isLoadingFixedExpenses } = this.props;
        console.log(this.props)
        const { isActiveExpanded, isEndendExpanded } = this.state
        const endFixedExpenses = []
        fixedExpenses?.map((expense) =>
        {
            if (expense.status === 0) endFixedExpenses.push(expense)
        })


        return (
            <SafeAreaView style={Views.container}>
                <ImageBackground source={localAssets.background} resizeMode="cover" style={Views.imageHeader} blurRadius={40}>
                    <MenuButton title="Añadir"
                        style={Buttons.fullWithButton}
                        stylePressed={Buttons.pressedFullWithButton}
                        onPress={() => RootRouting.navigate(Routing.addFixedExpense)} />
                </ImageBackground>

                {isLoadingFixedExpenses ? <ActivityIndicator /> :
                    <SafeAreaView style={styles.safeContainer}>
                        <ScrollView contentContainerStyle={styles.scrollview} stickyHeaderIndices={[2]}>
                            <View style={styles.content}>
                                <Collapse onToggle={(isExpanded) => this.setState({ isActiveExpanded: isExpanded })}>
                                    <CollapseHeader
                                        style={Views.collapseHeader}>
                                        <CollapseHeaderTitle name="Activos" expanded={isActiveExpanded} />
                                    </CollapseHeader>

                                    <CollapseBody style={{ paddingBottom: 30 }}>
                                        {fixedExpenses?.length > 0
                                            ? fixedExpenses.map((data, index) => (

                                                data.status === 1 ?
                                                    <CollapseBodyData key={index} data={data}
                                                        onPress={
                                                            () => RootRouting.navigate(Routing.editFixedExpense, { id: data.uid })
                                                        }
                                                    />

                                                    : null
                                            ))
                                            : <Text style={Views.collapseBodyNoData}>No hay gastos fijos activos</Text>}

                                    </CollapseBody>
                                </Collapse>
                            </View>
                            {/* </ScrollView> */}

                            {/* <ScrollView contentContainerStyle={styles.scrollview}> */}
                            <View style={styles.content}>
                                <Collapse onToggle={(isExpanded) => this.setState({ isEndendExpanded: isExpanded })}>
                                    <CollapseHeader style={Views.collapseHeader}>
                                        <CollapseHeaderTitle name="Finalizados" expanded={isEndendExpanded} />
                                    </CollapseHeader>
                                    <CollapseBody style={{ paddingBottom: 30 }}>
                                        {endFixedExpenses?.length > 0
                                            ? endFixedExpenses.map((data, index) => (

                                                data.status == 0 ?
                                                    < CollapseBodyData key={index} data={data}
                                                        onPress={
                                                            () => RootRouting.navigate(Routing.editFixedExpense, { id: data.uid })
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
const CollapseHeaderTitle = ({ name, expanded }) => (
    <View style={Views.collapseHeaderView} >
        <Text style={Views.collapseHeaderText}>{name}</Text>
        {expanded ? <MaterialCommunityIcons name="chevron-down" size={30} color={Color.white} /> : <MaterialCommunityIcons name="chevron-right" size={30} color={Color.white} />}

    </View>
)

const formatDate = (date) => new Date(date).toLocaleDateString('es-ES');
const CollapseBodyData = (props) =>
{

    const { data, onPress } = props
    let { amount, category, initDate, nextInsertion, concept, period, lastInsertion } = data

    amount = toTwoDecimals(amount).replace('.', ',')
    return (

        <TouchableOpacity style={styles.item}>
            <View style={styles.rowContainer}>
                <View style={styles.iconContainer} >
                    <MaterialCommunityIcons name={category.icon} size={20} color={Color.button} />
                </View>
                <Text style={{ ...textStyles, width: "60%" }}>{concept}</Text>
                <Text style={{ ...textStyles, width: "30%", fontWeight: 'bold', textAlign: 'right' }}>
                    {amount}€
                </Text>
            </View>

            <View style={styles.rowContainer}>

                <Text style={{ ...smallTextStyles, width: "50%", textAlign: 'left' }}>
                    Últ: {lastInsertion ? formatDate(lastInsertion) : null}
                </Text>
                <Text style={{ ...smallTextStyles, width: "50%", textAlign: 'right' }}>
                    Próx: {nextInsertion ? formatDate(nextInsertion) : null}
                </Text>
            </View>
            <View style={styles.rowContainer}>
                <Text style={{ ...smallTextStyles, width: "50%", textAlign: 'left' }}>
                    Periodo: <Text style={{ fontWeight: 'bold' }}>{Periods.find(item => item.value === period).name}</Text>
                </Text>
                <Text style={{ ...smallTextStyles, width: "50%", textAlign: 'right' }}>
                    Fecha de creación: {formatDate(initDate)}
                </Text>

            </View>
        </TouchableOpacity>
        // <TouchableOpacity style={Views.collapseBodyView} onPress={onPress}>
        //     <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: "100%", alignItems: 'flex-end' }}>
        //         <MaterialCommunityIcons name={category.icon} size={30} color={Color.firstText} />
        //         <Text style={[Views.collapseBodyText, Views.collapseBodyTextCategory, { textAlign: 'left', marginLeft: 15 }]}>{category.name}</Text>
        //         <Text style={[Views.collapseBodyText, { textAlign: 'center', }]}>{amount}€</Text>
        //     </View>
        //     <HorizontalLine />
        //     <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: "100%", marginTop: 10 }}>
        //         <Text style={[Views.collapseBodyText, { textAlign: 'center', }]}>Periodo: {periods.find(item => item.value === period).name}</Text>
        //     </View>
        //     <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: "90%", marginTop: 10 }}>
        //         <Text style={[Views.collapseBodyText, { fontSize: 12, width: "100%", padding: 5, borderWidth: 1, borderRadius: 5, borderColor: Color.button }]}>Descripción: {concept.slice(0, 50)}</Text>
        //     </View>
        //     <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: "100%", marginTop: 10 }}>
        //         <Text style={[Views.collapseBodyText, { textAlign: 'center', }]}>Últ.: {lastInsertion ? new Date(lastInsertion).toLocaleDateString() : null}</Text>
        //         <Text style={[Views.collapseBodyText, { textAlign: 'center', }]}>Próx: {nextInsertion ? new Date(nextInsertion).toLocaleDateString() : null}</Text>
        //     </View>

        //     <HorizontalLine />
        //     <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: "100%", marginTop: 5 }}>
        //         <Text styles={Texts.text}>Fecha de creación: {new Date(data.createdAt).toLocaleDateString('es-ES')}</Text>
        //     </View>
        // </TouchableOpacity>


    )
}
const textStyles = {
    fontSize: 16,
    color: Color.firstText,
    textAlignVertical: 'center',
};

const smallTextStyles = {
    fontSize: 12,
    color: Color.firstText,
    textAlignVertical: 'center',
};
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
        width: "100%",
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
        backgroundColor: Color.headerBackground,
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
    },
    item: {
        width: "100%",
        flexDirection: "column",
        alignItems: "center",
        borderRadius: 0,
        padding: "5%",
        borderBottomWidth: 1,
        backgroundColor: Color.white,
    },
    rowContainer: {
        flexDirection: 'row',
        width: "100%",
    },
    iconContainer: {
        width: "10%",
        justifyContent: 'center',
        alignItems: 'center',
        alignItems: 'flex-start',
    },

});

export default connect(mapStateToProps, mapStateToPropsAction)(FixedExpensesScreen);