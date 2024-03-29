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
  }, []);


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

      setAvatar(rAvatar);
      setMiniAvatar(rAvatar);

    } catch (error) {
      // Error retrieving data
      console.log(error);
    } finally {
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

    if (lastName === undefined || lastName === null || lastName === '') {
      return true;
    } else if (lastName !== '') {
      if (validName(lastName.trim())) {
        return true;
      }
      alert('Please fix your last name');
        return false;
    }
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

  const validateAndSave = (key, value, falsy) => {
    if (value !== falsy || value !== null) {
      if (typeof value !== 'string') {
        value = JSON.stringify(value);
      }
      writeData(key,value.trim());
    } else {
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
          if (rLastName !== null && rLastName !== 'null') {value = value + rLastName['0']}
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

    <ScrollView>

      <View style={styles.header}>

      <Pressable style={styles.backButton} onPress={exitProfile}>
            <View style={styles.overBackButton}>
            <Text style={styles.backButtonText}>{'<'}</Text>
            </View>
        </Pressable>

        <Image
          style={styles.logo}
          resizeMode='contain'
          source={require('../assets/Logo.png')}
        />

        <ImageBackground
            key={miniAvatar ? miniAvatar : Math.random()}
            style={styles.miniAvatarIcon}
            resizeMode='contain'
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

          <ImageBackground
            key={avatar ? avatar : Math.random()}
            style={styles.avatarIcon}
            resizeMode='contain'
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
          keyboardType={'email-address'}
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
    
    </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#495E57',
    alignSelf: 'stretch',
  },
  header: {
    paddingTop: 30,
    paddingHorizontal: 16,
    color: '#EDEFEE',
    backgroundColor: '#EDEFEE',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    textAlign: 'center',
    fontSize: 36,
  },
  body: {
    color: '#EDEFEE',
    textAlign: 'center',
    backgroundColor: '#495E57',
    flex: 6,
    paddingHorizontal: 24,
  },
  title: {
    paddingVertical: 12,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#EDEFEE',
  },
  inputBox: {
    height: 48,
    marginBottom: 16,
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
  },
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingBottom: 24,
  },
  buttonsSection: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 32,
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
  },
  buttonCancel: {
    padding: 14,
    borderRadius: 18,
    borderColor: '#EE9972',
    borderWidth: 2,
  },
  buttonConfirm: {
    backgroundColor: '#EE9972',
    padding: 14,
    borderRadius: 18,
  },
  sectionTitle: {
    marginBottom: 8,
    fontSize: 16,
    color: '#EDEFEE',
  },
  backButton: {
    height: 60,
    width: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overBackButton: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: '#AAA',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#EDEFEE',
    fontSize: 20,
    fontWeight: 'bold',
  },
});