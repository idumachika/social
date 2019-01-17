import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import _ from 'lodash';
import FastImage from 'react-native-fast-image';
import * as Progress from 'react-native-progress';
import { createImageProgress } from 'react-native-image-progress';
const FImage = createImageProgress(FastImage);

const { width } = Dimensions.get('window');

const isLastImage = (index, secondViewImages, numberImagesToShow, source) => {
  return (
    (source.length > 5 || numberImagesToShow) &&
    index === secondViewImages.length - 1
  );
};
handlePressImage = (
  event,
  { image, index },
  onPressImage,
  numberImagesToShow,
  source,
  secondViewImages
) =>
  onPressImage(event, image, {
    isLastImage:
      index && isLastImage(index, secondViewImages, numberImagesToShow, source),
  });

const PhotoGrid = ({
  imageProps,
  sources,
  width,
  height,
  defaultRatio,
  defaultStyles,
  imageStyle,
  textStyles,
  numberImagesToShow,
  onPressImage,
}) => {
  if (sources.length < 0) return null;
  const source = _.take(sources, 5);
  const firstViewImages = [];
  const secondViewImages = [];
  const firstItemCount = source.length === 5 ? 2 : 1;
  let index = 0;
  _.each(source, (img, callback) => {
    if (index === 0) {
      firstViewImages.push(img);
    } else if (index === 1 && firstItemCount === 2) {
      firstViewImages.push(img);
    } else {
      secondViewImages.push(img);
    }
    index++;
  });

  let ratio = 0;
  if (secondViewImages.length === 0) {
    ratio = 0;
  } else if (secondViewImages.length === 1) {
    ratio = 1 / 2;
  } else {
    ratio = defaultRatio;
  }
  const direction = source.length === 5 ? 'row' : 'column';

  const firstImageWidth =
    direction === 'column'
      ? width / firstViewImages.length
      : width * (1 - ratio);
  const firstImageHeight =
    direction === 'column'
      ? height * (1 - ratio)
      : height / firstViewImages.length;

  const secondImageWidth =
    direction === 'column' ? width / secondViewImages.length : width * ratio;
  const secondImageHeight =
    direction === 'column' ? height / secondViewImages.length : height * ratio;

  const secondViewWidth = direction === 'column' ? width : width * ratio;
  const secondViewHeight = direction === 'column' ? height * ratio : height;

  return source.length ? (
    <View style={[{ flexDirection: direction, width, height }, defaultStyles]}>
      <View
        style={{
          flex: 1,
          flexDirection: direction === 'row' ? 'column' : 'row',
        }}>
        {firstViewImages.map((image, index) => (
          <TouchableOpacity
            activeOpacity={0.7}
            key={index}
            style={{ flex: 1 }}
            onPress={event =>
              handlePressImage(
                event,
                { image },
                onPressImage,
                numberImagesToShow,
                source
              )
            }>
            <FImage
              style={[
                styles.image,
                { width: firstImageWidth, height: firstImageHeight },
                imageStyle,
              ]}
              source={
                typeof image === 'string'
                  ? {
                      uri: image,
                      priority: FastImage.priority.normal,
                      headers: { 'accept-encoding': '' },
                    }
                  : image
              }
              {...imageProps}
              resizeMode={FastImage.resizeMode.contain}
              indicator={Progress.Circle}
              indicatorProps={{
                size: 80,
                borderWidth: 0,
                color: 'rgba(60,14,101, 1)',
                unfilledColor: 'rgba(60,14,101, 0.2)',
              }}
            />
          </TouchableOpacity>
        ))}
      </View>
      {secondViewImages.length ? (
        <View
          style={{
            width: secondViewWidth,
            height: secondViewHeight,
            flexDirection: direction === 'row' ? 'column' : 'row',
          }}>
          {secondViewImages.map((image, index) => (
            <TouchableOpacity
              activeOpacity={0.7}
              key={index}
              style={{ flex: 1 }}
              onPress={event =>
                handlePressImage(
                  event,
                  { image, index },
                  onPressImage,
                  numberImagesToShow,
                  source,
                  secondViewImages
                )
              }>
              {isLastImage(
                index,
                secondViewImages,
                numberImagesToShow,
                source
              ) ? (
                <ImageBackground
                  style={[
                    styles.image,
                    { width: secondImageWidth, height: secondImageHeight },
                    imageStyle,
                  ]}
                  source={typeof image === 'string' ? { uri: image } : image}>
                  <View style={styles.lastWrapper}>
                    <Text style={[styles.textCount, textStyles]}>
                      +{numberImagesToShow || source.length - 5}
                    </Text>
                  </View>
                </ImageBackground>
              ) : (
                <FImage
                  style={[
                    styles.image,
                    { width: secondImageWidth, height: secondImageHeight },
                    imageStyle,
                  ]}
                  source={
                    typeof image === 'string'
                      ? {
                          uri: image,
                          priority: FastImage.priority.normal,
                          headers: { 'accept-encoding': '' },
                        }
                      : image
                  }
                  {...imageProps}
                  resizeMode={FastImage.resizeMode.contain}
                  indicator={Progress.Circle}
                  indicatorProps={{
                    size: 80,
                    borderWidth: 0,
                    color: 'rgba(60,14,101, 1)',
                    unfilledColor: 'rgba(60,14,101, 0.2)',
                  }}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>
      ) : null}
    </View>
  ) : null;
};

PhotoGrid.prototypes = {
  sources: PropTypes.array.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  defaultStyles: PropTypes.object,
  imageStyle: PropTypes.object,
  onPressImage: PropTypes.func,
  defaultRatio: PropTypes.float,
  imageProps: PropTypes.object,
};

PhotoGrid.defaultProps = {
  defaultStyles: {},
  imageStyle: {},
  imageProps: {},
  width: width,
  height: 400,
  defaultRatio: 1 / 3,
};

const styles = {
  image: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#fff',
  },
  lastWrapper: {
    flex: 1,
    backgroundColor: 'rgba(200, 200, 200, .5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textCount: {
    color: '#fff',
    fontSize: 60,
  },
};

export default PhotoGrid;
