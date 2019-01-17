import times from 'lodash.times';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { connect } from 'react-redux';
import * as RNIap from 'react-native-iap';
import {
  iOSColors,
  systemWeights,
  human,
  material,
  materialColors,
} from 'react-native-typography';
import * as walletActions from '../../reducers/wallet/actions';
import { List, ListItem } from 'react-native-elements';
// this is a traditional React component connected to the redux store

const itemSkus = Platform.select({
  ios: ['50_tvalue'],
  android: ['50_tvalue'],
});
class Purchase extends PureComponent {
  constructor(props) {
    super(props);
    RNIap.initConnection();
  }

  async componentDidMount() {
    try {
      const products = await RNIap.getProducts(itemSkus);
      const subs = await RNIap.getSubscriptions(['1_month_box_office ']);
      console.log(products, subs);
    } catch (err) {
      console.warn(err); // standardized err.code and err.message available
    }
  }

  buyProduct = sku =>
    RNIap.buyProduct(sku)
      .then(purchase => {
        console.log(purchase);
        RNIap.consumePurchase(purchase.purchaseToken);
      })
      .catch(err => console.log(err.message));

  componentDidUpdate(prevProps) {
    if (prevProps.fundingWallet && !this.props.fundingWallet) {
      //console.log(this.props.walletFunded);
      Alert.alert('Wallet Funding', 'Your wallet has been funded successfully');
      RNIap.consumePurchase(this.props.walletFunded.transaction.purchaseToken);
    }
  }
  render() {
    // TODO: purchase products send the id to server, let server credit then we consume in redux
    const { fundingWallet, fundWallet } = this.props;

    if (fundingWallet) {
      return <ActivityIndicator style={{ flex: 1 }} size="large" />;
    }
    return (
      <View style={styles.container}>
        <List>
          <ListItem
            roundAvatar
            title={'Buy 50 T-Value'}
            subtitle={'50 t-value purchase'}
            onPress={() => {
              RNIap.consumeAllItems().then(t => console.log(t));
              RNIap.buyProduct('50_tvalue')
                .then(fundWallet)
                .catch(err => Alert.alert('Wallet Funding', err.message));
            }}
          />
        </List>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    padding: 10,
    backgroundColor: iOSColors.white,
  },
});

// which props do we want to inject, given the global state?
function mapStateToProps(state) {
  return {
    user: state.account.user,
    fundingWallet: state.wallet.fundingWallet,
    fundWalletError: state.wallet.fundWalletError,
    walletFunded: state.wallet.walletFunded,
  };
}

const mapDispatchToProps = dispatch => {
  return {
    fundWallet: data => dispatch(walletActions.fundWallet(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Purchase);
