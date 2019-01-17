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
import PopupMenu from './PopupMenu';

// <Icon1 name="ios-more" />
const profileImageSize = 40; //36;
const padding = 12;

const iLike = (user, likes) =>
  _.first(_.takeWhile(likes, { author: user._id }));

const Metadata = ({ post, onLike, user, outOfFund, viewId }) => (
  <View style={styles.padding}>
    <IconBar
      outOfFund={outOfFund}
      onLike={onLike}
      post={post}
      isLiked={iLike(user, post.likes)}
      viewId={viewId}
      likes={getLikeLabel(post.likes)}
    />

    <Text style={styles.subtitle}>{post.body}</Text>
  </View>
);

const getLikeLabel = (likes) => {
  return numeral(likes.length).format(
          likes.length < 1000 ? '0 a' : '0.00a'
        ) + " " + likes.length > 1 ? 'Likes' : 'Like';
}

const Header = ({ name, image }) => (
  <View style={[styles.row, styles.padding]}>
    <View style={styles.row}>
      <FastImage
        resizeMode={FastImage.resizeMode.contain}
        style={styles.avatar}
        source={image}
      />
      <Text style={styles.text}>{name}</Text>
    </View>
    <PopupMenu
      actions={['Edit', 'Delete']}
      onPress={(e, i) => console.log(i)}
    />
  </View>
);

const Icon1 = ({ name }) => (
  <Ionicons style={{ marginRight: 8 }} name={name} size={26} color="black" />
);

const makeComment = postId => {
  Navigation.showModal({
    stack: {
      children: [
        {
          component: {
            name: 'tlikes.discover.CommentPage',
            passProps: {
              postId,
            },
            options: {
              topBar: {
                title: {
                  text: 'Make Comment',
                },
              },
            },
          },
        },
      ],
    },
  });
};

const requestFund = viewId =>
  Alert.alert(
    'Insufficient Fund',
    "You're out of T-Values, will you like to top-up your wallet now?",
    [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Proceed',
        onPress: () =>
          Navigation.push(viewId, {
            component: {
              name: 'tlikes.wallet.Purchase',
              passProps: {
                text: 'Pushed screen',
              },
              options: {
                topBar: {
                  title: {
                    text: 'Fund Wallet',
                  },
                  animate: true,
                },
              },
            },
          }),
      },
    ],
    { cancelable: true }
  );

const confirmLike = (onLike, pId) =>
  Alert.alert(
    'TLikes',
    "You'll be charged 1 T-Value for liking this post.",
    [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Proceed',
        onPress: () =>
          onLike(pId)
      },
    ],
    { cancelable: true }
  );

const LikeIcon = (liked) => {
  //alert("Liked: " + JSON.stringify(liked));
  return ((liked)? <Icon active={true} name="thumbs-up" />
                : <Icon active={false} name="thumbs-up" />)
}
const IconBar = ({ onLike, post, isLiked, outOfFund, viewId, likes }) => (
  <Card transparent>
    <CardItem>
      <Left>
        <Button transparent
          onPress={() => (outOfFund ? requestFund(viewId) : confirmLike(onLike, post._id))}>
          {LikeIcon(isLiked)}

          <Text>{likes}</Text>
        </Button>

        <Button transparent
          onPress={() => makeComment(post._id)}>
          <Icon active name="chatbubbles" />
          <Text>{numeral(post.comments.length).format(
            post.comments.length < 1000 ? '0 a' : '0.00a'
          )}</Text>
        </Button>
      </Left>
      <Right>
        <Button transparent>
          <Icon active name="paper-plane" />
        </Button>
      </Right>
    </CardItem>
    </Card>
);

const IconBar1 = ({ onLike, post, isLiked, outOfFund, viewId }) => (
  <View style={styles.row}>
    <View style={styles.row}>
      <Touchable
        onPress={() => (outOfFund ? requestFund(viewId) : onLike(post._id))}>
        {!outOfFund && (
          <FastImage
            style={styles.imgLikeInBtn}
            source={{
              uri: isLiked
                ? `${Config.SERVER_URL}/images/ic_like_fill.png`
                : `${Config.SERVER_URL}/images/ic_like.png`,
            }}
          />
        )}
        {outOfFund && <Icon name="ios-lock-outline" size={25} />}
      </Touchable>
      <Touchable onPress={() => makeComment(post._id)}>
        <Icon name="ios-chatbubbles-outline" />
        <Text style={styles.text}>
          {numeral(post.comments.length).format(
            post.comments.length < 1000 ? '0 a' : '0.00a'
          )}
        </Text>
      </Touchable>
      <Icon name="ios-send-outline" />
    </View>
    <Icon name="ios-bookmark-outline" />
  </View>
);

const postClicked = (type, post) => {
  if (type === 'video') {
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
                    text: post.body,
                  },
                },
              },
            },
          },
        ],
      },
    });
  } else if (type === 'image') {
  }
};

const win = Dimensions.get('window');
const TrendingPost = ({ post, onLike, user, outOfFund, viewId }) => {
  const video = _.first(_.takeWhile(post.media, { type: 'video' }));
  const audio = _.first(_.takeWhile(post.media, { type: 'audio' }));
  const image = _.first(_.takeWhile(post.media, { type: 'image' }));
  let uri;
  let imgW;
  let imgH;
  let aspect;
  let type;

  if (image) {
    imgW = parseInt(image.width);
    imgH = parseInt(image.height);
    aspect = imgW / imgH || 1;
    uri = `${Config.SERVER_URL}/media/stream/image/${image._id}`;
    type = 'image';
  }

  if (!image && video) {
    imgW = 467;
    imgH = 467;
    aspect = imgW / imgH || 1;
    uri = `${Config.SERVER_URL}/media/stream/cover/${video._id}`;
    type = 'video';
  }

  if (!uri) {
    return null;
  }

  /*return (
    <Card>
            <CardItem>
              <Body>
                <Header
        image={{
          uri: `${Config.SERVER_URL}/media/stream/image/${post.author.avatar}`,
        }}
        name={post.author.name}
      />
              </Body>
            </CardItem>
            <CardItem cardBody>
              <Touchable onPress={() => postClicked(type, post)}>
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
          {video && (
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
                height: 'auto',
                position: 'absolute',
              }}
            />
          )}
          {video && (
            <MaterialIcons
              style={styles.playBtn}
              name="play-circle-filled"
              color="#fff"
              size={100}
            />
          )}
        </FImage>
      </Touchable>
            </CardItem>
            <Metadata
        viewId={viewId}
        outOfFund={outOfFund}
        onLike={onLike}
        post={post}
        user={user}
      />
          </Card>
  );
}; */


  return (
    <View>
      <Header
        image={{
          uri: `${Config.SERVER_URL}/media/stream/image/${post.author.avatar}`,
        }}
        name={post.author.name}
      />
      <Touchable onPress={() => postClicked(type, post)}>
        <FImage
          //resizeMode={FastImage.resizeMode.contain}
          indicator={Progress.Circle}
          indicatorProps={{
            size: 80,
            borderWidth: 0,
            color: 'rgba(60,14,101, 1)',
            unfilledColor: 'rgba(60,14,101, 0.2)',
          }}
          style={{
            backgroundColor: '#D8D8D8',
            width: win.width,
            aspectRatio: aspect,
          }}
          source={{ uri }}>
          {video && (
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
          )}
          {video && (
            <MaterialIcons
              style={styles.playBtn}
              name="play-circle-filled"
              color="#fff"
              size={100}
            />
          )}
        </FImage>
      </Touchable>
      <Metadata
        viewId={viewId}
        outOfFund={outOfFund}
        onLike={onLike}
        post={post}
        user={user}
      />
    </View>
  );
};


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
export default TrendingPost;
