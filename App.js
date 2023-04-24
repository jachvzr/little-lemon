// import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { LogBox } from 'react-native';
//import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Splash from './screens/Splash';
import Onboarding from './screens/Onboarding';
import Profile from './screens/Profile';
import Home from './screens/Home';

import { View } from 'react';

import { readData, writeData, clearData } from './functions/AsyncStorageFunctions';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

export default function App() {

  LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
  ]);


  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(null);

  useEffect(() => {
    async function checkOnboardingStatus() {
      try {
        const value = await AsyncStorage.getItem('onboarding');
        setIsOnboardingCompleted(value === 'true');
      } catch (error) {
        // Error retrieving data
      } finally {
      }
    }
    checkOnboardingStatus();
  }, []);

  useEffect(() => {
    async function storeOnboardingCompleted() {
      try {
        await AsyncStorage.setItem('onboarding', JSON.stringify(isOnboardingCompleted));
      } catch (error) {
        console.log(error);
      } 
    }
    storeOnboardingCompleted();
  }, [isOnboardingCompleted]);

  return (

    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {isOnboardingCompleted ? (
          <>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Profile" component={Profile} initialParams={{ setIsOnboardingCompleted: setIsOnboardingCompleted }} />
          </> 
          ) : (
          <>
          <Stack.Screen name="Onboarding" component={Onboarding} initialParams={{ setIsOnboardingCompleted: setIsOnboardingCompleted }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>

  );
};
