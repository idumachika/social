import App from './src/app';
/*import { createStore, applyMiddleware, combineReducers } from 'redux';
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
import Storage from './src/helpers/storage';
import { iOSColors } from 'react-native-typography';
import PushNotification from 'react-native-push-notification';
import * as reducers from './src/reducers';
import * as appActions from './src/reducers/app/actions';
import * as accountActions from './src/reducers/account/actions';
import { registerScreens } from './src/screens'; */
/*const socketIo = require('socket.io-client');
import { GoogleAnalyticsTracker } from 'react-native-google-analytics-bridge';
const tracker = new GoogleAnalyticsTracker('UA-124024789-1');
const socket = socketIo(Config.SERVER_URL, {
  reconnection: true,
  transports: ['websocket'],
});

const createStoreWithMiddleware1 = applyMiddleware(
  thunk.withExtraArgument({ tracker, socket })
)(createStore);
const reducer1 = combineReducers(reducers);

async function boot() {
	let initialStore = {};
	let val = await Storage.getItem('savedStore');

	if(val) {
		initialStore = val;
	}

	const store = createStoreWithMiddleware1(reducer1);
    //registerScreens(store, Provider);
    //const app = new App(store);

    return store;
} 

boot().then( s => {
	registerScreens(s, Provider);
	alert(JSON.stringify(s))
    const app = new App(s);
}); */

const app = new App();
