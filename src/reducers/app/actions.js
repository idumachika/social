import * as types from './actionTypes';

export function appInitialized() {
  return async function(dispatch, getState) {
    // since all business logic should be inside redux actions
    // this is a good place to put your app initialization code
    dispatch(changeAppRoot('AUTH'));
  };
}

export function changeAppRoot(root) {
  return { type: types.ROOT_CHANGED, root: root };
}

export function updateActiveComponent(componentId) {
  return { type: types.UPDATE_ACTIVE_COMPONENT, componentId };
}

export function toggleMenu() {
  return { type: types.MENU_TOGGLED };
}

export function popScreen() {
  return { type: types.POP_SCREEN };
}

export function socketConnected() {
  return async (dispatch, getState, extra) => {
    const { token } = getState().account;
    const { socket } = extra;
    if (token) {
      socket.emit('backOnline', token);
    }
  };
}

export function login() {
  return async function(dispatch, getState) {
    // login logic would go here, and when it's done, we switch app roots
    dispatch(changeAppRoot('DASHBOARD'));
  };
}
