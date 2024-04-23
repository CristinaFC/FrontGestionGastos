
import React, { Component } from 'react';
import { ImageBackground, SafeAreaView, StyleSheet, View, ActivityIndicator } from 'react-native';
import * as Color from '../../assets/styles/Colors';
import { Views } from '../../assets/styles/Views';
import Header from '../../components/Header';
import { localAssets } from '../../assets/images/assets';
import { FlatList } from 'react-native-gesture-handler';
import { apiGetIncomes, setIncomeDataState, apiDeleteIncome, apiGetIncomesByCategory, apiGetRecentIncomes } from '../../modules/Income/IncomeActions';
import { connect } from 'react-redux';
import { Item } from '../../components/Item';
import { Dropdown } from 'react-native-element-dropdown';
import Routing from '../../navigation/Routing';
import * as RootRouting from '../../navigation/RootRouting'
import { Inputs } from '../../assets/styles/Inputs';
import DateSelectorModal from '../../components/Modals/DateSelectorModal';
import { Dropdown as DropdownStyle } from '../../assets/styles/Dropdown';
import { Filters } from '../Expenses/constants';
import { apiGetCategoriesByType } from '../../modules/Category/CategoryActions'
import { createCategoriesEnum } from '../../utils/validators/CategoryUtils';



class HistoryIncomesScreen extends Component
{

    constructor(props)
    {
        super(props);
        this.state = {
            filter: null,
            category: null,
            categories: [],
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
            modal: false,
        }
    }

    async _getData()
    {
        await this.props.apiGetIncomes(this.state.month, this.state.year)
        await this.props.apiGetCategoriesByType("Incomes")
        this.setState({ categories: createCategoriesEnum(this.props.categories) })
    }

    componentDidMount() { this._getData() }

    async _handleChange(name, value) { this.setState({ [name]: value }) }

    _handleModal() { this.setState({ modal: !this.state.modal }); }

    async _getIncomes() { await this.props.apiGetIncomes(this.state.month, this.state.year) }

    async _getIncomesByCategory()
    {
        await this.props.apiGetIncomesByCategory(this.state.category, this.state.month, this.state.year)
    }

    async _getIncomesByDate()
    {
        this.state.category != null ? await this._getIncomesByCategory() : await this._getIncomes();
        if (this.state.filter != null) await this.sortFunc();
        this._handleModal();
    }

    async _handleChangeOrderBy(name, value)
    {
        await this._handleChange(name, value)
        if (value == "reset") await this._handleReset(name)
        await this.sortFunc()
    }

    async _handleReset(name)
    {
        await this._getIncomes()
        if (name == "category") await this.sortFunc()
        this.setState({ [name]: null })
    }

    async _handleChangeCategory(name, value)
    {
        await this._handleChange(name, value);
        if (value == "reset") this._handleReset(name)
        else { await this._getIncomesByCategory(); await this.sortFunc() }
    }

    async sortFunc()
    {
        const { filter } = this.state
        const { incomes } = this.props

        let copy
        if (filter != null)
        {
            if (filter === Filters.TITLE.value)
                copy = incomes?.map(obj => { return { ...obj, concept: obj.concept } }).sort((a, b) => a.concept.localeCompare(b.concept))
            else if (filter === Filters.ACCOUNT.value)
                copy = incomes?.map(obj => { return { ...obj, account: obj.account } }).sort((a, b) => a.account.name.localeCompare(b.account.name))
            else if (filter === Filters.AMOUNT_ASC.value)
                copy = incomes?.map(obj => { return { ...obj, amount: Number(obj.amount) } }).sort((a, b) => a.amount - b.amount)
            else if (filter === Filters.AMOUNT_DESC.value)
                copy = incomes?.map(obj => { return { ...obj, amount: Number(obj.amount) } }).sort((a, b) => b.amount - a.amount)
            else if (filter === Filters.DATE_ASC.value)
                copy = incomes?.map(obj => { return { ...obj, date: new Date(obj.date) } })
                    .sort((a, b) => Number(a.date) - Number(b.date))
            else if (filter === Filters.DATE_DESC.value)
                copy = incomes?.map(obj => { return { ...obj, date: new Date(obj.date) } })
                    .sort((a, b) => Number(b.date) - Number(a.date))
            else if (filter === Filters.RESET.value)
                this.setState({ filter: null })

            await this.props.setIncomeDataState({ prop: 'incomes', value: copy })
        }
    }

    render()
    {
        const { isLoadingIncomes, incomes, isLoadingCategories } = this.props;
        const { filter, category, categories, month, year, modal } = this.state
        console.log(incomes)
        return (
            <SafeAreaView style={Views.container}>
                <Header goBack={true} title="Historial de ingresos" reloadData={() => this.props.apiGetRecentIncomes(7)} />
                <ImageBackground source={localAssets.background} resizeMode="cover" style={Views.imageHeaderWithFilters} blurRadius={40}>
                    <DateSelectorModal
                        modal={modal}
                        onOpenModal={() => this._handleModal()}
                        onClose={() => this.setState({ modal: false })}
                        month={month}
                        year={year}
                        onChangeMonth={(item) => this._handleChange('month', item.value)}
                        onChangeYear={(item) => this._handleChange('year', item.value)}
                        onSubmit={() => this._getIncomesByDate()}
                    />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
                        <Dropdown
                            style={DropdownStyle.dropdown}
                            data={Object.values(categories)}
                            value={category}
                            labelField="label"
                            valueField="value"
                            selectedTextStyle={DropdownStyle.selectedTextStyle}
                            placeholderStyle={DropdownStyle.placeholderStyle}
                            maxHeight={300}
                            iconColor={Color.white}
                            placeholder="Filtrar"
                            onChange={(item) => this._handleChangeCategory('category', item.value)}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>

                        <Dropdown
                            style={DropdownStyle.dropdown}
                            data={Object.values(Filters)}
                            value={filter}
                            labelField="label"
                            valueField="value"
                            selectedTextStyle={DropdownStyle.selectedTextStyle}
                            placeholderStyle={DropdownStyle.placeholderStyle}
                            maxHeight={300}
                            iconColor={Color.white}
                            placeholder="Ordenar por..."
                            onChange={item =>
                            {
                                this._handleChangeOrderBy('filter', item.value)
                            }}
                        />

                    </View>
                </ImageBackground>
                {isLoadingIncomes
                    ? <ActivityIndicator />
                    :
                    <View style={styles.content}>

                        {incomes !== undefined ?
                            <FlatList
                                contentContainerStyle={{ alignItems: 'center' }}
                                data={incomes}
                                renderItem={({ item }) =>
                                    <Item
                                        type="Income"
                                        item={item}
                                        action={() =>
                                            RootRouting.navigate(Routing.detailsIncome, { id: item.uid })}
                                        deleteAction={() => this.props.apiDeleteIncome(item.uid)} />
                                }
                            />
                            : null}
                    </View>
                }
            </SafeAreaView >
        );
    }
}




const mapStateToProps = ({ IncomeReducer, CategoryReducer }) =>
{

    const { incomes, isLoadingIncomes } = IncomeReducer;
    const { categories, isLoadingCategories } = CategoryReducer;

    return { incomes, isLoadingIncomes, categories, isLoadingCategories };

};

const mapStateToPropsAction = {
    apiGetIncomes,
    apiGetCategoriesByType,
    apiGetIncomesByCategory,
    setIncomeDataState,
    apiDeleteIncome,
    apiGetRecentIncomes,
    setIncomeDataState
};


const styles = StyleSheet.create({

    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flex: 1
    },
    dropdown: {
        padding: 5,
        width: 230,
        alignSelf: 'flex-end',
        marginRight: "5%",
        height: 40,
        borderColor: Color.white,
        borderWidth: 1,
        marginTop: "2%",
        backgroundColor: 'rgba(236, 236, 236, .8)',
        borderRadius: 10
    },
    placeholderStyle: {
        fontSize: 14,
    },
    selectedTextStyle: {
        fontSize: 16,
        color: Color.firstText
    },



});

export default connect(mapStateToProps, mapStateToPropsAction)(HistoryIncomesScreen);
