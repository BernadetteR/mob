import { StatusBar } from 'expo-status-bar';
import {Image, Platform, StyleSheet} from 'react-native';
import { Text, View } from '@/components/Themed';
import React from "react";

export default function InfoScreen() {
  return (
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to CookingCompass!</Text>
        <Text style={styles.titleSecond}>The app that will change your life.</Text>
        <Text style={styles.titleThird}>Who is behind Cooking Compass?</Text>
        <Text style={styles.text}>
          We are Angi, Bernadette and Tina and we have made it our mission to help anyone who doesn't know
          what to eat. Whether you're hungry, lost for ideas or just curious, our app is your perfect
          companion!{'\n'}{'\n'}Discover new recipes, save your favorites and let our culinary compass needle
          guide you in the right direction!
        </Text>
        <Text style={styles.textbottom}>Enjoy cooking and have fun!</Text>
        <Image source={require('.././img/thumbsup.png')} style={styles.logo}/>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    marginTop: 40,
  },
  titleSecond: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  titleThird: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    color: '#02A382'
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 400,
    height: 400,
    resizeMode: 'contain',
  },
  text: {
    fontSize: 16,
    marginBottom: 20,
  },
  textbottom: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#02A382'
  },
});