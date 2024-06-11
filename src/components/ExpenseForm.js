

// // export const ExpenseForm = () =>
// // {
// //     return (<>
// //         <View style={styles.form}>
// //             <Text style={styles.text}>Gasto:</Text>
// //             <TextInputValidator
// //                 error={formErrors}
// //                 errorKey="amount"
// //                 inputValue={amount}
// //                 keyboardType="numeric"
// //                 onChange={value => this._handleChange('amount', value)}
// //                 placeholder="Cantidad"
// //             />
// //             <Text style={styles.text}>Descripción:</Text>
// //             <TextInputValidator
// //                 multiline={true}
// //                 numberOfLines={4}
// //                 error={formErrors}
// //                 errorKey="description"
// //                 inputValue={description}
// //                 keyboardType="ascii-capable"
// //                 onChange={value => this._handleChange('description', value)}
// //                 placeholder="Descripción"
// //             />

// //             <Text style={styles.text}>Fecha:</Text>
// //             <TouchableOpacity onPress={() => this.setState({ showDate: true })} style={styles.datePicker}>
// //                 <Text style={styles.dateData}>{date.toLocaleString('es-ES')}</Text>
// //             </TouchableOpacity >

// //             <DatePicker
// //                 modal
// //                 locale='es'
// //                 open={showDate}
// //                 date={date}
// //                 mode="date"
// //                 onConfirm={(date) => { this._handleDateChange(date) }}
// //                 onCancel={() => { this.setState({ showDate: false }) }}
// //             />
// //             <View style={styles.dropdownContainer}>

// //                 <Text style={styles.dropdownText}>Categoría:</Text>
// //                 <Dropdown
// //                     style={styles.dropdown}
// //                     data={categories}
// //                     value={category}
// //                     labelField="name"
// //                     valueField="name"
// //                     selectedTextStyle={styles.selectedTextStyle}
// //                     inputSearchStyle={styles.inputSearchStyle}
// //                     maxHeight={300}
// //                     placeholder="Seleccionar..."
// //                     onChange={item =>
// //                     {
// //                         this._handleChange('category', item)
// //                     }}
// //                 />
// //             </View>
// //             <View style={styles.dropdownContainer}>

// //                 <Text style={styles.dropdownText}>Cuenta:</Text>
// //                 <Dropdown
// //                     style={styles.dropdown}
// //                     data={accounts}
// //                     value={account}
// //                     labelField="name"
// //                     valueField="value"
// //                     selectedTextStyle={styles.selectedTextStyle}
// //                     inputSearchStyle={styles.inputSearchStyle}
// //                     maxHeight={300}
// //                     placeholder="Seleccionar..."
// //                     onChange={item =>
// //                     {
// //                         this._handleChange('account', item)
// //                     }}
// //                 />
// //             </View>
// //             <View style={styles.switcher}>
// //                 <Text style={styles.text} >Gasto fijo:</Text>
// //                 <Switch
// //                     style
// //                     trackColor={{ false: Color.orange, true: Color.button }}
// //                     thumbColor={Color.white}
// //                     onValueChange={() => this._handleSwitch()}
// //                     value={fixed}
// //                 />
// //             </View>
// //             <SubmitButton title="Guardar" onPress={() => this._editExpense()} />
// //         </View></>)
// // }
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Switch, StyleSheet } from 'react-native';
import TextInputValidator from './TextInputValidator';
import DatePicker from 'react-native-date-picker';
import Dropdown from 'react-native-element-dropdown';
import SubmitButton from './SubmitButton';

import * as Color from '../assets/styles/Colors';

class ExpenseForm extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            showDate: false,
        };
    }

    render()
    {
        const { date, amount, description, category, account, fixed, formErrors } = this.props;
        return (

            <View style={styles.form}>
                <Text style={styles.text}>Gasto:</Text>
                <TextInputValidator
                    error={formErrors}
                    errorKey="amount"
                    inputValue={amount}
                    keyboardType="numeric"
                    onChange={(value) => this.props.onChange('amount', value)}
                    placeholder="Cantidad"
                />
                {/* <Text style={styles.text}>Descripción:</Text>
                <TextInputValidator
                    multiline={true}
                    numberOfLines={4}
                    error={formErrors}
                    errorKey="description"
                    inputValue={description}
                    keyboardType="ascii-capable"
                    onChange={(value) => this.props.onChange('description', value)}
                    placeholder="Descripción"
                />
                <Text style={styles.text}>Fecha:</Text>
                <TouchableOpacity onPress={() => this.setState({ showDate: true })} style={styles.datePicker}>
                    <Text style={styles.dateData}>{date.toLocaleDateString('es-ES')}</Text>
                </TouchableOpacity>
                <DatePicker
                    modal
                    locale="es"
                    open={this.state.showDate}
                    date={date}
                    mode="date"
                    onConfirm={(date) =>
                    {
                        this.props.onDateChange(date);
                        this.setState({ showDate: false });
                    }}
                    onCancel={() => this.setState({ showDate: false })}
                />
                <View style={styles.dropdownContainer}>
                    <Text style={styles.dropdownText}>Categoría:</Text>
                    <Dropdown
                        style={styles.dropdown}
                        data={this.props.categories}
                        value={category}
                        labelField="name"
                        valueField="value"
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        maxHeight={300}
                        placeholder="Seleccionar..."
                        onChange={(item) => this.props.onChange('category', item)}
                    />
                </View>
                <View style={styles.dropdownContainer}>
                    <Text style={styles.dropdownText}>Cuenta:</Text>
                    <Dropdown
                        style={styles.dropdown}
                        data={this.props.accounts}
                        value={account}
                        labelField="name"
                        valueField="value"
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        maxHeight={300}
                        placeholder="Seleccionar..."
                        onChange={(item) => this.props.onChange('account', item)}
                    />
                </View>
                <View style={styles.switcher}>
                    <Text style={styles.text}>Gasto fijo:</Text>
                    <Switch
                        trackColor={{ false: Color.orange, true: Color.button }}
                        thumbColor={Color.white}
                        onValueChange={() => this.props.onSwitchChange()}
                        value={fixed}
                    />
                </View> */}
                <SubmitButton title="Añadir" onPress={() => this.props.onSubmitExpense()} />
            </View>
        );
    }
}
const styles = StyleSheet.create({

    container: {
        flex: 1,
        alignItems: 'center'
    },
    selectedTextStyle: {
        fontSize: 16,
        color: Color.firstText
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    errorText: {
        marginLeft: "10%",
        color: Color.orange,
        fontSize: 16,
        alignSelf: 'flex-start'
    },
    inputText: {
        width: "80%",
        color: Color.firstText,
        fontSize: 16,
        marginBottom: "-3%",
    },
    text: {
        width: "80%",
        color: Color.firstText,
        fontSize: 16,
    },
    switcher: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: "80%",
        marginTop: 25,
    },
    dropdown: {
        padding: 5,
        width: 150,
        alignSelf: 'flex-end',
        height: 40,
        borderColor: Color.white,
        borderWidth: 1,
        marginTop: "2%",
        backgroundColor: 'rgba(236, 236, 236, .8)',
        borderRadius: 10
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
    datePicker: {
        width: "80%",
        height: "100%",
        borderBottomWidth: 0.4,
        borderBottomColor: Color.firstText,
        justifyContent: 'flex-end',
        marginBottom: "10%"
    },
    dateData: {
        color: Color.firstText,
        fontSize: 16,
        paddingBottom: 5
    },
    form: {
        width: "80%",
        height: 550,
        paddingVertical: 30,
        marginTop: "10%",
        borderRadius: 20,
        alignItems: "center",
        backgroundColor: 'rgba(236, 236, 236, .8)',
        justifyContent: 'space-between'
    }

});
export default ExpenseForm;
