/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component} from 'react';
//Import react-navigation
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import Inputs from './myAppFiles/inputs';
import Unnamed from './myAppFiles/unnamed';
import Percorso from './myAppFiles/percorso';

import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

const App = createStackNavigator(
  {
    //Constant which holds all the screens like index of any book
    inputs: {screen: Inputs},
    //First entry by default be our first screen
    //if we do not define initialRouteName
    unnamed: {screen: Unnamed},
    percorso: {screen: Percorso},
  },
  {
    initialRouteName: 'inputs',
  },
);

export default createAppContainer(App);

/*const App: () => React$Node = () => {
  const [departure, setDeparture] = useState('');
  return (
      <Inputs />
  );
};*/

//export default App;
