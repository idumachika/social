import React from 'react';
import {View,TouchableOpacity,UIManager,findNodeHandle} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types';

const ICON_SIZE = 30;

class PopupMenu extends React.Component {
  handleShowPopupError = () => {
    // show error here
  };

  handleMenuPress = () => {
    const { actions, onPress } = this.props;

    UIManager.showPopupMenu(
      findNodeHandle(this.refs.menu),
      actions,
      this.handleShowPopupError,
      onPress,
    );
  };

  render() {
    return (
      <View>
        { this.props.children }
        <TouchableOpacity onPress={this.handleMenuPress} style={{alignSelf:'center',backgroundColor:'transparent',paddingLeft:15,paddingRight:15}}>
          <Icon
            name="ios-more"
            size={ICON_SIZE}
            color='#999'
            ref="menu"
          />
        </TouchableOpacity>
      </View>
    );
  }
}

PopupMenu.propTypes = {
  actions: PropTypes.array.isRequired,
  onPress: PropTypes.func.isRequired,
  children: PropTypes.object.isRequired,
};

export default PopupMenu;