import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';
import Config from 'react-native-config';
import RNFetchBlob from 'rn-fetch-blob';
import FastImage from 'react-native-fast-image';
import * as Progress from 'react-native-progress';
import moment from 'moment';
import { createImageProgress } from 'react-native-image-progress';
const FImage = createImageProgress(FastImage);
import {
  iOSColors,
  iOSUIKit,
  human,
  systemWeights,
} from 'react-native-typography';

const PostAvatarTag = ({ post }) => {
  return (
    <View style={{ flex: 1, flexDirection: 'row' }}>
      <View style={{ flex: 2 }}>
        <FastImage
          style={{
            borderRadius: 50,
            borderWidth: 2,
            borderColor: iOSColors.pink,
            height: 50,
            width: 50,
          }}
          source={{
            uri: `${Config.SERVER_URL}/media/stream/image/${
              post.author.avatar
            }`,
            priority: FastImage.priority.normal,
            headers: { 'accept-encoding': '' },
          }}
          //   resizeMode={FastImage.resizeMode.contain}
        />
      </View>
      <View style={{ flex: 8, marginTop: '3%' }}>
        <Text
          style={{
            ...iOSUIKit.bodyEmphasizedObject,
            color: iOSColors.purple,
          }}>
          {post.author.name}
        </Text>
        <Text
          style={{
            textAlignVertical: 'center',
            ...human.headlineWhiteObject,
            ...systemWeights.light,
          }}>
          {moment(new Date(post.createdAt).toUTCString()).fromNow()}
        </Text>
      </View>
    </View>
  );
};

export default PostAvatarTag;
