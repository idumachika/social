import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Platform, StyleSheet, TextInput, View, Animated } from 'react-native';

const IS_ANDROID = Platform.OS === 'android';

export default class CustomTextInput extends Component {
  static propTypes = {
    isEnabled: PropTypes.bool,
  };

  state = {
    isFocused: false,
  };

  focus = () => this.textInputRef.focus();

  focusStatus = () => this.setState({ isFocused: !this.state.isFocused });

  render() {
    const { isEnabled, ...otherProps } = this.props;
    const { isFocused } = this.state;
    const color = isEnabled ? 'grey' : '#3c0e65';
    const borderColor = isFocused ? 'grey' : '#3c0e65';
    return (
      <Animated.View style={styles.container}>
        <View style={[styles.textInputWrapper, { borderColor }]}>
          <TextInput
            ref={ref => (this.textInputRef = ref)}
            autoCapitalize={'none'}
            autoCorrect={false}
            style={[styles.textInput, { color }]}
            maxLength={32}
            underlineColorAndroid={'transparent'}
            placeholderTextColor={'#3c0e65'}
            selectionColor={'#3c0e65'}
            onFocus={this.focusStatus}
            onBlur={this.focusStatus}
            {...otherProps}
          />
        </View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 2,
    marginBottom: 10,
  },
  textInputWrapper: {
    height: 42,
    marginBottom: 2,
    borderBottomWidth: 1,
  },
  textInput: {
    flex: 1,
    color: '#3c0e65',
    margin: IS_ANDROID ? -1 : 0,
    height: 42,
    padding: 7,
  },
});
