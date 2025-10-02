import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, Alert} from 'react-native';
import { useApp } from '../state/AppContext';

export default function AssignScreen() {
    // import global vars
    const {items, people, assignments, setAssignments} = useApp();

    // check assignments is possible
    if (items.length == 0 || people.length == 0){
        return (
            <View style = {{flex:1, justifyContent:'center', padding:20}}>
                <Text style = {{fontSize:18, textAlign:'center'}}>
                    {items.length == 0
                    ? "Add items before assigning."
                    : "Add people before assigning."}
                </Text>
            </View>
        )
    }

    // get assignment from list
    const getAssignment = (itemId: string) =>
        assignments.find(item => item.itemId === itemId)

    // toggle person to share or not share item
    // input: itemId, personId
    // output: assigmnets list with not empty items
    const togglePerson = (itemId:string, PersonId:string) => {
        // use setAssignment to change the list
        setAssignments(prev => {
            // check if other assigned to item already
            const existing = prev.find(item => item.itemId === itemId);
            // if no one assigned => add the item to list, and return
            if (!existing) 
                return [...prev,{itemId,shares: {[PersonId]:true}}];
            
            // if item exist in list => create new list with that item that can be modified and copy all the other item as they are
            // this method aviod unnecessary renders
            const next = prev.map(item => (item.itemId === itemId ? {...item ,shares: {...item.shares}} : item));

            // find the item in the new list
            const target = next.find(item => item.itemId === itemId);

            // if there is no target, throw error
            if (!target) 
                throw new Error("Target must exist")
            
            // if person is sharing item => remove person
            if (target.shares[PersonId]) {
                delete target.shares[PersonId];
            
            // else => add person to sharing
            } else {
                target.shares[PersonId] = true;
            }

            // return new list with modification
            return next.filter(item => Object.keys(item.shares).length > 0);
        })
    }

    // create itemCard for displaying
    const ItemCard = ({id, name, price, quantity}:{id: string; name: string; price: number; quantity: number}) => {
        const itemAssign = getAssignment(id);
        const selectedCount = itemAssign ? Object.keys(itemAssign.shares).length : 0;

        return (
            <View style = {{borderWidth:1, borderRadius:12, padding:12, marginBottom:12}}>
                <View style = {{flexDirection: "row",justifyContent:"space-between",marginBottom:8}}>
                    <Text style={{fontSize: 16,fontWeight:"600"}}>
                        {name}{"\n"}
                        <Text style = {{fontSize: 12, fontWeight:"normal"}}>{price} * {quantity}</Text>
                    </Text>
                    <Text style = {{opacity: 0.7}}>{selectedCount} selected</Text>
                </View> 
            <View style = {{flexDirection:"row", gap:8, flexWrap:"wrap"}}>
                {people.map(p => {
                    const isOn = !!itemAssign?.shares[p.id];
                    return (
                        <TouchableOpacity
                        key = {p.id}
                        onPress={() => togglePerson(id,p.id)}
                        style = {{
                            borderWidth:1,
                            borderRadius: 20,
                            paddingVertical: 6,
                            paddingHorizontal: 12,
                            backgroundColor: isOn ? "rgba(0,0,0,0.08)" : "transparent"
                        }}
                        >
                            <Text>{p.name}</Text>
                        </TouchableOpacity>
                    )
                })}
            </View>
            

            </View> 
        )
    }
    
    // return screen
    return (
        <View style = {{flex:1,padding:16}}>
            <Text style = {{fontSize:22, marginBottom:10}}>Assign people to items</Text>
            <FlatList
                data={items}
                keyExtractor = {(i) => i.id}
                renderItem={({ item }) => (
                    <ItemCard id={item.id} name={item.name} price={item.price} quantity={item.quantity} />
                )}
            />

        </View>
    );
}