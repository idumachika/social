import React from 'react';
import PropTypes from 'prop-types';
import { Image, Text, TouchableOpacity, View } from 'react-native';

import styles from './styles/CardTwo';

const CardTwo = ({ info, viewMedia }) => (
  <TouchableOpacity activeOpacity={0.8} onPress={viewMedia.bind(this, info.id)}>
    <View style={styles.cardContainer}>
      <Image source={info.poster} style={styles.cardImage} />
      <View style={styles.cardTitleContainer}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {info.original_title}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);

CardTwo.propTypes = {
  info: PropTypes.object.isRequired,
  viewMedia: PropTypes.func.isRequired,
};

export default CardTwo;
