
import React, { Component } from 'react';
import { ImageBackground, SafeAreaView, Text, View, ActivityIndicator } from 'react-native';
import { MenuButton } from '../../components/MenuButton';
import * as RootRouting from '../../navigation/RootRouting'
import { Texts } from '../../assets/styles/Texts';
import { Views } from '../../assets/styles/Views';
import Header from '../../components/Header';
import { localAssets } from '../../assets/images/assets';
import Routing from '../../navigation/Routing';
import { FlatList } from 'react-native-gesture-handler';
import { apiGetRecentIncomes, apiDeleteIncome } from '../../modules/Income/IncomeActions';
import { connect } from 'react-redux';
import { Item } from '../../components/Item';
import { MenuView } from '../../components/MenuView';

class MainIncomesScreen extends Component
{

    constructor(props) { super(props); }

    componentDidMount()
    {
        this._getData()
    }

    _getData() { this.props.apiGetRecentIncomes(7) }

    render()
    {
        const { incomes, isLoadingIncomes } = this.props;

        return (
            <SafeAreaView style={Views.container}>
                <Header title="Ingresos" />
                <ImageBackground source={localAssets.background} resizeMode="cover" style={Views.imageHeader} blurRadius={40}>
                    <MenuView
                        leftTitle="Añadir"
                        leftOnPress={() => RootRouting.navigate(Routing.addIncome, { type: "Incomes" })}
                        rightTitle="Historial"
                        rightOnPress={() => RootRouting.navigate(Routing.historyIncomes)} />
                </ImageBackground>
                <View style={Views.recentsTitleContainer}>
                    <Text style={Texts.recentsText}>Recientes</Text>
                </View>
                {isLoadingIncomes
                    ? <ActivityIndicator />
                    :
                    <View style={Views.container}>

                        {incomes !== (undefined || null) ?

                            <FlatList
                                contentContainerStyle={{ alignItems: 'center' }}
                                data={incomes}
                                renderItem={({ item }) =>
                                    <Item item={item}
                                        type="Income"
                                        action={() =>
                                            RootRouting.navigate(Routing.detailsIncome, { id: item.uid, type: "income" })}
                                    />

                                } />

                            : null}
                    </View>
                }
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
    apiGetRecentIncomes,
    apiDeleteIncome
};


export default connect(mapStateToProps, mapStateToPropsAction)(MainIncomesScreen);