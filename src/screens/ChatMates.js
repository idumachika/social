import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Text, Platform, FlatList } from 'react-native';
import * as chatmateActions from '../reducers/chatmate/actions';
import { Navigation } from 'react-native-navigation';
import { connect } from 'react-redux';
import { ListItem, SearchBar } from 'react-native-elements';
import Config from 'react-native-config';
class ChatMates extends PureComponent {
  _keyExtractor(item, index) {
    return `${item._id}`;
  }

  _renderSeparator() {
    return <View style={styles.separator} />;
  }
  renderHeader = () => {
    return (
      <View style={styles.searchContainer}>
        <SearchBar
          lightTheme
          // onChangeText={someMethod}
          // onClearText={someMethod}
          icon={{ type: 'font-awesome', name: 'search' }}
          placeholder="Type Here..."
        />
      </View>
    );
  };

  noFriends = () => {
    return (
      <View>
        <Text>NO FRIENDS ONLINE</Text>
      </View>
    );
  };

  openP2P = to =>
    Navigation.push(this.props.activeComponent, {
      component: {
        name: 'tlikes.P2PChat',
        passProps: {
          to,
        },
        options: {
          topBar: {
            visible: true,
            title: {
              text: to.name.toUpperCase(),
            },
            animate: false,
          },
        },
      },
    });

  renderItem = friend => {
    const { item } = friend;
    return (
      <ListItem
        roundAvatar
        avatar={{
          uri: `${Config.SERVER_URL}/media/stream/image/${item.avatar}`,
        }}
        key={item._id}
        title={`${item.name} (@${item.username})`}
        titleStyle={{
          fontWeight: '400',
          color: '#2196f3',
          fontSize: 17,
          fontFamily: 'typonil',
        }}
        subtitle={item.bio}
        onPress={() => this.openP2P(item)}
        containerStyle={{ backgroundColor: 'white' }}
        hideChevron={true}
      />
    );
  };

  render() {
    const { friends, loadingFriends, refreshFriends } = this.props;
    return (
      <FlatList
        style={styles.root}
        data={friends}
        onRefresh={refreshFriends}
        refreshing={loadingFriends}
        // extraData={this.state}
        ListEmptyComponent={this.noFriends}
        ListHeaderComponent={this.renderHeader}
        ItemSeparatorComponent={this._renderSeparator}
        keyExtractor={this._keyExtractor}
        renderItem={this.renderItem}
      />
    );
  }
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: '#e0e0e0',
  },
  searchContainer: {
    ...Platform.select({
      ios: {
        paddingTop: 47,
      },
      android: {
        paddingBottom: 10,
      },
    }),
  },
});

function mapStateToProps(state) {
  return {
    friends: state.chatmate.friends,
    loadingFriends: state.chatmate.loadingFriends,
    user: state.account.user,
    activeComponent: state.app.activeComponent,
  };
}

const mapDispatchToProps = dispatch => {
  return {
    refreshFriends: () => dispatch(chatmateActions.init()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatMates);
