import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  View,
  Platform,
  StyleSheet,
  FlatList,
  Alert,
  Image,
  Dimensions,
} from 'react-native';
import { connect } from 'react-redux';
import TrendingPost from '../components/TrendingPost';
import Config from 'react-native-config';
import RNFetchBlob from 'rn-fetch-blob';
import {
  DocumentPicker,
  DocumentPickerUtil,
} from 'react-native-document-picker';
import * as discoverActions from '../reducers/discover/actions';
import ImagePicker from 'react-native-image-picker';
// import ImageResizer from 'react-native-image-resizer';
import RNFS from 'react-native-fs';
import MediaMeta from 'react-native-media-meta';
import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import InputToolbar from '../components/post/InputToolbar';
import { iOSColors } from 'react-native-typography';
import { COLOURS } from './../helpers/colours';
import TVideo from '../components/TVideo';
// this is a traditional React component connected to the redux store
class Talents extends PureComponent {
  chooseMediaType = () =>

    Alert.alert(
      'Choose Media Category',
      'Choose they type of content you will like to attach to your post. 60 sec video and max of 1MB audio and picture.',
      [
        { text: 'Video', onPress: () => this.showChooser('video') },
        //  { text: 'Audio', onPress: () => this.showChooser('audio') },
        { text: 'Picture', onPress: () => this.showChooser('image') },
      ],
      { cancelable: true }
    );

  showChooser = mediaType => {
    const { updateDraftMedia } = this.props;

    // for audio
    if (mediaType === 'audio') {
      DocumentPicker.show(
        {
          filetype: [
            //   DocumentPickerUtil.allFiles(),
            DocumentPickerUtil.audio(),
          ],
        },
        (error, res) => {
          if (!error) {
            // declaring necessary file information variables
            const { fileSize, fileName, type, uri } = res;
            // for audio only
            RNFS.stat(uri).then(r => {
              if (r.isFile()) {
                const { originalFilepath, size } = r;
                MediaMeta.get(originalFilepath)
                  .then(metadata => {
                    const {
                      thumb,
                      duration,
                      title,
                      album,
                      artist,
                      height,
                      width,
                    } = metadata;
                    const dur = parseFloat(duration);
                  })
                  .catch(err => console.error(err));
              }
            });
          }
        }
      );
    } else {
      let options;
      // file chooser option with custom button for selecting audio contents
      if (mediaType === 'image') {
        options = {
          title: 'Select photo to share',
          storageOptions: {
            skipBackup: true,
            path: 'images',
          },
          mediaType,
        };
      } else {
        options = {
          title: 'Select video to share',
          takePhotoButtonTitle: 'Record video',
          videoQuality: 'high',
          durationLimit: 60,
          storageOptions: {
            skipBackup: true,
            path: 'videos',
          },
          mediaType,
        };
      }

      ImagePicker.showImagePicker(
        options,
        async ({
          error,
          didCancel,
          uri,
          customButton,
          height,
          width,
          type,
          fileName,
        }) => {
          if (!didCancel && !error) {
            // for video and audio content

            RNFS.stat(uri).then(r => {
              if (r.isFile()) {
                const { originalFilepath, size } = r;
                let blobFile = RNFetchBlob.wrap(originalFilepath);
                if (mediaType === 'image') {
                  updateDraftMedia({
                    type,
                    height: `${height}`,
                    width: `${width}`,
                    fileName,
                    file: blobFile,
                    uri: uri,
                    mediaType,
                  });
                } else {
                  MediaMeta.get(originalFilepath)
                    .then(metadata => {
                      const { duration, encoder, framerate } = metadata;
                      const dur = parseFloat(duration);
                      console.log(height, width);
                      if (dur <= 60000) {
                        updateDraftMedia({
                          type: 'video/mp4',
                          file: blobFile,
                          framerate,
                          fileName: originalFilepath.split('/').pop(),
                          duration,
                          uri: uri,
                          encoder,
                          mediaType,
                        });
                      } else {
                        alert('Video duration is longer than max.');
                      }
                    })
                    .catch(err => console.error(err));
                }
              }
            });
          }
        }
      );
    }
  };

  _onPressItem = id => {
    // this.setState(state => {
    //   const selected = new Map(state.selected);
    //   selected.set(id, !selected.get(id));
    //   return { selected };
    // });
  };

  _keyExtractor(item, index) {
    return item._id;
  }

  _renderSeparator() {
    return <View style={styles.separator} />;
  }

  showMedia = () => {
    const { draftMedia } = this.props;
    const media = draftMedia[0];
    //alert(JSON.stringify(this.props.posts[0]));
    return (
      <View style={{ flexDirection: 'row' }}>
        {media.mediaType === 'video' && <Icon name="file-movie-o" size={30} />}
        {media.mediaType === 'image' && (
          <Icon name="file-picture-o" size={30} />
        )}{' '}
        <Text>{media.file}</Text>
      </View>
    );
  };

  previewMedia = () => {
    const { draftMedia } = this.props;
    const media = draftMedia[0];
    //alert(JSON.stringify(draftMedia));
    switch(media.mediaType) {
      case "image":
        return (
          <View style={{flex: 1, width: '100vw'}}>
            <Text>{JSON.stringify(media)}</Text>
            <Image
              style={{ width: '100vw', height: 58 }}
              source={{ uri: media.file }}
            />
          </View>
        );
      default:
          return <Text>{JSON.stringify(media)}</Text>;
    }
  }

  renderHeader = () => {
    const { updateDraft, publishPost, draftPost, draftMedia } = this.props;
    return (
      <View>
        <View style={styles.searchContainer}>
          <InputToolbar
            text={draftPost.body}
            onTextChanged={body => updateDraft({ body })}
            composerHeight={40}
            label={'Share'}
            onSend={publishPost}
            onPressActionButton={this.chooseMediaType}
          />
          {this.showMedia}

        </View>
        <PMedia {...this.props} />
      </View>
    );
  };

  noTrending = () => {
    return (
      <View style={styles.noContentView}>
        {/* <Icon size={100} name="gear" color="white" /> */}
      </View>
    );
  };

  renderItem = ({ item }) => {
    return (
      <TrendingPost
        post={item}
        onLike={this.props.onLikePost}
        user={this.props.user}
        outOfFund={this.props.outOfFund}
        viewId={this.props.componentId}
      />
    );
  };

  render() {
    return (
      <FlatList
        style={styles.root}
        data={this.props.posts}
        onRefresh={this.props.refreshPost}
        refreshing={this.props.loadingPosts || this.props.publishingPost}
        extraData={{
          draftPost: this.props.draftPost,
          draftMedia: this.props.draftMedia,
          refreshPost: this.props.refreshPost,
        }}
        ListEmptyComponent={this.noTrending}
        ListHeaderComponent={this.renderHeader}
        ItemSeparatorComponent={this._renderSeparator}
        keyExtractor={this._keyExtractor}
        renderItem={this.renderItem}
        enableEmptySections
        onEndReached={this.props.loadMorePosts}
        onEndReachedThreshold={1200}
      />
    );
  }
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: iOSColors.white,
  },
  separator: {
    height: 8,
    backgroundColor: COLOURS.purple,
  },
  noContentView: {
    alignContent: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    margin: 10,
    minHeight: 60,
    ...Platform.select({
      ios: {
        paddingTop: 47,
      },
      android: {
        paddingTop: 35,
        paddingBottom: 10,
      },
    }),
  },
});

// which props do we want to inject, given the global state?
function mapStateToProps(state) {
  return {
    user: state.account.user,
    posts: state.discover.posts,
    loadingPosts: state.discover.loadingPosts,
    draftPost: state.discover.draftPost,
    draftMedia: state.discover.draftMedia,
    publishingPost: state.discover.publishingPost,
    outOfFund: state.discover.outOfFund,
  };
}

const mapDispatchToProps = dispatch => {
  return {
    updateDraftMedia: content =>
      dispatch(discoverActions.updateDraftMedia(content)),
    updateDraft: fields => dispatch(discoverActions.updateDraftPost(fields)),
    publishPost: () => dispatch(discoverActions.sendPost()),
    loadMorePosts: () => dispatch(discoverActions.loadMorePosts()),
    refreshPost: () => dispatch(discoverActions.refreshPost()),
    onLikePost: post => dispatch(discoverActions.likePost(post)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Talents);

const PMedia = (props) => {
  const { draftMedia } = props;
  const media = draftMedia[0];
  //alert(JSON.stringify(draftMedia));
  const win = Dimensions.get('window');
  if(media) {
    //alert(JSON.stringify(media));
    let src = media.uri.toString();
    switch(media.mediaType) {
      case "image":
        return (
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Image
              style={{ width: win.width, height: 200 }}
              source={{ uri: src }}
              //source={require(src)}
            />
          </View>
        );
      case "video":
        return <TVideo url={src} tilte="Video preview" />;
      default:
          return <Text>No media selected</Text>;
    }
  } else {
    return null;
  }
}
