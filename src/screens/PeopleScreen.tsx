import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity} from 'react-native';
import { useApp } from '../state/AppContext';

export default function PeopleScreen(){
    // import people and setPeople from app context
    const {people, setPeople} = useApp();

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

    // remove person from list
    const removePerson = (idRemove: string) => {
        setPeople(prev => prev.filter(p => p.id !== idRemove))
    }
    
    // return screen
    return (
        <View style={{ flex:1, padding:16, gap:10}}>
                <Text style={{fontSize:22}}>
                    Add Friends
                </Text>
                <TextInput
                    placeholder = "Enter Friend's name"
                    value = {name}
                    onChangeText={setName}
                    style = {{borderWidth:1, padding:8, borderRadius:6}}
                />
            <Button title='Add friend' onPress={addPerson} disabled={!valid} />

            <Text style={{fontSize:22}}>
                Friends list
            </Text>

            <FlatList
                style = {{marginTop:10 }}
                data = {people}
                keyExtractor={(p) => p.id}
                renderItem={({ item }) => (
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 8 }}>
                        <Text style={{fontSize:16}}>{item.name}</Text>
                        <TouchableOpacity onPress={() => removePerson(item.id)}>
                            <Text style={{color: "red"}}>Remove</Text>
                        </TouchableOpacity>
                    </View>
                )
            }
            />
        </View>
    )


}