import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import Config from 'react-native-config';
import * as accountAction from '../../reducers/account/actions';
import { GoogleSignin, statusCodes } from 'react-native-google-signin';
// import * as RNIap from 'react-native-iap';

import {
  LoginManager,
  GraphRequest,
  GraphRequestManager,
  AccessToken,
} from 'react-native-fbsdk';
import { connect } from 'react-redux';

import CustomButton from '../../components/CustomButton';
import MountainBackground from '../../components/MountainBackground';

const gradientColor = ['#FAFAFA', '#FFFFFF'];
const itemSkus = Platform.select({
  ios: ['50_tvalue'],
  android: ['50_tvalue'],
});
class WelcomeScreen extends PureComponent {
  constructor(props) {
    super(props);
    GoogleSignin.configure();
    //RNIap.initConnection();
  }
  loginScreen = () =>
    Navigation.push(this.props.componentId, {
      component: {
        name: 'tlikes.LoginScreen',
        passProps: {
          text: 'Pushed screen',
        },
        options: {
          topBar: {
            title: {
              text: 'LOGIN',
            },
            animate: true,
          },
        },
      },
    });

  signUpScreen = data =>
    Navigation.push(this.props.componentId, {
      component: {
        name: 'tlikes.SignUpScreen',
        passProps: {
          ...data,
        },
        options: {
          topBar: {
            title: {
              text: 'SIGNUP',
            },
            animate: true,
          },
        },
      },
    });

  socialSignUpScreen = data =>
    Navigation.push(this.props.componentId, {
      component: {
        name: 'tlikes.auth.SocialSignUp',
        passProps: {
          ...data,
        },
        options: {
          topBar: {
            title: {
              text: 'SIGNUP',
            },
            animate: true,
          },
        },
      },
    });

  googleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      this.props.preSocial({
        mode: 'google',
        ...userInfo.user,
        googleAccessToken: userInfo.accessToken,
      });
    } catch (error) {
      console.log(error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (f.e. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };

  FBSignIn = async () => {
    try {
      await LoginManager.logInWithReadPermissions(['public_profile']);
      const access = await AccessToken.getCurrentAccessToken();
      const infoRequest = new GraphRequest(
        '/me/?fields=id,email,first_name,last_name,gender,picture,birthday,about',
        null,
        (err, info) => {
          if (!err) {
            // TODO: check if record exists a login else signup
            this.props.preSocial({
              mode: 'fb',
              ...info,
              facebookAccessToken: access.accessToken,
            });
          } else {
            alert('An error occur!');
          }
        }
      );
      new GraphRequestManager().addRequest(infoRequest).start();
    } catch (error) {
      console.log(error);
    }
  };

  // async componentDidMount() {
  //   try {
  //     const products = await RNIap.getProducts(itemSkus);
  //     const subs = await RNIap.getSubscriptions(['1_month_box_office ']);
  //     console.log(products, subs);
  //   } catch (err) {
  //     console.warn(err); // standardized err.code and err.message available
  //   }
  // }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.preSocialLogin && !this.props.preSocialLogin) {
      if (!this.props.preSocialLoginSuccess) {
        // send to registration page
        const { preSocialData } = this.props;
        Alert.alert(
          'FIRST LOGIN',
          "It's your first login, we need some more information from you.",
          [
            {
              text: 'Cancel',
              onPress: () => null,
              style: 'cancel',
            },
            {
              text: 'Proceed',
              onPress: () => this.socialSignUpScreen({ ...preSocialData }),
            },
          ],
          { cancelable: true }
        );
      }
    }
  }

  render() {
    if (this.props.preSocialLogin) {
      return (
        <MountainBackground>
          <View style={styles.container}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        </MountainBackground>
      );
    }
    return (
      <MountainBackground>
        <View style={styles.container}>
          <CustomButton
            colors={gradientColor}
            text={'LOGIN'}
            onPress={this.loginScreen}
            textStyle={styles.loginColor}
          />
          <CustomButton
            colors={['#e52d27', '#b31217']}
            text={'GOOGLE LOGIN'}
            onPress={this.googleSignIn}
            textStyle={styles.loginText}
          />
          <CustomButton
            colors={['#00c6ff', '#0072ff']}
            text={'FACEBOOK LOGIN'}
            onPress={this.FBSignIn}
            textStyle={styles.loginText}
          />
          {/* <CustomButton
            text={'TEST IAP'}
            onPress={() => {
              //  RNIap.consumeAllItems().then(t => console.log(t));
              RNIap.buyProduct('50_tvalue')
                .then(purchase => {
                  console.log(purchase);
                  RNIap.consumePurchase(purchase.purchaseToken);
                })
                .catch(err => console.log(err.message));
            }}
            textStyle={styles.loginText}
          /> */}

          <TouchableOpacity onPress={this.signUpScreen} style={styles.padding}>
            <Text style={styles.creatText}>Create New Account</Text>
          </TouchableOpacity>
        </View>
      </MountainBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 80,
    flex: 1,
    justifyContent: 'space-between',
    alignContent: 'space-between',
  },
  creatText: {
    color: '#fff',
    fontSize: 15,
    alignSelf: 'center',
  },
  padding: {
    padding: 20,
  },
  loginText: {
    color: '#FFFFFF',
    fontFamily: 'typonil',
    fontSize: 15,
  },
  loginColor: { color: '#3c0e65' },
});

// which props do we want to inject, given the global state?
function mapStateToProps(state) {
  return {
    preSocialData: state.account.preSocialData,
    socialLoginProcessing: state.account.socialLoginProcessing,
    socialLoginResponse: state.account.socialLoginResponse,
    preSocialLogin: state.account.preSocialLogin,
    preSocialLoginSuccess: state.account.preSocialLoginSuccess,
  };
}

const mapDispatchToProps = dispatch => {
  return {
    socialLogin: data => dispatch(accountAction.socialLoginAttempt(data)),
    preSocial: data => dispatch(accountAction.checkSocialRecord(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WelcomeScreen);
