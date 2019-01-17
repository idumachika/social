import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Platform,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Swiper from 'react-native-swiper';
import { connect } from 'react-redux';
import Config from 'react-native-config';
import CardOne from '../components/CardOne';
import CardTwo from '../components/CardTwo';
import ProgressBar from '../components/ProgressBar';
import { Navigation } from 'react-native-navigation';
import * as discoverActions from '../reducers/discover/actions';
import * as appActions from '../reducers/app/actions';

// this is a traditional React component connected to the redux store
const popularMovies = [
  // {
  //   id: 1,
  //   poster: require('../../img/alade_gosh_.jpg'),
  //   original_title: 'Yemi Alade - OH MY GOSH',
  // },
  // {
  //   id: 2,
  //   poster: require('../../img/spyro.jpg'),
  //   original_title: 'Spyro - Funke Remix',
  // },
  // {
  //   id: 3,
  //   poster: require('../../img/lovalova.png'),
  //   original_title: 'Tiwa Savage - Lova Lova ft Dunca Mighty',
  // },
  // {
  //   id: 4,
  //   poster: require('../../img/maro.jpg'),
  //   original_title: 'Maro ft Davido',
  // },
  // {
  //   id: 5,
  //   poster: require('../../img/ji.jpg'),
  //   original_title: 'Idowest ft Davido',
  // },
];
const nowPlayingMovies = [
  // {
  //   id: 1,
  //   poster: require('../../img/weekend_getaway.jpg'),
  //   original_title: 'Weekend Getaway',
  //   overview:
  //     'This is the movie decription that will showcase the actions scencse and what this movie is all about',
  // },
  // {
  //   id: 2,
  //   poster: require('../../img/isoken.jpg'),
  //   original_title: 'Isoken',
  //   overview:
  //     'This is the movie decription that will showcase the actions scencse and what this movie is all about',
  // },
  // {
  //   id: 3,
  //   poster: require('../../img/hab.jpg'),
  //   original_title: 'Royal Hibiscus',
  //   overview:
  //     'This is the movie decription that will showcase the actions scencse and what this movie is all about',
  // },
  // {
  //   id: 4,
  //   poster: require('../../img/big.jpg'),
  //   original_title: 'Banana Island Ghost',
  //   overview:
  //     'This is the movie decription that will showcase the actions scencse and what this movie is all about',
  // },
  // {
  //   id: 5,
  //   poster: require('../../img/october_1st.jpg'),
  //   original_title: 'October 1st',
  //   overview:
  //     'This is the movie decription that will showcase the actions scencse and what this movie is all about',
  // },
  // {
  //   id: 6,
  //   poster: require('../../img/phone_swap.jpg'),
  //   original_title: 'Phone Swap',
  //   overview:
  //     'This is the movie decription that will showcase the actions scencse and what this movie is all about',
  // },
  // {
  //   id: 7,
  //   poster: require('../../img/wedding_party.jpg'),
  //   original_title: 'Wedding Party',
  //   overview:
  //     'This is the movie decription that will showcase the actions scencse and what this movie is all about',
  // },
];

const iconPlay = (
  <Icon
    name="md-play"
    size={21}
    color="#9F9F9F"
    style={{ paddingLeft: 3, width: 22 }}
  />
);
const iconTop = (
  <Icon name="md-trending-up" size={21} color="#9F9F9F" style={{ width: 22 }} />
);
const iconUp = (
  <Icon name="md-recording" size={21} color="#9F9F9F" style={{ width: 22 }} />
);

class Box extends Component {
  state = {
    slider1ActiveSlide: 1,
  };

  constructor(props) {
    super(props);
    this.props.loadDiscovery();
  }

  viewMedia = i => {
    alert(i.id);
  };

  seAll = () => {};

  render() {
    return this.state.isLoading ? (
      <View style={styles.progressBar}>
        <ProgressBar />
      </View>
    ) : (
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            // refreshing={this.state.isRefreshing}
            // onRefresh={this._onRefresh}
            colors={['#EA0000']}
            tintColor="white"
            title="loading..."
            titleColor="white"
            progressBackgroundColor="white"
          />
        }>
        <Swiper
          autoplay
          autoplayTimeout={4}
          showsPagination={false}
          height={248}>
          {nowPlayingMovies.map(info => (
            <CardOne
              key={info.id}
              info={info}
              viewMedia={this.viewMedia.bind(this, info)}
            />
          ))}
        </Swiper>
        <View>
          <View style={styles.listHeading}>
            <Text style={styles.listHeadingLeft}>Popular</Text>
            <TouchableOpacity>
              <Text style={styles.listHeadingRight} onPress={this.seeAll}>
                See all
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {popularMovies.map(info => (
              <CardTwo
                key={info.id}
                info={info}
                viewMedia={this.viewMedia.bind(this, info)}
              />
            ))}
          </ScrollView>
          <View style={styles.browseList}>
            <TouchableOpacity activeOpacity={0.7}>
              <View style={styles.browseListItem}>
                {iconPlay}
                <Text style={styles.browseListItemText} onPress={this.seeAll}>
                  Now Playing
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7}>
              <View style={styles.browseListItem}>
                {iconTop}
                <Text style={styles.browseListItemText} onPress={this.seeAll}>
                  Top Rated
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7}>
              <View style={styles.browseListItem}>
                {iconUp}
                <Text style={styles.browseListItemText} onPress={this.seeAll}>
                  Upcoming
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }
}

// which props do we want to inject, given the global state?
function mapStateToProps(state) {
  return {
    posts: state.discover.posts,
  };
}

const mapDispatchToProps = dispatch => {
  return {
    loadDiscovery: () => dispatch(discoverActions.getRecentPosts()),
  };
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#3c0e65',
    ...Platform.select({
      ios: {
        paddingTop: 14,
      },
    }),
  },
  progressBar: {
    backgroundColor: '#3c0e65',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listHeading: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 30,
  },
  listHeadingLeft: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  listHeadingRight: {
    color: 'white',
    ...Platform.select({
      ios: {
        fontSize: 15,
      },
      android: {
        fontSize: 16,
      },
    }),
  },
  browseList: {
    marginTop: 30,
    paddingHorizontal: 16,
    ...Platform.select({
      ios: {
        marginBottom: 60,
      },
      android: {
        marginBottom: 30,
      },
    }),
  },
  browseListItem: {
    ...Platform.select({
      ios: {
        paddingVertical: 8,
      },
      android: {
        paddingVertical: 10,
      },
    }),
    flexDirection: 'row',
  },
  browseListItemText: {
    flex: 1,
    color: 'white',
    paddingLeft: 10,
    ...Platform.select({
      ios: {
        fontSize: 15,
        fontWeight: '500',
      },
      android: {
        fontSize: 16,
        fontWeight: '100',
      },
    }),
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Box);
