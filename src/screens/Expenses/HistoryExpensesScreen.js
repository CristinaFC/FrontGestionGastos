
import React, { Component } from 'react';
import { ImageBackground, SafeAreaView, StyleSheet, View, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import * as Color from '../../assets/styles/Colors';
import { Views } from '../../assets/styles/Views';
import Header from '../../components/Header';
import { localAssets } from '../../assets/images/assets';
import { FlatList } from 'react-native-gesture-handler';
import { apiGetExpenses, setExpenseDataState, apiGetExpensesByCategory, apiDeleteExpense } from '../../modules/Expense/ExpenseActions';
import { connect } from 'react-redux';
import { Item } from '../../components/Item';
import { Dropdown } from 'react-native-element-dropdown';
import Routing from '../../navigation/Routing';
import * as RootRouting from '../../navigation/RootRouting'
import { apiGetCategoriesByType } from '../../modules/Category/CategoryActions'
import { filters } from './constants';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { MenuButton } from '../../components/MenuButton';
import { Style } from '../../assets/styles/Style';
import { Texts } from '../../assets/styles/Texts';
import { Inputs } from '../../assets/styles/Inputs';
import { Months } from '../Graphs/constants';
import DateDropDown from '../../components/DateDropDown';

class HistoryExpensesScreen extends Component
{

    constructor(props)
    {
        super(props);
        this.state = {
            filter: '',
            category: '',
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear()
        }
    }

    _getData()
    {
        this.props.apiGetExpenses(this.state.month, this.state.year);
        this.props.apiGetCategoriesByType("Expenses")
    }

    componentDidMount()
    {
        this._getData()
    }

    async _handleChange(name, value)
    {
        this.setState({ [name]: value }, async () =>
        {
            if (name === "month" && this.state.filter != "Todos")
                await this.props.apiGetExpenses(this.state.month, this.state.year);
            else if (name === "category")
                this.props.apiGetExpensesByCategory(this.state.category.uid, this.state.month, this.state.year)
        })
    }

    async _handleChangeOrderBy(name, value) 
    {
        await this._handleChange(name, value);
        this.sortFunc()
    }

    _handleChangeCategory(name, value)
    {
        this._handleChange(name, value);
        if (value === "Todos") this.props.apiGetExpenses()
        else this.props.apiGetExpensesByCategory(value.uid, this.state.month, this.state.year)

    }

    async sortFunc()
    {
        const { filter } = this.state
        const { expenses } = this.props
        let copy
        switch (filter.value)
        {
            case 0:
                copy = expenses.map(obj => { return { ...obj, amount: Number(obj.amount) } }).sort((a, b) => a.amount - b.amount)
                break;
            case 1:
                copy = expenses.map(obj => { return { ...obj, amount: Number(obj.amount) } }).sort((a, b) => b.amount - a.amount)
                break;
            case 2:
                copy = expenses.map(obj => { return { ...obj, date: new Date(obj.date) } })
                    .sort((a, b) => Number(a.date) - Number(b.date))
                break;
            case 3:
                copy = expenses.map(obj => { return { ...obj, date: new Date(obj.date) } })
                    .sort((a, b) => Number(b.date) - Number(a.date))
                break;
        }

        this.props.setExpenseDataState({ prop: 'expenses', value: copy })
    }

    render()
    {
        const { isLoadingExpenses, expenses, categories, isLoadingCategories } = this.props;
        const { filter, category, month, year } = this.state

        if (isLoadingExpenses || isLoadingCategories) return <ActivityIndicator />
        return (
            <SafeAreaView style={styles.container}>
                <Header goBack={true} title="Historial de gastos" />
                <ImageBackground source={localAssets.background} resizeMode="cover" style={Views.image} blurRadius={40}>
                    <View style={styles.container}>
                        <View style={{ flexDirection: 'column', width: '93%', justifyContent: 'center', alignItems: 'center' }}>
                            <DateDropDown
                                month={month}
                                year={year}
                                onChangeMonth={(item) => this._handleChange('month', item.value)}
                                onChangeYear={(item) => this._handleChange('year', item.value)} />
                            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                                <Dropdown
                                    style={styles.dropdown}
                                    data={categories}
                                    value={category}
                                    labelField="name"
                                    valueField="name"
                                    selectedTextStyle={styles.selectedTextStyle}
                                    inputSearchStyle={styles.inputSearchStyle}
                                    maxHeight={300}
                                    placeholder="Filtrar"
                                    onChange={item =>
                                    {
                                        this._handleChangeCategory('category', item)
                                    }}
                                />
                                <Dropdown
                                    style={styles.dropdown}
                                    data={filters}
                                    value={filter}
                                    labelField="name"
                                    valueField="value"
                                    selectedTextStyle={styles.selectedTextStyle}
                                    inputSearchStyle={styles.inputSearchStyle}
                                    maxHeight={300}
                                    placeholder="Ordenar por..."
                                    onChange={item =>
                                    {
                                        this._handleChangeOrderBy('filter', item)
                                    }}
                                />
                            </View>

                        </View>
                        {category ?
                            <View style={{ width: "80%", flexDirection: 'row', marginTop: 15, borderBottomWidth: 1, borderColor: Color.white, marginBottom: 10 }}>
                                <Text style={[Texts.titleText, { width: "50%", textAlign: 'left' }]}>{category.name}</Text>
                                <TouchableOpacity style={{ alignItems: 'flex-end', borderColor: Color.white, width: "50%" }}
                                    onPress={() => { this.setState({ category: '', filter: '' }), this._getData() }}>
                                    <MaterialCommunityIcons name="close" size={25} color={Color.white} />
                                </TouchableOpacity>

                            </View> : null}

                        {expenses ?
                            <FlatList
                                contentContainerStyle={{ alignItems: 'center' }}
                                data={expenses}
                                renderItem={({ item }) =>
                                    <Item item={item}
                                        action={() => RootRouting.navigate(Routing.detailsExpense, { id: item.uid })}
                                        deleteAction={() => this.props.apiDeleteExpense(item.uid)} />
                                }
                            />
                            : null}
                    </View>
                </ImageBackground>
            </SafeAreaView >
        );
    }
}


const mapStateToProps = ({ ExpenseReducer, CategoryReducer }) =>
{

    const { expenses, isLoadingExpenses } = ExpenseReducer;
    const { categories, isLoadingCategories } = CategoryReducer;

    return { expenses, isLoadingExpenses, categories, isLoadingCategories };

};

const mapStateToPropsAction = {
    apiGetCategoriesByType,
    apiGetExpensesByCategory,
    apiGetExpenses,
    setExpenseDataState,
    apiDeleteExpense
};


const styles = StyleSheet.create({

    container: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },

    dropdown: {
        padding: 5,
        width: 160,
        alignSelf: 'center',
        height: 40,
        borderColor: Color.white,
        borderWidth: 1,
        marginTop: "2%",
        backgroundColor: 'rgba(236, 236, 236, .8)',
        borderRadius: 10,
        marginHorizontal: "3%",
    },
    placeholderStyle: {
        fontSize: 14,
    },
    selectedTextStyle: {
        fontSize: 16,
        color: Color.firstText
    },
});

export default connect(mapStateToProps, mapStateToPropsAction)(HistoryExpensesScreen);
