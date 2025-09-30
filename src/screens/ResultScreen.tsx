import { computeSplit } from '../logic/computeSplit';
import { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity} from 'react-native';
import { useApp } from '../state/AppContext';

export default function ResultScreen() {
    const {people, items, assignments, tip, setTip} = useApp();
    const totals = computeSplit(people,items,assignments);
    const [tempTip,setTempTip] = useState(tip);

    const resultData = people.map(person => ({
        id: person.id,
        name: person.name,
        amount: totals[person.id] || 0
    }))

    const factor = 1 + (+tip || 0) / 100;
    const displayData = resultData.map(p => ({...p, amount: p.amount * factor}));

    const numTip = Number(tip);
    const valid = !Number.isNaN(numTip) && numTip >= 0;
    const tempValid = !Number.isNaN(tempTip) && +tempTip >= 0;

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
                    <Text style={{fontSize:16}}>${item.amount}</Text>
                </View>
             )}>
            </FlatList>
            <Text style={{fontSize:16,fontWeight:"thin"}}>Added tip {tip}%</Text>
        </View>
    )
}