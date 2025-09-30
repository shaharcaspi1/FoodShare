import { computeSplit } from '../logic/computeSplit';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity} from 'react-native';
import { useApp } from '../state/AppContext';

export default function ResultScreen() {
    const {people, items, assignments} = useApp();

    const totals = computeSplit(people,items,assignments);
    const resultData = people.map(person => ({
        id: person.id,
        name: person.name,
        amount: totals[person.id] || 0
    }))
    return(
        <View style={{flex:1, padding:16, gap:10}}>
            <Text style={{fontSize:22}}>
                Split results
            </Text>
            <FlatList
             style={{marginTop:10}}
             data={resultData}
             keyExtractor={(p) => p.id}
             renderItem={({item}) =>(
                <View style={{flexDirection:"row", alignItems:"center",justifyContent:"space-between",paddingVertical:8}}>
                    <Text style={{fontSize:16}}>{item.name}</Text>
                    <Text style={{fontSize:16}}>${item.amount}</Text>
                </View>
             )
            }
            >

            </FlatList>
        </View>
    )
}