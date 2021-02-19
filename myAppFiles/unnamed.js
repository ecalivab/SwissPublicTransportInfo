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

class Unnamed extends Component {
  state = {
    data: [],
  };

  static navigationOptions = {
    //Setting the header of the screen
    title: 'Your Options',
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

  actionOnRow(item) {
    const {navigate} = this.props.navigation;
    navigate('percorso', {
      Dep: item.from.station.name,
      Arr: item.to.station.name,
      Date: item.from.departure,
    });
  }

  componentDidMount() {
    this.fetchData();
  }
  fetchData = async () => {
    const response = await fetch(
      'http://transport.opendata.ch/v1/connections?from=' +
        this.props.navigation.state.params.Dep +
        '&to=' +
        this.props.navigation.state.params.Arr +
        '&date=' +
        this.props.navigation.state.params.Date +
        '&time=' +
        this.props.navigation.state.params.Time,
      //'https://randomuser.me/api?results=10',
    );
    const json = await response.json();
    this.setState({data: json.connections});
    console.log(json);
  };

  renderListHeader = () => {
    return (
      <View>
        <Text style={styles.logo}>Choose Your Journey</Text>
      </View>
    );
  };
  render() {
    let colors = ['#003f5c', '#3e4180', '#614787', '#48356c'];
    return (
      <View sytle={styles.containerU}>
        <FlatList
          style={styles.flatContainer}
          data={this.state.data}
          keyExtractor={(x, index) => index}
          renderItem={({item, index}) => (
            <TouchableWithoutFeedback onPress={() => this.actionOnRow(item)}>
              <View style={this.row(colors, index)}>
                <Text style={{fontSize: 17, margin: 5, fontWeight: 'bold', color: '#ffffff'}}>
                  {'Departure Station: ' + `${item.from.station.name}`}
                  {'\n'}
                  {'Departure At: ' + `${item.from.departure}`}
                  {'\n'}
                  {'Arrival Station: ' + `${item.to.station.name}`}
                  {'\n'}
                  {'Arrival At: ' + `${item.to.arrival}`}
                  {'\n'}
                  {'Transfers: ' + `${item.transfers}`}{' '}
                  {'Duration: ' + `${item.duration}`}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          )}
          ListHeaderComponent={this.renderListHeader}
        />
      </View>
    );
  }
}

export default Unnamed;

const styles = StyleSheet.create({
  containerU: {
    flex: 1,
    padding: 8,
    flexDirection: 'column', // main axis
    justifyContent: 'center', // main axis
    alignItems: 'center', // cross axis
    backgroundColor: '#003f5c',
  },

  logo: {
    fontWeight: 'bold',
    fontSize: 40,
    textAlign: 'center',
    color: '#fb5b5a',
    marginBottom: 10,
  },

  flatContainer: {
    margin: 5,
  },
});
