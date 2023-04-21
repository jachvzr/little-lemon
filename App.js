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
  // const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkOnboardingStatus() {
      try {
        const value = await AsyncStorage.getItem('onboarding');
        // alert('isonboardingcompleted: ' + isOnboardingCompleted + ' - reading value...' + value);
        setIsOnboardingCompleted(value === 'true');
      } catch (error) {
        // Error retrieving data
      } finally {
        // setIsLoading(false);
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

  // const handleOnboardingComplete = async () => {
  //   try {
  //     await AsyncStorage.setItem('@onboarding_completed', 'true');
  //     setIsOnboardingCompleted(true);
  //   } catch (error) {
  //     // Error saving data
  //   }
  // };

  // useEffect(() => {
  //   const checkOnboarding = async () => {
  //     const onboardingComplete = await readData('onboarding');
  //     if (onboardingComplete === 'true') {
  //       setIsOnboardingCompleted(true);
  //     }
  //     else {
  //       await writeData('onboarding', 'true');
  //     }
  //     // setIsLoading(false);
  //   };
  //   checkOnboarding();
  // }, [])

  // if (isLoading) {
  //   return <Splash />;
  // }

  return (
    // <View>
    // { isOnboardingCompleted ? <Profile /> : <Onboarding /> }
    // </View>


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


// // import { View } from 'react-native';
// import React, { useState, useEffect } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';

// import AsyncStorage from '@react-native-async-storage/async-storage';

// import Onboarding from './screens/Onboarding';
// import Profile from './screens/Profile';
// import SplashScreen from './screens/Splash';

// const Stack = createNativeStackNavigator();

// function App() {
//   const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
//   const [loading, setLoading] = useState(true);

//   const handleLogout = async () => {
//     setIsOnboardingCompleted(false);
//     await AsyncStorage.clear();
//   };

//   useEffect(() => {
//     // check if onboarding is complete
//     AsyncStorage.getItem('onboarding_complete').then(value => {
//       setIsOnboardingComplete(value === 'true');
//       setLoading(false);
//     });
//   }, []);

//   useEffect(() => {
//     // persist onboarding status
//     AsyncStorage.setItem('onboarding_complete', isOnboardingComplete.toString());
//   }, [isOnboardingComplete]);

//   if (loading) {
//     return <SplashScreen />;
//   }

//   if (!isOnboardingComplete) {
//     return (
//       <NavigationContainer>
//         <Stack.Navigator>
//           <Stack.Screen name="Onboarding" component={Onboarding} />
//           {(props) => <Onboarding {...props} onboardingComplete={setIsOnboardingComplete} />}
//         </Stack.Navigator>
//       </NavigationContainer>
//     );
//   }

//   return (
//     <NavigationContainer>
//       <Stack.Navigator>
//         <Stack.Screen name="Profile" component={Profile} />
//         {(props) => <Profile {...props} logout={handleLogout} />}
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

// // export default function App() {

// //   const [isLoading, setIsLoading] = useState(true);
// //   const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);

// //   const handleOnboardingComplete = () => {
// //     setIsOnboardingCompleted(true);
// //   };

// //   useEffect(() => {
// //     async function checkOnboardingCompleted() {
// //       try {
// //         const value = await AsyncStorage.getItem('isOnboardingCompleted');
// //         //alert(value);
// //         if (value !== null) {
// //           setIsOnboardingCompleted(value === 'true');
// //         }
// //       } catch (error) {
// //         console.log(error);
// //       } finally {
// //         setIsLoading(false);
// //       }
// //     }
// //     checkOnboardingCompleted();
// //   }, []);

// //   useEffect(() => {
// //     async function storeOnboardingCompleted() {
// //       try {
// //         await AsyncStorage.setItem('isOnboardingCompleted', JSON.stringify(isOnboardingCompleted));
// //       } catch (error) {
// //         console.log(error);
// //       } 
// //     }
// //     storeOnboardingCompleted();
// //   }, [isOnboardingCompleted]);

// //   const handleLogout = async () => {
// //     setIsOnboardingCompleted(false);
// //     await AsyncStorage.clear();
// //   };


// //   // if (isLoading) {
// //   //    // We haven't finished reading from AsyncStorage yet
// //   //   return <Splash />;
// //   // } else if (!isOnboardingCompleted) {
// //   //   return <Onboarding setIsOnboardingCompleted={setIsOnboardingCompleted} />
// //   // } else {
// //   //   return <Profile setIsOnboardingCompleted={setIsOnboardingCompleted} />
// //   // }

// //   // return (
// //   //   <NavigationContainer>
// //   //     <Stack.Navigator>
// //   //       {
// //   //       // isLoading ? 
// //   //       // ( <Stack.Screen name="Splash" component={Splash}/>) : 
// //   //       // ( 
// //   //       isOnboardingCompleted ?
// //   //       (<Stack.Screen name="Profile" component={Profile} options={handleLogout}/>) :
// //   //       (<Stack.Screen name="Onboarding" component={Onboarding} options={setIsOnboardingCompleted}/>)
// //   //       // )
// //   //       }
// //   //     </Stack.Navigator>
// //   //   </NavigationContainer>
// //   // );

// //   // return (
// //   //   <NavigationContainer>
// //   //     <Stack.Navigator>
// //   //       { isOnboardingCompleted ?
// //   //       (<Stack.Screen name="Profile" component={Profile}/>) :
// //   //       (<Stack.Screen name="Onboarding" component={Onboarding} options={{setIsOnboardingCompleted}}/>)}
// //   //     </Stack.Navigator>
// //   //   </NavigationContainer>
// //   // );

// //   return (
// //     <NavigationContainer>
// //       <Stack.Navigator>
// //         {isLoading ? (
// //           <Stack.Screen name="Splash" component={Splash} />
// //         ) : isOnboardingCompleted ? (
// //           <Stack.Screen name="Profile" component={Profile} />
// //         ) : (
// //           <Stack.Screen name="Onboarding" component={Onboarding} initialParams={{ handleOnboardingComplete }}/>
// //         )}
// //       </Stack.Navigator>
// //     </NavigationContainer>
// //   );


// //   //   return (
// //   //    <Stack.Navigator>
// //   //      {state.isOnboardingCompleted ? (
// //   //        // Onboarding completed, user is signed in
// //   //        <Stack.Screen name="Profile" component={Profile} />
// //   //      ) : (
// //   //        // User is NOT signed in
// //   //        <Stack.Screen name="Onboarding" component={Onboarding} />
// //   //      )}
// //   //    </Stack.Navigator>
// //   //   );



// //   // return (
// //   //   <NavigationContainer>
// //   //     <Stack.Navigator>
// //   //       <Stack.Screen name="Onboarding" component={Onboarding} />
// //   //     </Stack.Navigator>
// //   //   </NavigationContainer>
// //   // );
// // }