/* eslint-disable new-cap */
import React from 'react';
import PropTypes from 'prop-types';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from './styles/CardThree';

const iconStar = <Icon name="md-star" size={16} color="#F5B642" />;

const CardThree = ({ info, viewMedia }) => (
  <View style={styles.cardContainer}>
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={viewMedia.bind(this, info.id)}>
      <View style={styles.card}>
        <Image
          source={{ uri: `${info.poster_path}` }}
          style={styles.cardImage}
        />
        <View style={styles.cardDetails}>
          <Text style={styles.cardTitle} numberOfLines={3}>
            {info.original_title}
          </Text>
          <View style={styles.cardGenre}>
            <Text style={styles.cardGenreItem}>
              {info.release_date.substring(0, 4)}
            </Text>
          </View>
          <View style={styles.cardNumbers}>
            <View style={styles.cardStar}>
              {iconStar}
              <Text style={styles.cardStarRatings}>
                {info.vote_average.toFixed(1)}
              </Text>
            </View>
            <Text style={styles.cardRunningHours} />
          </View>
          <Text style={styles.cardDescription} numberOfLines={3}>
            {info.overview}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  </View>
);

CardThree.propTypes = {
  info: PropTypes.object.isRequired,
  viewMedia: PropTypes.func.isRequired,
};

export default CardThree;
