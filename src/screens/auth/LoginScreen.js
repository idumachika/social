import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Text, View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import * as appActions from '../../reducers/app/actions';
import * as accountAction from '../../reducers/account/actions';
import CustomButton from '../../components/CustomButton';
import CustomTextInput from '../../components/CustomTextInput';
import MountainBackground from '../../components/MountainBackground';
// this is a traditional React component connected to the redux store
class LoginScreen extends PureComponent {
  static get options() {
    return {
      topBar: {
        visible: true,
        drawBehind: false,
        background: {
          color: 'white',
        },
        title: {
          text: 'LOGIN',
          fontSize: 20,
          color: '#3c0e65',
          // fontFamily: 'typonil_bold',
        },
      },
    };
  }

  updateUsername = username => this.props.updateUser({ username });
  updatePassword = password => this.props.updateUser({ password });

  render() {
    const { user, accountLogin, loginRequested, accountError } = this.props;
    return (
      <MountainBackground>
        <View style={{ marginTop: 80 }}>
          <Text style={styles.errorMessage}>{accountError}</Text>
          <View style={styles.inputWrapper}>
            <CustomTextInput
              placeholder={'Enter username'}
              editable={!loginRequested}
              returnKeyType={'next'}
              blurOnSubmit={false}
              withRef={true}
              value={user.username}
              ref={ref => (this.emailInputRef = ref)}
              onSubmitEditing={() => this.passwordInputRef.focus()}
              onChangeText={this.updateUsername}
            />
          </View>
          <View style={styles.inputWrapper}>
            <CustomTextInput
              name={'password'}
              placeholder={'Enter password'}
              editable={!loginRequested}
              returnKeyType={'go'}
              secureTextEntry={true}
              withRef={true}
              ref={ref => (this.passwordInputRef = ref)}
              value={user.password}
              onChangeText={this.updatePassword}
              isEnabled={!loginRequested}
              onSubmitEditing={accountLogin}
            />
          </View>
          <CustomButton
            colors={['#FAFAFA', '#FFFFFF']}
            text={'LOGIN'}
            onPress={accountLogin}
            textStyle={{ color: '#3c0e65' }}
            isLoading={loginRequested}
            isEnabled={!loginRequested}
          />
        </View>
      </MountainBackground>
    );
  }
}

const styles = StyleSheet.create({
  inputWrapper: {
    backgroundColor: 'white',
    borderRadius: 5,
    marginBottom: 10,
  },
  button: {
    textAlign: 'center',
    fontSize: 15,
    marginBottom: 10,
    marginTop: 10,
    color: 'blue',
  },
  errorMessage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    padding: 10,
  },
});

// which props do we want to inject, given the global state?
function mapStateToProps(state) {
  return {
    user: state.account.user,
    loginRequested: state.account.loginRequested,
    accountError: state.account.accountLoginError,
  };
}

const mapDispatchToProps = dispatch => {
  return {
    proceedToDashboard: () => dispatch(appActions.login()),
    accountLogin: () => dispatch(accountAction.login()),
    updateUser: fields => dispatch(accountAction.updateUser(fields)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginScreen);
