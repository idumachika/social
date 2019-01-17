import { AsyncStorage } from 'react-native';
import Config from 'react-native-config';

const addItem = async (item, name) => {
  const save = typeof item === 'string' ? item : JSON.stringify(item);
  return await AsyncStorage.setItem(`@${Config.APP_NAME}:${name}`, save);
};

const removeItem = async name =>
  AsyncStorage.removeItem(`@${Config.APP_NAME}:${name}`);
const getItem = async name => {
  const value = await AsyncStorage.getItem(`@${Config.APP_NAME}:${name}`);
  try {
    return await JSON.parse(value);
  } catch (e) {
    return value;
  }
};

export default { addItem, removeItem, getItem };
