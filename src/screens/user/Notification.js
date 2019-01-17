import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Image,
} from 'react-native';
import { connect } from 'react-redux';
import * as counterActions from '../../reducers/discover/actions';
import * as appActions from '../../reducers/app/actions';
import { Navigation } from 'react-native-navigation';
import CustomButton from '../../components/CustomButton';
import CustomTextInput from '../../components/CustomTextInput';
import { List, ListItem } from 'react-native-elements';

const list = [
  {
    name: 'Amy Farha',
    avatar_url:
      'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
    subtitle: 'is now following you',
  },
  {
    name: 'Chris Jackson',
    avatar_url:
      'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
    subtitle: 'Invite you to a new contest',
  },
  {
    name: 'Amy Farha',
    avatar_url:
      'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
    subtitle: 'Shared your post',
  },
  {
    name: 'Chris Jackson',
    avatar_url:
      'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
    subtitle: 'Likes your content',
  },
];
// this is a traditional React component connected to the redux store
class Notification extends Component {
  render() {
    return (
      <View style={{ marginTop: 80, backgroundColor: '#e0e0e0' }}>
        <List containerStyle={{ marginBottom: 20 }}>
          {list.map(l => (
            <ListItem
              roundAvatar
              avatar={{ uri: l.avatar_url }}
              key={l.name}
              subtitle={l.subtitle}
              title={l.name}
            />
          ))}
        </List>
      </View>
    );
  }
}

const styles = StyleSheet.create({});

// which props do we want to inject, given the global state?
function mapStateToProps(state) {
  return {};
}

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Notification);
