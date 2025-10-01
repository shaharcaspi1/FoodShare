import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity} from 'react-native';
import { useApp } from '../state/AppContext';
import { styles } from '../models/styles'
import { Item } from '../models/types';


export default function ItemsScreen() {
    // import the items and set items from context
    const { items, setItems, assignments, setAssignments } = useApp();

    // create useState arguments for inserting items to list
    const [itemName, setItemName] = useState('');
    const [itemPrice, setItemPrice] = useState('');
    const [itemQuantity, setItemQuantity] = useState('1');

    // valid checks
    const validName = itemName.trim().length > 0;
    const numPrice = Number(itemPrice);
    const validPrice = !Number.isNaN(numPrice) && numPrice >= 0;
    const numQuantity = Number(itemQuantity);
    const validQuantity = !Number.isNaN(numQuantity) && numQuantity >= 1;
    const valid = validName && validPrice && validQuantity;

    // useState argument to check which id editor is open
    const [editingId, setEditingId] = useState<string | null>(null);

    // create useState argumenst to edit item
    const [editItemName, setEditItemName] = useState('');
    const [editItemPrice, setEditItemPrice] = useState('');
    const editNumPrice = Number(editItemPrice);
    const [editItemQuantity, setEditItemQuantity] = useState('1');
    const editNumQuantity = Number(editItemQuantity);

    // edit valid check
    const editNameValid = editItemName.trim().length > 0;
    const editPriceValid = !Number.isNaN(editNumPrice) && editNumPrice >= 0;
    const editQuantityValid = !Number.isNaN(editNumQuantity) && editNumQuantity >= 1;
    const editValid = editPriceValid && editQuantityValid && editNameValid;

    // add new item to the list
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

    // edit item in list
    const editItem = (idEdit:string) => {
        if (!editValid) return;
        const edited:Item = {
            id: idEdit,
            name: editItemName.trim(),
            price: editNumPrice,
            quantity: editNumQuantity
        }
        setItems(prev => prev.map(item => item.id === idEdit ? edited : item))
    }
    
    // remove item from the list
    const removeItem = (idRemove: string) => {
        setItems(prev => prev.filter((item) => item.id !== idRemove));
        const getAssignment = assignments.find(item => item.itemId === idRemove)
        if (getAssignment) {
            setAssignments(prev => prev.filter((assign) => assign.itemId !== idRemove))
        }
    }

    // compute total sum
    const totalSum = items.reduce((current, it) => current + (it.price * it.quantity), 0);
    
    // return the screen with all the above implemented
    return (
        <View style = {{flex:1, padding:16, gap:10}}>
            
            <Text style={{fontSize: 22}}>
                Add items
            </Text>

            <TextInput 
            placeholder = 'Item name'
            value = {itemName}
            onChangeText={setItemName}
            style={styles.textInputStyle}/>

            <TextInput 
            placeholder = 'Price'
            value = {itemPrice}
            onChangeText={setItemPrice}
            keyboardType='numeric'
            style={styles.textInputStyle}/>

            <TextInput 
            placeholder = 'Quantity'
            value = {itemQuantity}
            onChangeText={setItemQuantity}
            keyboardType='numeric'
            style={styles.textInputStyle}/>

            <Button title='Add Item' disabled={!valid} onPress={addItem}/>

            <Text style={{fontSize: 22}}>
                Items
            </Text>

            <FlatList
                style={styles.flatListStyle}
                data = {items}
                keyExtractor={(i) => i.id}
                renderItem={({ item }) => (
                    <View>
                        <View style={styles.flatListRenderItem}>
                            <Text>{item.name} | {item.quantity} * {item.price}</Text>
                            <TouchableOpacity
                            onPress={() => {
                                const check = editingId === item.id ? null : item.id;
                                setEditingId(check);
                                if (check){
                                    setEditItemName(item.name);
                                    setEditItemPrice(String(item.price));
                                    setEditItemQuantity(String(item.quantity));
                                }
                            }}
                            >
                                <Text style={{color:'blue'}}>{editingId === item.id ? 'Close' : 'Edit'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => removeItem(item.id)}>
                                <Text style={{color:'red'}}>Remove</Text>
                            </TouchableOpacity>
                        </View>
                        {editingId === item.id && (
                                <View style={{paddingVertical:8, gap:6}}>
                                    <TextInput
                                        placeholder='Name'
                                        value={editItemName}
                                        onChangeText={setEditItemName}
                                        style={styles.textInputStyle}/>
                                    <TextInput
                                        placeholder='Price'
                                        value={editItemPrice}
                                        onChangeText={setEditItemPrice}
                                        keyboardType='numeric'
                                        style={styles.textInputStyle}/>
                                    <TextInput
                                        placeholder='Quantity'
                                        value={editItemQuantity}
                                        onChangeText={setEditItemQuantity}
                                        keyboardType='numeric'
                                        style={styles.textInputStyle}/>
                                        <View style={{flexDirection:'row' ,gap:10}}>
                                            <Button
                                                title='Save'
                                                onPress={() => {editItem(item.id); setEditingId(null);}}
                                                disabled={!editValid}
                                            />
                                            <Button
                                                title='Cancel'
                                                onPress={() => {setEditingId(null);}}
                                                color="red"
                                            />
                                            
                                        </View>
                                </View>
                            )}
                    </View>
                )}
            />
        <Text style={styles.text}>
            total = {totalSum}
        </Text>
        </View>
    );
}
