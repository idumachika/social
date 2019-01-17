import times from 'lodash.times';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View, StyleSheet, Platform, Text } from 'react-native';
import InputToolbar from '../components/post/InputToolbar';
import { connect } from 'react-redux';
import RNFS from 'react-native-fs';
import {
  DocumentPicker,
  DocumentPickerUtil,
} from 'react-native-document-picker';
import EPicker from 'react-native-picker';
// this is a traditional React component connected to the redux store

class TPlayer extends Component {
  state = {
    share: { text: '' },
  };

  render() {
    return (
      <View style={{ marginTop: 190, backgroundColor: 'yellow' }}>
        <Text>Hello</Text>
        <InputToolbar
          text={this.state.share.text}
          onTextChanged={text => {
            this.setState({ share: { ...this.state.share, text } });
          }}
          composerHeight={40}
          label={'Share'}
          onSend={() => {}}
          onPressActionButton={() => {
            DocumentPicker.show(
              {
                filetype: [
                  DocumentPickerUtil.images(),
                  DocumentPickerUtil.audio(),
                  DocumentPickerUtil.video(),
                ],
              },
              (error, res) => {
                // Android
                console.log(res);
              }
            );
          }}
        />
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
    // counter: state.counter,
  };
}

const mapDispatchToProps = dispatch => {
  return {
    // proceedToDashboard: () => dispatch(appActions.login()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TPlayer);
