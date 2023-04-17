//import { StatusBar } from 'expo-status-bar';
import React from 'react';
// import { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Pressable, Image, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback } from 'react-native';
// import { validateEmail, validateName } from '../utils';

export default function Splash() {

  // const [email, onChangeEmail] = useState('');
  // const [name, onChangeName] = useState('');

  // const displayMessage = () => {
  //   if ((validateEmail(email) != null) && (validateName(name) != null)) {
  //     alert("Thanks for subscribing. Stay tuned!");
  //     //onChangeEmail('');
  //   }
  // };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>

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
          Loading...
        </Text>

      </View>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // height: '100%',
    // backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  header: {
    //paddingTop: 100,
    color: '#EDEFEE',
    //backgroundColor: '#F4CE14',
    backgroundColor: '#EDEFEE',
    width: '100%',
    height: '16%',
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
    width: '100%',
    height: '84%',
    padding: 24,
    // justifyContent: 'center',
  },
  form: {
    // padding: 20,
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
    backgroundColor: '#EDEFEE',
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
  logo: {
    height: 100,
    width: 280,
    marginBottom: 0
  },
});