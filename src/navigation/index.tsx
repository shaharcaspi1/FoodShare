import React from 'react';
// import screens
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import ItemsScreen from '../screens/ItemsScreen';
import PeopleScreen from '../screens/PeopleScreen';
import AssignScreen from '../screens/AssignScreen';
import ResultScreen from '../screens/ResultScreen';

// create type for root navigation
export type RootStackParamList = {
    Home: undefined;
    Items: undefined;
    People: undefined;
    Assign: undefined;
    Result: undefined;
}

// create var Stack for navigator 
const Stack = createNativeStackNavigator<RootStackParamList>();

// default function for navigation
export default function RootNavigator() {
    return (
        <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Items" component={ItemsScreen} />
            <Stack.Screen name="People" component={PeopleScreen} />
            <Stack.Screen name="Assign" component={AssignScreen} />
            <Stack.Screen name="Result" component={ResultScreen} />
        </Stack.Navigator>
    );
}
