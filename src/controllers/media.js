import Config from 'react-native-config';
import WebRequest from '../helpers/request';

export const publishMedia = (postId, content) => {
  return WebRequest(
    `/media/post/${postId}`,
    Config.REQUEST_METHOD_POST,
    content,
    true
  );
};

export const getPosMedia = postId => {
  return WebRequest(`/media/post/${postId}`, Config.REQUEST_METHOD_GET);
};
