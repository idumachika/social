import * as types from './actionTypes';
import Immutable from 'seamless-immutable';
import _ from 'lodash';
import Storage from '../../helpers/storage';

const initialState = Immutable({
  sessionActive: false,
  token: '',
  user: { username: '', password: '' },
  loginRequested: false,
  registrationRequested: false,
  validationRequested: false,
  accountValidationError: '',
  accountLoginError: '',
  accountRecordValidated: false,
  justRegistered: '',
  loadingFriendsSuggestions: false,
  following: [],
  followingUser: false,
  pushToken: {},
  socialLoginProcessing: false,
  socialLoginResponse: null,
  preSocialLogin: false,
  preSocialData: null,
  preSocialLoginSuccess: false,
});

let indx = -1; // place holder for content location in array

export default function app(state = initialState, action = {}) {
  //alert("I got this: " + JSON.stringify(state));
  /*Storage.getItem("savedAccount").then( item => {
    if(!state) {
      state = (!item)? initialState: item;
    }
    Storage.addItem("savedAccount", state);

  }).catch( e => alert(e.message)); */
  switch (action.type) {
    case types.LOGOUT:
      return state.merge({
        user: { email: '', password: '' },
        token: '',
      });
    case types.ACCOUNT_LOGIN:
      return state.merge({
        loginRequested: true,
      });
    case types.SESSION_ACTIVE:
      return state.merge({
        sessionActive: true,
      });
    case types.SESSION_EXPIRED:
      return state.merge({
        sessionActive: false,
        token: undefined,
      });
    case types.ACCOUNT_UPDATE_TOKEN:
      return state.merge({
        token: action.token,
      });
    case types.ACCOUNT_UPDATE_USER:
      return state.merge({ user: state.user.merge({ ...action.fields }) });

    case types.ACCOUNT_JUST_REGISTERED:
      return state.merge({
        newUser: true,
      });
    case types.ACCOUNT_LOGIN_ERROR:
      return state.merge({
        accountLoginError: action.message,
        loginRequested: false,
      });
    case types.ACCOUNT_LOGIN_SUCCESS:
      return state.merge({
        loginRequested: false,
        accountLoginError: '',
      });
    case types.ACCOUNT_VALIDATION:
      return state.merge({
        validationRequested: true,
      });
    case types.ACCOUNT_VALIDATION_SUCCESS:
      return state.merge({
        validationRequested: false,
        accountValidationError: '',
        accountRecordValidated: true,
      });
    case types.ACCOUNT_VALIDATION_ERROR:
      return state.merge({
        validationRequested: false,
        accountValidationError: action.message,
      });
    case types.CLEAR_ACCOUNT_VALIDATION_ERROR:
      return state.merge({
        validationRequested: false,
        accountValidationError: '',
      });
    case types.RESET_ACCOUNT_VALIDATION:
      return state.merge({
        accountRecordValidated: false,
      });

    case types.UPDATE_DP:
      return state.merge({
        user: { ...state.user, avatar: action.dp },
      });
    case types.UPDATE_PROFILE:
      return state.merge({
        user: { ...state.user, ...action.user },
      });
    case types.ACCOUNT_REGISTRATION:
      return state.merge({
        registrationRequested: true,
      });
    case types.ACCOUNT_REGISTRATION_ERROR:
      return state.merge({
        accountRegistrationError: action.message,
        registrationRequested: false,
        accountRecordValidated: false,
      });
    case types.ACCOUNT_REGISTRATION_SUCCESS:
      return state.merge({
        registrationRequested: false,
        accountRegistrationError: '',
        justRegistered: action.message,
      });
    case types.LOADING_FRIENDS_SUGGESTIONS:
      return state.merge({
        loadingFriendsSuggestions: true,
      });
    case types.FRIENDS_SUGGESTIONS_SUCCESS:
      return state.merge({
        loadingFriendsSuggestions: false,
        suggestedFriends: action.suggestions,
      });
    case types.FOLLOWING_USER:
      return state.merge({
        followingUser: true,
      });
    case types.FOLLOWING_USER_SUCCESS:
      indx = _.findIndex(state.suggestedFriends, {
        _id: action.follow.followed,
      });
      if (indx === -1) {
        return state;
      }
      return state.merge({
        followingUser: false,
        following: [...state.following, action.follow],
        suggestedFriends: state.suggestedFriends.filter(
          o => o._id !== state.suggestedFriends[indx]._id
        ),
      });
    case types.UPDATE_PUSH_TOKEN:
      return state.merge({
        pushToken: action.token,
      });
    case types.SOCIAL_LOGIN:
      return state.merge({
        socialLoginProcessing: true,
      });
    case types.SOCIAL_LOGIN_ERROR:
      return state.merge({
        socialLoginProcessing: false,
        socialLoginResponse: action.error,
      });
    case types.SOCIAL_LOGIN_SUCCESS:
      return state.merge({
        socialLoginProcessing: false,
        socialLoginResponse: action.res,
      });
    case types.PRE_SOCIAL_LOGIN:
      return state.merge({
        preSocialLogin: true,
        preSocialLoginSuccess: false,
        preSocialData: action.data,
      });
    case types.PRE_SOCIAL_LOGIN_ERROR:
      return state.merge({
        preSocialLogin: false,
        preSocialLoginSuccess: false,
      });
    case types.PRE_SOCIAL_LOGIN_SUCCESS:
      return state.merge({
        preSocialLogin: false,
        preSocialLoginSuccess: true,
      });
    default:
      return state;
  }
}
