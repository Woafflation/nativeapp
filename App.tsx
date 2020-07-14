/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {StyleSheet, View, Text, StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import Collapse from './components/collapse';

const Stack = createStackNavigator();

const Home = () => (
  <>
    <StatusBar barStyle="dark-content" />
    <View style={styles.root}>
      <Text>Hello, world!</Text>
      <Collapse
        title="Collapse Test Title"
        description="Collapse Test Description"
      />
      <Collapse
        title="Collapse Test Title"
        description="Collapse Test Description"
      />
      <Collapse
        title="Collapse Test Title"
        description="Collapse Test Description"
      />
      <Collapse
        title="Collapse Test Title"
        description="Collapse Test Description"
      />
    </View>
  </>
);

const App = () => {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={Home} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

const styles = StyleSheet.create({
  root: {
    padding: 40,
  },
});

export default App;
