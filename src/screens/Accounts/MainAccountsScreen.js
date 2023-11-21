
import React, { Component } from 'react';
import { ImageBackground, StyleSheet, View, FlatList, ActivityIndicator } from 'react-native';
import { MenuButton } from '../../components/MenuButton';
import * as RootRouting from '../../navigation/RootRouting'

import { apiGetAccounts } from '../../modules/Accounts/AccountActions';

import * as Color from '../../assets/styles/Colors';
import Header from '../../components/Header';
import { localAssets } from '../../assets/images/assets';
import Routing from '../../navigation/Routing';
import { connect } from 'react-redux';
import { Option } from '../../components/Option';
import { Views } from '../../assets/styles/Views';

class MainAccountsScreen extends Component
{
    constructor(props)
    {
        super(props);
    }

    componentDidMount()
    {
        this._getAccounts()
    }

    _getAccounts()
    {
        this.props.apiGetAccounts();
    }

    render()
    {
        const { isLoadingAccounts, accounts } = this.props;

        return (
            <View style={Views.container}>
                <Header goBack={true}
                    rightIcon="plus"
                    rightAction={() => RootRouting.navigate(Routing.addAccount)}
                    title="Cuentas" />
                <ImageBackground source={localAssets.background} resizeMode="cover" style={Views.image} blurRadius={40}>
                    {isLoadingAccounts
                        ? <ActivityIndicator />
                        :
                        <View style={Views.container}>

                            {accounts !== undefined ?

                                <FlatList
                                    contentContainerStyle={{ alignItems: 'center' }}
                                    data={accounts}
                                    renderItem={({ item }) =>
                                        <Option action={() => RootRouting.navigate(Routing.accountDetails, { id: item.uid })}
                                            title={item.name} icon={item.icon}
                                            secondIcon={true}
                                            secondAction={() => RootRouting.navigate(Routing.editAccount, { id: item.uid })} />
                                    }
                                />
                                : null}
                        </View>
                    }
                </ImageBackground>
            </View>
        )

    }
}



const mapStateToProps = ({ AccountReducer }) =>
{

    const { isLoadingAccounts, accounts } = AccountReducer;

    return { isLoadingAccounts, accounts };

};

const mapStateToPropsAction = {
    apiGetAccounts
};




export default connect(mapStateToProps, mapStateToPropsAction)(MainAccountsScreen);