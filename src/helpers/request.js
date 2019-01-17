import Config from 'react-native-config';
import RNFetchBlob from 'rn-fetch-blob';
import { Alert } from 'react-native';
import _ from 'lodash';
let requestToken;
const SERVER_URL = Config.SERVER_URL;
const Request = async (path, method, payload, multi_part) => {
  let body;
  if (multi_part) {
    body = _.map(
      payload,
      (data, name) => (typeof data === 'object' ? { ...data } : { name, data })
    );
  } else {
    body = payload;
  }
  if (
    ![
      Config.REQUEST_METHOD_DELETE,
      Config.REQUEST_METHOD_POST,
      Config.REQUEST_METHOD_PUT,
      Config.REQUEST_METHOD_GET,
    ].includes(method)
  ) {
    console.log('Invalid Request Method');
    throw `Invalid Request Method ${method}`;
  }
  
  try {
    const auth = requestToken
      ? { Authorization: `Bearer ${requestToken}` }
      : {};
    const response = await RNFetchBlob.fetch(
      method,
      SERVER_URL + path,
      {
        ...auth,
        'Content-Type': multi_part ? 'multipart/form-data' : 'application/json',
      },
      multi_part ? body : JSON.stringify(body)
    );
    if (response.respInfo.status === 200) {
      return await response.json();
    } else if (response.respInfo.status === 401) {
      throw 'Unauthorized Request';
    } else {
      console.log('Error in response', path, response.text());
      throw `Invalid server response for route ${path}.`;
    }
  } catch (e) {
    console.log(e, Config.SERVER_URL + path);
    if (e.message) {
      Alert.alert('Internet Connection', e.message);
    }
    throw e;
  }
};

export default Request;

export const updateToken = token => (requestToken = token);
