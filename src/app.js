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
import { COLOURS } from './helpers/colours';
//import store from './getStore';
const socketIo = require('socket.io-client');
import { GoogleAnalyticsTracker } from 'react-native-google-analytics-bridge';
const tracker = new GoogleAnalyticsTracker('UA-124024789-1');
const socket = socketIo(Config.SERVER_URL, {
  reconnection: true,
  transports: ['websocket'],
});
import { savedStore } from './getStore';
// redux related book keeping
const createStoreWithMiddleware = applyMiddleware(
  thunk.withExtraArgument({ tracker, socket })
)(createStore);
const reducer = combineReducers(reducers);
//const store = createStoreWithMiddleware(reducer);
// screen related book keeping
//registerScreens(store, Provider);


// notice that this is just a simple class, it's not a React component
export default class App {
  //let initStore
  //let store
  constructor() {

    this.store = {};
    // push notification

    /*Storage.getItem('savedStore').then((value)=>{
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
    }); 
    */
    savedStore.then( s => {
      this.initialStore = s;
      //alert("Still called: " + JSON.stringify(s))
      
    });

    this.store = createStoreWithMiddleware(reducer);
      registerScreens(this.store, Provider); 

      this.boot();
  }

  boot() {
    //alert("Boot called")
    this.configurePush();
    // since react-redux only works on components, we need to subscribe this class manually
    this.store.subscribe(this.onStoreUpdate.bind(this));
    // currentComponentId

    // Initiate Event listeners
    Navigation.events().registerAppLaunchedListener(() => {
      tracker.trackEvent('lunch', 'appLunched');
      socket.on('connect', () => {
        this.store.dispatch(appActions.socketConnected());
        tracker.trackEvent('socket', 'connected');
      });
      this.store.dispatch(appActions.appInitialized());
    });
    Navigation.events().registerComponentDidAppearListener(
      ({ componentId, componentName }) => {
        this.store.dispatch(appActions.updateActiveComponent(componentId));
        tracker.trackEvent('pageEntry', componentName);
        // reset verification when signup page is loaded
        if (componentName === 'tlikes.SignUpScreen') {
          this.store.dispatch(accountActions.resetValidation());
        }

        if (Platform.OS === 'android') {
          BackHandler.addEventListener('hardwareBackPress', function() {
            this.store.dispatch(appActions.popScreen());
            return true;
          });
        }
      }
    );

    Navigation.events().registerComponentDidDisappearListener(
      ({ componentName }) => tracker.trackEvent('pageExit', componentName)
    );
    Navigation.events().registerNavigationButtonPressedListener(
      ({ buttonId }) => {
        tracker.trackEvent('navigationButtonPressed', buttonId);
        if (buttonId === 'menu') this.store.dispatch(appActions.toggleMenu());
      }
    );

    Navigation.events().registerBottomTabSelectedListener(
      ({ selectedTabIndex, unselectedTabIndex }) =>
        tracker.trackEvent(
          'navigationBetweenTabs',
          `${selectedTabIndex}->${unselectedTabIndex}`
        )
    );
  }

  /* componentWillMount() {
      var self = this;
      AppState.addEventListener('change', this._handleAppStateChange.bind(this));
      this.setState({isStoreLoading: true});
      AsyncStorage.getItem('savedStore').then((value)=>{
        if(value && value.length){
          let initialStore = JSON.parse(value)
          self.setState({store: createStore(reducers, initialStore, middleware)});
        }else{
          self.setState({store: store});
        }
        self.setState({isStoreLoading: false});
      }).catch((error)=>{
        self.setState({store: store});
        self.setState({isStoreLoading: false});
      })
    } */

  configurePush() {
    PushNotification.configure({
      onRegister: token =>
        this.store.dispatch(accountActions.updatePushToken(token)),

      onNotification: function(notification) {
        Alert.alert(notification.title, notification.bigText);
        if (Platform.OS === 'ios') {
          notification.finish(PushNotificationIOS.FetchResult.NoData);
        }
      },
      senderID: Config.PUSH_SENDER_ID,
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      soundName: 'short_press_like',
    });
  }

  onStoreUpdate() {
    const { root } = this.store.getState().app;
    //alert("Save this: " + JSON.stringify(store.getState()));
    //alert(JSON.stringify(this.store.getState().app) + "|" + this.currentRoot);
    
    Storage.addItem(this.store.getState(), "savedStore");

    // handle a root change
    // if your app doesn't change roots in runtime, you can remove onStoreUpdate() altogether
    if (this.currentRoot != root) {
      this.currentRoot = root;
      this.startApp(root);
    }
  }
  // single with sidemenue
  // root: {
  //   sideMenu: {
  //     left: {
  //       component: {
  //         name: 'example.BottomTabsSideMenu',
  //       },
  //     },

  //     center: {
  //       stack: {
  // }
  // }

  startApp(root) {
    switch (root) {
      case 'AUTH':
        tracker.trackEvent('accessLevel', 'guest');
        if (Platform.OS === 'ios') {
          Navigation.setRoot({
            root: {
              stack: {
                id: 'Auth',
                options: {
                  topBar: {
                    visible: false,
                    hideOnScroll: true,
                    buttonColor: 'black',
                    animate: true,
                  },
                  popGesture: true,
                  statusBar: {
                    visible: true,
                    style: 'light',
                  },
                  layout: {
                    backgroundColor: 'white',
                    orientation: ['portrait' /*, 'landscape'*/],
                  },
                },
                children: [
                  {
                    component: {
                      name: 'tlikes.WelcomeScreen',
                      passProps: {
                        str:
                          "This is a prop passed in 'startSingleScreenApp()'!",
                        obj: {
                          str: 'This is a prop passed in an object!',
                          arr: [
                            {
                              str:
                                'This is a prop in an object in an array in an object!',
                            },
                          ],
                          arr2: [
                            ['array of strings', 'with two strings'],
                            [1, 2, 3],
                          ],
                        },
                        num: 1234,
                        fn: function() {
                          return 'Hello from a function!';
                        },
                      },
                    },
                  },
                ],
              },
            },
          });
        } else {
          Navigation.setDefaultOptions({
            topBar: {
              visible: false,
              drawBehind: true,
              animate: true,
              background: {
                color: 'white',
              },
              title: {
                color: iOSColors.purple,
              },
            },
            statusBar: {
              backgroundColor: '#3c0e65',
              drawBehind: false,
              visible: true,
            },
          });
          Navigation.setRoot({
            root: {
              stack: {
                id: 'Auth',
                children: [
                  {
                    component: {
                      name: 'tlikes.WelcomeScreen',
                      passProps: {
                        str:
                          "This is a prop passed in 'startSingleScreenApp()'!",
                        obj: {
                          str: 'This is a prop passed in an object!',
                          arr: [
                            {
                              str:
                                'This is a prop in an object in an array in an object!',
                            },
                          ],
                          arr2: [
                            ['array of strings', 'with two strings'],
                            [1, 2, 3],
                          ],
                        },
                        num: 1234,
                        fn: function() {
                          return 'Hello from a function!';
                        },
                      },
                    },
                  },
                ],
              },
            },
          });
        }
        return;
      case 'DASHBOARD':
        tracker.trackEvent('accessLevel', 'user');
        Navigation.setRoot({
          root: {
            sideMenu: {
              left: {
                component: {
                  name: 'tlikes.BottomTabsSideMenu',
                  options: {
                    statusBar: {
                      visible: true,
                      style: 'light',
                    },
                  },
                },
              },
              center: {
                bottomTabs: {
                  id: 'main',
                  options: {
                    bottomTabs: {
                      titleDisplayMode: 'alwaysShow',
                      // translucent: true,
                      hideShadow: false,
                    },
                    popGesture: true,
                    statusBar: {
                      visible: true,
                      style: 'light',
                    },
                    layout: {
                      orientation: ['portrait' /*, 'landscape'*/],
                      ...Platform.select({
                        android: {
                          topMargin: Navigation.constants().topBarHeight,
                        },
                      }),
                    },
                  },
                  children: [
                    {
                      stack: {
                        children: [
                          {
                            component: {
                              name: 'tlikes.TrendingScreen',
                              options: {
                                statusBar: {
                                  visible: true,
                                  style: 'light',
                                },
                                topBar: {
                                  visible: true,
                                  ...Platform.select({
                                    android: { drawBehind: false },
                                  }),
                                  hideOnScroll: false,
                                  buttonColor: 'white',
                                  title: {
                                    text: 'Experience T-Likes',
                                    fontSize: 20,
                                    color: 'white',
                                    fontFamily: 'typonil_bold',
                                  },
                                  background: {
                                    color: COLOURS.purple,
                                  },

                                  rightButtons: [
                                    {
                                      icon: require('../img/tlogo.png'),
                                      id: 'tlogo',
                                      color: 'white',
                                    },
                                  ],
                                  leftButtons: [
                                    {
                                      icon: require('../img/men.png'),
                                      id: 'menu',
                                      color: 'white',
                                    },
                                  ],
                                },
                                popGesture: true,
                                bottomTab: {
                                  fontSize: 12,
                                  badge: 'New',
                                  text: 'Trending',
                                  icon: require('../img/trending.png'),
                                  selectedIcon: require('../img/trending_selected.png'),
                                },
                              },
                            },
                          },
                        ],
                      },
                    },
                    {
                      stack: {
                        children: [
                          {
                            component: {
                              name: 'tlikes.ChatMates',
                              options: {
                                statusBar: {
                                  visible: true,
                                  style: 'light',
                                },
                                topBar: {
                                  visible: true,
                                  ...Platform.select({
                                    android: { drawBehind: false },
                                  }),
                                  hideOnScroll: false,
                                  buttonColor: 'white',
                                  title: {
                                    text: 'Experience T-Likes',
                                    fontSize: 20,
                                    color: 'white',
                                    fontFamily: 'typonil_bold',
                                  },
                                  background: {
                                    color: COLOURS.purple,
                                  },

                                  rightButtons: [
                                    {
                                      icon: require('../img/tlogo.png'),
                                      id: 'tlogo',
                                      color: 'white',
                                    },
                                  ],
                                  leftButtons: [
                                    {
                                      icon: require('../img/men.png'),
                                      id: 'menu',
                                      color: 'white',
                                    },
                                  ],
                                },
                                popGesture: true,
                                bottomTab: {
                                  fontSize: 12,
                                  text: 'Chat Mates',
                                  icon: require('../img/cmate.png'),
                                  selectedIcon: require('../img/cmate_selected.png'),
                                },
                              },
                            },
                          },
                        ],
                      },
                    },
                    {
                      stack: {
                        children: [
                          {
                            component: {
                              name: 'tlikes.BoxScreen',
                              options: {
                                statusBar: {
                                  visible: true,
                                  style: 'light',
                                },
                                topBar: {
                                  visible: true,
                                  ...Platform.select({
                                    android: { drawBehind: false },
                                  }),
                                  hideOnScroll: false,
                                  buttonColor: 'white',
                                  title: {
                                    text: 'Experience T-Likes',
                                    fontSize: 20,
                                    color: 'white',
                                    fontFamily: 'typonil_bold',
                                  },
                                  background: {
                                    color: COLOURS.purple,
                                  },

                                  rightButtons: [
                                    {
                                      icon: require('../img/tlogo.png'),
                                      id: 'tlogo',
                                      color: 'white',
                                    },
                                  ],
                                  leftButtons: [
                                    {
                                      icon: require('../img/men.png'),
                                      id: 'menu',
                                      color: 'white',
                                      navigationButtonPressed: () => alert('3'),
                                    },
                                  ],
                                },
                                popGesture: true,
                                bottomTab: {
                                  fontSize: 12,
                                  text: 'Box Office',
                                  icon: require('../img/box.png'),
                                  selectedIcon: require('../img/box_selected.png'),
                                },
                              },
                            },
                          },
                        ],
                      },
                    },
                    {
                      stack: {
                        children: [
                          {
                            component: {
                              name: 'tlikes.TalentsScreen',
                              options: {
                                statusBar: {
                                  visible: true,
                                  style: 'light',
                                },
                                topBar: {
                                  visible: true,
                                  hideOnScroll: false,
                                  ...Platform.select({
                                    android: { drawBehind: false },
                                  }),
                                  buttonColor: 'white',
                                  title: {
                                    text: 'Experience T-Likes',
                                    fontSize: 20,
                                    color: 'white',
                                    fontFamily: 'typonil_bold',
                                  },
                                  background: {
                                    color: COLOURS.purple,
                                  },

                                  rightButtons: [
                                    {
                                      icon: require('../img/tlogo.png'),
                                      id: 'tlogo',
                                      color: 'white',
                                    },
                                  ],
                                  leftButtons: [
                                    {
                                      icon: require('../img/men.png'),
                                      id: 'menu',
                                      color: 'white',
                                      navigationButtonPressed: () =>
                                        alert('p2'),
                                    },
                                  ],
                                },
                                popGesture: true,
                                bottomTab: {
                                  fontSize: 12,
                                  text: 'Discover',
                                  icon: require('../img/discover.png'),
                                  selectedIcon: require('../img/discover_selected.png'),
                                },
                              },
                            },
                          },
                        ],
                      },
                    },
                    {
                      stack: {
                        children: [
                          {
                            component: {
                              name: 'tlikes.ContestsScreen',
                              options: {
                                statusBar: {
                                  visible: true,
                                  style: 'light',
                                },
                                topBar: {
                                  visible: true,
                                  ...Platform.select({
                                    android: { drawBehind: false },
                                  }),
                                  hideOnScroll: false,
                                  buttonColor: 'white',
                                  title: {
                                    text: 'Experience T-Likes',
                                    fontSize: 20,
                                    color: 'white',
                                    fontFamily: 'typonil_bold',
                                  },
                                  background: {
                                    color: COLOURS.purple,
                                  },

                                  rightButtons: [
                                    {
                                      icon: require('../img/tlogo.png'),
                                      id: 'tlogo',
                                      color: 'white',
                                    },
                                  ],
                                  leftButtons: [
                                    {
                                      icon: require('../img/men.png'),
                                      id: 'menu',
                                      color: 'white',
                                      navigationButtonPressed: () => alert('p'),
                                    },
                                  ],
                                },
                                popGesture: true,
                                bottomTab: {
                                  fontSize: 12,
                                  text: 'Contests',
                                  icon: require('../img/two.png'),
                                  selectedIcon: require('../img/two_selected.png'),
                                },
                              },
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            },
          },
        });
        return;
      default:
        console.error('Unknown app root');
    }
  }
}

