import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import ItemsScreen from '../screens/ItemsScreen';

export type RootStackParamList = {
    Home: undefined;
    Items: undefined;
}

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
    console.log(typeof HomeScreen);
    return (
        <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Items" component={ItemsScreen} />
        </Stack.Navigator>
    );
}
