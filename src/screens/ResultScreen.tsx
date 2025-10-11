import { computeSplit } from '../logic/computeSplit';
import { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, Share } from 'react-native';
import { useApp } from '../state/AppContext';
import { styles } from '../models/styles';

const shareList = async (listToShare: string) => {
    try {
        const result = await Share.share({
            message: listToShare
        });

        if (result.action === Share.sharedAction) {
            if (result.activityType) {
                console.log(`Shared with activity type: ${result.activityType}`)
            } else {
                console.log('Shared successfully.');
            }
        } else if (result.action === Share.dismissedAction) {
            console.log('Share dismissed.')
        }
    } catch (err: unknown) {
        if (err instanceof Error){
            console.error('Error sharing:', err.message)
        } else {
            console.error('Error sharing:', err)
        }
    }
}

export default function ResultScreen() {
    // import global vars
    const {people, items, assignments, tip, setTip} = useApp();

    // compute split using computeSplit from app logic
    const totals = computeSplit(people,items,assignments);

    // create temporary tip useState variable
    const [tempTip,setTempTip] = useState(tip);

    // create list with data
    const resultData = people.map(person => ({
        id: person.id,
        name: person.name,
        amount: totals[person.id] || 0
    }))

    

    // create factor to add tip, and display data with tip factored
    const factor = 1 + (+tip || 0) / 100;
    const displayData = resultData.map(p => ({...p, amount: p.amount * factor}));

    // list to share
    const listToShare = displayData.map(person => (person.name +" "+ person.amount.toFixed(0))).join('\n');

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
            <Button title='Share list' onPress={() => shareList(listToShare)}/>
            <Text style={styles.noteText}>Added tip {tip}%</Text>
        </View>
    )
}
