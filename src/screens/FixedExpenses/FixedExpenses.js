
import React, { Component } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View, TouchableOpacity, ImageBackground, TextInput } from 'react-native';
import { MenuButton } from '../../components/MenuButton';
import * as RootRouting from '../../navigation/RootRouting'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Color from '../../assets/styles/Colors'
import { Views } from '../../assets/styles/Views';
import Routing from '../../navigation/Routing';
import { apiGetFixedExpenses, clearFixedExpenseData } from '../../modules/FixedExpenses/FixedExpenseActions';
import { connect } from 'react-redux';
import { Buttons } from '../../assets/styles/Buttons';
import { Style } from '../../assets/styles/Style';
import { Periods } from '../Expenses/constants';
import { localAssets } from '../../assets/images/assets';
import { formatCurrency, formatDate } from '../../services/api/Helpers';
import { ScrollView } from 'react-native-gesture-handler';

class FixedExpensesScreen extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            isActiveCollapsed: true,
            isEndendCollapsed: true,
            name: '',
            filteredExpenses: []
        }
    }

    componentDidMount()
    {
        this._getData()
    }

    async _getData()
    {
        await this.props.apiGetFixedExpenses()
        this.setState({ filteredExpenses: this.props.fixedExpenses })
    }

    componentDidUpdate(prevProps)
    {
        if (prevProps.fixedExpenses !== this.props.fixedExpenses)
        {
            this.setState({ filteredExpenses: this.props.fixedExpenses });
        }
    }

    _findFixedExpense(value)
    {
        let filteredExpenses;
        let valueLower = value.toLowerCase();

        if (value === '') filteredExpenses = this.props.fixedExpenses

        else filteredExpenses = this.props.fixedExpenses.filter(expense => expense.concept.toLowerCase().includes(valueLower));

        this.setState({ name: value, filteredExpenses })
    }

    _handleChange(name)
    {
        this.setState({ [name]: !this.state[name] });
    }


    render()
    {
        const { isLoadingFixedExpenses } = this.props;
        const { isActiveCollapsed, isEndendCollapsed, name, filteredExpenses } = this.state

        return (
            <SafeAreaView style={Views.container} >
                <ImageBackground source={localAssets.background} resizeMode="cover" style={Views.imageHeader} blurRadius={40}>
                    <View style={Views.menuHeaderView}>
                        <MenuButton title="Añadir" onPress={() => RootRouting.navigate(Routing.addFixedExpense)} />
                        <TextInput
                            style={[Buttons.homeButton, { fontSize: Style.FONT_SIZE_SMALL, }]}
                            onChangeText={(value) => this._findFixedExpense(value)}
                            value={name}
                            placeholder='Buscar...'
                        />
                    </View>

                </ImageBackground>

                {isLoadingFixedExpenses ? <ActivityIndicator /> :
                    <View style={styles.scrollview}>
                        <TouchableOpacity style={Views.collapseHeaderView} onPress={() => this._handleChange("isActiveCollapsed")} >
                            <Text style={Views.collapseHeaderText}>Activos</Text>
                            {!isActiveCollapsed ? <MaterialCommunityIcons name="chevron-down" size={30} color={Color.white} /> : <MaterialCommunityIcons name="chevron-right" size={30} color={Color.white} />}
                        </TouchableOpacity>

                        {!isActiveCollapsed && (
                            <ScrollView style={styles.listContainer} >
                                {filteredExpenses.map(item => (
                                    item.status === 1 && <FixedExpenseItem key={item.uid} data={item} onPress={() => RootRouting.navigate(Routing.editFixedExpense, { id: item.uid })} />
                                ))}
                            </ScrollView>
                        )}
                        <TouchableOpacity style={Views.collapseHeaderView} onPress={() => this._handleChange("isEndendCollapsed")}>
                            <Text style={Views.collapseHeaderText}>Finalizados</Text>
                            {!isEndendCollapsed ? <MaterialCommunityIcons name="chevron-down" size={30} color={Color.white} /> : <MaterialCommunityIcons name="chevron-right" size={30} color={Color.white} />}
                        </TouchableOpacity>
                        {!isEndendCollapsed && (
                            <ScrollView style={styles.listContainer} >
                                {filteredExpenses.map(item => (
                                    item.status === 0 && <FixedExpenseItem key={item.uid} data={item} onPress={() => RootRouting.navigate(Routing.editFixedExpense, { id: item.uid })} />
                                ))}
                            </ScrollView>
                        )}
                    </View>
                }
            </SafeAreaView >
        );
    }

}


const FixedExpenseItem = ({ data, onPress }) =>
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
                        {formatCurrency(amount)}€
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
    scrollview: {
        width: Style.DEVICE_WIDTH,
        flexDirection: 'column',
        alignItems: 'center',
        flex: 1,
        marginBottom: 20
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
    listContainer: {
        // height: Style.DEVICE_FORTY_FIVE_PERCENT_HEIGHT,
        flexGrow: 0
    },

});

export default connect(mapStateToProps, mapStateToPropsAction)(FixedExpensesScreen);