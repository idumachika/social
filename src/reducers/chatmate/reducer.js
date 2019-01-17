import * as types from './actionTypes';
import Immutable from 'seamless-immutable';

const initialState = Immutable({
  loadingFriendsSuggestions: false,
  loadingFriends: false,
  loadingP2PMessage: false,
  messages: {},
});

export default function chatmate(state = initialState, action = {}) {
  switch (action.type) {
    case types.LOADING_FRIENDS_SUGGESTIONS:
      return state.merge({
        loadingFriendsSuggestions: true,
      });
    case types.FRIENDS_SUGGESTIONS_SUCCESS:
      return state.merge({
        loadingFriendsSuggestions: false,
        suggestedFriends: action.suggestions,
      });
    case types.LOADING_FRIENDS:
      return state.merge({
        loadingFriends: true,
      });
    case types.LOADING_FRIENDS_SUCCESS:
      return state.merge({
        friends: action.friends,
        loadingFriends: false,
      });
    case types.LOADING_P2P_MESSAGE:
      return state.merge({
        loadingP2PMessage: true,
      });
    case types.LOADING_P2P_MESSAGE_SUCCESS:
      return state
        .updateIn(['messages', [action.accountId]], e =>
          action.messages.reverse().map(m => ({
            text: m.body,
            _id: m._id,
            createdAt: m.createdAt,
            user: m.from,
          }))
        )
        .merge({
          loadingP2PMessage: false,
        });

    case types.SENDING_MESSAGE:
      // action.message.messages[], action.message.to, state.messages
      let old = state.messages[action.message.to._id] || [];
      return state.merge({
        messages: {
          ...state.messages,
          [action.message.to._id]: [...action.message.messages, ...old],
        },
      });
    case types.ADD_P2P_MESSAGE:
      return state.updateIn(['messages', [action.message.user._id]], e =>
        [
          {
            _id: action.message._id,
            text: action.message.body,
            user: action.message.user,
            createdAt: action.message.createdAt,
          },
        ].concat(e)
      );
    default:
      return state;
  }
}
