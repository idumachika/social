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
import { GiftedChat } from 'react-native-gifted-chat';
import * as chatmateActions from '../../reducers/chatmate/actions';
import { Navigation } from 'react-native-navigation';
import Config from 'react-native-config';
import _ from 'lodash';
import { connect } from 'react-redux';

const chat_bg = { uri: 'chat_bg' };
class ChatMates extends React.PureComponent {
  constructor(props) {
    super(props);
    const { to, loadP2PMessage } = this.props;
    loadP2PMessage(to._id);
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
  }

  sendMessage = (messages = []) => {
    const { to, sendMessage } = this.props;
    sendMessage({
      messages,
      to: {
        ...to,
        avatar: `${Config.SERVER_URL}/media/stream/image/${to.avatar}`,
      },
    });
    // sendMessage(account._id, {
    //   _id: 1,
    //   text: 'Hello developer',
    //   createdAt: new Date(),
    //   user: {
    //     _id: 2,
    //     name: 'React Native',
    //     avatar: 'https://placeimg.com/140/140/any',
    //   },
    // });
  };

  render() {
    const { to, user, messages, loadingEarlier } = this.props;
    return (
      <ImageBackground
        imageStyle={{ resizeMode: 'cover' }}
        style={styles.backGround}
        source={chat_bg}>
        <GiftedChat
          messages={messages[to._id]}
          isLoadingEarlier={loadingEarlier}
          onSend={this.sendMessage}
          user={{
            ...this.props.user,
            avatar: `${Config.SERVER_URL}/media/stream/image/${
              this.props.user.avatar
            }`,
          }}
          isAnimated={true}
          loadEarlier={true}
        />
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  subView: {
    marginTop: 30,
    alignSelf: 'center',
  },
  backGround: {
    flex: 1,
    width: null,
    alignSelf: 'stretch',
  },
});

function mapStateToProps(state) {
  return {
    user: state.account.user,
    messages: state.chatmate.messages,
    loadingEarlier: state.chatmate.loadingP2PMessage,
  };
}

const mapDispatchToProps = dispatch => {
  return {
    loadP2PMessage: accountId =>
      dispatch(chatmateActions.loadP2PMessage(accountId)),
    sendMessage: message => dispatch(chatmateActions.sendMessage(message)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatMates);
