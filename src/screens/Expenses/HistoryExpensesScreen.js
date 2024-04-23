
import React, { Component } from 'react';
import
{
    SafeAreaView, View, ActivityIndicator, ImageBackground, Text, TouchableOpacity, PermissionsAndroid,
    Platform, Modal, StyleSheet
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

import { Dropdown as DropdownStyle } from '../../assets/styles/Dropdown';
import { Views } from '../../assets/styles/Views';
import DateSelectorModal from '../../components/Modals/DateSelectorModal';
import RNFS from 'react-native-fs';
import XLSX from 'xlsx';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { Months } from '../Graphs/constants';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


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
            pdfModalMsg: ''
        }
    }

    async _getData()
    {
        await this.props.apiGetExpenses(this.state.month, this.state.year);
        await this.props.apiGetCategoriesByType("Expenses")
    }

    async componentDidMount()
    {
        await this._getData()
        this.setState({ categories: createCategoriesEnum(this.props.categories) })
    }

    async _handleChange(name, value) { this.setState({ [name]: value }) }

    _handleModal() { this.setState({ modal: !this.state.modal }); }

    async _getExpenses() { await this.props.apiGetExpenses(this.state.month, this.state.year) }

    async _getExpensesByCategory()
    {
        await this.props.apiGetExpensesByCategory(this.state.category, this.state.month, this.state.year)
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

            if (filter === Filters.TITLE.value)
                copy = expenses?.map(obj => { return { ...obj, concept: obj.concept } }).sort((a, b) => a.concept.localeCompare(b.concept))
            else if (filter === Filters.ACCOUNT.value)
                copy = expenses?.map(obj => { return { ...obj, account: obj.account } }).sort((a, b) => a.account.name.localeCompare(b.account.name))
            else if (filter === Filters.AMOUNT_ASC.value)
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
            await this.props.setExpenseDataState({ prop: 'expenses', value: copy })
        }
    }
    _getReportData()
    {
        const { expenses } = this.props
        let data = {
            total: 0,
            categories: {}
        }
        expenses.forEach(exp =>
        {
            let { category, amount } = exp
            data.total += exp.amount

            if (data.categories[category.name]) data.categories[category.name] += amount;
            else data.categories[category.name] = amount;
        })
        return data
    }

    async createPDF()
    {
        this.setState({ pdfModal: true })
        let isPermitted = await this._isPermitted()
        let msg = ''
        if (isPermitted)
        {
            let data = this._getReportData()
            let options = {
                html: `<!DOCTYPE html>
                <html>
                  <h1>Hola,</h1>
                  <h2> A continuación, te mostramos un reporte mensual de tus gastos en ${Months[this.state.month - 1].name}</h2>
                  <span>Los gastos totales han sido de ${data.total}€</span><br>
                  <table>
                  ${Object.keys(data.categories).map((name) =>

                (`<tr>
                        <th style="padding: 10px; background-color: #f2f2f2; border: 1px solid #ddd;">${name}</th>
                        <td style="padding: 10px; border: 1px solid #ddd;">${data.categories[name]}€</td>
                    </tr>`)
                )}
                    <tr>
                      <th style="padding: 10px; background-color: #f2f2f2; border: 1px solid #ddd;">TOTAL</th>
                      <td style="padding: 10px; border: 1px solid #ddd;">${data.total}€</td>
                    </tr>
                  </table>
                  <h2>Desgloce de los gastos:</h2>
                  <table style="width:100%">
                    <tr>
                      <th style="padding: 10px; background-color: #f2f2f2; border: 1px solid #ddd;">Concepto</th>
                      <th style="padding: 10px; background-color: #f2f2f2; border: 1px solid #ddd;">Categoría</th>
                      <th style="padding: 10px; background-color: #f2f2f2; border: 1px solid #ddd;">Fecha</th>
                      <th style="padding: 10px; background-color: #f2f2f2; border: 1px solid #ddd;">Cuenta</th>
                    </tr>
                    ${this.props.expenses.map(expense =>

                (`<tr>
                    <td style="padding: 10px; border: 1px solid #ddd;">${expense.concept}</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${expense.category.name}</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${expense.date}</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${expense.account.name}</td>
                </tr>`
                ))}
                  </table>
                </html> `,
                //File Name
                fileName: 'test',
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
                'Gasto fijo': expense.fixed,
                Periodo: expense.fixed ? Periods[expense.period].name : null
            });
        })
        let wb = XLSX.utils.book_new();
        let ws = XLSX.utils.json_to_sheet(dataToExport)
        XLSX.utils.book_append_sheet(wb, ws, "Gastos")

        const wbout = XLSX.write(wb, { type: 'binary', bookType: "xlsx" });

        RNFS.writeFile(RNFS.ExternalStorageDirectoryPath + `/${Months[this.state.month - 1].name}_${this.state.year}_informe.xlsx`, wbout, 'ascii').then((r) =>
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
                    title: "Storage permission needed",
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

    render()
    {
        const { isLoadingExpenses, expenses, isLoadingCategories } = this.props;
        const { filter, category, categories, month, year, modal } = this.state

        return (
            <SafeAreaView style={Views.container}>
                <Header goBack={true} reloadData={() => this.props.apiGetRecentExpenses(7)} title="Historial de gastos" otherContent={this.renderExportItems()} />
                <ImageBackground source={localAssets.background} resizeMode="cover" style={Views.imageHeaderWithFilters} blurRadius={40}>
                    <View style={{ width: "100%", flexDirection: 'row', justifyContent: 'space-between', }}>

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

                    </View>
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

                {
                    (isLoadingExpenses || isLoadingCategories) ? <ActivityIndicator /> :

                        <FlatList
                            contentContainerStyle={{ alignItems: 'center' }}
                            data={expenses}
                            renderItem={({ item }) =>
                                <Item item={item}
                                    hasDeleteAction={true}
                                    deleteAction={() => this.props.apiDeleteExpense(item.uid)}
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
    apiDeleteExpense,
    apiGetRecentExpenses
};



export default connect(mapStateToProps, mapStateToPropsAction)(HistoryExpensesScreen);
