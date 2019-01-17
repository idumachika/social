import Config from 'react-native-config';
import WebRequest from '../helpers/request';
export const accountRegister = user => {
  return WebRequest(
    `/${Config.AUTH_PATH}register`,
    Config.REQUEST_METHOD_POST,
    user,
    true
  );
};

export const followUser = userId => {
  return WebRequest(`/followers`, Config.REQUEST_METHOD_POST, { userId });
};

export const socialLogin = data => {
  return WebRequest(`/auth/social-login`, Config.REQUEST_METHOD_POST, data);
};

export const lookupSocialRecord = data => {
  return WebRequest(`/auth/social-record`, Config.REQUEST_METHOD_POST, data);
};

export const creditWallet = data => {
  return WebRequest(`/wallets`, Config.REQUEST_METHOD_POST, data);
};

export const updateMobilePushToken = token => {
  // we're sending object of toke and os
  return WebRequest('/users/pushtoken', Config.REQUEST_METHOD_PUT, token);
};

export const getUser = userId => {
  WebRequest(`/users/${userId}`, Config.REQUEST_METHOD_GET);
};

export const accountLogin = user => {
  return WebRequest(
    `/${Config.AUTH_PATH}login`,
    Config.REQUEST_METHOD_POST,
    user
  );
};

export const validateRecord = user => {
  return WebRequest(
    `/${Config.AUTH_PATH}validate`,
    Config.REQUEST_METHOD_POST,
    user
  );
};

export const updateProfilePicture = data =>
  WebRequest('/api/profile/dp', REQUEST_METHOD_POST, [{ ...data }]);

export default {
  followUser,
  accountLogin,
  validateRecord,
  updateMobilePushToken,
};
