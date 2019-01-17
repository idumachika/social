import * as types from './actionTypes';
import { creditWallet } from '../../controllers/user';
import * as RNIap from 'react-native-iap';

export function fundWallet(data) {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: types.FUND_WALLET });
      const fund = await creditWallet(data);
      dispatch({ type: types.FUND_WALLET_SUCCESS, fund });
      RNIap.consumePurchase(fund.purchaseToken);
    } catch (error) {
      dispatch({ type: types.FUND_WALLET_ERROR, error });
    }
  };
}
