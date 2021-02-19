import React, {Component} from 'react';

import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
  StyleSheet,
  Button,
} from 'react-native';

class Percorso extends Component {
  state = {
    data: [],
  };

  static navigationOptions = {
    //Setting the header of the screen
    title: 'Percorso',
  };

  row = function(colors, index) {
    return {
      elevation: 1,
      borderRadius: 2,
      flex: 1,
      flexDirection: 'row', // main axis
      justifyContent: 'flex-start', // main axis
      alignItems: 'center', // cross axis
      paddingTop: 10,
      paddingBottom: 10,
      paddingLeft: 18,
      paddingRight: 16,
      marginLeft: 10,
      marginRight: 10,
      marginTop: 0,
      marginBottom: 6,
      backgroundColor: colors[index % colors.length],
    };
  };

  componentDidMount() {
    this.fetchData();
  }
  fetchData = async () => {
    let newJson = '';
    const response = await fetch(
      //'http://transport.opendata.ch/v1/connections?from=interlakenost&to=spiez&date=2020-06-10&time=01:00',

      'http://transport.opendata.ch/v1/connections?from=' +
        this.props.navigation.state.params.Dep.toString()
          .toLowerCase()
          .replace(/\s/g, '')
          .trim() +
        '&to=' +
        this.props.navigation.state.params.Arr.toString()
          .trim()
          .replace(/\s/g, '')
          .toLowerCase() +
        '&date=' +
        this.props.navigation.state.params.Date.substring(0, 10) +
        '&time=' +
        this.props.navigation.state.params.Date.substring(11, 16) +
        '&fields[]=connections/sections/journey/passList',
      //'https://randomuser.me/api?results=10',
    );

    console.log(
      'http://transport.opendata.ch/v1/connections?from=' +
        this.props.navigation.state.params.Dep.toString()
          .toLowerCase()
          .replace(/\s/g, '')
          .trim() +
        '&to=' +
        this.props.navigation.state.params.Arr.toString()
          .trim()
          .replace(/\s/g, '')
          .toLowerCase() +
        '&date=' +
        this.props.navigation.state.params.Date.substring(0, 10) +
        '&time=' +
        this.props.navigation.state.params.Date.substring(11, 16) +
        '&fields[]=connections/sections/journey/passList/station',
    );
    const json = await response.json();
    //this.setState({data: json.connections});
    console.log(json.connections[0].sections[0]); //this 0 is the index that we need to pass in some way
    for (let i = 0; i < json.connections[0].sections.length; i++) {
      if (json.connections[0].sections[i].journey !== null) {
        console.log(json.connections[0].sections[i].journey.passList,);
        newJson = json.connections[0].sections[i].journey.passList;
      }
    }
    this.setState({data: newJson});
  };

  renderListHeader = () => {
    return (
      <View>
        <Text style={styles.logo}>Journey Details</Text>
      </View>
    );
  };

  render() {
    let colors = ['#5687c2', '#c69056', '#8b64c6', '#dcc439'];
    return (
      <View sytle={styles.containerU}>
        <FlatList
          style={styles.flatContainer}
          data={this.state.data}
          keyExtractor={(x, index) => index}
          renderItem={({item, index}) => (
            <View style={this.row(colors, index)}>
              <Text style={{fontSize: 17, margin: 5, fontWeight: 'bold', color: '#ffffff'}}>
                {`Station: ${item.station.name}`} {'\n'}
                {`Departure: ${item.departure}`}
              </Text>
            </View>
          )}
          ListHeaderComponent={this.renderListHeader}
        />
      </View>
    );
  }
}

export default Percorso;

const styles = StyleSheet.create({
  containerU: {
    flex: 1,
    padding: 8,
    flexDirection: 'column', // main axis
    justifyContent: 'center', // main axis
    alignItems: 'center', // cross axis
    backgroundColor: '#003f5c',
  },

  flatContainer: {
    margin: 5,
  },

  logo: {
    fontWeight: 'bold',
    fontSize: 40,
    textAlign: 'center',
    color: '#fb5b5a',
    marginBottom: 10,
  },
});
