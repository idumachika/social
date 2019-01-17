import * as types from './actionTypes';
import Immutable from 'seamless-immutable';
import { Navigation } from 'react-native-navigation';
const initialState = Immutable({
  root: undefined, // 'login' / 'after-login'
  menuOpened: false,
  activeComponent: 'main',
});

export default function app(state = initialState, action = {}) {
  switch (action.type) {
    case types.ROOT_CHANGED:
      return state.merge({
        root: action.root,
      });
    case types.UPDATE_ACTIVE_COMPONENT:
      return state.merge({
        activeComponent: action.componentId,
      });
    case types.MENU_TOGGLED:
      Navigation.mergeOptions(state.activeComponent, {
        sideMenu: {
          left: {
            visible: true,
          },
        },
      });
      return state;
    case types.POP_SCREEN:
      Navigation.pop(state.activeComponent).catch(() => null);
      return state;
    default:
      return state;
  }
}
