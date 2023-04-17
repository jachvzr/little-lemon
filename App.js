// import { View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';


import Onboarding from './screens/Onboarding';
import Profile from './screens/Profile';
import Splash from './screens/Splash';

const Stack = createNativeStackNavigator();

export default function App() {

  const [isLoading, setIsLoading] = useState(true);
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);

  useEffect(() => {
    async function checkOnboardingCompleted() {
      try {
        const value = await AsyncStorage.getItem('isOnboardingCompleted');
        if (value !== null) {
          setIsOnboardingCompleted(value === 'true');
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
  }, []);




  if (isLoading) {
     // We haven't finished reading from AsyncStorage yet
    return <Splash />;
  } else if (!isOnboardingCompleted) {
    return <Onboarding setIsOnboardingCompleted={setIsOnboardingCompleted} />
  } else {
    return <Profile />
  }
    
  //   return (
  //    <Stack.Navigator>
  //      {state.isOnboardingCompleted ? (
  //        // Onboarding completed, user is signed in
  //        <Stack.Screen name="Profile" component={Profile} />
  //      ) : (
  //        // User is NOT signed in
  //        <Stack.Screen name="Onboarding" component={Onboarding} />
  //      )}
  //    </Stack.Navigator>
  //   );



  // return (
  //   <NavigationContainer>
  //     <Stack.Navigator>
  //       <Stack.Screen name="Onboarding" component={Onboarding} />
  //     </Stack.Navigator>
  //   </NavigationContainer>
  // );
}