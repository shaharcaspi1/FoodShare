import { computeSplit } from '../logic/computeSplit';
import { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity} from 'react-native';
import { useApp } from '../state/AppContext';

export default function ResultScreen() {
    // import global vars
    const {people, items, assignments, tip, setTip} = useApp();

    // compute split using computeSplit from app logic
    const totals = computeSplit(people,items,assignments);

    // create temporary tip useState variable
    const [tempTip,setTempTip] = useState(tip);

    // crrate list with data
    const resultData = people.map(person => ({
        id: person.id,
        name: person.name,
        amount: totals[person.id] || 0
    }))

    // create factor to add tip, and display data with tip factored
    const factor = 1 + (+tip || 0) / 100;
    const displayData = resultData.map(p => ({...p, amount: p.amount * factor}));

    // check for valid tip and tempTip
    const numTip = Number(tip);
    const valid = !Number.isNaN(numTip) && numTip >= 0;
    const tempValid = !Number.isNaN(tempTip) && +tempTip >= 0;

    // return screen
    return(
        <View style={{flex:1, padding:16, gap:10}}>
            <Text style={{fontSize:22}}>
                Split results
            </Text>
            <TextInput
                placeholder = 'Tip (in %)'
                value = {tempTip}
                onChangeText={setTempTip}
                keyboardType='numeric'
                style={{borderWidth:1, padding:8, borderRadius:6}}
            />

            <Button title='Add Tip' disabled={!(valid && tempValid)} onPress={() => setTip(tempTip)}/>

            <FlatList
             style={{marginTop:10}}
             data={displayData}
             keyExtractor={(p) => p.id}
             renderItem={({item}) =>(
                <View style={{flexDirection:"row", alignItems:"center",justifyContent:"space-between",paddingVertical:8}}>
                    <Text style={{fontSize:16}}>{item.name}</Text>
                    <Text style={{fontSize:16}}>${item.amount.toFixed(0)}</Text>
                </View>
             )}>
            </FlatList>
            <Text style={{fontSize:16,fontWeight:"thin"}}>Added tip {tip}%</Text>
        </View>
    )
}