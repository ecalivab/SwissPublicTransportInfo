import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Button,
} from 'react-native';
import Autocomplete from 'react-native-autocomplete-input';
import DatePicker from 'react-native-datepicker';
import TimePicker from 'react-native-24h-timepicker';

class Inputs extends Component {
  constructor(props) {
    //constructor to set default state
    super(props);
    /*
    this.state = {
      //intitialize local state
      time: this.getCurrentTime,
    };
    */
  }

  getCurrentTime = () => {
    const hour = new Date().getHours();
    const minutes = new Date().getMinutes();
    console.log(hour + ':' + minutes);

    return hour + ':' + minutes;
  };

  state = {
    stations: [],
    queryD: '',
    queryA: '',
    departure: '',
    arrival: '',
    datePick: '',
    time: this.getCurrentTime(),
    depVal: [],
    arrVal: [],
  };

  static navigationOptions = {
    //Setting the header of the screen
    title: 'Swiss Travel',
  };

  getCurrentDate = () => {
    const date = new Date().getDate();
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();

    console.log(year + '-' + month + '-' + date);
    //Alert.alert(date + '-' + month + '-' + year);
    // You can turn it in to your desired format
    return year + '-' + month + '-' + date; //format: dd-mm-yyyy;
  };

  PressButton = (dep, arr, date, time) => {
    const {navigate} = this.props.navigation;
    console.log('time: ' + time);

    if (this.state.datePick === '') {
      date = this.getCurrentDate();
    }

    if (this.state.time === '') {
      time = this.getCurrentTime();
    }

    if (this.state.departure === '') {
      alert('A Departure Station needs to be choose');
      return;
    }

    if (this.state.arrival === '') {
      alert('An Arrival Station needs to be choose');
      return;
    }

    let find = 0;
    console.log('inside press button' + this.state.depVal);

    for (let i = 0; i < this.state.depVal.length; i++) {
      console.log('inside for: ' + this.state.depVal[i]);
      if (this.state.depVal[i] === dep) {
        find = 1;
      }
    }
    if (find === 0) {
      alert('Departure Station is incorrect');
      return;
    }

    find = 0;

    for (let i = 0; i < this.state.arrVal.length; i++) {
      if (this.state.arrVal[i] === arr) {
        find = 1;
      }
    }
    if (find === 0) {
      alert('Arrival Station is incorrect');
      return;
    }

    alert(
      'Departure: ' +
        dep +
        '\nArrival: ' +
        arr +
        '\nDate: ' +
        date +
        ' Time: ' +
        time,
    );
    navigate('unnamed', {
      Dep: dep,
      Arr: arr,
      Date: date,
      Time: time,
    });
  };

  //componentDidMount() {
  // this.fetchData();
  // }

  fetchData = async search => {
    const response = await fetch(
      'http://transport.opendata.ch/v1/locations?type=stations&query=' + search,
      //'https://randomuser.me/api?results=10',
    );
    const json = await response.json();
    this.setState({stations: json.stations});
    //console.log('fetchData:' + json.stations[0].name);
  };

  validateStationD = async search => {
    const stationList = [];
    const response = await fetch(
      'http://transport.opendata.ch/v1/locations?type=stations&query=' + search,
      //'https://randomuser.me/api?results=10',
    );
    const json = await response.json();
    for (let i = 0; i < json.stations.length; i++) {
      stationList.push(json.stations[i].name);
    }
    console.log(json.stations[0]);
    this.setState({depVal: stationList});
  };

  validateStationA = async search => {
    const stationList = [];
    const response = await fetch(
      'http://transport.opendata.ch/v1/locations?type=stations&query=' + search,
      //'https://randomuser.me/api?results=10',
    );
    const json = await response.json();
    for (let i = 0; i < json.stations.length; i++) {
      stationList.push(json.stations[i].name);
    }
    console.log(json.stations[0]);
    this.setState({arrVal: stationList});
  };

  findStation(query) {
    //method called everytime when we change the value of the input
    if (query === '') {
      //if the query is null then return blank
      return [];
    }

    const {stations} = this.state;
    //making a case insensitive regular expression to get similar value from the film json
    const regex = new RegExp(`${query.trim()}`, 'i');
    //return the filtered film array according the query from the input
    return stations.filter(station => (station.name !== null) ? station.name.search(regex) >= 0 : '');
  }

  onCancel() {
    this.TimePicker.close();
  }

  onConfirm(hour, minute) {
    this.setState({time: `${hour}:${minute}`});
    this.TimePicker.close();
  }

  render() {
    const {queryA} = this.state;
    const {queryD} = this.state;
    const stationsA = this.findStation(queryA);
    const stationsD = this.findStation(queryD);
    const {departure} = this.state;
    const {arrival} = this.state;
    //const {selectedHours, selectedMinutes } = this.state;

    //this.setTime();
    //const time = this.getCurrentTime();
    const currentDay = this.getCurrentDate();

    const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();
    return (
      <View style={styles.containerInput}>
        <Text style={styles.logo}>SWISS TRAVEL</Text>

        <Autocomplete
          autoCapitalize="none"
          autoCorrect={false}
          //containerStyle={styles.autocompleteContainer}
          //data to show in suggestion
          data={
            stationsD.length === 1 && comp(queryD, stationsD[0].name)
              ? []
              : stationsD
          }
          //default value if you want to set something in input
          defaultValue={queryD}
          /*onchange of the text changing the state of the query which will trigger
                the findStation method to show the suggestions*/
          onChangeText={text => {
            this.setState({queryD: text});
            this.setState({departure: text});
            this.fetchData(departure);
          }}
          placeholder="Enter Departure Station"
          renderItem={({item}) => (
            //you can change the view you want to show in suggestion from here
            <TouchableOpacity
              onPress={() => {
                this.setState({queryD: item.name});
                this.setState({departure: item.name});
                this.validateStationD(item.name);
              }}>
              <Text style={styles.itemText}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />

        <Autocomplete
          autoCapitalize="none"
          autoCorrect={false}
          //containerStyle={styles.autocompleteContainer}
          //data to show in suggestion
          data={
            stationsA.length === 1 && comp(queryA, stationsA[0].name)
              ? []
              : stationsA
          }
          //default value if you want to set something in input
          defaultValue={queryA}
          /*onchange of the text changing the state of the query which will trigger
                  the findStation method to show the suggestions*/
          onChangeText={text => {
            this.setState({queryA: text});
            this.setState({arrival: text});
            this.fetchData(arrival);
          }}
          placeholder="Enter Arrival Station"
          renderItem={({item}) => (
            //you can change the view you want to show in suggestion from here
            <TouchableOpacity
              onPress={() => {
                this.setState({queryA: item.name});
                this.setState({arrival: item.name});
                this.validateStationA(item.name);
              }}>
              <Text style={styles.itemText}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />

        <View style={styles.inputView}>
          <Text style={styles.input} onPress={() => this.TimePicker.open()}>
            {this.state.time}
          </Text>
          <TimePicker
            ref={ref => {
              this.TimePicker = ref;
            }}
            onCancel={() => this.onCancel()}
            onConfirm={(hour, minute) => this.onConfirm(hour, minute)}
          />
        </View>

        <View style={styles.summitCentered}>
          <DatePicker
            style={{width: 200}}
            date={this.state.datePick} //initial date from state
            mode="date" //The enum of date, datetime and time
            placeholder={currentDay}
            format="YYYY-MM-DD"
            minDate="2019-01-01"
            maxDate="2021-12-31"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
              dateText: {
                marginLeft: 10,
                color: '#ffffff',
              },
              dateIcon: {
                position: 'absolute',
                left: 0,
                top: 4,
                marginLeft: 0,
              },
              dateInput: {
                marginLeft: 36,
                color: '#ffffff',
              },
            }}
            onDateChange={date => {
              this.setState({datePick: date});
            }}
          />
        </View>

        <View style={styles.summit}>
          <Button
            color="#663a82"
            title="Summit"
            onPress={() =>
              this.PressButton(
                this.state.departure,
                this.state.arrival,
                this.state.datePick,
                this.state.time,
              )
            }
          />
        </View>
      </View>
    );
  }
}
export default Inputs;

const styles = StyleSheet.create({
  containerInput: {
    backgroundColor: '#044d6d',
    flex: 1,
    padding: 16,
    marginTop: 0,
  },

  logo: {
    fontWeight: 'bold',
    fontSize: 50,
    textAlign: 'center',
    color: '#fb5b5a',
    marginBottom: 50,
  },
  autocompleteContainer: {
    backgroundColor: '#ffffff',
    borderWidth: 3,
  },
  descriptionContainer: {
    flex: 1,
    justifyContent: 'center',
  },

  itemText: {
    fontSize: 15,
    color: '#663a82',
    paddingTop: 5,
    paddingBottom: 5,
    margin: 2,
  },
  infoText: {
    textAlign: 'center',
    fontSize: 16,
  },
  input: {
    paddingTop: 10,
    paddingLeft: 30,
    margin: 15,
    height: 40,
    width: 100,
    borderColor: '#7a42f4',
    borderWidth: 1,
    backgroundColor: '#fffcfc',
  },
  inputView: {
    marginLeft: 120,
  },
  summit: {
    marginBottom: 10,
    marginTop: 10,
    marginLeft: 50,
    marginRight: 50,
  },
  summitCentered: {
    marginBottom: 10,
    marginTop: 10,
    marginLeft: 70,
    marginRight: 50,
  },
  containerPicker: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
    padding: 16,
  },
});
