import React, { Component } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  DatePickerIOS,
  DatePickerAndroid,
  Image,
  ImageBackground,
  Picker,
} from 'react-native';
import { connect } from 'react-redux';
import Config from 'react-native-config';
import LinearGradient from 'react-native-linear-gradient';
import _ from 'lodash';
import CustomButton from '../../components/CustomButton';
import CustomTextInput from '../../components/CustomTextInput';
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import * as accountAction from '../../reducers/account/actions';
import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';
import EPicker from 'react-native-picker';
import Nigeria from '../../helpers/Nigeria';
import { Navigation } from 'react-native-navigation';

const socialImage = require('../../../img/social.jpg');

class PersonalModal extends Component {
  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this);
    const { user } = this.props;
    this.state = {
      dpHolder: `${Config.SERVER_URL}/images/love2.png`,
      user,
    };
  }

  showState = () => {
    const { user } = this.state;
    EPicker.init({
      pickerData: Nigeria.map(state => ({
        [state.name]: state.locals.map(local => local.name),
      })),
      pickerConfirmBtnText: 'Save',
      pickerTitleText: 'Select State',
      onPickerConfirm: data => {
        this.setState({ user: { ...user, state: data[0], lga: data[1] } });
      },
      onPickerCancel: data => {
        console.log(data);
      },
    });
    EPicker.show();
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.justRegistered) {
      Navigation.showOverlay({
        component: {
          name: 'tlikes.SignUpLight',
          passProps: {
            title: 'SignUp Info',
            content: this.props.justRegistered,
            onOk: componentId => {
              Navigation.dismissOverlay(componentId);
              Navigation.push(this.props.componentId, {
                component: {
                  name: 'tlikes.LoginScreen',
                  passProps: {
                    text: 'Pushed screen',
                  },
                  options: {
                    topBar: {
                      title: {
                        text: 'Login',
                      },
                      animate: false,
                    },
                  },
                },
              });
            },
          },
          options: {
            topBar: {},
          },
        },
      });
    }
  }

  chooseProfileImage = () => {
    const options = {
      title: 'Select profile Photo',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    let self = this;
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
        const base64Str = await RNFS.readFile(filePath, 'base64');

        self.setState({
          dpHolder: { uri: resizedImageUri.uri },
          user: {
            ...this.state.user,
            dp: {
              name: 'display_image',
              filename: response.fileName,
              type: response.fileName.split('.').pop(),
              data: blobFile,
            },
          },
        });
      }
    });
  };

  setBio = bio =>
    this.setState({
      user: {
        ...this.state.user,
        bio,
      },
    });
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

  render() {
    const { dpHolder, user } = this.state;
    const {
      registrationRequested,
      accountError,
      accountRegistration,
    } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: Platform.OS === 'android' ? 3 : 2 }}>
          <ImageBackground
            imageStyle={{ resizeMode: 'cover' }}
            style={{
              flex: 1,
              width: null,
              alignSelf: 'stretch',
            }}
            source={socialImage}>
            <LinearGradient
              colors={[
                'rgba(60,14,101, 0.2)',
                'rgba(60,14,101, 0.2)',
                'rgba(60,14,101, 0.7)',
              ]}
              style={{
                top: 0,
                left: 0,
                right: 0,
                height: '100%',
                position: 'absolute',
              }}
            />
            {/* <LinearGradient
              colors={['#3c0e65', '#5d2b8d']}
              start={{ x: 0.0, y: 0.5 }}
              end={{ x: 1.0, y: 0.1 }}
              style={[
                {},
                {
                  padding: 5,
                  alignItems: 'center',
                  borderRadius: 1,
                  justifyContent: 'center',
                  height: '100%',
                },
              ]}
            /> */}

            <TouchableOpacity
              onPress={this.chooseProfileImage}
              style={{
                height: 190,
                width: 300,
                position: 'absolute',
                alignSelf: 'center',
                marginTop: 13,
                zIndex: 55,
              }}>
              <Image
                source={dpHolder}
                style={{
                  alignSelf: 'center',
                  height: 100,
                  width: 100,
                  borderRadius: 50,
                  borderWidth: 2,
                  borderColor: 'white',
                }}
                activeOpacity={0.7}
              />
              <Text
                style={{
                  color: 'white',
                  fontFamily: 'typonil',
                  fontWeight: '600',
                  fontSize: 12,
                  alignSelf: 'center',
                }}>
                Click here to choose profile image
              </Text>
            </TouchableOpacity>
          </ImageBackground>
        </View>
        <View style={{ flex: 6, padding: 10 }}>
          <ScrollView>
            <Text style={styles.errorMessage}>{accountError}</Text>
            <Text
              style={{
                alignSelf: 'center',
                fontFamily: 'typonil',
                fontSize: 20,
              }}>
              {`What's your Gender?`}
            </Text>
            <Picker
              style={styles.twoPickers}
              itemStyle={styles.twoPickerItems}
              selectedValue={user.gender}
              onValueChange={gender =>
                this.setState({ user: { ...user, gender } })
              }>
              <Picker.Item label={'Gender'} value={''} />
              <Picker.Item label={'Male'} value={'male'} />
              <Picker.Item label={'Female'} value={'female'} />
            </Picker>

            <Text
              style={{
                alignSelf: 'center',
                fontFamily: 'typonil',
                fontSize: 20,
              }}>
              Your date of Birth
            </Text>

            {Platform.OS === 'ios' && (
              <DatePickerIOS
                mode={'date'}
                minimumDate={new Date()}
                date={user.tempDate || new Date()}
                onDateChange={date => this.treatDate(date)}
              />
            )}

            {Platform.OS === 'android' && (
              <CustomButton
                colors={['#FFFFFF', '#FFFFFF']}
                text={user.dob || 'Choose Birthday'}
                onPress={() => this.treatDate()}
                buttonStyle={{ borderColor: '#3c0e65', borderWidth: 2 }}
                textStyle={{ color: '#3c0e65' }}
              />
            )}

            <Text
              style={{
                alignSelf: 'center',
                fontFamily: 'typonil',
                fontSize: 20,
              }}>
              Your current city?
            </Text>
            <CustomButton
              colors={['#FFFFFF', '#FFFFFF']}
              text={user.state ? `${user.lga}, ${user.state}` : 'Choose City'}
              onPress={() => this.showState()}
              buttonStyle={{ borderColor: '#3c0e65', borderWidth: 2 }}
              textStyle={{ color: '#3c0e65' }}
            />
            <CustomTextInput
              name={'bio'}
              placeholder={'Brief bio, Tell people about you here...'}
              editable={!registrationRequested}
              value={user.bio}
              multiline={true}
              onChangeText={this.setBio}
              isEnabled={!registrationRequested}
            />

            <CustomButton
              isLoading={registrationRequested}
              isEnabled={
                !registrationRequested &&
                (user.dob && user.gender && user.dp && user.state
                  ? true
                  : false)
              }
              text={'Proceed'}
              disabledMessage={
                'Profile Image, Gender and Date of birth is required!'
              }
              onPress={() =>
                accountRegistration(_.unset(user, 'tempDate') ? user : user)
              }
            />
          </ScrollView>
        </View>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    registrationRequested: state.account.registrationRequested,
    validationRequested: state.account.validationRequested,
    validationError: state.account.accountValidationError,
    accountError: state.account.accountRegistrationError,
    justRegistered: state.account.justRegistered,
  };
}

const mapDispatchToProps = dispatch => {
  return {
    accountRegistration: user => dispatch(accountAction.signUp(user)),
    validateAccount: user => dispatch(accountAction.validateAccount(user)),
  };
};

const styles = StyleSheet.create({
  twoPickers: {
    marginVertical: 15,
  },
  twoPickerItems: {
    height: 60,
  },
  errorMessage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    padding: 10,
  },
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PersonalModal);
