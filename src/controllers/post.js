import Config from 'react-native-config';
import WebRequest from '../helpers/request';

export const recentPosts = ({ limit, lastDate }) => {
  return WebRequest('/posts/latest', Config.REQUEST_METHOD_POST, {
    limit,
    lastDate,
  });
};

export const publishPost = post => {
  return WebRequest('/posts', Config.REQUEST_METHOD_POST, post);
};

export const sendPostLikes = data => {
  return WebRequest('/likes', Config.REQUEST_METHOD_POST, data);
};

export const sendComment = data => {
  return WebRequest('/comments', Config.REQUEST_METHOD_POST, data);
};

export const removeComment = data => {
  return WebRequest('/comments', Config.REQUEST_METHOD_DELETE, data);
};

export const latestPosts = lastDate => {
  return WebRequest('/posts/latest/new', Config.REQUEST_METHOD_POST, {
    lastDate,
  });
};
