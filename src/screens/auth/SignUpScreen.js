import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import * as accountAction from '../../reducers/account/actions';
import { Navigation } from 'react-native-navigation';

import CustomButton from '../../components/CustomButton';
import CustomTextInput from '../../components/CustomTextInput';
import MountainBackground from '../../components/MountainBackground';
//import { last } from 'rxjs/operators';
// this is a traditional React component connected to the redux store
class SignUpScreen extends PureComponent {
  static get options() {
    return {
      topBar: {
        visible: true,
        drawBehind: false,
        background: {
          color: 'white',
        },
        title: {
          text: 'SIGNUP',
          fontSize: 20,
          color: '#3c0e65',
          // fontFamily: 'typonil_bold',
        },
      },
    };
  }

  constructor(props) {
    super(props);
    const { mode, updateUser } = this.props;
    if (mode === 'fb') {
      const {
        about,
        first_name,
        last_name,
        email,
        gender,
        picture,
        birthday,
        facebookAccessToken,
      } = this.props;
      updateUser({
        name: `${first_name} ${last_name}`,
        gender,
        email,
        dob: new Date(birthday),
        bio: about,
        picture: picture.data.url,
        mode,
        facebookAccessToken,
      });
    } else if (mode === 'google') {
      const { name, email, photo, googleAccessToken } = this.props;
      updateUser({
        name,
        email,
        picture: photo,
        mode,
        googleAccessToken,
      });
    }
  }

  showReport(content) {
    Navigation.showOverlay({
      component: {
        name: 'tlikes.SignUpLight',
        passProps: {
          title: 'SignUp Verification',
          content,
        },
        options: {
          topBar: {},
        },
      },
    });
  }

  checkStats() {
    const {
      validationError,
      accountRecordValidated,
      clearValidationError,
      user,
      componentId,
    } = this.props;
    if (validationError) {
      Navigation.showOverlay({
        component: {
          name: 'tlikes.SignUpLight',
          passProps: {
            title: 'SignUp Verification',
            content: validationError,
          },
          options: {
            topBar: {},
          },
        },
      });
      clearValidationError();
    }
    if (accountRecordValidated) {
      Navigation.push(componentId, {
        component: {
          name: 'tlikes.PersonalModal',
          passProps: {
            user,
          },
          options: {
            topBar: {
              title: {
                text: 'Getting Started',
              },
            },
          },
        },
      });
    }
  }

  personal() {
    const { user } = this.props;
    const { accountRecordValidated, validateAccount } = this.props;
    const email = /^[a-z0-9!#$%&\'*+\/=?^`{}|~_-]+[.a-z0-9!#$%&\'*+\/=?^`{}|~_-]*@[a-z0-9]+[._a-z0-9-]*\.[a-z0-9]+$/i;
    const password = /^[.a-zA-Z_0-9-!@#$%\^&*()]{6,32}$/i;
    const username = /^[a-z_0-9]{1,32}$/i;
    const phone = /^[0-9]{11,18}$/i;

    if (!email.test(user.email)) {
      this.showReport('Invalid email address');
      this.emailInputRef.focus();
      return false;
    }

    if (!username.test(user.username)) {
      this.showReport('Invalid username');
      this.usernameInputRef.focus();
      return false;
    }

    if (!phone.test(user.phone)) {
      this.showReport('Invalid phone number');
      this.phoneInputRef.focus();
      return false;
    }

    if (!password.test(user.password)) {
      this.showReport(
        'Invalid password, password should be minimum of 6 characters.'
      );
      this.passwordInputRef.focus();
      return false;
    }

    if (user.password !== user.cpassword) {
      this.showReport("Password don't match");
      this.passwordInputRef.focus();
      return false;
    }

    if (accountRecordValidated) {
      Navigation.push(this.props.componentId, {
        component: {
          name: 'tlikes.PersonalModal',
          passProps: {
            user,
          },
          options: {
            topBar: {
              title: {
                text: 'Getting Started',
              },
            },
          },
        },
      });
    } else {
      validateAccount(user);
    }
  }

  updateUserInfo = field => this.props.updateUser(field);
  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log(this.props.user);
    if (this.props.validationError || this.props.accountRecordValidated) {
      this.checkStats();
    }
  }
  render() {
    const {
      registrationRequested,
      validationRequested,
      user,
      validationError,
      accountRecordValidated,
    } = this.props;

    return (
      <MountainBackground>
        <View style={styles.contain}>
          <View style={styles.inputWrapper}>
            <CustomTextInput
              placeholder={'Full Name'}
              value={user.name}
              onChangeText={name => this.updateUserInfo({ name })}
              ref={ref => (this.nameInputRef = ref)}
              onSubmitEditing={() => this.usernameInputRef.focus()}
              editable={!registrationRequested}
              returnKeyType={'next'}
              blurOnSubmit={false}
              withRef={true}
            />
          </View>

          <View style={styles.inputWrapper}>
            <CustomTextInput
              placeholder={'Username'}
              value={user.username}
              onChangeText={username => this.updateUserInfo({ username })}
              ref={ref => (this.usernameInputRef = ref)}
              onSubmitEditing={() => this.phoneInputRef.focus()}
              editable={!registrationRequested}
              returnKeyType={'next'}
              blurOnSubmit={false}
              withRef={true}
            />
          </View>

          <View style={styles.inputWrapper}>
            <CustomTextInput
              keyboardType={'phone-pad'}
              placeholder={'Phone Number'}
              value={user.phone}
              onChangeText={phone => this.updateUserInfo({ phone })}
              ref={ref => (this.phoneInputRef = ref)}
              onSubmitEditing={() => this.emailInputRef.focus()}
              editable={!registrationRequested}
              returnKeyType={'next'}
              blurOnSubmit={false}
              withRef={true}
            />
          </View>

          <View style={styles.inputWrapper}>
            <CustomTextInput
              keyboardType={'email-address'}
              placeholder={'Email Address'}
              value={user.email}
              onChangeText={email => this.updateUserInfo({ email })}
              ref={ref => (this.emailInputRef = ref)}
              onSubmitEditing={() => this.passwordInputRef.focus()}
              editable={!registrationRequested}
              returnKeyType={'next'}
              blurOnSubmit={false}
              withRef={true}
            />
          </View>

          <View style={styles.inputWrapper}>
            <CustomTextInput
              name={'password'}
              placeholder={'Choose password'}
              editable={!registrationRequested}
              returnKeyType={'next'}
              secureTextEntry={true}
              withRef={true}
              ref={ref => (this.passwordInputRef = ref)}
              value={user.password}
              onSubmitEditing={() => this.cpasswordInputRef.focus()}
              onChangeText={password => this.updateUserInfo({ password })}
              isEnabled={!registrationRequested}
            />
          </View>

          <View style={styles.inputWrapper}>
            <CustomTextInput
              name={'cpassword'}
              placeholder={'Confirm chosen Password'}
              editable={!registrationRequested}
              returnKeyType={'done'}
              secureTextEntry={true}
              withRef={true}
              ref={ref => (this.cpasswordInputRef = ref)}
              value={user.cpassword}
              onChangeText={cpassword => this.updateUserInfo({ cpassword })}
              isEnabled={!registrationRequested}
            />
          </View>
          <CustomButton
            colors={['#FAFAFA', '#FFFFFF']}
            text={'PROCEED'}
            onPress={() => this.personal()}
            buttonStyle={{}}
            textStyle={{ color: '#3c0e65' }}
            isLoading={validationRequested}
            isEnabled={
              user.name &&
              user.phone &&
              user.username &&
              user.email &&
              user.password &&
              user.cpassword
                ? true
                : false && !validationRequested
            }
            disabledMessage={'All Fields are Required!'}
          />
        </View>
      </MountainBackground>
    );
  }
}

const styles = StyleSheet.create({
  contain: {
    marginTop: 5,
    flex: 1,
    justifyContent: 'space-between',
    alignContent: 'space-between',
  },
  inputWrapper: {
    backgroundColor: 'white',
    borderRadius: 5,
    marginBottom: 10,
  },
  button: {
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 10,
    marginTop: 10,
    color: 'blue',
  },
});

function mapStateToProps(state) {
  return {
    registrationRequested: state.account.registrationRequested,
    accountError: state.account.accountRegistrationError,
    validationRequested: state.account.validationRequested,
    validationError: state.account.accountValidationError,
    accountRecordValidated: state.account.accountRecordValidated,
    user: state.account.user,
  };
}

const mapDispatchToProps = dispatch => {
  return {
    validateAccount: user => dispatch(accountAction.validateAccount(user)),
    clearValidationError: () =>
      dispatch(accountAction.clearValidationErrorMessage()),
    updateUser: fields => dispatch(accountAction.updateUser(fields)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUpScreen);
