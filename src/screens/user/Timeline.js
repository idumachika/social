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
import Line from '../../components/timeline/Line';

const data = [
  {
    title: 'Share',
    description: "Shared Austin's post",
    time: new Date('March 6, 2018 6:15:00'),
    innerCircleType: 'dot',
  },
  {
    title: 'Contest',
    description: 'Joined bishop "Fashion Contest"',
    time: new Date('March 6, 2018 14:15:00'),
    dashLine: true,
    dotSize: 8,
    circleSize: 20,
  },
  {
    title: 'Like',
    description: 'Liked 7 Talents',
    time: new Date('March 6, 2018 7:00:00'),
  },
  {
    title: 'Post',
    description: 'Post an Update',
    time: new Date('March 6, 2018 7:35:00'),
  },
  {
    title: 'Vote',
    description: 'Vote for "Jane Sul" in the "Fashion Contest"',
    time: new Date('March 6, 2018 14:15:00'),
    dashLine: true,
    dotSize: 8,
    circleSize: 20,
  },
];

// this is a traditional React component connected to the redux store
class Timeline extends Component {
  render() {
    return (
      <View style={{ marginTop: 80, flex: 1 }}>
        {/* <Line data={data.reverse()} isRenderSeperator innerCircleType={'dot'} /> */}
        <Line
          data={data}
          isRenderSeperator
          columnFormat={'two-column'}
          innerCircleType={'dot'}
        />
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
)(Timeline);
