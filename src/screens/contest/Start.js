import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  DatePickerIOS,
  DatePickerAndroid,
  Platform,
  Picker,
  ImageBackground,
  Alert,
} from 'react-native';
// import Config from 'react-native-config';
import moment from 'moment';
import RNFetchBlob from 'rn-fetch-blob';
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import { connect } from 'react-redux';
import { Navigation } from 'react-native-navigation';
// this is a traditional React component connected to the redux store
import {
  iOSColors,
  systemWeights,
  human,
  material,
  materialColors,
} from 'react-native-typography';
import CustomButton from '../../components/CustomButton';
import CustomTextInput from '../../components/CustomTextInput';
import * as contestActions from '../../reducers/contest/actions';

const treatDate = (date, cb, field) => {
  if (Platform.OS === 'ios') {
    cb({
      [field]:
        `${date.getFullYear()}-` + `${date.getMonth() + 1}-${date.getDay()}`,
    });
  } else if (Platform.OS === 'android') {
    DatePickerAndroid.open({
      date: new Date(),
      mode: 'spinner',
    }).then(({ action, year, month, day }) => {
      if (action === 'dateSetAction') {
        cb({
          [field]: `${year}-${month + 1}-${day}`,
        });
      }
    });
  }
};

const DatePicker = ({ value, callback, field }) => {
  if (Platform.OS === 'ios')
    return (
      <DatePickerIOS
        mode={'date'}
        minimumDate={new Date()}
        date={value || new Date()}
        onDateChange={date => this.treatDate(date, callback, field)}
      />
    );

  if (Platform.OS === 'android')
    return (
      <CustomButton
        colors={['#FFFFFF', '#FFFFFF']}
        text={value || `Choose ${field} date`}
        onPress={() => treatDate(null, callback, field)}
        buttonStyle={{ borderColor: iOSColors.purple, borderWidth: 1 }}
        textStyle={{ color: iOSColors.gray }}
      />
    );
};
class StartContest extends PureComponent {
  treatDate = date => {
    if (Platform.OS === 'ios') {
      this.setState({
        user: {
          ...this.state.user,
          tempDate: date,
          dob:
            `${date.getFullYear()}-` +
            `${date.getMonth() + 1}-${date.getDay()}`,
        },
      });
    } else if (Platform.OS === 'android') {
      const maxDate = new Date();
      maxDate.setFullYear(new Date().getFullYear() - 17);
      DatePickerAndroid.open({
        date: new Date(),
        mode: 'spinner',
        maxDate,
      }).then(({ action, year, month, day }) => {
        if (action === 'dateSetAction') {
          this.setState({
            user: { ...this.state.user, dob: `${year}-${month + 1}-${day}` },
          });
        }
      });
    }
  };

  choosePoster = () => {
    const { updateContest } = this.props;
    const options = {
      title: 'Select contest poster',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    // let self = this;
    ImagePicker.showImagePicker(options, async response => {
      if (!response.didCancel && !response.error) {
        let rotation = 0;
        const { originalRotation } = response;
        if (originalRotation === 90) {
          rotation = 90;
        } else if (originalRotation === 180) {
          //For a few images rotation is 180.
          rotation = -180;
        } else if (originalRotation === 270) {
          //When taking images with the front camera (selfie), the rotation is 270.
          rotation = -90;
        }

        let height = 300;
        let width = 300;
        let format = 'JPEG';
        let quality = 80;

        const resizedImageUri = await ImageResizer.createResizedImage(
          `data:image/jpeg;base64,${response.data}`,
          height,
          width,
          format,
          quality,
          rotation
        );

        let filePath =
          Platform.OS === 'android' && resizedImageUri.uri.replace
            ? resizedImageUri.uri.replace('file:/data', '/data')
            : resizedImageUri.uri;

        if (Platform.OS === 'ios') {
          const ind = filePath.indexOf('file://');
          filePath =
            filePath.substr(0, ind) +
            filePath.substr(ind + 7, filePath.length - 1);
        }

        let blobFile = RNFetchBlob.wrap(filePath);
        // const base64Str = await RNFS.readFile(filePath, 'base64');

        updateContest({
          poster: {
            name: 'poster',
            filename: response.fileName,
            type: response.fileName.split('.').pop(),
            data: blobFile,
          },
          posterURI: resizedImageUri.uri,
        });
      }
    });
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.savingContest && !this.props.savingContest) {
      Navigation.showOverlay({
        component: {
          name: 'tlikes.SignUpLight',
          passProps: {
            title: 'Start Contest',
            content: this.props.savingContestError
              ? 'Unable to create contest at the moment'
              : 'Contest created successfully',
            onOk: componentId => {
              Navigation.dismissOverlay(componentId);
              if (!this.props.savingContestError) {
                Navigation.pop(this.props.componentId);
              }
            },
          },
          options: {
            topBar: {},
          },
        },
      });
    }
  }

  startNow = () => {
    const { contest, startContest } = this.props;
    Alert.alert(
      'Start Contest',
      `By choosing Create Contest, You agree to be charged ${
        contest.registrationValue
      } T-Value.`,
      [
        { text: 'Create Contest', onPress: startContest },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  render() {
    const {
      user,
      contest,
      updateContest,
      savingContest,
      savingContestError,
    } = this.props;
    return (
      <ScrollView style={styles.container}>
        <ImageBackground
          style={styles.image}
          source={{ uri: contest.posterURI }}>
          <View>
            <Text style={styles.slogan}>
              {contest.title || 'Untitled Contest'}
            </Text>
            <Text style={styles.author}>
              From <Text style={styles.bold}>{user.name}</Text> starts{' '}
              <Text style={styles.bold}>
                {moment(
                  new Date(
                    contest.start || new Date().toUTCString()
                  ).toUTCString()
                ).from()}
              </Text>
            </Text>
          </View>
        </ImageBackground>
        <CustomButton
          colors={['#FFFFFF', '#FFFFFF']}
          text="Choose poster"
          onPress={this.choosePoster}
          buttonStyle={{ borderColor: iOSColors.purple, borderWidth: 1 }}
          textStyle={{ color: iOSColors.gray }}
        />
        <CustomTextInput
          placeholder={'Title'}
          value={contest.title}
          onChangeText={title => updateContest({ title })}
          ref={ref => (this.titleInputRef = ref)}
          onSubmitEditing={() => this.descriptionInputRef.focus()}
          // editable={!registrationRequested}
          returnKeyType={'next'}
          blurOnSubmit={false}
          withRef={true}
        />
        <CustomTextInput
          placeholder={'Description'}
          value={contest.description}
          onChangeText={description => updateContest({ description })}
          ref={ref => (this.descriptionInputRef = ref)}
          multiline={true}
          onSubmitEditing={() => this.firstPrizeInputRef.focus()}
          // editable={!registrationRequested}
          returnKeyType={'next'}
          blurOnSubmit={false}
          withRef={true}
        />

        <CustomTextInput
          placeholder={'Winning Prize'}
          value={contest.firstPrize}
          onChangeText={firstPrize => updateContest({ firstPrize })}
          ref={ref => (this.firstPrizeInputRef = ref)}
          multiline={true}
          onSubmitEditing={() => this.secondPrizeInputRef.focus()}
          // editable={!registrationRequested}
          returnKeyType={'next'}
          blurOnSubmit={false}
          withRef={true}
        />

        <CustomTextInput
          placeholder={'RunnerUP Prize'}
          value={contest.secondPrize}
          onChangeText={secondPrize => updateContest({ secondPrize })}
          ref={ref => (this.secondPrizeInputRef = ref)}
          multiline={true}
          onSubmitEditing={() => this.thirdPrizeInputRef.focus()}
          // editable={!registrationRequested}
          returnKeyType={'next'}
          blurOnSubmit={false}
          withRef={true}
        />

        <CustomTextInput
          placeholder={'Third Place Prize'}
          value={contest.thirdPrize}
          onChangeText={thirdPrize => updateContest({ thirdPrize })}
          ref={ref => (this.thirdPrizeInputRef = ref)}
          multiline={true}
          onSubmitEditing={() => this.participationPrizeInputRef.focus()}
          // editable={!registrationRequested}
          returnKeyType={'next'}
          blurOnSubmit={false}
          withRef={true}
        />

        <CustomTextInput
          placeholder={'Participation Prize'}
          value={contest.participationPrize}
          onChangeText={participationPrize =>
            updateContest({ participationPrize })
          }
          ref={ref => (this.participationPrizeInputRef = ref)}
          multiline={true}
          onSubmitEditing={() => this.registrationValueInputRef.focus()}
          // editable={!registrationRequested}
          returnKeyType={'next'}
          blurOnSubmit={false}
          withRef={true}
        />

        <CustomTextInput
          placeholder={'Registration fee (T-Value)'}
          value={contest.registrationValue}
          onChangeText={registrationValue =>
            updateContest({ registrationValue })
          }
          keyboardType={'phone-pad'}
          ref={ref => (this.registrationValueInputRef = ref)}
          // onSubmitEditing={() => this.registrationValueInputRef.focus()}
          // editable={!registrationRequested}
          //returnKeyType={'next'}
          blurOnSubmit={false}
          withRef={true}
        />

        <Picker
          style={styles.twoPickers}
          itemStyle={styles.twoPickerItems}
          selectedValue={contest.category}
          onValueChange={category => updateContest({ category })}>
          <Picker.Item label={'Contest Category'} value={null} />
          <Picker.Item label={'Fashion'} value={'fashion'} />
          <Picker.Item label={'Game'} value={'game'} />
          <Picker.Item label={'Music'} value={'music'} />
          <Picker.Item label={'Entertainment'} value={'entertainment'} />
        </Picker>
        <DatePicker
          value={contest.start}
          callback={updateContest}
          field="start"
        />
        <DatePicker value={contest.end} callback={updateContest} field="end" />
        <CustomButton
          isLoading={savingContest}
          onPress={this.startNow}
          isEnabled={!savingContest}
          text="Start Contest"
        />
      </ScrollView>
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
  container: {
    marginTop: 60,
    padding: 10,
    backgroundColor: iOSColors.white,
  },
  bold: {
    ...systemWeights.bold,
  },
  startTitle: {
    ...human.caption2Object,
    color: 'rgba(255,255,255,0.80)',
    margin: 8,
  },
  twoPickerItems: {
    height: 60,
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
});

// which props do we want to inject, given the global state?
function mapStateToProps(state) {
  return {
    user: state.account.user,
    contest: state.contest.tmpContest,
    savingContest: state.contest.savingContest,
    savingContestError: state.contest.savingContestError,
  };
}

const mapDispatchToProps = dispatch => {
  return {
    updateContest: fields => dispatch(contestActions.updateTmpContest(fields)),
    startContest: () => dispatch(contestActions.startContest()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StartContest);
