import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
  Platform,
  TouchableOpacity as Touchable,
  Alert,
  Dimensions,
} from 'react-native';
import { Card, Icon, CardItem, Left, Right, Body, Button, Text, Thumbnail } from 'native-base';
import Config from 'react-native-config';
import LinearGradient from 'react-native-linear-gradient';
import _ from 'lodash';
import FastImage from 'react-native-fast-image';
import * as Progress from 'react-native-progress';
import { createImageProgress } from 'react-native-image-progress';
import { Navigation } from 'react-native-navigation';
const FImage = createImageProgress(FastImage);
import { iOSColors } from 'react-native-typography';
import numeral from 'numeral';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Video from './media/video';

const profileImageSize = 40; //36;
const padding = 12;

export default class TVideo extends React.Component {
	constructor(props) {
		super(props);
	}

	postClicked = () => {

			Navigation.showModal({
				stack: {
					children: [
						{
							component: {
								name: 'tlikes.discover.VideoPlayer',
								passProps: {
									post,
								},
								options: {
									topBar: {
										title: {
											text: this.props.post.body,
										},
									},
								},
							},
						},
					],
				},
			});
	};

	render() {
		return (
			<Video
          // onEnd={this.closeModal}
          title={this.props.title}
          fullScreenOnly={false}
          rotateToFullScreen={false}
          autoPlay={true}
          url={this.props.url}
          //placeholder={`${Config.SERVER_URL}/media/stream/cover/${v._id}`}
        />
		)
	}

	/*
	render1() {
		return (
			<Touchable onPress={this.postClicked(type, post)}>
	        <FImage
	          resizeMode={FastImage.resizeMode.cover}
	          indicator={Progress.Circle}
	          indicatorProps={{
	            size: 80,
	            borderWidth: 0,
	            color: 'rgba(60,14,101, 1)',
	            unfilledColor: 'rgba(60,14,101, 0.2)',
	          }}
	          style={{
	            backgroundColor: '#D8D8D8',
	            width: '100%',
	            aspectRatio: aspect,
	          }}
	          source={{ uri }}>

	            <LinearGradient
	              colors={[
	                'rgba(224, 198, 247, 0.2)',
	                'rgba(224, 198, 247, 0.2)',
	                'rgba(224, 198, 247, 0.7)',
	              ]}
	              style={{
	                top: 0,
	                left: 0,
	                right: 0,
	                height: '100%',
	                position: 'absolute',
	              }}
	            />

	            <MaterialIcons
	              style={styles.playBtn}
	              name="play-circle-filled"
	              color="#fff"
	              size={100}
	            />

	        </FImage>
	      </Touchable>
		)
	}; */
}

const styles = StyleSheet.create({
  text: { fontWeight: '600' },
  subtitle: {
    opacity: 0.8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  padding: {
    padding,
  },
  playBtn: {
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 120,
  },
  imgLikeInBtn: {
    width: 25,
    height: 25,
    margin: 7,
  },
  avatar: {
    aspectRatio: 1,
    backgroundColor: '#D8D8D8',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#979797',
    borderRadius: 5, //profileImageSize / 2,
    width: profileImageSize,
    height: profileImageSize,
    marginRight: padding,
  },
  card: {
    marginTop: 20,
    marginHorizontal: 16,
    padding: 12,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: iOSColors.white,
    borderRadius: 6,
    ...Platform.select({
      android: { elevation: 16 },
      ios: {
        shadowColor: 'black',
        shadowOffset: {
          width: 0,
          height: 16,
        },
        shadowOpacity: 0.2,
        shadowRadius: 16,
      },
    }),
  },
});