
import React, { Component } from 'react';
import
{
    SafeAreaView, View, ActivityIndicator, ImageBackground, Text, TouchableOpacity, PermissionsAndroid,
    Platform, Modal, StyleSheet,
    TextInput
} from 'react-native';
import * as Color from '../../assets/styles/Colors';
import Header from '../../components/Header';
import { localAssets } from '../../assets/images/assets';
import { FlatList } from 'react-native-gesture-handler';
import { apiGetExpenses, setExpenseDataState, apiGetExpensesByCategory, apiDeleteExpense, apiGetRecentExpenses } from '../../modules/Expense/ExpenseActions';
import { connect } from 'react-redux';
import { Item } from '../../components/Item';
import { Dropdown } from 'react-native-element-dropdown';
import { apiGetCategoriesByType } from '../../modules/Category/CategoryActions'
import { Filters, Periods } from './constants';
import { createCategoriesEnum } from '../../utils/validators/CategoryUtils';
import * as RootRouting from '../../navigation/RootRouting'
import { Dropdown as DropdownStyle } from '../../assets/styles/Dropdown';
import { Views } from '../../assets/styles/Views';
import DateSelectorModal from '../../components/Modals/DateSelectorModal';
import RNFS from 'react-native-fs';
import XLSX from 'xlsx';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { Months } from '../Graphs/constants';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import
{
    calculateChangePercentage,
    calculatePorcentage, calculateReportData, formatCurrency, formatDate
} from '../../services/api/Helpers';
import { apiGetIncomes } from '../../modules/Income/IncomeActions';
import Routing from '../../navigation/Routing';
import { Style } from '../../assets/styles/Style';
import { Buttons } from '../../assets/styles/Buttons';
import { htmlStyles } from '../../assets/styles/Html';

class HistoryExpensesScreen extends Component
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
            xlsxModal: false,
            xlsxModalMsg: '',
            pdfModal: false,
            pdfModalMsg: '',
            concept: '',
            filteredExpenses: []
        }
    }

    async _getData()
    {
        await this.props.apiGetExpenses(this.state.month, this.state.year);
        await this.props.apiGetCategoriesByType("Expenses")
        await this.props.apiGetIncomes(this.state.month, this.state.year)
        this.setState({ filteredExpenses: this.props.expenses })

    }

    async componentDidMount()
    {
        await this._getData()
        this.setState({ categories: createCategoriesEnum(this.props.categories) })
    }

    async _handleChange(name, value) { this.setState({ [name]: value }) }

    _handleModal() { this.setState({ modal: !this.state.modal }); }

    async _getExpenses()
    {
        await this.props.apiGetExpenses(this.state.month, this.state.year)
        this.setState({ filteredExpenses: this.props.expenses })
    }

    async _getExpensesByCategory()
    {
        await this.props.apiGetExpensesByCategory(this.state.category, this.state.month, this.state.year)

        this.setState({ filteredExpenses: this.props.expenses })
    }

    async _getExpensesByDate()
    {
        this.state.category != null ? await this._getExpensesByCategory() : await this._getExpenses();
        if (this.state.filter != null) await this.sortFunc();
        this._handleModal();
    }

    async _handleChangeOrderBy(name, value)
    {
        await this._handleChange(name, value)
        if (value == "reset") this._handleReset(name)
        this.sortFunc()
    }

    async _handleReset(name)
    {
        await this.props.apiGetExpenses(this.state.month, this.state.year)
        if (name == "category") await this.sortFunc()
        this._findExpense(this.state.concept)
        this.setState({ [name]: null })
    }

    async _handleChangeCategory(name, value)
    {
        await this._handleChange(name, value);
        if (value == "reset") this._handleReset(name)
        else { await this._getExpensesByCategory(); await this.sortFunc() }
    }

    async sortFunc()
    {
        const { filter } = this.state
        const { expenses } = this.props
        let copy
        if (filter != null)
        {
            if (filter === Filters.AMOUNT_ASC.value)
                copy = expenses?.map(obj => { return { ...obj, amount: Number(obj.amount) } }).sort((a, b) => a.amount - b.amount)
            else if (filter === Filters.AMOUNT_DESC.value)
                copy = expenses?.map(obj => { return { ...obj, amount: Number(obj.amount) } }).sort((a, b) => b.amount - a.amount)
            else if (filter === Filters.DATE_ASC.value)
                copy = expenses?.map(obj => { return { ...obj, date: new Date(obj.date) } })
                    .sort((a, b) => Number(a.date) - Number(b.date))
            else if (filter === Filters.DATE_DESC.value)
                copy = expenses?.map(obj => { return { ...obj, date: new Date(obj.date) } })
                    .sort((a, b) => Number(b.date) - Number(a.date))
            else if (filter === Filters.RESET.value)
                this.setState({ filter: null })

            this.setState({ filteredExpenses: copy })
        }
    }

    _getReportData()
    {
        const { expenses, prevMonthExpenses } = this.props
        let monthData = calculateReportData(expenses, this.props.incomes)
        let prevMonthData = calculateReportData(prevMonthExpenses, this.props.incomes)
        return { monthData, prevMonthData }
    }


    async createPDF()
    {
        this.setState({ pdfModal: true })
        let isPermitted = await this._isPermitted()
        let msg = ''
        let { monthData, prevMonthData } = this._getReportData()
        const { expenses, incomes } = this.props


        const testHtml = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Informe de gastos (${Months[this.state.month - 1].name} ${this.state.year})</title>
          <style>
           ${htmlStyles}
          </style>
        </head>
        <body>
        <header>
          
        </header>
        <h1>Informe de gastos (${Months[this.state.month - 1].name} ${this.state.year})</h1>
        <div class="section">
            <h2>Ahorro o Déficit Mensual</h2>
            <p class="summary">Total de Gastos: ${formatCurrency(monthData.totalExpAmount)}€</p>
            <p class="summary">Total de Ingresos:  ${formatCurrency(monthData.totalIncAmount)}€</p>
            <p class="summary">Ahorro (o Déficit): ${formatCurrency(monthData.totalIncAmount - monthData.totalExpAmount)}€</p>
        </div>
        <div class="chartContainer">
            <div class="chartSection">
                <h2>Gastos del Mes Actual</h2>
                <div class="chart">
        ${this.props.categories.map(({ uid, name }) =>
        {
            const { expGroupedByCategory } = monthData
            const index = expGroupedByCategory?.findIndex(cat => cat._id === uid)
            const category = expGroupedByCategory[index]
            let amount = 0, porcentage = 0

            if (category)
            {
                amount = category.amount
            }
            porcentage = calculatePorcentage(amount, monthData.totalExpAmount)
            return `<div class="bar">
                        <div class="bar-label">${name}</div>
                        <div class="bar-wrapper">
                            <div class="bar-fill" style="width:${porcentage}%"></div>
                        </div>
                        <div class="bar-percentage">${porcentage}%</div>
                    </div>`
        }).join('')}
                </div >
            </div >

            <div class="chartSection">
                <h2>Gastos del Mes Anterior</h2>
                <div class="chart">
                    ${this.props.categories.map(({ name, uid }) =>
        {
            const expGroupedByCategory = prevMonthData?.expGroupedByCategory
            const index = expGroupedByCategory?.findIndex(cat => cat._id === uid)
            let amount = 0, porcentage = 0
            if (index !== -1 && index !== undefined)
            {
                const category = expGroupedByCategory[index]

                if (category)
                {
                    amount = category.amount
                }
            }
            if (prevMonthData) porcentage = calculatePorcentage(amount, prevMonthData?.totalExpAmount)
            return `<div class="bar">
                        <div class="bar-label">${name}</div>
                        <div class="bar-wrapper">
                            <div class="bar-fill" style="width:${porcentage}%"></div>
                        </div>
                        <div class="bar-percentage">${porcentage}%</div>
                    </div>`
        }).join('')}
                </div>
            </div>
        </div >

        <div class="section">
            <h2>Comparación de Gastos por Categoría (Mes Anterior)</h2>
            <table>
              <thead>
                <tr>
                  <th>Categoría</th>
                  <th>Gastos Este Mes</th>
                  <th>Gastos Mes Anterior</th>
                  <th>Diferencia (%)</th>
                </tr>
              </thead>
              <tbody>
              ${monthData.categories.map(({ name, monthlyExpenses, amount }) =>
        {

            const index = monthlyExpenses.findIndex(item => item.month === this.state.month && item.year === this.state.year)
            const monthTotal = monthlyExpenses[index].total

            const prevMonthIndex = monthlyExpenses.findIndex(item => item.month === this.state.month - 1 && item.year === this.state.year)
            const prevMonthTotal = monthlyExpenses[prevMonthIndex]?.total
            const difference = calculateChangePercentage(monthTotal, prevMonthTotal)
            return `
                    <tr>
                        <td>${name}</td>
                        <td>${formatCurrency(monthTotal || 0)}€</td>
                        <td>${formatCurrency(prevMonthTotal || 0)}€</td>
                        <td>${formatCurrency(difference || 0)}%</td>
                    </tr>
                `
        }).join('')}
               
              </tbody>
            </table>
          </div>
          
          <div class="section">
            <h2>Porcentaje de Gastos respecto al Límite por Categoría</h2>
            <table>
              <thead>
                <tr>
                  <th>Categoría</th>
                  <th>Límite</th>
                  <th>Gastos</th>
                  <th>Porcentaje</th>
                </tr>
              </thead>
              <tbody>
                ${monthData.categories.map(cat =>
        {
            if (cat.limit && cat.limit > 0)
            {

                const index = cat.monthlyExpenses.findIndex(item => item.month === this.state.month && item.year === this.state.year)
                const total = cat.monthlyExpenses[index]?.total
                return `<tr>
            <td>${cat.name}</td>
            <td>${formatCurrency(cat.limit)}€</td>
            <td>${formatCurrency(total)}€</td>
            <td>${calculatePorcentage(total, cat.limit)}%</td>
        </tr>`}
        }).join('')}
              </tbody >
            </table >
          </div >
          
          <div class="section">
            <h2>Gastos Agrupados por Cuenta</h2>
            <table>
              <thead>
                <tr>
                  <th>Cuenta</th>
                  <th>Total de Gastos</th>
                </tr>
              </thead>
              <tbody>
              ${monthData.expGroupedByAccount.map(({ name, amount }) => (
            `<tr>
                        <td>${name}</td>
                        <td>${formatCurrency(amount)}€</td>
                    </tr>`
        )).join('')}
               
              </tbody>
            </table>
          </div>
          <div class="section">
          <h2>Desglose de Gastos</h2>
        <table>
            <thead>
                <tr>
                    <th>Concepto</th>
                    <th>Cuenta</th>
                    <th>Categoría</th>
                    <th>Fecha</th>
                    <th>Cantidad</th>
                </tr>
            </thead>
            <tbody>
        ${expenses?.map(expense => (
            `<tr>
                <td>${expense.concept}</td>
                <td>${expense.account.name}</td>
                <td>${expense.category.name}</td>
                <td>${formatDate(expense.date)}</td>
                <td>${formatCurrency(expense.amount)}€</td>
            </tr>`
        )).join('')}
                </tbody>
            </table>
        </div>
        <div class="section">
            <h2>Desglose de Ingresos</h2>
            <table>
                <thead>
                <tr>
                    <th>Concepto</th>
                    <th>Cuenta</th>
                    <th>Categoría</th>
                    <th>Fecha</th>
                    <th>Cantidad</th>
                </tr>
                </thead>
                <tbody>
        ${incomes?.map(income => (
            `<tr>
                <td>${income.concept}</td>
                <td>${income.account.name}</td>
                <td>${income.category.name}</td>
                <td>${formatDate(income.date)}</td>
                <td>${formatCurrency(income.amount)}€</td>
            </tr>`
        )).join('')}
                </tbody>
            </table>
        </div>
        </body >
        </html > 
        `

        if (isPermitted)
        {
            //let data = this._getReportData()
            let options = {
                html: testHtml,
                //File Name
                fileName: 'Informe-' + Months[this.state.month - 1].name + "-" + this.state.year,
                //File directory
                directory: 'docs',
            };
            try
            {
                await RNHTMLtoPDF.convert(options);
                msg = 'PDF exportado'
            } catch (e)
            {
                this.setState({ pdfModalMsg: 'Error. Intenéntelo más tarde' })
            }
        } else msg = 'Permiso denegado'
        this.setState({ pdfModalMsg: msg })
    }


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
                        title: 'Permiso para almacenar datos en el dispositivo',
                        message: 'La aplicación necesita acceso al dispositvo',
                    },
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err)
            {
                alert('Error', err);
                return false;
            }
        } else
        {
            return true;
        }
    }

    exportDataToExcel()
    {

        let dataToExport = [];
        let msg = 'Excel exportado'
        this.props.expenses.forEach(expense =>
        {
            dataToExport.push({
                Concepto: expense.concept,
                Cantidad: expense.amount,
                Cuenta: expense.account.name,
                Categoría: expense.category.name,
                Fecha: new Date(expense.date).toLocaleDateString('es-ES'),
                'Gasto fijo': expense.fixedExpenseRef ? 'Sí' : 'No',
                Periodo: expense.fixedExpenseRef ? Periods[expense.fixedExpenseRef.period].name : null
            });
        })
        let wb = XLSX.utils.book_new();
        let ws = XLSX.utils.json_to_sheet(dataToExport)
        XLSX.utils.book_append_sheet(wb, ws, "Gastos")

        const wbout = XLSX.write(wb, { type: 'binary', bookType: "xlsx" });

        RNFS.writeFile(RNFS.ExternalStorageDirectoryPath + `/ ${Months[this.state.month - 1].name}_${this.state.year} _informe.xlsx`, wbout, 'ascii').then((r) =>
        {
            msg = 'Excel exportado'
        }).catch((e) =>
        {
            msg = "Error. Inténtelo más tarde"
        });

        return msg

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
                    title: "Permisos necesarios",
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

    renderExportItems()
    {
        const { xlsxModal, xlsxModalMsg, pdfModal, pdfModalMsg } = this.state

        return <View style={styles.exportIcons}>
            <TouchableOpacity onPress={() => this.handleClick()}>
                <MaterialCommunityIcons name="file-excel-outline" size={25} color={Color.white} />
            </TouchableOpacity>
            <Modal
                animationType="slide"
                transparent={true}
                visible={xlsxModal}
                onRequestClose={() => this.setState({ xlsxModal: false })}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text>{xlsxModalMsg}</Text>
                        <TouchableOpacity
                            onPress={() => this.setState({ xlsxModal: false })}
                            style={styles.button}
                        >
                            <Text style={styles.buttonText}>Aceptar</Text></TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <TouchableOpacity onPress={() => this.createPDF()}>
                <MaterialCommunityIcons name="file-pdf-box" size={25} color={Color.white} />
            </TouchableOpacity>
            <Modal
                animationType="slide"
                transparent={true}
                visible={pdfModal}
                onRequestClose={() => this.setState({ pdfModal: false })}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text>{pdfModalMsg}</Text>
                        <TouchableOpacity
                            onPress={() => this.setState({ pdfModal: false })}
                            style={styles.button}
                        >
                            <Text style={styles.buttonText}>Aceptar</Text></TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    }

    _findExpense(value)
    {
        let filteredExpenses;
        let valueLower = value.toLowerCase();

        if (value === '') filteredExpenses = this.props.expenses

        else
        {
            let filterByConcept = this.props.expenses.filter(expense => expense.concept.toLowerCase().includes(valueLower));
            let filterByAccount = this.props.expenses.filter(expense => expense.account?.name.toLowerCase().includes(valueLower));

            filteredExpenses = filterByConcept.concat(filterByAccount)
        }
        this.setState({ concept: value, filteredExpenses })
    }

    render()
    {
        const { isLoadingExpenses, isLoadingCategories } = this.props;
        const { filter, category, categories, month, year, modal, concept } = this.state
        return (
            <SafeAreaView style={Views.container}>
                <Header goBack={true} reloadData={() => this.props.apiGetRecentExpenses(7)} title="Historial de gastos" otherContent={this.renderExportItems()} />
                <ImageBackground source={localAssets.background} resizeMode="cover" style={Views.imageHeaderWithFilters} blurRadius={40}>
                    <View style={{ width: "100%", flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <DateSelectorModal
                            modal={modal}
                            onOpenModal={() => this._handleModal()}
                            onClose={() => this.setState({ modal: false })}
                            month={month}
                            year={year}
                            onChangeMonth={(item) => this._handleChange('month', item.value)}
                            onChangeYear={(item) => this._handleChange('year', item.value)}
                            onSubmit={() => this._getExpensesByDate()}
                        />

                        <TextInput
                            style={[Buttons.homeButton, { fontSize: Style.FONT_SIZE_SMALL, width: "60%", }]}
                            onChangeText={(value) => this._findExpense(value)}
                            value={concept}
                            placeholder='Buscar por cuenta o concepto'
                        />
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
                        <Dropdown
                            style={DropdownStyle.dropdown}
                            data={Object.values(categories)}
                            value={category}
                            labelField="label"
                            valueField="value"
                            selectedTextStyle={[DropdownStyle.selectedTextStyle, { color: Color.white }]}
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
                            selectedTextStyle={[DropdownStyle.selectedTextStyle, { color: Color.white }]}
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

                {
                    (isLoadingExpenses || isLoadingCategories) ? <ActivityIndicator /> :

                        <FlatList
                            contentContainerStyle={{ alignItems: 'center' }}
                            data={this.state.filteredExpenses}
                            renderItem={({ item }) =>

                                <Item item={item}
                                    hasDeleteAction={false}
                                    action={() =>
                                        RootRouting.navigate(Routing.detailsExpense, { id: item.uid, type: "expense" })}
                                />
                            }
                        />

                }
            </SafeAreaView >
        );
    }
}



const styles = StyleSheet.create({

    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    buttonText: {
        color: Color.white
    },
    button: {
        borderRadius: 10,
        padding: 10,
        marginTop: 15,
        elevation: 2,
        backgroundColor: Color.button
    },
    exportIcons: {
        display: 'flex',
        marginLeft: 'auto',
        alignItems: 'flex-end', flexDirection: 'row'
    }
});



const mapStateToProps = ({ ExpenseReducer, CategoryReducer, IncomeReducer }) =>
{
    const { incomes, isLoadingIncomes } = IncomeReducer
    const { expenses, isLoadingExpenses, prevMonthExpenses } = ExpenseReducer;
    const { categories, isLoadingCategories } = CategoryReducer;

    return { expenses, isLoadingExpenses, categories, isLoadingCategories, incomes, isLoadingIncomes, prevMonthExpenses };

};

const mapStateToPropsAction = {
    apiGetCategoriesByType,
    apiGetExpensesByCategory,
    apiGetExpenses,
    setExpenseDataState,
    apiDeleteExpense,
    apiGetRecentExpenses,
    apiGetIncomes
};



export default connect(mapStateToProps, mapStateToPropsAction)(HistoryExpensesScreen);
