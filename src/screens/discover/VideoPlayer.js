import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity as Touchable,
} from 'react-native';
import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import * as chatActions from '../../reducers/chatmate/actions';
// import * as accountActions from '../../reducers/account/actions';
import { Navigation } from 'react-native-navigation';
import Config from 'react-native-config';
import Video from '../../components/media/video';
// this is a traditional React component connected to the redux store
class VideoPlayer extends PureComponent {
  closeModal = () => Navigation.dismissModal(this.props.componentId);

  render() {
    const { post } = this.props;
    const v = post.media[0];
    return (
      <View style={styles.root}>
        <View style={styles.header}>
          <Text style={styles.title}>Video Player</Text>
          <Touchable onPress={this.closeModal}>
            <Ionicons
              style={styles.close}
              name="ios-close-circle-outline"
              size={30}
            />
          </Touchable>
        </View>
        <Video
          // onEnd={this.closeModal}
          title={post.body}
          fullScreenOnly={true}
          rotateToFullScreen={true}
          autoPlay={true}
          url={`${Config.SERVER_URL}/media/stream/video/${v._id}`}
          placeholder={`${Config.SERVER_URL}/media/stream/cover/${v._id}`}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: '#eef0f3',
    paddingBottom: 40,
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
  title: {
    fontSize: 15,
    padding: 10,
    fontWeight: 'bold',
  },
});

function mapStateToProps(state) {
  return {
    user: state.account.user,
    // suggestions: state.account.suggestedFriends,
    // loadingSuggestions: state.account.loadingFriendsSuggestions,
    // followingUser: state.account.followingUser,
    // following: state.account.following,
  };
}

const mapDispatchToProps = dispatch => {
  return {
    // followUser: user => dispatch(accountActions.followAccount(user)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VideoPlayer);
