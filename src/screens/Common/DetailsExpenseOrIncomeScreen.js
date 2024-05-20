
import React, { Component, } from 'react';
import { SafeAreaView, StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import * as Color from '../../assets/styles/Colors';
import { Views } from '../../assets/styles/Views';
import Header from '../../components/Header';
import { apiGetExpenseById, apiDeleteExpense } from '../../modules/Expense/ExpenseActions';
import { connect } from 'react-redux';
import { Texts } from '../../assets/styles/Texts';
import DeleteAccountButton from '../../components/DeleteButton';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { formatCurrency, formatDate } from '../../services/api/Helpers';
import { Style } from '../../assets/styles/Style';
import { ItemAttr } from '../../components/ItemAttr';
import { apiDeleteIncome, apiGetIncomeById } from '../../modules/Income/IncomeActions';


class DetailsExpenseOrIncomeScreen extends Component
{

    constructor(props)
    {
        super(props);
        this.state = {
            amount: '',
            account: '',
            category: '',
            concept: '',
            date: new Date(),
            deleting: false
        }
        this.id = props.route.params.id;
        this.type = props.route.params.type
    }
    async _getData()
    {

        let data = [];
        if (this.type === 'expense')
        {
            await this.props.apiGetExpenseById(this.id).then(() => data = this.props.expense);

        } else if (this.type === 'income')
        {
            await this.props.apiGetIncomeById(this.id);
            data = this.props.income
        }

        const { amount, concept, date, category, account, exchangeData } = data;

        this.setState({ amount: formatCurrency(amount), concept, date, category, account, exchangeData });
    }


    async componentDidMount()
    {
        await this._getData()
    }


    async _delete()
    {

        if (this.type === 'expense')
        {
            await this.props.apiDeleteExpense(this.id);
        } else if (this.type === 'income')
        {
            await this.props.apiDeleteIncome(this.id);
        }
        this.setState({ deleting: false })

    }

    render()
    {
        const { isLoadingExpense, isLoadingIncome } = this.props

        const { date, amount, account, category, concept, deleting, exchangeData } = this.state

        let type = this.type === 'expense' ? 'gasto' : 'ingreso'

        return (
            <SafeAreaView style={Views.container}>
                <Header goBack={true} title="Detalles" />

                {this.type === "expense" && isLoadingExpense || this.type === "income" && isLoadingIncome
                    ? <ActivityIndicator />
                    : <View style={styles.dataContainer}>
                        <Text style={Texts.conceptTitle}>{concept}</Text>
                        <ItemAttr attrName="Cantidad" attrValue={`${amount}€`} />
                        {exchangeData &&
                            <>
                                <ItemAttr attrName="Tipo" attrValue={`${exchangeData?.rate}`} />
                                <ItemAttr attrName="Cantidad convertida" attrValue={`${exchangeData?.value}  ${exchangeData?.currency}`} />
                            </>}

                        <ItemAttr attrName="Fecha" attrValue={formatDate(date)} />
                        <ItemAttr attrName="Cuenta" attrValue={account?.name} />
                        <View style={styles.categoryContainer}>
                            <Text style={[Texts.attrName, { marginBottom: 0 }]}>Categoría: </Text>
                            <View style={styles.categoryIconContainer}>
                                <Text style={[Texts.text, { marginBottom: 0 }]}>{category?.name}</Text>
                                <MaterialCommunityIcons name={category.icon} size={20} color={Color.button} />

                            </View>
                        </View>

                        <DeleteAccountButton
                            deleting={deleting}
                            handleChange={(value) => this.setState({ deleting: value })}
                            deleteUser={() => this._delete()}
                            onPressCancel={(value) => this.setState({ deleting: value })}
                            buttonText={`Eliminar ${type}`}
                            warningText={`Está a punto de eliminar el ${type} ${concept}. ¿Desea continuar?`}
                        />
                    </View>
                }
            </SafeAreaView >
        );
    }
}




const mapStateToProps = ({ ExpenseReducer, IncomeReducer }) =>
{
    const { income, isLoadingIncome } = IncomeReducer;
    const { expense, isLoadingExpense } = ExpenseReducer;

    return { expense, isLoadingExpense, income, isLoadingIncome };

};

const mapStateToPropsAction = {
    apiGetExpenseById,
    apiGetIncomeById,
    apiDeleteExpense,
    apiDeleteIncome
};


const styles = StyleSheet.create({
    dataContainer: {
        width: Style.DEVICE_EIGHTY_PERCENT_WIDTH,
        justifyContent: 'space-evenly',
        alignSelf: 'center',
    },
    categoryIconContainer:
    {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        width: "70%",
        borderBottomWidth: 1
    },
    categoryContainer: {
        height: Style.DEVICE_TEN_PERCENT_HEIGHT,
        width: "100%",
        flexDirection: 'row',
        alignItems: 'center'
    }

});

export default connect(mapStateToProps, mapStateToPropsAction)(DetailsExpenseOrIncomeScreen);

