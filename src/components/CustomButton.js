import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import TouchableView from './TouchableView';
import { iOSColors } from 'react-native-typography';

const startGradient = { x: 0.0, y: 0.5 };
const endGradient = { x: 1.0, y: 0.1 };

const CustomButton = ({
  isLoading,
  text,
  buttonStyle,
  textStyle,
  colors,
  onPress,
  isEnabled,
  ...otherProps
}) => (
  <Animated.View {...otherProps}>
    <TouchableView
      onPress={isEnabled && !isLoading && onPress ? onPress : null}>
      <LinearGradient
        colors={colors}
        start={startGradient}
        end={endGradient}
        style={[buttonStyle, styles.button]}>
        {isLoading && (
          <ActivityIndicator style={styles.spinner} color={'#2196f3'} />
        )}
        {!isLoading && <Text style={[styles.text, textStyle]}>{text}</Text>}
      </LinearGradient>
    </TouchableView>
  </Animated.View>
);

CustomButton.propTypes = {
  onPress: PropTypes.func,
  isEnabled: PropTypes.bool,
  disabledMessage: PropTypes.string,
  isLoading: PropTypes.bool,
  text: PropTypes.string,
  buttonStyle: PropTypes.any,
  textStyle: PropTypes.any,
  colors: PropTypes.any,
};

CustomButton.defaultProps = {
  onPress: () => null,
  isEnabled: true,
  isLoading: false,
  colors: [iOSColors.purple, '#5d2b8d'],
};

const styles = StyleSheet.create({
  button: {
    padding: 15,
    alignItems: 'center',
    borderRadius: 40,
    justifyContent: 'center',
    width: '97%',
    margin: 5,
  },
  spinner: {
    height: 26,
  },
  text: {
    textAlign: 'center',
    fontWeight: '400',
    color: 'white',
  },
});

export default CustomButton;
