
import React, { Component } from "react";
import { View, StyleSheet, FlatList, ActivityIndicator, ImageBackground, Modal } from "react-native";

import { connect } from "react-redux";
import Routing from "../../navigation/Routing";

import { Views } from "../../assets/styles/Views";

import { apiGetRecipients, apiPostRecipient, clearRecipientData } from "../../modules/Recipients/RecipientActions";
import * as RootRouting from '../../navigation/RootRouting';
import * as Color from '../../assets/styles/Colors';

import { localAssets } from "../../assets/images/assets";
import Header from "../../components/Header";
import { Option } from "../../components/Option";
import { Style } from "../../assets/styles/Style";
import RecipientForm from "../../components/RecipientForm";
import { formatError } from "../../services/api/Helpers";


class RecipientScreen extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            openModal: false
        }
    }

    async componentDidMount()
    {
        this._getRecipients()
    }

    componentDidUpdate(prevProps) { if (prevProps !== this.props) this.forceUpdate() }

    _getRecipients()
    {
        this.props.apiGetRecipients();
    }

    async _addRecipient(fields)
    {
        await this.props.apiPostRecipient(fields)
    }

    render()
    {
        const { isLoadingRecipients, recipients, errors } = this.props;
        const { openModal } = this.state
        if (isLoadingRecipients) return <ActivityIndicator />
        return (
            <View style={Views.container}>
                <Header goBack={true}
                    rightIcon="plus"
                    rightAction={() => this.setState({ openModal: true })}
                    title="Destinatarios" />
                <ImageBackground source={localAssets.background} resizeMode="cover" style={Views.image} blurRadius={40}>
                    <View style={Views.container}>
                        {recipients?.length > 0 ?

                            <FlatList
                                contentContainerStyle={{ alignItems: 'center' }}
                                data={recipients}
                                renderItem={({ item }) =>
                                    <Option action={() => item.readOnly ? null :
                                        RootRouting.navigate(Routing.categoryDetails, { id: item.uid })}
                                        title={item.name} icon={item.icon} readOnly={item.readOnly} />
                                }
                            />
                            : null}
                    </View>
                    <Modal
                        visible={openModal}
                        animationType="slide"
                        transparent={true}
                        onRequestClose={() => this.setState({ openModal: false })}>
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <RecipientForm
                                    onSubmit={async (fields) =>
                                    {
                                        await this._addRecipient(fields);
                                        if (this.props.errors?.length === 0)
                                        {
                                            this.props.clearRecipientData()
                                            this._getRecipients()
                                            this.setState({ openModal: false });
                                        }
                                    }}
                                    formErrors={formatError(errors)}
                                    recipient={null}
                                    title="Nuevo destinatario"
                                    closeModal={() => this.setState({ openModal: false })}
                                />
                            </View>
                        </View>

                    </Modal>
                </ImageBackground >
            </View >
        )

    }
}

const styles = StyleSheet.create({
    iconHeader: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    checkboxContainer: {
        width: Style.DEVICE_NINETY_PERCENT_WIDTH,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 5
    },

    recipientContainer:
    {
        width: Style.DEVICE_NINETY_PERCENT_WIDTH,
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between'
    },

    addRecipientButton:
    {
        borderWidth: 2,
        borderRadius: 100,
        borderColor: Color.button
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: Color.white,
        borderRadius: 10,
        padding: 20,
        width: '80%',
        maxHeight: '80%',
    },
    text: {
        color: Color.firstText,
        fontSize: 16,
    },
    switcher: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: "80%",
        marginTop: 10,
    },

    dropdownContainer: {
        paddingHorizontal: "10%",
        width: "100%",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    dropdownText: {
        color: Color.firstText,
        fontSize: 16
    },

    form: {
        flexGrow: 0,
        width: "90%",
        height: "95%",
        paddingVertical: 20,
        borderRadius: 20,
        backgroundColor: 'rgba(236, 236, 236, .8)',

    }

});

const mapStateToProps = ({ RecipientReducer }) =>
{

    const { recipients, isLoadingRecipients, errors } = RecipientReducer;

    return { recipients, isLoadingRecipients, errors };

};

const mapStateToPropsAction = {
    apiPostRecipient,
    apiGetRecipients,
    clearRecipientData
};


export default connect(mapStateToProps, mapStateToPropsAction)(RecipientScreen);