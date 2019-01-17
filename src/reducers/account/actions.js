import * as types from './actionTypes';
import {
  accountLogin,
  accountRegister,
  validateRecord,
  followUser,
  updateMobilePushToken,
  socialLogin,
  lookupSocialRecord,
} from '../../controllers/user'; // eslint-disable-line import/default
import * as chatActions from '../chatmate/actions';
import * as appActions from '../app/actions';
import * as discoverActions from '../discover/actions';
import { updateToken } from '../../helpers/request';
import Storage from '../../helpers/storage';

export function initializeSession() {
  return async (dispatch, getState) => {
    // check is user is logged in
    // else send no-session
    const rawUser = await Storage.getItem(types.USER_ACCOUNT);
    const token = await Storage.getItem(`${types.USER_ACCOUNT}_TOKEN`);
    if (rawUser !== null && token !== null) {
      try {
        const user = await JSON.parse(rawUser);
        dispatch({ type: types.ACCOUNT_UPDATE_TOKEN, token: token });
        dispatch(updateUser(user));
        dispatch(changeAppRoot('DASHBOARD'));
      } catch (e) {}
    } else {
      dispatch(appActions.changeAppRoot('AUTH'));
    }
  };
}

export function logout() {
  return async (dispatch, getState) => {
    await Storage.removeItem(types.USER_ACCOUNT);
    dispatch({ type: types.LOGOUT });
    dispatch(appActions.changeAppRoot('AUTH'));
  };
}

export function updateProfilePicture(data) {
  return async (dispatch, getState) => {
    const res = await User.updateProfilePicture(data);
    if (res.error === false) {
      dispatch({ type: types.UPDATE_DP, dp: res.dp });
    }
  };
}

export function updateProfile(data) {
  return async (dispatch, getState) => {
    const res = await User.updateProfile(data);
    if (res.error === false) {
      dispatch({ type: types.UPDATE_PROFILE, user: res.user });
    }
  };
}

export function accountError(message) {
  return { type: types.ACCOUNT_ERROR, message };
}

export function updateUser(fields) {
  return { type: types.ACCOUNT_UPDATE_USER, fields };
}

export function clearErrorMessage() {
  return { type: types.ACCOUNT_ERROR, message: undefined };
}

export function clearValidationErrorMessage() {
  return { type: types.CLEAR_ACCOUNT_VALIDATION_ERROR };
}

export function resetValidation() {
  return { type: types.RESET_ACCOUNT_VALIDATION };
}

export function validateAccount(user) {
  return async (dispatch, getState, tracker) => {
    dispatch({ type: types.ACCOUNT_VALIDATION });
    try {
      const res = await validateRecord(user);
      if (res.unique) {
        dispatch({ type: types.ACCOUNT_VALIDATION_SUCCESS });
      } else {
        dispatch({
          type: types.ACCOUNT_VALIDATION_ERROR,
          message: 'Duplicate Record Found!',
        });
      }
    } catch (e) {
      dispatch({
        type: types.ACCOUNT_VALIDATION_ERROR,
        message: 'Unable to validate your Record',
      });
    }
  };
}

export function signUp(user) {
  return async (dispatch, getState, tracker) => {
    dispatch({ type: types.ACCOUNT_REGISTRATION });
    try {
      const re = await accountRegister(user);
      console.log(re);
      dispatch({
        type: types.ACCOUNT_REGISTRATION_SUCCESS,
        message: re.message,
      });
    } catch (e) {
      console.log(e);
      dispatch({
        type: types.ACCOUNT_REGISTRATION_ERROR,
        message: 'Unable to signUp please check your internet connection.',
      });
    }
  };
}

export function followAccount(user) {
  return async (dispatch, getState, extra) => {
    dispatch({ type: types.FOLLOWING_USER });
    try {
      const res = await followUser(user._id);
      dispatch({ type: types.FOLLOWING_USER_SUCCESS, follow: res.follow });
      dispatch(chatActions.refreshFriendsList());
    } catch (e) {
      console.log(e);
    }
  };
}

export function updatePushToken(token) {
  return { type: types.UPDATE_PUSH_TOKEN, token };
}

export function socialLoginAttempt(data) {
  return async dispatch => {
    dispatch({ type: types.SOCIAL_LOGIN });
    try {
      const res = await socialLogin(data);
      dispatch({ type: types.SOCIAL_LOGIN_SUCCESS, res });
    } catch (error) {
      dispatch({ type: types.SOCIAL_LOGIN_ERROR, error });
    }
  };
}

export function checkSocialRecord(data) {
  return async (dispatch, getState, { socket }) => {
    dispatch({ type: types.PRE_SOCIAL_LOGIN, data });
    try {
      const res = await lookupSocialRecord(data);
      dispatch({ type: types.PRE_SOCIAL_LOGIN_SUCCESS, res });
      loginSuccess(res, dispatch, getState, socket);
    } catch (error) {
      dispatch({ type: types.PRE_SOCIAL_LOGIN_ERROR, error });
    }
  };
}

export function login() {
  return async (dispatch, getState, { socket }) => {
    dispatch({ type: types.ACCOUNT_LOGIN });
    const { user } = getState().account;
    if (!user.username || !user.password) {
      dispatch({
        type: types.ACCOUNT_LOGIN_ERROR,
        message: 'Username and password is required.',
      });
      return false;
    }
    try {
      const re = await accountLogin({
        username: user.username,
        password: user.password,
      });
      try {
        const rawUser = await JSON.stringify(re.user);
        await Storage.addItem(types.USER_ACCOUNT, rawUser);
        await Storage.addItem(`${types.USER_ACCOUNT}_TOKEN`, re.token);
        dispatch({ type: types.ACCOUNT_LOGIN_SUCCESS });
        loginSuccess(re, dispatch, getState, socket);
        // socket.emit('login', re.token);
        // dispatch({ type: types.ACCOUNT_UPDATE_TOKEN, token: re.token });
        // updateToken(re.token);
        // dispatch({ type: types.LOADING_FRIENDS_SUGGESTIONS });
        // socket.on('friendsSuggestion', suggestions => {
        //   dispatch({ type: types.FRIENDS_SUGGESTIONS_SUCCESS, suggestions });
        // });
        // updateMobilePushToken(getState().account.pushToken);
        // dispatch(chatActions.init());
        // dispatch(discoverActions.initialize());
        // dispatch(updateUser(re.user));
        // dispatch(appActions.changeAppRoot('DASHBOARD'));
      } catch (e) {
        console.log(e);
      }
      // dispatch(appActions.isLoading(false));
    } catch (e) {
      console.log(e);
      // dispatch(appActions.isLoading(false));
      dispatch({
        type: types.ACCOUNT_LOGIN_ERROR,
        message: 'Unable to login please check your credentials.',
      });
    }
  };
}

function loginSuccess(re, dispatch, getState, socket) {
  socket.emit('login', re.token);
  dispatch({ type: types.ACCOUNT_UPDATE_TOKEN, token: re.token });
  updateToken(re.token);
  dispatch({ type: types.LOADING_FRIENDS_SUGGESTIONS });
  socket.on('friendsSuggestion', suggestions => {
    dispatch({ type: types.FRIENDS_SUGGESTIONS_SUCCESS, suggestions });
  });
  updateMobilePushToken(getState().account.pushToken);
  dispatch(chatActions.init());
  dispatch(discoverActions.initialize());
  dispatch(updateUser(re.user));
  dispatch(appActions.changeAppRoot('DASHBOARD'));
}
