/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState} from 'react';
import {Button, StyleSheet, View, Text, StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';

import Collapse from './components/collapse';
import DraggableGrid from './components/draggable-grid';
import Accordion from './components/accordion';
        
const Stack = createStackNavigator();

type RootStackParamList = {
  Accordion: undefined;
  Grid: undefined;
};

type AccordionScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Accordion'
>;

type AccordionProps = {
  navigation: AccordionScreenNavigationProp;
};

const AccordionScreen = ({navigation}: AccordionProps) => (
  <>
    <StatusBar barStyle="dark-content" />
    <View style={styles.root}>
      <Button title="Go to Grid" onPress={() => navigation.navigate('Grid')} />
      <Text>Hello, world!</Text>
      <Accordion
          data={[
            {id: '0', title: 'Test 1', description: 'Test 1'},
            {id: '1', title: 'Test 2', description: 'Test 2'},
            {id: '2', title: 'Test 3', description: 'Test 3'},
          ]}
       />
    </View>
  </>
);

const Grid = () => {
  const [gridData, setGridData] = useState([
    {name: '1', key: 'one'},
    {name: '2', key: 'two'},
    {name: '3', key: 'three'},
    {name: '4', key: 'four'},
    {name: '5', key: 'five'},
    {name: '6', key: 'six'},
    {name: '7', key: 'seven'},
    {name: '8', key: 'eight'},
    {name: '9', key: 'nine'},
  ]);

  const renderItem = (item: {name: string; key: string}) => {
    return (
      <View style={styles.gridItem} key={item.key}>
        <Text style={styles.gridItemText}>{item.name}</Text>
      </View>
    );
  };

  return (
    <View style={styles.wrapper}>
      <DraggableGrid
        data={gridData}
        onDragRelease={(data) => {
          setGridData(data);
        }}
        numColumns={3}
        renderItem={renderItem}
      />
    </View>
  );
};

const App = () => {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Accordion" component={AccordionScreen} />
          <Stack.Screen name="Grid" component={Grid} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

const styles = StyleSheet.create({
  root: {
    padding: 40,
  },
  wrapper: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  gridItem: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridItemText: {
    fontSize: 40,
    color: '#FFFFFF',
  },
});

export default App;
