import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Image, TextInput, ScrollView, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback } from 'react-native';

export default function Home({ navigation }) {

    return (
        <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
        <Text>Home Page</Text>

        <Text>---</Text>

        <Pressable onPress={() => navigation.navigate('Profile')}>
            <Text>Profile</Text>
        </Pressable>

        </View>
    );
};