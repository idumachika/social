import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Text, Platform, FlatList } from 'react-native';
import { connect } from 'react-redux';
import * as chatActions from '../../reducers/chatmate/actions';
import * as accountActions from '../../reducers/account/actions';
import { Navigation } from 'react-native-navigation';
import { ListItem, SearchBar } from 'react-native-elements';
import Config from 'react-native-config';
// this is a traditional React component connected to the redux store
class FindFriends extends PureComponent {
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

  noSuggestion = () => {
    return (
      <View>
        <Text>NO SUGGESTIONS AT THE MOMENT</Text>
      </View>
    );
  };

  showRequestModal = account => {
    Navigation.showOverlay({
      component: {
        name: 'tlikes.FollowRequest',
        passProps: {
          account,
          user: this.props.user,
          onFollow: () => this.props.followUser(account),
          isLoading: this.props.followingUser,
          following: this.props.following,
        },
        options: {
          topBar: {},
        },
      },
    });
  };

  renderItem = post => {
    const { item } = post;
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
        onPress={this.showRequestModal.bind(this, item)}
        containerStyle={{ backgroundColor: 'white' }}
        hideChevron={true}
      />
    );
  };

  render() {
    const { suggestions, loadingSuggestions, refreshSuggestion } = this.props;
    return (
      <FlatList
        style={styles.root}
        data={suggestions}
        onRefresh={refreshSuggestion}
        refreshing={loadingSuggestions}
        // extraData={this.state}
        ListEmptyComponent={this.noSuggestion}
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
    backgroundColor: '#eef0f3',
  },
  searchContainer: {
    ...Platform.select({
      ios: {
        paddingTop: 47,
      },
      android: {
        paddingTop: 60,
        paddingBottom: 10,
      },
    }),
  },
});

function mapStateToProps(state) {
  return {
    user: state.account.user,
    suggestions: state.account.suggestedFriends,
    loadingSuggestions: state.account.loadingFriendsSuggestions,
    followingUser: state.account.followingUser,
    following: state.account.following,
  };
}

const mapDispatchToProps = dispatch => {
  return {
    refreshSuggestion: () => {
      alert('todo');
    },
    followUser: user => dispatch(accountActions.followAccount(user)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FindFriends);
