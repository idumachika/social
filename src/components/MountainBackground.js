import React from 'react';
import {
  Image,
  ImageBackground,
  View,
  ScrollView,
  StyleSheet,
} from 'react-native';

const tlikesLogo = { uri: 't_logo' };
const grid = { uri: 'ngrid' };

const Mountain = ({ children }) => (
  <ImageBackground
    imageStyle={{ resizeMode: 'cover' }}
    style={styles.backGround}
    source={grid}>
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.subView}>
          <Image style={{ height: 90, width: 150 }} source={tlikesLogo} />
        </View>
        {children}
      </View>
    </ScrollView>
  </ImageBackground>
);

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

export default Mountain;
