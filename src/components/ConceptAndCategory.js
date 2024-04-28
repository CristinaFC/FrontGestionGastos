import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Color from '../assets/styles/Colors';
import { Style } from '../assets/styles/Style';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { TextInputValidator } from './TextInputValidator';
import CategoriesModal from './Modals/CategoriesModal';


class ConceptAndCategory extends Component
{

    constructor(props)
    {
        super(props);
        this.state = {
            showCategoriesModal: false,
        }
    }

    render()
    {
        const { concept, categories, formErrors, onChangeConcept, onChangeCategory, category, editable = true } = this.props
        const { showCategoriesModal } = this.state
        return (
            <View style={styles.container}>
                <TextInputValidator
                    multiline={true}
                    numberOfLines={4}
                    error={formErrors}
                    errorKey="concept"
                    inputValue={concept}
                    keyboardType="ascii-capable"
                    onChange={onChangeConcept}
                    placeholder="Concepto"
                    title="Concepto"
                    style={styles.input}
                    editable={editable}
                />
                {formErrors.find(error => error.key === "category") !== undefined ?
                    <Text style={styles.errorText}>*</Text> : null}
                <TouchableOpacity onPress={() => editable && this.setState({ showCategoriesModal: true })} style={[styles.categoryIcon, { borderColor: category ? Color.button : Color.firstText }]}>
                    {category ?
                        <MaterialCommunityIcons name={category.icon} size={25} color={Color.button} />
                        : <Icon name="tag" size={Style.DEVICE_FIVE_PERCENT_WIDTH} color={Color.firstText} />
                    }
                </TouchableOpacity >
                <CategoriesModal
                    visible={showCategoriesModal}
                    onClose={() => this.setState({ showCategoriesModal: false })}
                    categories={categories}
                    onSelectCategory={onChangeCategory} />
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    input: {
        width: Style.DEVICE_EIGHTY_PERCENT_WIDTH,
    },
    categoryIcon: {
        borderWidth: 0.8,
        borderRadius: 5,
        padding: 10,
        marginBottom: 10
    },
    errorText: {
        marginTop: 10,
        alignSelf: 'flex-start',
        color: Color.orange,
        textAlign: 'right',
        height: 10,
    },
});


export default ConceptAndCategory;
