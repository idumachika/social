import React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import CustomButton from './CustomButton';
import { Navigation } from 'react-native-navigation';
const Light = ({ onOk, title, content, componentId }) => (
  <View style={styles.container}>
    <View style={{ flex: 8 }}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.content}>{content}</Text>
    </View>
    <View style={{ flex: 5 }}>
      <CustomButton
        text={'OK'}
        onPress={() =>
          onOk ? onOk(componentId) : Navigation.dismissOverlay(componentId)
        }
      />
    </View>
  </View>
);

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

export default Light;
