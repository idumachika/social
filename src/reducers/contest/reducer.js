import * as types from './actionTypes';
import Immutable from 'seamless-immutable';

const initialState = Immutable({
  contests: [],
  loadingContests: false,
  loadingContestsError: false,
  tmpContest: {},
  savingContest: false,
  savingContestError: null,
});

export default function contest(state = initialState, action = {}) {
  switch (action.type) {
    case types.UPDATE_TMP_CONTEST:
      return state.merge({
        tmpContest: { ...state.tmpContest, ...action.fields },
      });
    case types.CREATING_CONTEST:
      return state.merge({
        savingContest: true,
      });
    case types.CONTEST_CREATED:
      return state.merge({
        savingContest: false,
        tmpContest: {},
        savingContestError: null,
      });
    case types.CREATING_CONTEST_ERROR:
      return state.merge({
        savingContest: false,
        savingContestError: action.error,
      });
    case types.LOADING_CONTESTS:
      return state.merge({
        loadingContests: true,
      });
    case types.LOADING_CONTESTS_ERROR:
      return state.merge({
        loadingContests: false,
        loadingContestsError: true,
      });
    case types.CONTESTS_LOADED:
      return state.merge({
        contests: action.contests,
        loadingContests: false,
        loadingContestsError: false,
      });
    default:
      return state;
  }
}
