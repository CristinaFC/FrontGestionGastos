
import React, { Component } from 'react';
import { ImageBackground, StyleSheet, View, FlatList, ActivityIndicator } from 'react-native';
import { MenuButton } from '../../components/MenuButton';
import * as RootRouting from '../../navigation/RootRouting'

import { apiGetAccounts, apiDeleteAccount } from '../../modules/Accounts/AccountActions';

import * as Color from '../../assets/styles/Colors';
import Header from '../../components/Header';
import { localAssets } from '../../assets/images/assets';
import Routing from '../../navigation/Routing';
import { connect } from 'react-redux';
import { Option } from '../../components/Option';
import { Views } from '../../assets/styles/Views';
import WarningModal from '../../components/Modals/WarningModal';

class MainAccountsScreen extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            warning: false,
            accountId: ''
        }
    }

    componentDidMount()
    {
        this._getAccounts()
    }

    _getAccounts()
    {
        this.props.apiGetAccounts();
    }

    async _deleteAccount(accountId)
    {
        await this.props.apiDeleteAccount(accountId);
    }

    render()
    {
        const { isLoadingAccounts, accounts } = this.props;
        const { warning, accountId } = this.state
        return (
            <View style={Views.container}>
                <Header
                    rightIcon="plus"
                    rightAction={() => RootRouting.navigate(Routing.addAccount)}
                    title="Cuentas" />
                <ImageBackground source={localAssets.background} resizeMode="cover" style={Views.image} blurRadius={40}>
                    {isLoadingAccounts
                        ? <ActivityIndicator />
                        :
                        <View style={Views.container}>

                            {accounts &&

                                <FlatList
                                    contentContainerStyle={{ alignItems: 'center' }}
                                    data={accounts}
                                    renderItem={({ item }) =>
                                        <Option
                                            icon={item.icon}
                                            action={() => RootRouting.navigate(Routing.accountDetails, { id: item.uid })}
                                            title={item.name}
                                            rightIcons={["delete"]}
                                            rightActions={[() => this.setState({ warning: true, accountId: item.uid })]} />
                                    }
                                />
                            }
                            {warning && <WarningModal
                                text="Está a punto de eliminar una cuenta. Los gastos e ingresos relacionados a esta cuenta se eliminarán también de forma permanente. ¿Desea continuar?"
                                buttom="Eliminar"
                                onPressCancel={() => this.setState({ warning: false })}
                                onPress={() =>
                                {
                                    this._deleteAccount(accountId)
                                    this.setState({ warning: false })
                                }} />
                            }
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
    apiGetAccounts,
    apiDeleteAccount
};




export default connect(mapStateToProps, mapStateToPropsAction)(MainAccountsScreen);