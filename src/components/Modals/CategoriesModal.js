import React from 'react';
import { View, Modal, ScrollView, TouchableOpacity, Text } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Color from '../../assets/styles/Colors';
import { Modals } from '../../assets/styles/Modals';

const CategoriesModal = ({ visible, onClose, categories, onSelectCategory }) =>
{
    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={Modals.modalContainer}>
                <View style={Modals.modalContent}>
                    <TouchableOpacity style={Modals.closeButton} onPress={onClose}>
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
                                style={Modals.modalCategory}
                            >
                                <MaterialCommunityIcons name={category.icon} size={20} color={Color.button} />
                                <Text style={Modals.categoryText}>{category.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}



export default CategoriesModal;
