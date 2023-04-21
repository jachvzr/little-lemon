import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Image, ImageBackground, TextInput, ScrollView, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import AnimatedCheckbox from 'react-native-checkbox-reanimated';
import { MaskedTextInput } from "react-native-mask-text";
import { LogBox } from 'react-native';

import { readData, writeData, clearData, removeItem, isOnboardingCompleted, setIsOnboardingCompleted} from '../functions/AsyncStorageFunctions';
import { validEmail, validName } from '../utils/index';
import { useFocusEffect } from '@react-navigation/native';

export default function Profile({ navigation, route }) {

  const [email, onChangeEmail] = useState('');
  const [firstName, onChangeFirstName] = useState('');
  const [lastName, onChangeLastName] = useState('');
  const [phone, onChangePhone] = useState('');

  const [orderStatuses, setOrderStatuses] = useState(false);
  const [passwordChanges, setPasswordChanges] = useState(false);
  const [specialOffers, setSpecialOffers] = useState(false);
  const [newsletter, setNewsletter] = useState(false);

  const [avatar, setAvatar] = useState(null);
  const [initials, setInitials] = useState('');

  const [miniAvatar, setMiniAvatar] = useState(null);
  const [miniInitials, setMiniInitials] = useState('');

  useEffect(() => {
    updateStatesFromStorage();
    updateInitials(true);
    // console.log(initials);
    // c   
  }, []);

  // useEffect(() => {
  //   updateInitials(true);
  // }, []);

  useEffect(() => {
    updateInitials(false);
  }, [avatar]);

  const updateStatesFromStorage = async () => {
    try {
      const rName = await AsyncStorage.getItem('firstName');
      onChangeFirstName(rName !== 'null' ? rName : '');

      const rEmail = await AsyncStorage.getItem('email');
      onChangeEmail(rEmail !== 'null' ? rEmail : '');

      const rLastName = await AsyncStorage.getItem('lastName');
      onChangeLastName(rLastName !== 'null' ? rLastName : '');

      const rPhone = await AsyncStorage.getItem('phone');
      onChangePhone(rPhone !== 'null' ? rPhone : '');

      const rOrderStatuses = await AsyncStorage.getItem('orderStatuses');
      setOrderStatuses(rOrderStatuses === 'true');

      const rPasswordChanges = await AsyncStorage.getItem('passwordChanges');
      setPasswordChanges(rPasswordChanges === 'true');

      const rSpecialOffers = await AsyncStorage.getItem('specialOffers');
      setSpecialOffers(rSpecialOffers === 'true');

      const rNewsletter = await AsyncStorage.getItem('newsletter');
      setNewsletter(rNewsletter === 'true');

      const rAvatar = await AsyncStorage.getItem('avatar');
      // rAvatar !== 'null' ? setAvatar(rAvatar) : setAvatar(null);
      setAvatar(rAvatar);
      setMiniAvatar(rAvatar);
      // setMiniInitials(initials); 

      // const rInitials = await AsyncStorage.getItem('initials');

    } catch (error) {
      // Error retrieving data
      console.log(error);
    } finally {
      // setIsLoading(false);
    }
  }

  const logOut = () => {
    clearData();
    route.params.setIsOnboardingCompleted(null);
  }

  const removeAvatar = () => {
    setAvatar(null);
  }

  const checkEmail = () => {
    if (email !== null) {
      if (validEmail(email.trim())) {
        return true;
      }
      alert('Please fix your email address');
      return false;
    }
    alert('Please enter your email address');
    return false;
  }

  const checkName = () => {
    if (firstName !== null) {
      if (validName(firstName.trim())) {
        return (true);
      }
      alert('Please fix your first name');
      return false;
    }
    alert('Please type your first name');
    return false;
  }

  const checkLastName = () => {
    if (lastName !== '') {
      if (validName(lastName.trim())) {
        return (true);
      }
      alert('Please fix your last name');
      return false;
    }
    // alert('Please type your first name');
    return true; //not mandatory
  }

  const checkPhone = () => {
    if (phone !== null) {
      if (phone.length > 0 && phone.length < 10) {
        alert('Please fix your phone number');
        return false;
      }
      return true;
    }
    return true;
  }

  const exitProfile = () => {
    updateStatesFromStorage();
    navigation.navigate('Home');
  };

  const saveAndExit = () => {

    if (checkEmail() && checkName() && checkLastName() && checkPhone()) {
      validateAndSave('email', email,'');
      validateAndSave('firstName', firstName,'');
      validateAndSave('lastName', lastName,'');
      validateAndSave('phone', phone,'');
      validateAndSave('orderStatuses', orderStatuses, 'false');
      validateAndSave('passwordChanges', passwordChanges, 'false');
      validateAndSave('specialOffers', specialOffers, 'false');
      validateAndSave('newsletter', newsletter, 'false');
      validateAndSave('avatar', avatar, null);
      updateInitials();
      exitProfile();
    }

  };

  // const validateAndSave = (key, value) => {
  //   if (value !== null) {
  //     if (typeof value !== 'string') {
  //       value = JSON.stringify(value);
  //     }
  //     writeData(key,value.trim());
  //   } 
  // }

  const validateAndSave = (key, value, falsy) => {
    if (value !== falsy || value !== null) { //should be &&????
      if (typeof value !== 'string') {
        value = JSON.stringify(value);
      }
      writeData(key,value.trim());
    } else {
      //writeData(key, falsy);
      removeItem(key);
    }
  }

  
  const changeAvatar = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const updateInitials = async (fromAsync) => {
    let rFirstName;
    let rLastName;
    let rAvatar;
    let value;
    try {
      if (fromAsync) {
        rAvatar = await AsyncStorage.getItem('avatar');
        if (rAvatar !== null) {
          value = '';
        } else {
          rFirstName = await AsyncStorage.getItem('firstName');
          rLastName = await AsyncStorage.getItem('lastName');
          value = rFirstName['0'];
          if (rLastName !== 'null') {value = value + rLastName['0']}
        }
        setMiniInitials(value);
      } else {
        if (avatar !== null) {
          value = '';
        } else {
          value = firstName['0'];
          if (lastName !== null) {value = value + lastName['0']}
        }
      }
      setInitials(value);
      // writeData('initials', value);
      
    } catch(error) {
      console.log(error);
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

      <Text style={styles.blankBox}></Text>

        <Image
          style={styles.logo}
          resizeMode='contain'
          source={require('../assets/Logo.png')}
        />

        <ImageBackground
            key={miniAvatar ? miniAvatar : Math.random()}
            style={styles.miniAvatarIcon}
            // imageStyle={{ borderRadius: 40 }}
            resizeMode='contain'
            //source={require('../assets/Logo.png')}
            source={{ uri: miniAvatar }}>
            <View style={styles.overMiniAvatar}>
            <Text style={styles.textOverMiniAvatar}>{miniInitials}</Text>
            </View>
        </ImageBackground>

      </View>

      

      <View style={styles.body}>

        <Text style={styles.title}>
          Personal Information
        </Text>

        <Text style={styles.sectionTitle}>Avatar</Text>
        <View style={styles.avatarSection}>

          {/* <Image
            key={avatar ? avatar : Math.random()}
            style={styles.avatarIcon}
            resizeMode='contain'
            //source={require('../assets/Logo.png')}
            source={{ uri: avatar }}
          /> */}

          <ImageBackground
            key={avatar ? avatar : Math.random()}
            style={styles.avatarIcon}
            // imageStyle={{ borderRadius: 40 }}
            resizeMode='contain'
            //source={require('../assets/Logo.png')}
            source={{ uri: avatar }}>
              <View style={styles.overAvatar}>
                <Text style={styles.textOverAvatar}>{initials}</Text>
              </View>
          </ImageBackground>

          <Pressable onPress={changeAvatar}
          style={styles.buttonConfirm}>
            <Text style={styles.buttonText}>Change</Text>
          </Pressable>

          <Pressable onPress={removeAvatar}
          style={styles.buttonCancel}>
            <Text style={styles.buttonText}>Remove</Text>
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>First name *</Text>
        <TextInput
          style={styles.inputBox}
          value={firstName}
          onChangeText={onChangeFirstName}
          placeholder={'enter your first name'}
          keyboardType={'default'}
        />

        <Text style={styles.sectionTitle}>Last name</Text>
        <TextInput
          style={styles.inputBox}
          value={lastName}
          onChangeText={onChangeLastName}
          placeholder={'enter your last name'}
          keyboardType={'default'}
        />

        <Text style={styles.sectionTitle}>Email *</Text>
        <TextInput
          style={styles.inputBox}
          value={email}
          onChangeText={onChangeEmail}
          placeholder={'enter your email'}
          keyboardType={'default'}
        />

        <Text style={styles.sectionTitle}>Phone number</Text>
        <MaskedTextInput
          style={styles.inputBox}
          value={phone}
          onChangeText={onChangePhone}
          placeholder={'enter your phone number'}
          keyboardType={'phone-pad'}
          mask="999-999-9999"
        />

        {/* <View style={styles.checkboxContainer}>
          <CheckBox
            value={orderStatuses}
            onValueChange={setOrderStatuses}
            style={styles.checkbox}
          />
          <Text style={styles.label}>Order statuses</Text>
        </View> */}

        <Text style={styles.title}>
          Email notifications
        </Text>
        
        <Pressable onPress={() => setOrderStatuses(!orderStatuses)} style={styles.checkboxContainer}>
          <View style={styles.checkbox}>
            <AnimatedCheckbox
              checked={orderStatuses}
              highlightColor='#F4CE14'
              checkmarkColor='#495E57'
              boxOutlineColor='#F4CE14'
            />
          </View>
          <Text style={styles.label}>Order statuses</Text>
        </Pressable>

        <Pressable onPress={() => setPasswordChanges(!passwordChanges)} style={styles.checkboxContainer}>
          <View style={styles.checkbox}>
            <AnimatedCheckbox
              checked={passwordChanges}
              highlightColor='#F4CE14'
              checkmarkColor='#495E57'
              boxOutlineColor='#F4CE14'
            />
          </View>
          <Text style={styles.label}>Password changes</Text>
        </Pressable>

        <Pressable onPress={() => setSpecialOffers(!specialOffers)} style={styles.checkboxContainer}>
          <View style={styles.checkbox}>
            <AnimatedCheckbox
              checked={specialOffers}
              highlightColor='#F4CE14'
              checkmarkColor='#495E57'
              boxOutlineColor='#F4CE14'
            />
          </View>
          <Text style={styles.label}>Special offers</Text>
        </Pressable>

        <Pressable onPress={() => setNewsletter(!newsletter)} style={styles.checkboxContainer}>
          <View style={styles.checkbox}>
            <AnimatedCheckbox
              checked={newsletter}
              highlightColor='#F4CE14'
              checkmarkColor='#495E57'
              boxOutlineColor='#F4CE14'
            />
          </View>
          <Text style={styles.label}>Newsletter</Text>
        </Pressable>

        <View style={styles.buttonsSection}>
          <Pressable onPress={exitProfile}
          style={styles.buttonCancel}>
            <Text style={styles.buttonText}>Discard changes</Text>
          </Pressable>

          <Pressable onPress={saveAndExit}
          style={styles.buttonConfirm}>
            <Text style={styles.buttonText}>Save changes</Text>
          </Pressable>
        </View>

        <Pressable onPress={logOut}
        style={styles.buttonEnabled}>
          <Text style={styles.logoutButtonText}>Log out</Text>
        </Pressable>

      </View>
    
      </ScrollView>
    {/* </SafeAreaView> */}
    
    </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // height: '100%',
    backgroundColor: '#495E57',
    alignSelf: 'stretch',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  header: {
    paddingTop: 30,
    paddingHorizontal: 16,
    color: '#EDEFEE',
    backgroundColor: '#EDEFEE',
    // backgroundColor: 'blue',
    // width: '100%',
    // height: '18%',
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    //height: '84%',
    flex: 6,
    paddingHorizontal: 24,
    // justifyContent: 'center',
  },
  form: {
    // padding: 20,
    // fontSize: 32,
    // color: '#EDEFEE',
    //textAlign: 'center',
  },
  title: {
    paddingVertical: 12,
    fontSize: 18,
    fontWeight: 'bold',
    // textAlign: 'center',
    color: '#EDEFEE',
  },
  // regularText: {
  //   fontSize: 24,
  //   // marginTop: 24,
  //   marginBottom: 12,
  //   color: '#EDEFEE',
  //   textAlign: 'center',
  // },
  inputBox: {
    height: 48,
    marginBottom: 16,
    //borderWidth: 2,
    borderRadius: 18,
    paddingHorizontal: 24,
    fontSize: 18,
    borderColor: '#333333',
    backgroundColor: '#EDEFEE',
  },
  buttonEnabled: {
    backgroundColor: '#F4CE14',
    padding: 14,
    borderRadius: 18,
    marginVertical: 32,
    // marginLeft: 220,
  },
  buttonDisabled: {
    backgroundColor: '#EDEFEE',
    padding: 18,
    borderRadius: 18,
    marginTop: 60,
    marginLeft: 220,
  },
  buttonText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#EDEFEE',
    fontWeight: 'bold',
  },
  logoutButtonText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#333333',
    fontWeight: 'bold',
  },
  logo: {
    height: 120,
    width: 200,
    marginBottom: 0
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  checkbox: {
    width: 32,
    height: 32,
  },
  label: {
    margin: 8,
    color: '#EDEFEE',
  },
  blankBox: {
    width: 60,
  },
  miniAvatarIcon: {
    height: 60,
    width: 60,
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: '#333333',
  },
  overMiniAvatar: {
    height: 60,
    width: 60,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textOverMiniAvatar: {
    color: '#EDEFEE',
    fontSize: 30,
    // fontWeight: 'bold',
  },
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingBottom: 24,
    // flexWrap: 'wrap',
  },
  buttonsSection: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 32,
    // marginVertical: 32,
  },
  avatarIcon: {
    height: 80,
    width: 80,
    borderRadius: 40,
    overflow: 'hidden',
    backgroundColor: '#333333',
  },
  overAvatar: {
    height: 80,
    width: 80,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textOverAvatar: {
    color: '#EDEFEE',
    fontSize: 40,
    // fontWeight: 'bold',
  },
  buttonCancel: {
    // backgroundColor: '#EDEFEE',
    padding: 14,
    borderRadius: 18,
    borderColor: '#EE9972',
    borderWidth: 2,
    // marginTop: 60,
    // marginLeft: 220,
  },
  buttonConfirm: {
    backgroundColor: '#EE9972',
    padding: 14,
    borderRadius: 18,
    // marginTop: 60,
    // marginLeft: 220,
  },
  sectionTitle: {
    marginBottom: 8,
    fontSize: 16,
    color: '#EDEFEE',
  }
});


// //import { StatusBar } from 'expo-status-bar';
// import React from 'react';
// import { useState } from 'react';
// import { StyleSheet, Text, TextInput, SafeAreaView, ScrollView, StatusBar, View, Pressable, Image, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback } from 'react-native';
// import AnimatedCheckbox from 'react-native-checkbox-reanimated';
// import * as ImagePicker from 'expo-image-picker';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// //import { useNavigation } from '@react-navigation/native';

// export default function Profile({ navigation, props }) {

//   //const navigation = useNavigation();

//   const [email, onChangeEmail] = useState('');
//   const [firstName, onChangeFirstName] = useState('');
//   const [lastName, onChangeLastName] = useState('');
//   const [phone, onChangePhone] = useState('');

//   const [orderStatuses, setOrderStatuses] = useState(false);
//   const [passwordChanges, setPasswordChanges] = useState(false);
//   const [specialOffers, setSpecialOffers] = useState(false);
//   const [newsletter, setNewsletter] = useState(false);

//   const logOut = () => {
//     props.logout
//     navigation.navigate('Onboarding');
//   };
//   const discardChanges = () => {
//   };
//   const saveChanges = () => {
//   };
//   const removeAvatar = () => {
//       setAvatar(null);
//   };
//   // const changeAvatar = () => {
//   // };

//   const [avatar, setAvatar] = useState(null);
//   const changeAvatar = async () => {
//     // No permissions request is necessary for launching the image library
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.All,
//       allowsEditing: true,
//       aspect: [1, 1],
//       quality: 1,
//     });

//     if (!result.canceled) {
//       setAvatar(result.assets[0].uri);
//     }
//   };

//   return (
//     // <KeyboardAvoidingView behavior="padding" style={styles.container}>
//     <SafeAreaView style={styles.container}>
//     {/* <ScrollView> */}

//       <View style={styles.header}>

//         <Text style={styles.headerText}>
//         </Text>

//         <Image
//           style={styles.logo}
//           resizeMode='contain'
//           source={require('../assets/Logo.png')}
//         />

//       </View>

      

//       <ScrollView style={styles.body}>

//         <Text style={styles.title}>
//           Personal Information
//         </Text>

//         <Text style={styles.sectionTitle}>Avatar</Text>
//         <View style={styles.avatarSection}>
//           <Image
//             key={avatar ? avatar : Math.random()}
//             style={styles.avatarIcon}
//             resizeMode='contain'
//             //source={require('../assets/Logo.png')}
//             source={{ uri: avatar }}
//           />

//           {/* <View style={styles.avatarIcon}></View> */}

//           <Pressable onPress={changeAvatar}
//           style={styles.buttonConfirm}>
//             <Text style={styles.buttonText}>Change</Text>
//           </Pressable>

//           <Pressable onPress={removeAvatar}
//           style={styles.buttonCancel}>
//             <Text style={styles.buttonText}>Remove</Text>
//           </Pressable>
//         </View>

//         <Text style={styles.sectionTitle}>First name</Text>
//         <TextInput
//           style={styles.inputBox}
//           value={firstName}
//           onChangeText={onChangeFirstName}
//           placeholder={'enter your first name'}
//           keyboardType={'default'}
//         />

//         <Text style={styles.sectionTitle}>Last name</Text>
//         <TextInput
//           style={styles.inputBox}
//           value={lastName}
//           onChangeText={onChangeLastName}
//           placeholder={'enter your last name'}
//           keyboardType={'default'}
//         />

//         <Text style={styles.sectionTitle}>Email</Text>
//         <TextInput
//           style={styles.inputBox}
//           value={email}
//           onChangeText={onChangeEmail}
//           placeholder={'enter your email'}
//           keyboardType={'default'}
//         />

//         <Text style={styles.sectionTitle}>Phone number</Text>
//         <TextInput
//           style={styles.inputBox}
//           value={phone}
//           onChangeText={onChangePhone}
//           placeholder={'enter your phone number'}
//           keyboardType={'phone-pad'}
//         />

//         {/* <View style={styles.checkboxContainer}>
//           <CheckBox
//             value={orderStatuses}
//             onValueChange={setOrderStatuses}
//             style={styles.checkbox}
//           />
//           <Text style={styles.label}>Order statuses</Text>
//         </View> */}

//         <Text style={styles.title}>
//           Email notifications
//         </Text>
        
//         <Pressable onPress={() => setOrderStatuses(!orderStatuses)} style={styles.checkboxContainer}>
//           <View style={styles.checkbox}>
//             <AnimatedCheckbox
//               checked={orderStatuses}
//               highlightColor='#F4CE14'
//               checkmarkColor='#495E57'
//               boxOutlineColor='#F4CE14'
//             />
//           </View>
//           <Text style={styles.label}>Order statuses</Text>
//         </Pressable>

//         <Pressable onPress={() => setPasswordChanges(!passwordChanges)} style={styles.checkboxContainer}>
//           <View style={styles.checkbox}>
//             <AnimatedCheckbox
//               checked={passwordChanges}
//               highlightColor='#F4CE14'
//               checkmarkColor='#495E57'
//               boxOutlineColor='#F4CE14'
//             />
//           </View>
//           <Text style={styles.label}>Password changes</Text>
//         </Pressable>

//         <Pressable onPress={() => setSpecialOffers(!specialOffers)} style={styles.checkboxContainer}>
//           <View style={styles.checkbox}>
//             <AnimatedCheckbox
//               checked={specialOffers}
//               highlightColor='#F4CE14'
//               checkmarkColor='#495E57'
//               boxOutlineColor='#F4CE14'
//             />
//           </View>
//           <Text style={styles.label}>Special offers</Text>
//         </Pressable>

//         <Pressable onPress={() => setNewsletter(!newsletter)} style={styles.checkboxContainer}>
//           <View style={styles.checkbox}>
//             <AnimatedCheckbox
//               checked={newsletter}
//               highlightColor='#F4CE14'
//               checkmarkColor='#495E57'
//               boxOutlineColor='#F4CE14'
//             />
//           </View>
//           <Text style={styles.label}>Newsletter</Text>
//         </Pressable>

//         {/* <View style={styles.checkboxContainer}>
//           <CheckBox
//             value={specialOffers}
//             onValueChange={setSpecialOffers}
//             style={styles.checkbox}
//           />
//           <Text style={styles.label}>Special offers</Text>
//         </View>

//         <View style={styles.checkboxContainer}>
//           <CheckBox
//             value={newsletter}
//             onValueChange={setNewsletter}
//             style={styles.checkbox}
//           />
//           <Text style={styles.label}>Newsletter</Text>
//         </View> */}

//         <Pressable onPress={logOut}
//         style={styles.buttonEnabled}>
//           <Text style={styles.buttonText}>Log out</Text>
//         </Pressable>

//         <View style={styles.buttonsSection}>
//           <Pressable onPress={discardChanges}
//           style={styles.buttonCancel}>
//             <Text style={styles.buttonText}>Discard changes</Text>
//           </Pressable>

//           <Pressable onPress={saveChanges}
//           style={styles.buttonConfirm}>
//             <Text style={styles.buttonText}>Save changes</Text>
//           </Pressable>
//         </View>

//       </ScrollView>
    
//       {/* </ScrollView> */}
//       </SafeAreaView>
//     // </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     // height: '100%',
//     backgroundColor: 'black',
//     // alignItems: 'center',
//     // justifyContent: 'center',
//   },
//   header: {
//     //paddingTop: 100,
//     color: '#EDEFEE',
//     //backgroundColor: '#F4CE14',
//     backgroundColor: '#EDEFEE',
//     width: '100%',
//     //height: '15%',
//     // flex: 1,
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
//     //height: '84%',
//     flex: 6,
//     paddingHorizontal: 24,
//     // justifyContent: 'center',
//   },
//   form: {
//     // padding: 20,
//     // fontSize: 32,
//     // color: '#EDEFEE',
//     //textAlign: 'center',
//   },
//   title: {
//     paddingVertical: 12,
//     fontSize: 18,
//     fontWeight: 'bold',
//     // textAlign: 'center',
//     color: '#EDEFEE',
//   },
//   // regularText: {
//   //   fontSize: 24,
//   //   // marginTop: 24,
//   //   marginBottom: 12,
//   //   color: '#EDEFEE',
//   //   textAlign: 'center',
//   // },
//   inputBox: {
//     height: 48,
//     marginBottom: 16,
//     //borderWidth: 2,
//     borderRadius: 18,
//     paddingHorizontal: 24,
//     fontSize: 18,
//     borderColor: '#333333',
//     backgroundColor: '#EDEFEE',
//   },
//   buttonEnabled: {
//     backgroundColor: '#F4CE14',
//     padding: 14,
//     borderRadius: 18,
//     marginTop: 16,
//     // marginLeft: 220,
//   },
//   buttonDisabled: {
//     backgroundColor: '#EDEFEE',
//     padding: 18,
//     borderRadius: 18,
//     marginTop: 60,
//     marginLeft: 220,
//   },
//   buttonText: {
//     fontSize: 18,
//     textAlign: 'center',
//     color: '#EDEFEE',
//     fontWeight: 'bold',
//   },
//   logo: {
//     height: 50,
//     width: 280,
//     marginBottom: 15,
//   },
//   checkboxContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 8,
//   },
//   checkbox: {
//     width: 32,
//     height: 32,
//   },
//   label: {
//     margin: 8,
//     color: '#EDEFEE',
//   },
//   avatarSection: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-evenly',
//     paddingBottom: 24,
//     // flexWrap: 'wrap',
//   },
//   buttonsSection: {
//     flexDirection: 'row',
//     justifyContent: 'space-evenly',
//     marginVertical: 16,
//   },
//   avatarIcon: {
//     height: 80,
//     width: 80,
//     borderRadius: 40,
//     backgroundColor: '#333333',
//   },
//   buttonCancel: {
//     // backgroundColor: '#EDEFEE',
//     padding: 14,
//     borderRadius: 18,
//     borderColor: '#EE9972',
//     borderWidth: 2,
//     // marginTop: 60,
//     // marginLeft: 220,
//   },
//   buttonConfirm: {
//     backgroundColor: '#EE9972',
//     padding: 14,
//     borderRadius: 18,
//     // marginTop: 60,
//     // marginLeft: 220,
//   },
//   sectionTitle: {
//     marginBottom: 8,
//     fontSize: 16,
//     color: '#EDEFEE',
//   }
// });