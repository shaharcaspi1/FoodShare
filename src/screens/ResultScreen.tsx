import { computeSplit } from '../logic/computeSplit';
import { useState } from 'react';
import { View, Text, TextInput, Button, FlatList } from 'react-native';
import { useApp } from '../state/AppContext';
import { styles } from '../models/styles';

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
        <View style={styles.screenContainer}>
            <Text style={styles.header}>
                Split results
            </Text>
            <TextInput
                placeholder = 'Tip (in %)'
                value = {tempTip}
                onChangeText={setTempTip}
                keyboardType='numeric'
                style={styles.textInputStyle}
            />

            <Button title='Add Tip' disabled={!(valid && tempValid)} onPress={() => setTip(tempTip)}/>

            <FlatList
             style={styles.flatListStyle}
             data={displayData}
             keyExtractor={(p) => p.id}
             renderItem={({item}) =>(
                <View style={styles.row}>
                    <Text style={styles.text}>{item.name}</Text>
                    <Text style={styles.text}>${item.amount.toFixed(0)}</Text>
                </View>
             )}>
            </FlatList>
            <Text style={styles.noteText}>Added tip {tip}%</Text>
        </View>
    )
}
