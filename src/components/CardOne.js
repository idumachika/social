import React from 'react';
import PropTypes from 'prop-types';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

import styles from './styles/CardOne';

const iconStar = <Icon name="md-star" size={16} color="#F5B642" />;
const linearColor = [
  'rgba(60, 14, 101, 0.5)',
  'rgba(60, 14, 101, 0.7)',
  'rgba(60, 14, 101, 0.8)',
];

const CardOne = ({ info, viewMedia }) => (
  <View>
    <Image source={info.poster} style={styles.imageBackdrop} />
    <LinearGradient colors={linearColor} style={styles.linearGradient} />
    <View style={styles.cardContainer}>
      <Image source={info.poster} style={styles.cardImage} />
      <View style={styles.cardDetails}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {info.original_title}
        </Text>
        <View style={styles.cardGenre}>
          <Text style={styles.cardGenreItem}>Action</Text>
        </View>
        <View style={styles.cardNumbers}>
          <View style={styles.cardStar}>
            {iconStar}
            <Text style={styles.cardStarRatings}>8.9</Text>
          </View>
          <Text style={styles.cardRunningHours} />
        </View>
        <Text style={styles.cardDescription} numberOfLines={3}>
          {info.overview}
        </Text>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={viewMedia.bind(this, info.id)}>
          <View style={styles.viewButton}>
            <Text style={styles.viewButtonText}>View Details</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

CardOne.propTypes = {
  info: PropTypes.object.isRequired,
  viewMedia: PropTypes.func.isRequired,
};

export default CardOne;
