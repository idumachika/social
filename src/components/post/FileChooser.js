import React from 'react';
import { StyleSheet, View, Text, Dimensions, Button } from 'react-native';
import CustomButton from '../CustomButton';
import { Navigation } from 'react-native-navigation';
import {
  DocumentPicker,
  DocumentPickerUtil,
} from 'react-native-document-picker';
import ImagePicker from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import MediaMeta from 'react-native-media-meta';
export default class FileChooser extends React.Component {
  chooseFile = () => {
    // file chooser option with custom button for selecting audio contents
    const options = {
      title: 'Select profile Photo',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      customButtons: [{ name: 'audio', title: 'Choose an Audio File' }],
    };

    ImagePicker.showImagePicker(options, async response => {
      if (!response.didCancel && !response.error) {
        let fileURI;
        // handling audio button selection manually
        if (customButton === 'audio') {
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
                fileURI = uri;
              }
            }
          ).catch(err => console.error(err));
          return false;
        } else {
          // file URI is for a video or an audio content
          fileURI = response.uri;
        }

        RNFS.stat(fileURI).then(r => {
          if (r.isFile()) {
            const { originalFilepath, size } = r;
            // TODO: check if it an audio or a Video before reading the meta
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
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={{ flex: 8 }}>
          <Text style={styles.title}>Choose File</Text>
          <Text style={styles.content}>Files to choose</Text>
        </View>
        <View style={{ flex: 5 }}>
          <CustomButton text={'CHOOSE MEDIA'} onPress={() => chooseFile()} />
          <CustomButton
            text={'CANCEL'}
            onPress={() => Navigation.dismissOverlay(this.props.componentId)}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width * 0.7,
    height: Dimensions.get('window').height * 0.26,
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
