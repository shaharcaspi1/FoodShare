import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, Alert, Image, ActivityIndicator} from 'react-native';
import { useApp } from '../state/AppContext';
import { styles } from '../models/styles'
import { Item } from '../models/types';
import { pickImage, captureImage} from '../util/pickImage';
import uploadReceipt from '../api/receipt';


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
    
    // add from photo function
    const [busy, setBusy] = useState<'idle'|'picking'|'uploading'|'parsing'>('idle');
    const [previewUri, setPreviewUri] = useState<string | null>(null);

    const onScanGalleryPress = async () => {
        try {
            setBusy('picking');
            const picked = await pickImage();
            if (!picked) {(setBusy('idle')); return;}
            
            setPreviewUri(picked);

            setBusy('uploading');

            setBusy('parsing');
            const {items: parsed} = await uploadReceipt(picked)

            const newScaned = parsed.map((i,index) =>({
                id: Date.now().toString() + String(index),
                name: i.name,
                price: i.price,
                quantity: i.qty,
            }))
            
            setItems(prev => [...prev, ...newScaned]);

            Alert.alert('Imported', `Added ${parsed.length} item(s).`);
            } catch (e: any) {
                console.error(e);
                Alert.alert('Import failed', e?.message ?? 'Unknown error');
            } finally {
                setBusy('idle');
            }
        }

    
        const onScanCameraPress = async () => {
            try {
                setBusy('picking');
                const picked = await captureImage();
                if (!picked) {(setBusy('idle')); return;}
                
                setPreviewUri(picked);
    
                setBusy('uploading');
    
                setBusy('parsing');
                const {items: parsed} = await uploadReceipt(picked)
    
                const newScaned = parsed.map((i,index) =>({
                    id: Date.now().toString() + String(index),
                    name: i.name,
                    price: i.price,
                    quantity: i.qty,
                }))
                
                setItems(prev => [...prev, ...newScaned]);
    
                Alert.alert('Imported', `Added ${parsed.length} item(s).`);
                } catch (e: any) {
                    console.error(e);
                    Alert.alert('Import failed', e?.message ?? 'Unknown error');
                } finally {
                    setBusy('idle');
                }
            }
    // return the screen with all the above implemented
    return (
        <View style={styles.screenContainer}>
            
            <Text style={styles.header}>
                Add items
            </Text>
            <View style={{flexDirection:"row", justifyContent:"space-between"}}>
                {previewUri === null &&
                (<Button title='Scan from gallery' onPress={onScanGalleryPress}/>)}

                {previewUri === null &&
                (<Button title='Scan from picture' onPress={onScanCameraPress}/>)}
                {busy !== 'idle' && <ActivityIndicator/>}
                
                <View style={{flexDirection:"column", justifyContent:"center", flex:1}}>
                    {previewUri && (
                        <Image source={{ uri: previewUri }} style={styles.previewImage} />
                    )}
                    {previewUri && (
                        <Button title='Retry scan' onPress={() => setPreviewUri(null)}/>
                    )}
                </View>
            </View>
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

            <Text style={styles.header}>
                Items
            </Text>

            <FlatList
                style={styles.flatListStyle}
                data = {items}
                keyExtractor={(i) => i.id}
                renderItem={({ item }) => (
                    <View>
                        {/* items list */}
                        <View style={styles.flatListRenderItem}>
                            <Text style={styles.listItemTitle} numberOfLines={1} ellipsizeMode='tail'>
                                {item.name} | {item.quantity} * {item.price}
                            </Text>
                            <View style={styles.listItemActions}>
                                {/* edit button */}
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
                                    <Text style={styles.linkEdit}>{editingId === item.id ? 'Close' : 'Edit'}</Text>
                                </TouchableOpacity>

                                {/* remove button */}
                                <TouchableOpacity onPress={() => removeItem(item.id)}>
                                    <Text style={styles.linkRemove}>Remove</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* edit button expanded*/}
                        {editingId === item.id && (
                            <View style={styles.editSection}>
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
                                <View style={styles.editButtonsRow}>
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
        {/* total */}
        <Text style={styles.text}>
            Total = {totalSum}
        </Text>
        </View>
    );
}
