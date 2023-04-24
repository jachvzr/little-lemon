import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { TextInput } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';

import { validEmail, validName } from '../utils/index';
import { readData, writeData } from '../functions/AsyncStorageFunctions';

import { KeyboardAvoidingView, SafeAreaView, Pressable, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LogBox } from 'react-native';

const Onboarding = ({ route }) => {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  // //const navigation = useNavigation();

  const handleOnPress = async () => {
  //   // Save user data to local storage and mark onboarding as complete
  //   try {
  //       await AsyncStorage.setItem('@onboarding_completed', 'true');
  //       route.params.onboardingComplete();
  //       navigation.navigate('Profile');
  //     } catch (error) {
  //       // Error saving data
  //     }
      
  };

  useEffect(() => {
    async function dataFromOnboarding() {
      try {
        const rName = await AsyncStorage.getItem('firstName');
        setFirstName(rName);
        const rEmail = await AsyncStorage.getItem('email');
        setEmail(rEmail);
      } catch (error) {
        // Error retrieving data
        console.log(error);
      } finally {
        // setIsLoading(false);
      }
    }
    dataFromOnboarding();
  }, []);

  const validateName = async () => {
    if (firstName !== null) {
      const value = firstName.trim();
      if (validName(value)) {
        setFirstName(value);
        writeData('firstName',value);
        // alert(email);
      } 
    }
  };

  const validateEmail = async () => {
    if (email !== null) {
      const value = email.trim();
      if (validEmail(value)) {
        setEmail(value);
        writeData('email',value);
        // alert(email);
      } 
    }
  };

  const buttonEnabled = () => {
    if (email !== null && firstName !== null) {
      return true;
    }
    return false;
  }

  const nextButtonPressed = () => {
    if (buttonEnabled()) {
      if (!validName(firstName)) {
        alert('not valid name');
      } else if (!validEmail(email)) {
        alert('not valid email');
      } else {

        writeData('email', email);
        writeData('firstName', firstName);

        // navigation.navigate('Profile');
        // writeData('onboarding','true');
        route.params.setIsOnboardingCompleted(true);
      }
    }
  };

  LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
  ]);

  return (

    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

    {/* <SafeAreaView> */}
    <ScrollView>

    <View style={styles.header}>

      <Text style={styles.headerText}>
      </Text>

      <Image
        style={styles.logo}
        resizeMode='contain'
        source={require('../assets/Logo.png')}
      />

    </View>

    <View style={styles.body}>
    

      <Text style={styles.title}>
        Let us get to know you
      </Text>

      <View style={styles.form}>

        <Text style={styles.regularText}>
          First Name
        </Text>
        <TextInput
          style={styles.inputBox}
          value={firstName}
          onChangeText={setFirstName}
          onEndEditing={validateName}
          placeholder={'enter your name'}
          keyboardType={'default'}
        />

        <Text style={styles.regularText}>
          Email
        </Text>
        <TextInput
          style={styles.inputBox}
          value={email}
          onChangeText={setEmail}
          onEndEditing={validateEmail}
          placeholder={'email'}
          keyboardType={'email-address'}
          // secureTextEntry={true}
        />

        <Pressable onPress={nextButtonPressed}
        style={buttonEnabled() ? styles.buttonEnabled : styles.buttonDisabled}>
          <Text style={buttonEnabled() ? styles.buttonText : styles.buttonDisabledText}>Next</Text>
        </Pressable>

      </View>

    </View>

    </ScrollView>
    {/* </SafeAreaView> */}
    
    </TouchableWithoutFeedback>
    </KeyboardAvoidingView>

  );

};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    // height: '100%',
    // backgroundColor: '#EDEFEE',
    backgroundColor: '#495E57',
    alignSelf: 'stretch',
    // alignItems: 'center',
    // justifyContent: 'center',
    // justifyContent: 'space-evenly',
  },
  header: {
    paddingTop: 30,
    color: '#EDEFEE',
    backgroundColor: '#EDEFEE',
    // backgroundColor: 'blue',
    // width: '100%',
    // height: '18%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    textAlign: 'center',
    fontSize: 36,
  },
  body: {
    // flexGrow: 1,
    //fontSize: 32,
    color: '#EDEFEE',
    textAlign: 'center',
    backgroundColor: '#495E57',
    // width: '100%',
    // height: '82%',
    // padding: 24,
    // justifyContent: 'center',
  },
  form: {
    padding: 20,
    // fontSize: 32,
    // color: '#EDEFEE',
    //textAlign: 'center',
  },
  title: {
    paddingVertical: 100,
    fontSize: 36,
    textAlign: 'center',
    color: '#EDEFEE',
  },
  regularText: {
    fontSize: 24,
    marginTop: 24,
    marginBottom: 12,
    color: '#EDEFEE',
    textAlign: 'center',
  },
  inputBox: {
    height: 60,
    // margin: 12,
    //borderWidth: 2,
    borderRadius: 18,
    paddingHorizontal: 24,
    fontSize: 18,
    borderColor: '#333333',
    backgroundColor: '#EDEFEE',
  },
  buttonEnabled: {
    backgroundColor: '#F4CE14',
    padding: 18,
    borderRadius: 18,
    marginTop: 60,
    marginLeft: 220,
  },
  buttonDisabled: {
    backgroundColor: '#BBBBBB',
    padding: 18,
    borderRadius: 18,
    marginTop: 60,
    marginLeft: 220,
  },
  buttonText: {
    fontSize: 24,
    textAlign: 'center',
    color: '#333333',
    fontWeight: 'bold',
  },
  buttonDisabledText: {
    fontSize: 24,
    textAlign: 'center',
    color: '#888888',
    fontWeight: 'bold',
  },
  logo: {
    height: 120,
    width: 200,
    marginBottom: 0
  },
});

export default Onboarding;


// //import { StatusBar } from 'expo-status-bar';
// import React from 'react';
// import { useState } from 'react';
// import { StyleSheet, Text, TextInput, View, Pressable, Image, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback } from 'react-native';
// import { validateEmail, validateName } from '../utils';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// export default function Onboarding({ navigation, props }) {

//   const [email, onChangeEmail] = useState('');
//   const [name, onChangeName] = useState('');

//   // const handleOnboardingComplete = route.params.handleOnboardingComplete;

//   const displayMessage = () => {
//     if ((validateEmail(email) != null) && (validateName(name) != null)) {
//       //alert("Thanks for subscribing. Stay tuned!");
//       //onChangeEmail('');
//       //////setIsOnboardingCompleted(true);
//       //handleOnboardingComplete();
//       props.onboardingcomplete;
//       navigation.navigate('Profile');
//     }
//   };

//   AsyncStorage.clear();

//   return (
//     <KeyboardAvoidingView behavior="padding" style={styles.container}>

//       <View style={styles.header}>

//         <Text style={styles.headerText}>
//         </Text>

//         <Image
//           style={styles.logo}
//           resizeMode='contain'
//           source={require('../assets/Logo.png')}
//         />

//       </View>

//       <View style={styles.body}>

//         <Text style={styles.title}>
//           Let us get to know you
//         </Text>

//         <View style={styles.form}>

//           <Text style={styles.regularText}>
//             First Name
//           </Text>
//           <TextInput
//             style={styles.inputBox}
//             value={name}
//             onChangeText={onChangeName}
//             placeholder={'enter your name'}
//             keyboardType={'default'}
//           />

//           <Text style={styles.regularText}>
//             Email
//           </Text>
//           <TextInput
//             style={styles.inputBox}
//             value={email}
//             onChangeText={onChangeEmail}
//             placeholder={'email'}
//             keyboardType={'email-address'}
//             // secureTextEntry={true}
//           />

//           <Pressable onPress={displayMessage}
//           style={(validateEmail(email) != null) && (validateName(name) != null) ? styles.buttonEnabled : styles.buttonDisabled}>
//             <Text style={styles.buttonText}>Next</Text>
//           </Pressable>

//         </View>

//       </View>

//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     // flex: 1,
//     // height: '100%',
//     // backgroundColor: '#fff',
//     // alignItems: 'center',
//     // justifyContent: 'center',
//   },
//   header: {
//     //paddingTop: 100,
//     color: '#EDEFEE',
//     //backgroundColor: '#F4CE14',
//     backgroundColor: '#EDEFEE',
//     width: '100%',
//     height: '16%',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   headerText: {
//     textAlign: 'center',
//     fontSize: 36,
//   },
//   body: {
//     // flexGrow: 1,
//     //fontSize: 32,
//     color: '#EDEFEE',
//     textAlign: 'center',
//     backgroundColor: '#495E57',
//     width: '100%',
//     height: '84%',
//     padding: 24,
//     // justifyContent: 'center',
//   },
//   form: {
//     // padding: 20,
//     // fontSize: 32,
//     // color: '#EDEFEE',
//     //textAlign: 'center',
//   },
//   title: {
//     paddingVertical: 100,
//     fontSize: 36,
//     textAlign: 'center',
//     color: '#EDEFEE',
//   },
//   regularText: {
//     fontSize: 24,
//     marginTop: 24,
//     marginBottom: 12,
//     color: '#EDEFEE',
//     textAlign: 'center',
//   },
//   inputBox: {
//     height: 60,
//     // margin: 12,
//     //borderWidth: 2,
//     borderRadius: 18,
//     paddingHorizontal: 24,
//     fontSize: 18,
//     borderColor: '#333333',
//     backgroundColor: '#EDEFEE',
//   },
//   buttonEnabled: {
//     backgroundColor: '#F4CE14',
//     padding: 18,
//     borderRadius: 18,
//     marginTop: 60,
//     marginLeft: 220,
//   },
//   buttonDisabled: {
//     backgroundColor: '#EDEFEE',
//     padding: 18,
//     borderRadius: 18,
//     marginTop: 60,
//     marginLeft: 220,
//   },
//   buttonText: {
//     fontSize: 24,
//     textAlign: 'center',
//     color: '#333333',
//     fontWeight: 'bold',
//   },
//   logo: {
//     height: 100,
//     width: 280,
//     marginBottom: 0
//   },
// });