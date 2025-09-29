import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, Alert} from 'react-native';
import { useApp } from '../state/AppContext';

export default function AssignScreen() {
    const {items, people, assignments, setAssignments} = useApp();

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

    const getAssignment = (itemId: string) =>
        assignments.find(item => item.itemId === itemId)

    const togglePerson = (itemId:string, PersonId:string) => {

        setAssignments(prev => {

            const existing = prev.find(item => item.itemId === itemId);
            if (!existing) 
                return [...prev,{itemId,shares: {[PersonId]:1}}];
            
            const next = prev.map(item => (item.itemId === itemId ? {...item ,shares: {...item.shares}} : item));
            const target = next.find(item => item.itemId === itemId);

            if (!target) {
                return prev;
            }

            if (target.shares[PersonId]) {
                delete target.shares[PersonId];
            } else {
                target.shares[PersonId] = 1;
            }

            return next.filter(item => Object.keys(item.shares).length > 0);
        })
    }

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