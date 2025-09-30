import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity} from 'react-native';
import { useApp } from '../state/AppContext';


export default function ItemsScreen() {
    /// import the items and set items from context
    const { items, setItems } = useApp();

    /// create useState arguments for inserting items to list
    const [itemName, setItemName] = useState('');
    const [itemPrice, setItemPrice] = useState('');
    const [itemQuantity, setItemQuantity] = useState('1');

    /// valid checks
    const validName = itemName.trim().length > 0;
    const numPrice = Number(itemPrice);
    const validPrice = !Number.isNaN(numPrice) && numPrice >= 0;
    const numQuantity = Number(itemQuantity);
    const validQuantity = !Number.isNaN(numQuantity) && numQuantity >= 1;
    const valid = validName && validPrice && validQuantity;

    /// add new item to the list
    const addItem = () => {
        if (!valid) return;
        const newItem = {
            id: Date.now().toString(),
            name: itemName.trim(),
            price: numPrice,
            quantity: numQuantity
        };
        setItems(prev => [...prev, newItem]);  
        setItemName('');
        setItemPrice('');
        setItemQuantity('1'); 
    }

    const removeItem = (idRemove: string) => {
        setItems(prev => prev.filter((item) => item.id !== idRemove))
    }

    /// return the screen with all the above implemented
    return (
        <View style = {{flex:1, padding:16, gap:10}}>
            
            <Text style={{fontSize: 22}}>
                Add items
            </Text>

            <TextInput 
            placeholder = 'Item name'
            value = {itemName}
            onChangeText={setItemName}
            style={{borderWidth:1, padding:8, borderRadius:6}}/>

            <TextInput 
            placeholder = 'Price'
            value = {itemPrice}
            onChangeText={setItemPrice}
            keyboardType='numeric'
            style={{borderWidth:1, padding:8, borderRadius:6}}/>

            <TextInput 
            placeholder = 'Quantity'
            value = {itemQuantity}
            onChangeText={setItemQuantity}
            keyboardType='numeric'
            style={{borderWidth:1, padding:8, borderRadius:6}}/>

            <Button title='Add Item' disabled={!valid} onPress={addItem}/>

            <Text style={{fontSize: 22}}>
                Items
            </Text>

            <FlatList
                style={{ marginTop:10 }}
                data = {items}
                keyExtractor={(i) => i.id}
                renderItem={({ item }) => (
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 8 }}>
                        <Text>{item.name} | {item.quantity} * {item.price}</Text>
                        <TouchableOpacity onPress={() => removeItem(item.id)}>
                            <Text style = {{color : 'red'}}> Remove </Text>
                        </TouchableOpacity>
                    </View>
                )}
            />

        </View>
    );
}
