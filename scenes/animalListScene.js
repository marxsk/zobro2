import React from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  TextInput,
  StyleSheet, Alert
} from 'react-native';
import * as scenes from '../scenes';

import AlphabetListView from 'react-native-alphabetlistview';

const animals = {
  'pes' : {name: 'pes divoký'},
  'hroch' : {name: 'hroch hro'},
  'zmija' : {name: 'zmija pásikavá'},
}

class Cell extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <TouchableHighlight
        onPress={() => this.props.navigation.navigate(scenes.sceneTitles['events'].name)}
        underlayColor='#bbbbbb'
      >
      <View style={{height:30, paddingLeft: 5}}>
        <Text style={{color: 'white'}}>{this.props.item.name}</Text>
      </View>
      </TouchableHighlight>
    );
  }
}
class SectionItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <View style={{
          backgroundColor: this.props.bgColor,
          width: 30,
          height: 30,
          borderLeftWidth: 1,
          borderColor: 'white',
          justifyContent: 'center',
        }}>
        <Text style={{color: 'white', textAlign: 'center', fontWeight: '700'}}>{this.props.title}</Text>
        </View>
    );
  }
}
class SectionHeader extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    // inline styles used for brevity, use a stylesheet when possible
    var textStyle = {
      textAlign:'center',
      color:'#fff',
      fontWeight:'700',
      fontSize:24
    };

    var viewStyle = {
      backgroundColor: '#104f1f'
    };
    return (
      <View style={viewStyle}>
        <Text style={textStyle}>{this.props.title}</Text>
      </View>
    );
  }
}

export default class AboutScene extends React.Component {
  constructor(props) {
    super(props);

    this.state = this.prepareSortedStructure(animals);
  }

  prepareSortedStructure(animals) {
    let state = {
      fullData: {}
    };

    const removeAccents = {
      'Č' : 'C',
      'Š' : 'S',
      'Ú' : 'U',
      'Ž' : 'Z',
      'Ě' : 'E',
      'Á' : 'A',
      'Ř' : 'R',
    };

    for (let animalID in animals) {
      let animal = animals[animalID];
      let firstLetter = animal.name.charAt(0).toUpperCase();

      if ((firstLetter === 'C') && (animal.name.charAt(1) === 'h')) {
        firstLetter = 'Ch';
      }

      if (firstLetter in removeAccents) {
        firstLetter = removeAccents[firstLetter];
      }

      if (!(firstLetter in state.fullData)) {
        state.fullData[firstLetter] = [];
      }

      state.fullData[firstLetter].push(animal);
    };

    for (let letter in state.fullData) {
      state.fullData[letter].sort(function(a, b) {
        return a.name.localeCompare(b.name);
      })
    };

    state['data'] = state.fullData;

    return state;
  }

  setFilter(text) {
    this.setState({
      text: text.text,
      data: this.filter(text.text.toUpperCase()),
    })
  }

  filter(text) {
    let data = {};
    for (let letter in this.state.fullData) {
      for (let idx in this.state.fullData[letter]) {
        if (this.state.fullData[letter][idx].name.toUpperCase().includes(text)) {
          if (!(letter in data)) {
            data[letter] = [];
          }
          data[letter].push(this.state.fullData[letter][idx]);
        }
      }
    }

    if (Object.keys(data).length === 0) {
      data['*'] = [{name: 'Zvíře s požadovaným jménem v aplikaci zatím chybí'}];
    }
    return data;
  }

  render() {
    return (
      <View style={{flex: 1}}>
      <TextInput
        style={{height: 40, textAlign: 'center', borderColor: 'gray', borderWidth: 1, backgroundColor: 'white'}}
        onChangeText={(text) => this.setFilter({text})}
        value={this.state.text}
        placeholder='Hledat'
        autoCorrect={false}
      />
        <AlphabetListView
          data={this.state.data}
          cell={Cell}
          cellProps={{navigation: this.props.navigation}}
          cellHeight={30}
          sectionListItem={SectionItem}
          sectionHeader={SectionHeader}
          sectionHeaderHeight={22.5}
          compareFunction={(a,b) => {return a.localeCompare(b); }}
          style={{
            backgroundColor: '#104f1f',
          }}
        />
      </View>
    );
  }
}
