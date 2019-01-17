import React, { Component } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ImageBackground,
} from 'react-native';
import { connect } from 'react-redux';
import { Navigation } from 'react-native-navigation';

import LinearGradient from 'react-native-linear-gradient';
import * as accountActions from '../reducers/account/actions';
import _ from 'lodash';
import { Avatar, Button, List, ListItem } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import Config from 'react-native-config';
import {
  material,
  iOSColors,
  systemWeights,
  materialColors,
} from 'react-native-typography';
const SERVER_URL = __DEV__ ? Config.LOCAL_SERVER_URL : Config.SERVER_URL;
const MENU = [
  {
    title: 'Account',
    icon: 'account-box',
    link: 'tlikes.AccountView',
  },
  {
    title: 'My Timelines',
    icon: 'account-card-details',
    link: 'tlikes.Timeline',
  },
  {
    title: 'Start Contest',
    icon: 'trophy',
    link: 'tlikes.contest.Start',
  },
  {
    title: 'Notifications',
    icon: 'message-alert',
    link: 'tlikes.Notification',
  },
  {
    title: 'Win-Win Promo',
    icon: 'cash-multiple',
    link: 'tlikes.Notification',
  },
  {
    title: 'Find Friends',
    icon: 'account-multiple',
    link: 'tlikes.FindFriends',
  },
  {
    title: 'Fund Wallet',
    icon: 'cash',
    link: 'tlikes.wallet.Purchase',
  },
  {
    title: 'Donations',
    icon: 'cash-usd',
    link: 'tlikes.FindFriends',
  },
];
const backgroundImage = require('../../img/social.jpg');
class SideMenu extends Component {
  constructor(props) {
    super(props);
    // if you want to listen on navigator events, set this up
    // this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) {
    console.log('SideMenu', 'Unhandled event ' + event.id);
  }
  gotoScreen = screen => {
    Navigation.push(this.props.activeComponent, {
      component: {
        name: screen.link,
        passProps: {
          text: 'Pushed screen',
        },
        options: {
          topBar: {
            visible: true,
            title: {
              text: screen.title,
              color: iOSColors.purple,
            },
            animate: true,
          },
        },
      },
    });
    Navigation.mergeOptions(this.props.activeComponent, {
      sideMenu: {
        left: {
          visible: false,
        },
      },
    });
  };

  render() {
    const { user } = this.props;
    return (
      <View style={styles.container}>
        <View style={{ flex: 3 }}>
          <ImageBackground
            imageStyle={{ resizeMode: 'cover', padding: 10 }}
            style={{
              flex: 1,
              width: null,
              alignSelf: 'stretch',
            }}
            source={backgroundImage}>
            <LinearGradient
              colors={[
                'rgba(60,14,101, 0.2)',
                'rgba(60,14,101, 0.2)',
                'rgba(60,14,101, 0.7)',
              ]}
              style={{
                top: 0,
                left: 0,
                right: 0,
                height: '100%',
                position: 'absolute',
              }}
            />
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 2, padding: 7 }}>
                <Avatar
                  large
                  rounded
                  source={{
                    uri: `${SERVER_URL}/media/stream/image/${user.avatar}`,
                  }}
                  onPress={() => console.log('Works!')}
                  activeOpacity={0.7}
                />
              </View>
              <View
                style={{ flexDirection: 'column', flex: 4, paddingTop: 13 }}>
                <Text
                  style={{
                    color: 'white',
                    fontWeight: '600',
                    fontSize: 22,
                  }}>
                  {user.name}
                </Text>
                {/* <Text style={{ color: 'white', fontSize: 16 }}></Text> */}
              </View>
            </View>
          </ImageBackground>
        </View>
        <View style={{ flex: 10 }}>
          {MENU.map((item, i) => (
            <TouchableOpacity
              onPress={() => this.gotoScreen(item)}
              key={`${i}`}
              style={songRowStyles.row}>
              <MaterialCommunityIcons
                style={songRowStyles.icon}
                size={25}
                name={item.icon}
              />
              {/* <ImageBackground style={songRowStyles.image} source={cover} /> */}
              <View style={songRowStyles.column}>
                <Text style={material.body2}>{item.title}</Text>
                <Text style={material.caption}>User account information</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.button}>
          <Button
            iconRight={
              <Icon
                type="font-awesome"
                name="sign-out"
                size={15}
                color="#3c0e65"
              />
            }
            titleStyle={{ color: '#3c0e65', fontSize: 17, fontWeight: '600' }}
            buttonStyle={{
              backgroundColor: '#3c0e65',
            }}
            onPress={() => this.props.logout()}
            title="Log out"
          />
        </View>
      </View>
    );
  }

  onShowModalPress() {
    this.props.navigator.showModal({
      title: 'Modal Screen from SideMenu',
      screen: 'example.PushedScreen',
      passProps: {
        str: "This is a prop passed in 'navigator.showModal()'!",
        obj: {
          str: 'This is a prop passed in an object!',
          arr: [
            {
              str: 'This is a prop in an object in an array in an object!',
            },
          ],
        },
        num: 1234,
      },
    });
  }

  onPushScreenToFirstTab() {
    this.props.navigator.handleDeepLink({
      link: 'tab1/pushScreen/example.PushedScreen',
    });
  }

  onPushScreenToSecondTab() {
    this.props.navigator.handleDeepLink({
      link: 'tab2/pushScreen/example.PushedScreen',
    });
  }
}

const songRowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 8,
  },
  number: {
    ...material.subheadingObject,
    color: materialColors.blackSecondary,
  },
  icon: {
    marginTop: 4,
    borderRadius: 3,
    marginLeft: 6,
  },
  image: {
    marginTop: 4,
    borderRadius: 3,
    marginLeft: 16,
    height: 40,
    width: 40,
  },
  column: {
    flex: 1,
    marginLeft: 16,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  duration: {
    ...material.body1Object,
    color: materialColors.blackSecondary,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: 300,
    backgroundColor: 'white',
  },
  button: {
    marginTop: 16,
  },
});
function mapStateToProps(state) {
  return {
    user: state.account.user,
    activeComponent: state.app.activeComponent,
  };
}

const mapDispatchToProps = dispatch => {
  return {
    logout: () => dispatch(accountActions.logout()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SideMenu);
