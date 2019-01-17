import * as types from './actionTypes';

export function init() {
  return (dispatch, getState, extra) => {
    const { socket, tracker } = extra;
    dispatch({ type: types.LOADING_FRIENDS_SUGGESTIONS });
    dispatch({ type: types.LOADING_FRIENDS });
    socket.on('friendsSuggestion', suggestions => {
      dispatch({ type: types.FRIENDS_SUGGESTIONS_SUCCESS, suggestions });
    });
    socket.on('accountFriends', friends => {
      dispatch({ type: types.LOADING_FRIENDS_SUCCESS, friends });
    });

    socket.on('newP2PMessage', ({ msg, usr }) => {
      dispatch({
        type: types.ADD_P2P_MESSAGE,
        message: { ...msg, user: usr },
      });
    });

    socket.on('receivedP2PMessage', ({ messages, accountId }) => {
      dispatch({
        type: types.LOADING_P2P_MESSAGE_SUCCESS,
        messages,
        accountId,
      });
    });
  };
}

export function refreshFriendsList() {
  return (dispatch, getState, extra) => {
    const { socket } = extra;
    const { token } = getState().account;
    socket.emit('refreshAccountFriends', token);
  };
}

export function loadP2PMessage(accountId) {
  return (dispatch, getState, extra) => {
    const { socket, tracker } = extra;
    const { token } = getState().account;
    dispatch({ type: types.LOADING_P2P_MESSAGE });
    socket.emit('loadP2PMessage', { accountId, token });
  };
}

export function sendMessage(message) {
  return (dispatch, getState, extra) => {
    const { socket, tracker } = extra;
    dispatch({ type: types.SENDING_MESSAGE, message });
    socket.emit('sendP2PMessage', message);
  };
}
