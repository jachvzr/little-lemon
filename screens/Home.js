import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, Pressable, StyleSheet, Image, ImageBackground, TextInput, ScrollView, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LogBox } from 'react-native';

export default function Home({ navigation }) {

    const [avatar, setAvatar] = useState(null);
    const [initials, setInitials] = useState('');
    const [firstName, onChangeFirstName] = useState('');
    const [lastName, onChangeLastName] = useState('');

    useFocusEffect(
        React.useCallback(() => {
            updateInitials(true);
        })
    );

    // useEffect(() => {
    //     // updateStatesFromStorage();
    //     updateInitials(true);
    // }, []);

    // useEffect(() => {
    //     updateInitials(false);
    //   }, [avatar]);

    const updateStatesFromStorage = async () => {
        try {    
            const rAvatar = await AsyncStorage.getItem('avatar');
            // rAvatar !== 'null' ? setAvatar(rAvatar) : setAvatar(null);
            setAvatar(rAvatar);

            // const rName = await AsyncStorage.getItem('firstName');
            // onChangeFirstName(rName !== 'null' ? rName : '');

            // const rLastName = await AsyncStorage.getItem('lastName');
            // onChangeLastName(rLastName !== 'null' ? rLastName : '');
    
        } catch (error) {
          // Error retrieving data
          console.log(error);
        } finally {
          // setIsLoading(false);
        }
    }

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
          } else {
            if (avatar !== null) {
              value = '';
            } else {
              value = firstName['0'];
              if (lastName !== null) {value = value + lastName['0']}
            }
          }
          setAvatar(rAvatar);
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

    {/* <SafeAreaView> */}
    <ScrollView>

    <View style={styles.header}>

        <Text style={styles.blankBox}></Text>

        <Image
          style={styles.logo}
          resizeMode='contain'
          source={require('../assets/Logo.png')}
        />

        <Pressable onPress={() => navigation.navigate('Profile')}>
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
        </Pressable>

    </View>

      

    <View style={styles.body}>

        <Text style={styles.title}>
          HOME!!!
        </Text>


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
    marginBottom: 0,
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
  blankBox: {
    width: 60,
  },
  avatarIcon: {
    height: 60,
    width: 60,
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: '#333333',
  },
  overAvatar: {
    height: 60,
    width: 60,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textOverAvatar: {
    color: '#EDEFEE',
    fontSize: 30,
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