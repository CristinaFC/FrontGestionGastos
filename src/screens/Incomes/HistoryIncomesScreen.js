
import React, { Component } from 'react';
import { ImageBackground, SafeAreaView, StyleSheet, View, ActivityIndicator } from 'react-native';
import * as Color from '../../assets/styles/Colors';
import { Views } from '../../assets/styles/Views';
import Header from '../../components/Header';
import { localAssets } from '../../assets/images/assets';
import { FlatList } from 'react-native-gesture-handler';
import { apiGetIncomes, setIncomeDataState, apiDeleteIncome } from '../../modules/Income/IncomeActions';
import { connect } from 'react-redux';
import { Item } from '../../components/Item';
import { Dropdown } from 'react-native-element-dropdown';
import Routing from '../../navigation/Routing';
import * as RootRouting from '../../navigation/RootRouting'
import { Inputs } from '../../assets/styles/Inputs';

const filters = [
    { name: "Cantidad: menor a mayor", value: 0 },
    { name: "Cantidad: mayor a menor", value: 1 },
    { name: "Fecha: más antiguos", value: 2 },
    { name: "Fecha: más recientes", value: 3 }
]

class HistoryIncomesScreen extends Component
{

    constructor(props)
    {
        super(props);
        this.state = { filter: '' }
    }

    _getData() { this.props.apiGetIncomes() }

    componentDidMount()
    {
        this._getData()
    }

    async _handleChange(name, value) 
    {
        await this.setState({ [name]: value })
        this.sortFunc()
    }

    async sortFunc()
    {
        const { filter } = this.state
        const { incomes } = this.props
        let copy
        switch (filter.value)
        {
            case 0:
                copy = incomes.map(obj => { return { ...obj, amount: Number(obj.amount) } }).sort((a, b) => a.amount - b.amount)
                break;
            case 1:
                copy = incomes.map(obj => { return { ...obj, amount: Number(obj.amount) } }).sort((a, b) => b.amount - a.amount)
                break;
            case 2:
                copy = incomes.map(obj => { return { ...obj, date: new Date(obj.date) } })
                    .sort((a, b) => Number(a.date) - Number(b.date))
                break;
            case 3:
                copy = incomes.map(obj => { return { ...obj, date: new Date(obj.date) } })
                    .sort((a, b) => Number(b.date) - Number(a.date))
                break;
        }

        this.props.setIncomeDataState({ prop: 'incomes', value: copy })
    }

    render()
    {
        const { isLoadingIncomes, incomes } = this.props;
        const { filter } = this.state

        return (
            <SafeAreaView style={Views.container}>
                <Header goBack={true} title="Historial de ingresos" />
                <ImageBackground source={localAssets.background} resizeMode="cover" style={Views.image} blurRadius={40}>
                    {isLoadingIncomes
                        ? <ActivityIndicator />
                        :
                        <View style={styles.content}>
                            <Dropdown
                                style={Inputs.halfDropdown}
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
                                    this._handleChange('filter', item)
                                }}
                            />
                            {incomes !== undefined ?
                                <FlatList
                                    contentContainerStyle={{ alignItems: 'center' }}
                                    data={incomes}
                                    renderItem={({ item }) =>
                                        <Item
                                            item={item}
                                            action={() =>
                                                RootRouting.navigate(Routing.detailsIncome, { id: item.uid })}
                                            deleteAction={() => this.props.apiDeleteIncome(item.uid)} />
                                    }
                                />
                                : null}
                        </View>
                    }
                </ImageBackground>
            </SafeAreaView >
        );
    }
}




const mapStateToProps = ({ IncomeReducer }) =>
{

    const { incomes, isLoadingIncomes } = IncomeReducer;


    return { incomes, isLoadingIncomes };

};

const mapStateToPropsAction = {
    apiGetIncomes,
    setIncomeDataState,
    apiDeleteIncome
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
