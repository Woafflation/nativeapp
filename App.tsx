/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {StyleSheet, View, Text, StatusBar} from 'react-native';

import Accordion from './components/accordion';

const App = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <View style={styles.root}>
        <Text>Hello, world!</Text>
        <Accordion
          data={[
            {id: 0, title: 'Test 1', description: 'Test 1'},
            {id: 1, title: 'Test 2', description: 'Test 2'},
            {id: 2, title: 'Test 3', description: 'Test 3'},
          ]}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  root: {
    padding: 40,
  },
});

export default App;
