
import React, { Component } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View, TouchableOpacity, ImageBackground, FlatList } from 'react-native';
import { MenuButton } from '../../components/MenuButton';
import * as RootRouting from '../../navigation/RootRouting'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Color from '../../assets/styles/Colors'
import Collapsible from 'react-native-collapsible';
import { Views } from '../../assets/styles/Views';
import Routing from '../../navigation/Routing';
import { apiGetFixedExpenses, clearFixedExpenseData } from '../../modules/FixedExpenses/FixedExpenseActions';
import { connect } from 'react-redux';
import { Buttons } from '../../assets/styles/Buttons';
import { Style } from '../../assets/styles/Style';
import { Periods } from '../Expenses/constants';
import { localAssets } from '../../assets/images/assets';

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
                        <View contentContainerStyle={styles.scrollview} stickyHeaderIndices={[2]}>
                            <TouchableOpacity style={Views.collapseHeaderView} onPress={() => this.setState({ isActiveExpanded: !this.state.isActiveExpanded })}>
                                <Text style={Views.collapseHeaderText}>Activos</Text>
                                {!isActiveExpanded ? <MaterialCommunityIcons name="chevron-down" size={30} color={Color.white} /> : <MaterialCommunityIcons name="chevron-right" size={30} color={Color.white} />}
                            </TouchableOpacity>

                            <Collapsible collapsed={isActiveExpanded}>
                                <FlatList
                                    data={fixedExpenses}
                                    renderItem={({ item }) =>
                                    {
                                        if (item.status === 1) <FixedExpenseItem data={item}
                                            onPress={() => RootRouting.navigate(Routing.editFixedExpense, { id: item.uid })} />
                                    }}
                                    keyExtractor={(item, index) => index.toString()}
                                />
                            </Collapsible>
                            <TouchableOpacity style={Views.collapseHeaderView} onPress={() => this.setState({ isEndendExpanded: !this.state.isEndendExpanded })}>
                                <Text style={Views.collapseHeaderText}>Finalizados</Text>
                                {!isEndendExpanded ? <MaterialCommunityIcons name="chevron-down" size={30} color={Color.white} /> : <MaterialCommunityIcons name="chevron-right" size={30} color={Color.white} />}
                            </TouchableOpacity>
                            <Collapsible collapsed={isEndendExpanded}>
                                <FlatList
                                    data={endFixedExpenses}
                                    renderItem={({ item }) =>
                                        <FixedExpenseItem data={item}
                                            onPress={() => RootRouting.navigate(Routing.editFixedExpense, { id: item.uid })} />}
                                    keyExtractor={(item, index) => index.toString()}
                                />
                            </Collapsible>
                        </View>
                    </SafeAreaView>

                }
            </SafeAreaView >
        );
    }

}

const formatDate = (date) => new Date(date).toLocaleDateString('es-ES');

const FixedExpenseItem = ({ data, onPress, collapse }) =>
{
    const { amount, category, concept, initDate, nextInsertion, period, lastInsertion } = data;

    return (
        <View>
            <TouchableOpacity style={styles.item} onPress={onPress}>
                <View style={styles.rowContainer}>
                    <View style={styles.iconContainer} >
                        <MaterialCommunityIcons name={category.icon} size={20} color={Color.button} />
                    </View>
                    <Text style={[styles.textStyles, { width: "60%" }]}>{concept}</Text>
                    <Text style={[styles.textStyles, { width: "30%", fontWeight: 'bold', textAlign: 'right' }]}>
                        {amount}€
                    </Text>
                </View>

                <View style={styles.rowContainer}>

                    <Text style={[styles.smallTextStyles, { width: "50%", textAlign: 'left' }]}>
                        Últ: {lastInsertion ? formatDate(lastInsertion) : null}
                    </Text>
                    <Text style={[styles.smallTextStyles, { width: "50%", textAlign: 'right' }]}>
                        Próx: {nextInsertion ? formatDate(nextInsertion) : null}
                    </Text>
                </View>
                <View style={styles.rowContainer}>
                    <Text style={[styles.smallTextStyles, { width: "50%", textAlign: 'left' }]}>
                        Periodo: <Text style={{ fontWeight: 'bold' }}>{Periods.find(item => item.value === period).name}</Text>
                    </Text>
                    <Text style={[styles.smallTextStyles, { width: "50%", textAlign: 'right' }]}>
                        Fecha de creación: {formatDate(initDate)}
                    </Text>

                </View>
            </TouchableOpacity>
        </View>
    );
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
    textStyles: {
        fontSize: 16,
        color: Color.firstText,
        textAlignVertical: 'center',
    },

    smallTextStyles: {
        fontSize: 12,
        color: Color.firstText,
        textAlignVertical: 'center',
    },

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