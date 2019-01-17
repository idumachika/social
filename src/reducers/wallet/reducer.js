import * as types from './actionTypes';
import Immutable from 'seamless-immutable';
import _ from 'lodash';

const initialState = Immutable({
  fundingWallet: false,
  fundWalletError: null,
  walletFunded: false,
});

export default function discover(state = initialState, action = {}) {
  switch (action.type) {
    case types.FUND_WALLET:
      return state.merge({
        fundingWallet: true,
        fundWalletError: null,
        walletFunded: null,
      });
    case types.FUND_WALLET_ERROR:
      return state.merge({
        fundingWallet: false,
        fundWalletError: action.error,
        walletFunded: null,
      });
    case types.FUND_WALLET_SUCCESS:
      return state.merge({
        fundingWallet: false,
        fundWalletError: null,
        walletFunded: action.fund,
      });
    default:
      return state;
  }
}
