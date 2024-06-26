
import React, { Component } from 'react';
import
{
    ImageBackground, SafeAreaView, StyleSheet, View, ActivityIndicator,
    Platform, PermissionsAndroid, TouchableOpacity, Modal, Text
} from 'react-native';
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
import { apiGetExpenses } from '../../modules/Expense/ExpenseActions';
import RNFS from 'react-native-fs';
import XLSX from 'xlsx';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { calculateChangePercentage, calculatePorcentage, calculateReportData, formatCurrency, formatDate } from '../../services/api/Helpers';
import { Months } from '../Graphs/constants';
import { htmlStyles } from '../../assets/styles/Html';

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
            xlsxModal: false,
            xlsxModalMsg: '',
            pdfModal: false,
            pdfModalMsg: '',
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

    async _getData()
    {
        await this.props.apiGetIncomes(this.state.month, this.state.year)
        await this.props.apiGetExpenses(this.state.month, this.state.year);

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
        this.props.incomes.forEach(expense =>
        {
            dataToExport.push({
                Concepto: expense.concept,
                Cantidad: expense.amount,
                Cuenta: expense.account.name,
                Categoría: expense.category.name,
                Fecha: new Date(expense.date).toLocaleDateString('es-ES'),
            });
        })
        let wb = XLSX.utils.book_new();
        let ws = XLSX.utils.json_to_sheet(dataToExport)
        XLSX.utils.book_append_sheet(wb, ws, "Ingresos")

        const wbout = XLSX.write(wb, { type: 'binary', bookType: "xlsx" });

        RNFS.writeFile(RNFS.ExternalStorageDirectoryPath + `/ ${Months[this.state.month - 1].name}_${this.state.year} _informe.xlsx`, wbout, 'ascii').then((r) =>
        {
            msg = 'Excel exportado'
        }).catch((e) =>
        {
            msg = "Error. Inténtelo más tarde"
        });

        return msg

    } _getReportData()
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
            {/* <TouchableOpacity onPress={() => this.createPDF()}>
                <MaterialCommunityIcons name="file-pdf-box" size={25} color={Color.white} />
            </TouchableOpacity> */}
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
    render()
    {
        const { isLoadingIncomes, incomes, isLoadingCategories } = this.props;
        const { filter, category, categories, month, year, modal } = this.state
        return (
            <SafeAreaView style={Views.container}>
                <Header goBack={true} title="Historial de ingresos"
                    reloadData={() => this.props.apiGetRecentIncomes(7)}
                    otherContent={this.renderExportItems()} />
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
                                        action={() => RootRouting.navigate(Routing.detailsIncome, { id: item.uid, type: "income" })}
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




const mapStateToProps = ({ IncomeReducer, CategoryReducer, ExpenseReducer }) =>
{

    const { incomes, isLoadingIncomes } = IncomeReducer;
    const { expenses, isLoadingExpenses, prevMonthExpenses } = ExpenseReducer;
    const { categories, isLoadingCategories } = CategoryReducer;

    return {
        incomes, isLoadingIncomes, categories, isLoadingCategories,
        expenses, isLoadingExpenses, prevMonthExpenses
    };

};

const mapStateToPropsAction = {
    apiGetIncomes,
    apiGetCategoriesByType,
    apiGetIncomesByCategory,
    setIncomeDataState,
    apiDeleteIncome,
    apiGetRecentIncomes,
    setIncomeDataState,
    apiGetExpenses
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

export default connect(mapStateToProps, mapStateToPropsAction)(HistoryIncomesScreen);
