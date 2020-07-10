/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {StyleSheet, View, Text, StatusBar} from 'react-native';

import Collapse from './components/collapse';

const App = () => {
  return (
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
};

const styles = StyleSheet.create({
  root: {
    padding: 40,
  },
});

export default App;
