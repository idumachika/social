import times from 'lodash.times';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Text,
  ImageBackground,
  TouchableOpacity,
  Image,
} from 'react-native';
import Config from 'react-native-config';
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
// this is a traditional React component connected to the redux store

const socialImage = require('../../../img/social.jpg');
import CustomButton from '../../components/CustomButton';
import CustomTextInput from '../../components/CustomTextInput';

class AccountPage extends Component {
  state = {
    share: { text: '' },
    dpHolder: `${Config.SERVER_URL}/images/love2.png`,
  };

  updateUserInfo = field => this.props.updateUser(field);

  render() {
    const { dpHolder } = this.state;
    const { user } = this.props;
    console.log(user);
    return (
      <View style={{ flex: 1, marginTop: 60, backgroundColor: '#e0e0e0' }}>
        <View style={{ flex: Platform.OS === 'android' ? 3 : 2 }}>
          <ImageBackground
            imageStyle={{ resizeMode: 'cover' }}
            style={{
              flex: 1,
              width: null,
              alignSelf: 'stretch',
            }}
            source={socialImage}>
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
            {/* <LinearGradient
              colors={['#3c0e65', '#5d2b8d']}
              start={{ x: 0.0, y: 0.5 }}
              end={{ x: 1.0, y: 0.1 }}
              style={[
                {},
                {
                  padding: 5,
                  alignItems: 'center',
                  borderRadius: 1,
                  justifyContent: 'center',
                  height: '100%',
                },
              ]}
            /> */}

            <TouchableOpacity
              onPress={this.chooseProfileImage}
              style={{
                height: 190,
                width: 300,
                position: 'absolute',
                alignSelf: 'center',
                marginTop: 13,
                zIndex: 55,
              }}>
              <Image
                source={{
                  uri: `${Config.SERVER_URL}/media/stream/image/${user.avatar}`,
                }}
                style={{
                  alignSelf: 'center',
                  height: 100,
                  width: 100,
                  borderRadius: 50,
                  borderWidth: 2,
                  borderColor: 'white',
                }}
                activeOpacity={0.7}
              />
              <Image source={{ uri: `${Config.SERVER_URL}/media/stream/image/${user.avatar}`, }} />
              <Text
                style={{
                  color: 'white',
                  fontFamily: 'typonil',
                  fontWeight: '600',
                  fontSize: 12,
                  alignSelf: 'center',
                }}>
                {user.name}
              </Text>
            </TouchableOpacity>
          </ImageBackground>
        </View>
        <View style={{ flex: 5, padding: 10 }}>
          <CustomTextInput
            placeholder={'Full Name'}
            value={user.name}
            onChangeText={name => this.updateUserInfo({ name })}
            ref={ref => (this.nameInputRef = ref)}
            onSubmitEditing={() => this.usernameInputRef.focus()}
            // editable={!registrationRequested}
            returnKeyType={'next'}
            blurOnSubmit={false}
            withRef={true}
          />

          <CustomTextInput
            placeholder={'Username'}
            value={user.username}
            onChangeText={username => this.updateUserInfo({ username })}
            ref={ref => (this.usernameInputRef = ref)}
            onSubmitEditing={() => this.phoneInputRef.focus()}
            //  editable={!registrationRequested}
            returnKeyType={'next'}
            blurOnSubmit={false}
            withRef={true}
          />

          <CustomTextInput
            keyboardType={'phone-pad'}
            placeholder={'Phone Number'}
            value={user.phone}
            onChangeText={phone => this.updateUserInfo({ phone })}
            ref={ref => (this.phoneInputRef = ref)}
            onSubmitEditing={() => this.emailInputRef.focus()}
            // editable={!registrationRequested}
            returnKeyType={'next'}
            blurOnSubmit={false}
            withRef={true}
          />

          <CustomTextInput
            keyboardType={'email-address'}
            placeholder={'Email Address'}
            value={user.email}
            onChangeText={email => this.updateUserInfo({ email })}
            ref={ref => (this.emailInputRef = ref)}
            onSubmitEditing={() => this.passwordInputRef.focus()}
            //editable={!registrationRequested}
            returnKeyType={'next'}
            blurOnSubmit={false}
            withRef={true}
          />

          <CustomButton
            text={'SAVE'}
            // onPress={() => this.personal()}
            buttonStyle={{}}
            // textStyle={{ color: '#3c0e65' }}
            // isLoading={validationRequested}
            // disabledMessage={'All Fields are Required!'}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  seekWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  seekInsideWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

// which props do we want to inject, given the global state?
function mapStateToProps(state) {
  return {
    user: state.account.user,
    activeComponent: state.app.activeComponent,
  };
}

const mapDispatchToProps = dispatch => {
  return {
    updateUser: fields => dispatch(accountAction.updateUser(fields)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountPage);
