import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, Pressable} from 'react-native';
import { useApp } from '../state/AppContext';
import { styles } from '../models/styles'

export default function PeopleScreen(){
    // import people and setPeople from app context
    const {people, setPeople, assignments, setAssignments} = useApp();

    // create name and setName to use in addPerson func
    const [name,setName] = useState("");

    // check name valid
    const valid = name.trim().length > 0;

    // add person to list
    const addPerson = () => {
        if (!valid) return;
        const newPerson = {
            id: Date.now().toString(),
            name: name.trim(),
        };
        setPeople(prev =>[...prev, newPerson]);
        setName("");
    }

    // remove person from list and all assignments
    const removePerson = (idRemove: string) => {
        setPeople(prev => prev.filter(p => p.id !== idRemove))
        setAssignments(prev =>
            prev.map(assign => {
                if (!assign.shares || !(idRemove in assign.shares)) return assign;
                const { [idRemove]: _, ...restShares} = assign.shares;
                return {...assign, shares:restShares};
            })
            .filter(assign => Object.keys(assign.shares ?? {}).length > 0)
        );
    }
    
    // return screen
    return (
        <View style={styles.peopleParent}>
                <Text style={styles.header}>
                    Add Friends
                </Text>
                <TextInput
                    placeholder = "Enter Friend's name"
                    value = {name}
                    onChangeText={setName}
                    style = {{borderWidth:1, padding:8, borderRadius:6}}
                />
            <Button title='Add friend' onPress={addPerson} disabled={!valid} />

            <Text style={styles.header}>
                Friends list
            </Text>

            <FlatList
                style = {styles.flatListStyle}
                data = {people}
                keyExtractor={(p) => p.id}
                renderItem={({ item }) => (
                    <View style={styles.flatListRenderItem}>
                        <Text style={styles.text}>{item.name}</Text>
                        <TouchableOpacity onPress={() => removePerson(item.id)}>
                            <Text style={{color:"red"}}>Remove</Text>
                        </TouchableOpacity>
                    </View>
                )
            }
            />
        </View>
    )


}