import React from 'react';
import { useApp } from '../state/AppContext';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';

// create type for home screen navugation
export type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;


// screen function
export default function HomeScreen() {
    // navigation variable
    const navigation = useNavigation<HomeScreenNavigationProp>();

    // import people, item, assignments global vars
    const  { people, items, assignments } = useApp();

    // checks for enabling assign and split screens
    const assignVaild = (people.length !== 0 && items.length !== 0);
    const splitVaild = (people.length !== 0 && items.length !== 0 && assignments.length == items.length);

    // return home screen
    // right now button to each screen, UI to be changed
    return (
        <View>
            <Text style={{
                fontSize:18,
                textAlign:"center",
                marginTop:10,
                marginBottom:10}}>
                Welcome to FoodShare,{"\n"}
                an app to help you figure out the pays{"\n"}
                at the end of the meal,{"\n"}
                without open the calculator
            </Text>
            <View style={{margin:5}}>
                <Button title="Add Items"
                onPress={() => navigation.navigate('Items')}
                />
            </View>
            <View style={{margin:5}}>
                <Button title="Add Friends"
                onPress={() => navigation.navigate('People')}
                />
            </View>
            <View style={{margin:5}}>
                <Button title="Assign"
                onPress={() => navigation.navigate('Assign')}
                disabled={!assignVaild}
                />
            </View>
            <View style={{margin:5}}>
                <Button title="Split"
                onPress={() => navigation.navigate('Result')}
                disabled={!splitVaild}
                />
            </View>
            
        </View>
    );
}