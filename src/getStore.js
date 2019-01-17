import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { Navigation } from 'react-native-navigation';
import Config from 'react-native-config';
import thunk from 'redux-thunk';
import {
  Platform,
  BackHandler,
  PushNotificationIOS,
  Alert,
} from 'react-native';
import Storage from './helpers/storage';
import { iOSColors } from 'react-native-typography';
import PushNotification from 'react-native-push-notification';
import * as reducers from './reducers';
import * as appActions from './reducers/app/actions';
import * as accountActions from './reducers/account/actions';
import { registerScreens } from './screens';
const socketIo = require('socket.io-client');
import { GoogleAnalyticsTracker } from 'react-native-google-analytics-bridge';
const tracker = new GoogleAnalyticsTracker('UA-124024789-1');
const socket = socketIo(Config.SERVER_URL, {
  reconnection: true,
  transports: ['websocket'],
});
// redux related book keeping
const createStoreWithMiddleware = applyMiddleware(
  thunk.withExtraArgument({ tracker, socket })
)(createStore);
const reducer = combineReducers(reducers);
export default store = createStoreWithMiddleware(reducer);

export const savedStore = Storage.getItem('savedStore');

/*
Storage.getItem('savedStore').then((value)=>{
      let initialStore = {};
      if(value && value.length){
        initialStore = value;
      }
      const store1 = createStoreWithMiddleware(reducer, initialStore);
      registerScreens(store1, Provider);
      this.store = store1;
      this.boot();
    }).catch((error) => {
      console.log(error.message);
      const store2 = createStoreWithMiddleware(reducer);
      this.store = store2;
      registerScreens(store2, Provider);
      this.boot();
    }); */