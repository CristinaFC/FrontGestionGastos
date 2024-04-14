import React from 'react';
import { View, Modal, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Color from '../../assets/styles/Colors';

const CategoriesModal = ({ visible, onClose, categories, onSelectCategory }) =>
{
    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <MaterialCommunityIcons name="close" size={20} color={Color.orange} />
                    </TouchableOpacity>

                    <ScrollView>
                        {categories && categories.length > 0 && categories.map(category => (
                            <TouchableOpacity
                                key={category.uid}
                                onPress={() =>
                                {
                                    onClose();
                                    onSelectCategory(category);
                                }}
                                style={styles.modalCategory}
                            >
                                <MaterialCommunityIcons name={category.icon} size={20} color={Color.button} />
                                <Text style={styles.categoryText}>{category.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
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
    closeButton: {
        alignSelf: 'flex-end',
    },
    modalCategory: {
        width: "100%",
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: Color.bodyBackground,
        height: 40,
        alignItems: 'center'
    },
    categoryText: {
        color: Color.firstText,
        marginLeft: 10,
    },
});

export default CategoriesModal;
