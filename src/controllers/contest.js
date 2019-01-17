import Config from 'react-native-config';
import WebRequest from '../helpers/request';

export const createContest = contest => {
  return WebRequest('/contests', Config.REQUEST_METHOD_POST, contest, true);
};

export const loadContests = () =>
  WebRequest('/contests', Config.REQUEST_METHOD_GET);
