import * as types from './actionTypes';
import { createContest, loadContests } from '../../controllers/contest';
export function init() {
  return (dispatch, getState, extra) => {};
}

export function updateTmpContest(fields) {
  return { type: types.UPDATE_TMP_CONTEST, fields };
}

export function getContests() {
  return async dispatch => {
    try {
      dispatch({ type: types.LOADING_CONTESTS });
      const contests = await loadContests();
      //alert(JSON.stringify(contests));
      dispatch({ type: types.CONTESTS_LOADED, contests });
    } catch (error) {
      dispatch({ type: types.LOADING_CONTESTS_ERROR, error });
    }
  };
}

export function startContest() {
  return async (dispatch, getState) => {
    const { tmpContest } = getState().contest;
    //alert(JSON.stringify(tmpContest));
    try {
      dispatch({ type: types.CREATING_CONTEST });
      //console.log(tmpContest);
      const res = await createContest(tmpContest);
      //console.log(res);
      if(res.message) {
        alert(res.message);
        dispatch({ type: types.CREATING_CONTEST_ERROR, error: res.message });
        return;
      }
      dispatch({ type: types.CONTEST_CREATED });
    } catch (error) {
      dispatch({ type: types.CREATING_CONTEST_ERROR, error });
    }
  };
}
