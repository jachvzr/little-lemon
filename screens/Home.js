import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, Pressable, StyleSheet, Image, ImageBackground, TextInput, FlatList, ScrollView, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LogBox } from 'react-native';
import debounce from 'lodash.debounce';

import { createTable, clearDatabase, getMenuItems, saveMenuItems, filterByQueryAndCategories } from '../functions/SQLiteFunctions';
import Filters from '../utils/Filters';
import { readData } from '../functions/AsyncStorageFunctions';

const categories = ['starters', 'mains', 'desserts'];

export default function Home({ navigation }) {

    const [avatar, setAvatar] = useState(null);
    const [initials, setInitials] = useState('');
    const [firstName, onChangeFirstName] = useState('');
    const [lastName, onChangeLastName] = useState('');

    const [data, setData] = useState([]);
    const [searchBarText, setSearchBarText] = useState('');
    const [query, setQuery] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);

    useFocusEffect(
      React.useCallback(() => {
    
        updateInitials(true);

      }, [])
    );





    useEffect(() => {
      
        (async () => {
          try {
            await updateInitials(true);
            await createTable();
            let menuItems = await getMenuItems();
            if (!menuItems.length) {
              menuItems = await fetchData();
              saveMenuItems(menuItems);
            }
            setData(menuItems);
          } catch (e) {
            console.log(e.message);
          }
        })();
      }, []);


    const fetchData = async() => {
    let parsedRes = {}
    let res = {}
    try { 
        const response = await fetch(
            'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json' 
        );
        res = await response.json();
        parsedRes = res.menu;

    } catch (error) { 
        console.error(error);
    }
    return parsedRes;
    }


    const updateInitials = async (fromAsync) => {
        let rFirstName;
        let rLastName;
        let rAvatar;
        let value;
        try {
          if (fromAsync) {
            rAvatar = await AsyncStorage.getItem('avatar');

            if (rAvatar === null) {
              rFirstName = await AsyncStorage.getItem('firstName');
              rLastName = await AsyncStorage.getItem('lastName');
              value = rFirstName['0'];
              if (rLastName !== null && rLastName !== '' && rLastName !== 'null') {value = value + rLastName['0']}
            } else {
              value = '';
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
        }
      };

    useEffect(() => {
        (async () => {
          try {
            const filterArray = selectedItems.length === 0 ? categories : selectedItems;
            const filteredMenuItems = await filterByQueryAndCategories(query, filterArray);
            setData(filteredMenuItems);
          } catch (e) {
            alert(e.message);
          }
        })();
      }, [selectedItems, query]);


      const handleToggleItem = (category) => {
        setSelectedItems((prevItems) => {
          const index = prevItems.indexOf(category);
          if (index >= 0) {
            return [...prevItems.slice(0, index), ...prevItems.slice(index + 1)];
          } else {
            return [...prevItems, category];
          }
        });
      };

      const lookup = useCallback((q) => {
        setQuery(q);
      }, []);
    
      const debouncedLookup = useMemo(() => debounce(lookup, 500), [lookup]);

      const handleSearchChange = (text) => {
        setSearchBarText(text);
        debouncedLookup(text);
      };

    LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
    ]);

    const MenuItemsSeparator = () => {
        return (
          <View
            style={{
              height: 1,
              width: "100%",
              backgroundColor: "#DDD",
            }}
          />
        );
      }

    const FilterItem = ({ category }) => {
        const isSelected = selectedItems.includes(category);
        return (
        <Pressable
            key={category}
            style={
                isSelected ? styles.filterItemSelected : styles.filterItem 
            }
            onPress={() => handleToggleItem(category)}
        >
            <Text style={
                isSelected ? styles.filterItemTextSelected : styles.filterItemText
            }>{category}</Text>
        </Pressable>
        );
    };

    const MenuItem = ({ title, description, price, image }) => (
    <View style={styles.item}>
        
        <View style={styles.itemDetails}>

            <View style={styles.itemText}>
                <Text style={styles.itemTitle}>{title}</Text>
                <Text numberOfLines={3} style={styles.itemDescription}>{description}</Text>
                <Text style={styles.itemPrice}>${price}</Text>
            </View>
        
            <View style={styles.itemImageFrame}>
            <Image
            style={styles.itemImage}
            // resizeMode='contain'
            source={{uri:'https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/' + image + '?raw=true'}}
            />
            </View>
        </View>
        
    </View>
    );

    return (

    <View style={styles.container}>

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
            resizeMode='contain'
            source={{ uri: avatar }}>
            <View style={styles.overAvatar}>
            <Text style={styles.textOverAvatar}>{initials}</Text>
            </View>
        </ImageBackground>
        </Pressable>

    </View>

    <View style={styles.hero}>

        

        <View style={styles.heroBlock}>
            <View style={styles.heroBlockLeft}>

            <Text style={styles.heroTitle}>
          Little Lemon
        </Text>

                <Text style={styles.heroSubtitle}>
                Chicago
                </Text>
                <Text style={styles.heroText}>
                We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.
                </Text>
            </View>

            <View style={styles.heroBlockRight}>
                <Image
                style={styles.heroImage}
                source={require('../assets/HeroImage.png')}
                />
            </View>            
        </View>

        <View style={styles.heroSearch}>
        <TextInput
          style={styles.inputBox}
          value={searchBarText}
          onChangeText={handleSearchChange}
          placeholder={'search'}
          keyboardType={'default'}
        />
        </View>

    </View>

    <View style={styles.filters}>
        <Text style={styles.filterTitle}>ORDER FOR DELIVERY!</Text>
        <FlatList
            data={categories}
            renderItem={({ item }) => (
                <FilterItem category={item} />
              )}
              horizontal={true}
            keyExtractor={(item) => item}
        />

    </View>



        <FlatList
            data={data}
            renderItem={({ item }) => (
                <MenuItem title={item.name} price={item.price} description={item.description} image={item.image}/>
              )}
            keyExtractor={(item) => item.name}
            ItemSeparatorComponent={MenuItemsSeparator}
        />
        
    
    </View>

  );
}

const styles = StyleSheet.create({
    
  container: {
    flex: 1,
    backgroundColor: '#EDEFEE',
    alignSelf: 'stretch',
  },
  hero: {
    backgroundColor: '#495E57',
    padding: 30,
    paddingBottom: 4,
},
heroTitle: {
    color: '#F4CE14',
    fontSize: 42,
},
heroBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
},
heroSearch: {
},
heroSubtitle: {
    fontSize: 26,
    marginBottom: 15,
    color: '#EDEFEE',
},
heroText: {
    marginRight: 15,
    fontSize: 18,
    color: '#EDEFEE',
},
heroBlockLeft: {
    flex: 1,
},
heroBlockRight: {
},
heroImage: {
    width: 150,
    height: 180,
    resizeMode: 'cover',
    borderRadius: 15,
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
  filters: {
    height: 80,
    backgroundColor: '#DDD',
  },
  filterTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 6,
    marginLeft: 15,
  },
  filterItem: {
    backgroundColor: '#BBB',
    marginBottom: 12,
    justifyContent: 'center',
    borderRadius: 30,
    marginLeft: 15,
  },
  filterItemText: {
    marginHorizontal: 16,
    fontSize: 16,
    fontWeight: 'bold',
  },
  filterItemSelected: {
    backgroundColor: '#F4CE14',
    marginBottom: 12,
    justifyContent: 'center',
    borderRadius: 30,
    marginLeft: 15,
  },
  filterItemTextSelected: {
    marginHorizontal: 16,
    fontSize: 16,
    fontWeight: 'bold',
  },
  item: {
    marginHorizontal: 30,
    marginVertical: 20,
  },
  itemTitle: {
    fontSize: 26,
    marginBottom: 6,
    fontWeight: 'bold',
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemText: {
    flex: 1,
    marginRight: 20,
  },
  itemImageFrame: {
  },
  itemImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    borderRadius: 15,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  body: {
    color: '#EDEFEE',
    textAlign: 'center',
    backgroundColor: '#495E57',
    flex: 6,
    paddingHorizontal: 24,
  },
  form: {
  },
  title: {
    paddingVertical: 12,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#EDEFEE',
  },
  inputBox: {
    height: 48,
    marginVertical: 16,
    //borderWidth: 2,
    borderRadius: 15,
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
  }
});