import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity as Touchable,
  TextInput,
  FlatList,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
// import * as chatActions from '../../reducers/chatmate/actions';
import * as discoverActions from '../../reducers/discover/actions';
import { Navigation } from 'react-native-navigation';
import Config from 'react-native-config';
import FastImage from 'react-native-fast-image';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { iOSColors } from 'react-native-typography';
import _ from 'lodash';
const profileImageSize = 36;
const padding = 12;

// this is a traditional React component connected to the redux store
class CommentPage extends PureComponent {
  constructor(props) {
    super(props);
    this._animated = new Animated.Value(0);
  }
  componentDidMount() {
    Animated.timing(this._animated, {
      toValue: 1,
      duration: 120,
    }).start();
  }

  closeModal = () => Navigation.dismissModal(this.props.componentId);
  Box = image => (
    <View style={[styles.row, styles.padding]}>
      <View style={styles.row}>
        <FastImage
          resizeMode={FastImage.resizeMode.contain}
          style={styles.avatar}
          source={image}
        />
        <TextInput
          style={styles.cbox}
          multiline={true}
          placeholder="comment here..."
          value={this.props.tmpComment}
          autoCorrect={true}
          spellCheck={true}
          onChangeText={text => this.props.updateTmpComment(text)}
        />
      </View>
      {this.props.sendingComment && <ActivityIndicator />}
      {!this.props.sendingComment && (
        <Ionicons.Button
          onPress={() => this.props.makeComment(this.props.postId)}
          size={30}
          name="ios-send"
          backgroundColor="#3c0e65">
          Comment
        </Ionicons.Button>
      )}
    </View>
  );
  commentView = ({ item }) => {
    const { deleteComment, postId, user } = this.props;
    return (
      <Animated.View style={[bubbleLeft.container]}>
        <View style={styles.tagHead}>
          <FastImage
            resizeMode={FastImage.resizeMode.contain}
            style={styles.avatar}
            source={{
              uri: `${Config.SERVER_URL}/media/stream/image/${
                item.author.avatar
              }`,
            }}
          />
          <Text style={styles.cmAuthor}>{item.author.name}</Text>
        </View>
        <View style={[bubbleLeft.wrapper]}>
          <Text style={styles.ctxt}>{item.body}</Text>
          <View style={styles.cmAction}>
            <Text>
              {moment(new Date(item.createdAt).toUTCString()).fromNow()}
            </Text>
            {user._id === item.author._id && (
              <Touchable onPress={() => deleteComment(item._id, postId)}>
                <Ionicons style={styles.delBtn} name="ios-close" size={30} />
              </Touchable>
            )}
          </View>
        </View>
      </Animated.View>
    );
  };
  render() {
    const { postId, posts } = this.props;
    const post = _.first(_.takeWhile(posts, { _id: postId }));
    return (
      <View style={styles.root}>
        <View style={styles.header}>
          <Text style={styles.title}>Make Comment</Text>
          <Touchable onPress={this.closeModal}>
            <Ionicons
              style={styles.close}
              name="ios-close-circle-outline"
              size={70}
            />
          </Touchable>
        </View>
        {this.Box({
          uri: `${Config.SERVER_URL}/media/stream/image/${
            this.props.user.avatar
          }`,
        })}
        <FlatList
          style={styles.commentLIst}
          data={post.comments}
          keyExtractor={item => item._id}
          renderItem={this.commentView}
        />
      </View>
    );
  }
}

const bubbleLeft = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    margin: 8,
  },
  wrapper: {
    borderRadius: 15,
    backgroundColor: iOSColors.lightGray2,
    marginRight: 60,
    minHeight: 20,
    justifyContent: 'flex-end',
    marginLeft: profileImageSize + 22,
    padding: 10,
    minWidth: 150,
  },
  containerToNext: {
    borderBottomLeftRadius: 3,
  },
  containerToPrevious: {
    borderTopLeftRadius: 3,
  },
});
const styles = StyleSheet.create({
  root: {
    backgroundColor: iOSColors.lightGray,
  },
  tagHead: {
    flexDirection: 'row',
  },
  commentLIst: {
    backgroundColor: '#eef0f3',
    marginBottom: 20,
  },
  ctxt: {
    color: iOSColors.gray,
    fontSize: 16,
    padding: 5,
  },
  cmAction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'space-between',
  },
  cmAuthor: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  cbox: {
    minWidth: 150,
    minHeight: 50,
  },
  delBtn: {},
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignContent: 'space-between',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  close: {
    padding: 5,
  },
  text: { fontWeight: '600' },
  title: {
    fontSize: 25,
    padding: 10,
    fontWeight: 'bold',
  },
  avatar: {
    aspectRatio: 1,
    backgroundColor: '#D8D8D8',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#979797',
    borderRadius: profileImageSize / 2,
    width: profileImageSize,
    height: profileImageSize,
    marginRight: padding,
  },
  padding: {
    padding,
  },
});

function mapStateToProps(state) {
  return {
    user: state.account.user,
    tmpComment: state.discover.tmpComment,
    sendingComment: state.discover.sendingComment,
    posts: state.discover.posts,
    // followingUser: state.account.followingUser,
    // following: state.account.following,
  };
}

const mapDispatchToProps = dispatch => {
  return {
    makeComment: postId => dispatch(discoverActions.makeComment(postId)),
    deleteComment: (commentId, postId) =>
      dispatch(discoverActions.deleteComment(commentId, postId)),
    updateTmpComment: text => dispatch(discoverActions.updateTmpComment(text)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommentPage);
