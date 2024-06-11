import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import Routing from "../../navigation/Routing";
import * as RootRouting from '../../navigation/RootRouting'
import Header from "../../components/Header";

import { Option } from "../../components/Option";

import { connect } from "react-redux";

import { apiLogout } from '../../modules/Auth/AuthActions';


class SettingsScreen extends Component
{

    constructor(props) { super(props); }

    render()
    {
        return (
            <View style={styles.container}>
                <Header title="Ajustes" />
                <Option action={() => RootRouting.navigate(Routing.categories)} title="Categorías" icon="tag-outline" />
                <Option action={() => RootRouting.navigate(Routing.profile)} title="Usuario" icon="account-circle-outline" />
                <Option action={() => this.props.apiLogout()} title="Cerrar sesión" icon="logout" readOnly={true} />

            </View>
        )
    }
}

const mapStateToPropsAction = {
    apiLogout,
};
const styles = StyleSheet.create({

    container: {
        flex: 1,
    },
    image: {
        flex: 1,
        resizeMode: 'cover',
        alignItems: 'center',
        width: '100%',
    },
});



export default connect(null, mapStateToPropsAction)(SettingsScreen);