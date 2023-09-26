

export const ExpenseForm = () =>
{
    return (<>
        <View style={styles.form}>
            <Text style={styles.text}>Gasto:</Text>
            <TextInputValidator
                error={formErrors}
                errorKey="amount"
                inputValue={amount}
                keyboardType="numeric"
                onChange={value => this._handleChange('amount', value)}
                placeholder="Cantidad"
            />
            <Text style={styles.text}>Descripción:</Text>
            <TextInputValidator
                multiline={true}
                numberOfLines={4}
                error={formErrors}
                errorKey="description"
                inputValue={description}
                keyboardType="ascii-capable"
                onChange={value => this._handleChange('description', value)}
                placeholder="Descripción"
            />

            <Text style={styles.text}>Fecha:</Text>
            <TouchableOpacity onPress={() => this.setState({ showDate: true })} style={styles.datePicker}>
                <Text style={styles.dateData}>{date.toLocaleString('es-ES')}</Text>
            </TouchableOpacity >

            <DatePicker
                modal
                locale='es'
                open={showDate}
                date={date}
                mode="date"
                onConfirm={(date) => { this._handleDateChange(date) }}
                onCancel={() => { this.setState({ showDate: false }) }}
            />
            <View style={styles.dropdownContainer}>

                <Text style={styles.dropdownText}>Categoría:</Text>
                <Dropdown
                    style={styles.dropdown}
                    data={categories}
                    value={category}
                    labelField="name"
                    valueField="name"
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    maxHeight={300}
                    placeholder="Seleccionar..."
                    onChange={item =>
                    {
                        this._handleChange('category', item)
                    }}
                />
            </View>
            <View style={styles.dropdownContainer}>

                <Text style={styles.dropdownText}>Cuenta:</Text>
                <Dropdown
                    style={styles.dropdown}
                    data={accounts}
                    value={account}
                    labelField="name"
                    valueField="value"
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    maxHeight={300}
                    placeholder="Seleccionar..."
                    onChange={item =>
                    {
                        this._handleChange('account', item)
                    }}
                />
            </View>
            <View style={styles.switcher}>
                <Text style={styles.text} >Gasto fijo:</Text>
                <Switch
                    style
                    trackColor={{ false: Color.orange, true: Color.button }}
                    thumbColor={Color.white}
                    onValueChange={() => this._handleSwitch()}
                    value={fixed}
                />
            </View>
            <SubmitButton title="Guardar" onPress={() => this._editExpense()} />
        </View></>)
}