import React from 'react';
import { StyleSheet, View, Text, Dimensions, Button } from 'react-native';
import CustomButton from './CustomButton';
import { Navigation } from 'react-native-navigation';
import { connect } from 'react-redux';
import _ from 'lodash';
let viewId;
const dismissThis = () => Navigation.dismissOverlay(viewId);
const FollowRequest = ({
  onFollow,
  account,
  user,
  componentId,
  followingUser,
  following,
}) => {
  viewId = componentId;
  const isFollowing = _.takeWhile(following, { followed: account._id });
  if (isFollowing.length > 0) {
    alert(`You are now following ${account.name}`);
    dismissThis();
  }
  return (
    <View style={styles.container}>
      <View style={{ flex: 8 }}>
        <Text style={styles.title}>Follow User</Text>
        <Text style={styles.content}>{account.name}</Text>
      </View>
      <View style={{ flex: 5 }}>
        <CustomButton
          isLoading={followingUser}
          isEnabled={!followingUser}
          text={'Follow'}
          onPress={onFollow}
        />
        <CustomButton text={'Cancel'} onPress={dismissThis} />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width * 0.7,
    height: Dimensions.get('window').height * 0.3,
    marginTop: '55%',
    marginLeft: '12%',
    backgroundColor: '#ffffff',
    borderRadius: 5,
    padding: 16,
    position: 'absolute',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
  },
  content: {
    marginTop: 8,
  },
});
function mapStateToProps(state) {
  return {
    followingUser: state.account.followingUser,
    following: state.account.following,
  };
}

const mapDispatchToProps = dispatch => {
  return {
    followUser: user => dispatch(accountActions.followAccount(user)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FollowRequest);
