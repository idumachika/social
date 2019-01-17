import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  Platform,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import {
  material,
  systemWeights,
  materialColors,
} from 'react-native-typography';
import moment from 'moment';
import { connect } from 'react-redux';
import numeral from 'numeral';
import * as contestActions from '../reducers/contest/actions';
import Config from 'react-native-config';
import { Navigation } from 'react-native-navigation';

const songs = [
  {
    song: 'Free Rhythm',
    author: 'Chaotic Hook',
    cover: require('../../img/angel-jimenez-168185_2x.png'),
    votes: 34343,
  },
  {
    song: 'Ascension',
    author: 'Varsity Balance',
    cover: require('../../img/efe-kurnaz-315384_2x.png'),
    votes: 79383,
  },
  {
    song: 'Devil Of Diamonds',
    author: 'The Audible Rupture',
    cover: require('../../img/mario-silva-315041.png'),
    votes: 3637,
  },
  {
    song: 'Out For Love',
    author: 'Seizing Mistake',
    cover: require('../../img/paul-morris-144777_2x.png'),
    votes: 9335,
  },
  {
    song: 'Female Tales',
    author: 'Twitch',
    cover: require('../../img/sasha-freemind-186664_2x.png'),
    votes: 8793,
  },
  {
    song: 'Easy Mind',
    author: 'Stanza',
    cover: require('../../img/wild-vibez-317184.png'),
    votes: 7884,
  },
  {
    song: 'Pleasure',
    author: 'Stanza',
    cover: require('../../img/joel-filipe-193035.png'),
    votes: 3374,
  },
  {
    song: 'Memories',
    author: 'Newt',
    cover: require('../../img/sasha-freemind-437035.png'),
    votes: 7994,
  },
  {
    song: 'Of Ice',
    author: 'Palm',
    cover: require('../../img/seth-doyle-188635.png'),
    votes: 8847,
  },
];

const SongRow = ({ number, cover, song, author, votes }) => {
  return (
    <TouchableOpacity style={songRowStyles.row}>
      <Text style={songRowStyles.number}>{number}</Text>
      <ImageBackground style={songRowStyles.image} source={cover} />
      <View style={songRowStyles.column}>
        <Text style={material.body2}>{song}</Text>
        <Text style={material.caption}>{author}</Text>
      </View>
      <Text style={songRowStyles.duration}>
        {numeral(votes).format(votes < 1000 ? '0 a' : '0.00a')}
      </Text>
    </TouchableOpacity>
  );
};

const songRowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 8,
  },
  number: {
    ...material.subheadingObject,
    color: materialColors.blackSecondary,
  },
  image: {
    marginTop: 4,
    borderRadius: 3,
    marginLeft: 16,
    height: 40,
    width: 40,
  },
  column: {
    flex: 1,
    marginLeft: 16,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  duration: {
    ...material.body1Object,
    color: materialColors.blackSecondary,
  },
});
// this is a traditional React component connected to the redux store
class Contests extends Component {
  constructor(props) {
    super(props);
    this.props.loadContests();
  }
  render() {
    const { contests } = this.props;
    return (
      <View style={styles.screenContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {contests.map(c => (
            <View style={styles.screenContainer} key={c._id}>
              <ImageBackground
                style={styles.image}
                source={{
                  uri: `${Config.SERVER_URL}/media/stream/image/${c.poster}`,
                }}>
                <View>
                  <Text style={styles.slogan}>{c.title}</Text>
                  <Text style={styles.author}>
                    From <Text style={styles.bold}>unknown</Text> we have{' '}
                    <Text style={styles.bold}>
                      {moment(
                        new Date(
                          c.start || new Date().toUTCString()
                        ).toUTCString()
                      ).from()}{' '}
                      to go
                    </Text>
                  </Text>
                </View>
              </ImageBackground>
              <View style={Platform.OS === 'ios' && { zIndex: 1 }}>
                <View style={styles.fabCircle}>
                  <MaterialCommunityIcons
                    name="account-plus"
                    size={38}
                    style={styles.fabIcon}
                  />
                </View>
              </View>
              <FlatList
                contentContainerStyle={styles.listContent}
                data={songs}
                keyExtractor={item => item.song}
                ItemSeparatorComponent={() => (
                  <View style={styles.songSeparator} />
                )}
                ListHeaderComponent={() => (
                  <Text style={styles.topSongs}>TOP 10 CONTESTANTS</Text>
                )}
                renderItem={({ item, index }) => (
                  <SongRow
                    number={index + 1}
                    song={item.song}
                    author={item.author}
                    cover={item.cover}
                    votes={item.votes}
                  />
                )}
              />
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }
}

const lightTextShadow = {
  textShadowColor: materialColors.blackTertiary,
  textShadowOffset: {
    width: 0,
    height: 1,
  },
  textShadowRadius: 4,
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    minWidth: 350,
  },
  image: {
    aspectRatio: 1.5,
    height: undefined,
    width: undefined,
    justifyContent: 'flex-end',
    padding: 16,
  },
  slogan: {
    ...material.display1WhiteObject,
    color: '#FFFFFF',
    ...lightTextShadow,
  },
  author: {
    ...material.body1WhiteObject,
    ...systemWeights.light,
    ...lightTextShadow,
  },
  bold: systemWeights.semibold,
  topSongs: {
    marginTop: 16,
    marginBottom: 8,
    marginHorizontal: 16,
    ...material.body2Object,
    color: materialColors.blackSecondary,
  },
  listContent: {
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  songSeparator: {
    height: StyleSheet.hairlineWidth,
    width: '100%',
    backgroundColor: materialColors.blackTertiary,
  },
  fabCircle: {
    position: 'absolute',
    top: -64 / 2,
    right: 16,
    width: 64,
    height: 64,
    borderRadius: 64 / 2,
    backgroundColor: '#D81E5B',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      android: { elevation: 12 },
      ios: {
        shadowColor: 'black',
        shadowOffset: {
          width: 0,
          height: 6,
        },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
    }),
  },
  fabIcon: {
    backgroundColor: 'transparent',
    color: '#FFFFFF',
  },
});

// which props do we want to inject, given the global state?
function mapStateToProps(state) {
  return {
    contests: state.contest.contests,
  };
}

const mapDispatchToProps = dispatch => {
  return {
    loadContests: () => dispatch(contestActions.getContests()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Contests);
