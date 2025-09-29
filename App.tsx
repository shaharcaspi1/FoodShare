import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/index';
import { AppProvider } from './src/state/AppContext';


console.log("RootNavigator typeof:", typeof RootNavigator);
console.log("AppProvider typeof:", typeof AppProvider);

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AppProvider>
  );
}