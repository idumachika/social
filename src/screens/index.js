import { Navigation } from 'react-native-navigation';

import WelcomeScreen from './auth/WelcomeScreen';
import LoginScreen from './auth/LoginScreen';
import SignUpScreen from './auth/SignUpScreen';
import BottomTabsSideMenu from './BottomTabsSideMenu';
import PersonalModal from './auth/PersonalModal';
import SocialSignUp from './auth/SocialSignUp';
// social
import FindFriends from './social/FindFriends';
import P2PChat from './social/P2PChat';

// contest
import StartContest from './contest/Start';

// user
import AccountView from './user/AccountView';
import TimelinePage from './user/Timeline';
import NotificationPage from './user/Notification';

// discover
import VideoPlayer from './discover/VideoPlayer';
import CommentPage from './discover/CommentPage';
import Trending from './Trending';
import Talents from './Talents';
import Contests from './Contests';
import ChatMates from './ChatMates';
import Box from './Box';
import TPlayer from './Tplayer';

// View Components
import SignUpLight from '../components/SignUpLight';
import FileChooser from '../components/post/FileChooser';
import FollowRequest from '../components/FollowRequest';

// wallet
import Purchase from './wallet/Purchase';
// register all screens of the app (including internal ones)
export function registerScreens(store, Provider) {
  //Navigation.registerComponent('tlikes.WelcomeScreen', () => WelcomeScreen);

  Navigation.registerComponentWithRedux(
    'tlikes.WelcomeScreen',
    () => WelcomeScreen,
    Provider,
    store
  );

  Navigation.registerComponentWithRedux(
    'tlikes.wallet.Purchase',
    () => Purchase,
    Provider,
    store
  );

  Navigation.registerComponentWithRedux(
    'tlikes.auth.SocialSignUP',
    () => SocialSignUp,
    Provider,
    store
  );

  Navigation.registerComponentWithRedux(
    'tlikes.ChatMates',
    () => ChatMates,
    Provider,
    store
  );

  Navigation.registerComponentWithRedux(
    'tlikes.contest.Start',
    () => StartContest,
    Provider,
    store
  );

  Navigation.registerComponentWithRedux(
    'tlikes.TPlayer',
    () => TPlayer,
    Provider,
    store
  );

  // users
  Navigation.registerComponentWithRedux(
    'tlikes.AccountView',
    () => AccountView,
    Provider,
    store
  );

  Navigation.registerComponentWithRedux(
    'tlikes.Timeline',
    () => TimelinePage,
    Provider,
    store
  );

  Navigation.registerComponentWithRedux(
    'tlikes.Notification',
    () => NotificationPage,
    Provider,
    store
  );

  Navigation.registerComponentWithRedux(
    'tlikes.ContestsScreen',
    () => Contests,
    Provider,
    store
  );

  Navigation.registerComponentWithRedux(
    'tlikes.TalentsScreen',
    () => Talents,
    Provider,
    store
  );

  Navigation.registerComponentWithRedux(
    'tlikes.discover.VideoPlayer',
    () => VideoPlayer,
    Provider,
    store
  );

  Navigation.registerComponentWithRedux(
    'tlikes.discover.CommentPage',
    () => CommentPage,
    Provider,
    store
  );

  Navigation.registerComponentWithRedux(
    'tlikes.BoxScreen',
    () => Box,
    Provider,
    store
  );

  Navigation.registerComponentWithRedux(
    'tlikes.TrendingScreen',
    () => Trending,
    Provider,
    store
  );

  Navigation.registerComponentWithRedux(
    'tlikes.SignUpScreen',
    () => SignUpScreen,
    Provider,
    store
  );

  Navigation.registerComponentWithRedux(
    'tlikes.PersonalModal',
    () => PersonalModal,
    Provider,
    store
  );

  Navigation.registerComponentWithRedux(
    'tlikes.LoginScreen',
    () => LoginScreen,
    Provider,
    store
  );

  //social
  Navigation.registerComponentWithRedux(
    'tlikes.FindFriends',
    () => FindFriends,
    Provider,
    store
  );

  Navigation.registerComponentWithRedux(
    'tlikes.P2PChat',
    () => P2PChat,
    Provider,
    store
  );

  Navigation.registerComponentWithRedux(
    'tlikes.BottomTabsSideMenu',
    () => BottomTabsSideMenu,
    Provider,
    store
  );

  // View Components
  Navigation.registerComponent('tlikes.SignUpLight', () => SignUpLight);
  Navigation.registerComponent('tlikes.FileChooser', () => FileChooser);
  Navigation.registerComponentWithRedux(
    'tlikes.FollowRequest',
    () => FollowRequest,
    Provider,
    store
  );
}
