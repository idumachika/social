import * as types from './actionTypes';
import Immutable from 'seamless-immutable';
import _ from 'lodash';

const initialState = Immutable({
  posts: [],
  loadingPosts: false,
  loadingPostsError: false,
  publishingPost: false,
  publishingPostError: false,
  latestPost: {},
  draftPost: { type: 1 },
  draftMedia: [],
  loadMorePostError: false,
  refreshPostError: false,
  uploadingDraftMedia: false,
  tmpComment: null,
  sendingComment: false,
  sendingLike: false,
  outOfFund: false,
  post: {},
});

let indx = -1; // place holder for content location in array

export default function discover(state = initialState, action = {}) {
  switch (action.type) {
    case types.REFRESH_LATEST_POSTS:
      return state.merge({
        loadingPosts: true,
      });
    case types.REFRESH_LATEST_POSTS_SUCCESS:
      return state.merge({
        loadingPosts: false,
        refreshPostError: false,
        posts: action.posts.concat(state.posts),
      });
    case types.REFRESH_LATEST_POSTS_ERROR:
      return state.merge({
        loadingPosts: false,
        refreshPostError: true,
      });
    case types.LOAD_MORE_POSTS:
      return state.merge({
        loadingPosts: true,
      });
    case types.PUSH_TO_POSTS:
      return state.merge({
        posts: state.posts.concat([action.post]),
      });
    case types.LOAD_MORE_POSTS_ERROR:
      return state.merge({
        loadMorePostError: true,
        loadingPosts: false,
      });
    case types.LOAD_MORE_POSTS_SUCCESS:
      return state.merge({
        loadingPosts: false,
        loadMorePostError: false,
        posts: state.posts.concat(action.posts),
      });
    case types.LOAD_LATEST_POSTS:
      return state.merge({
        loadingPosts: true,
      });
    case types.LOAD_LATEST_POSTS_SUCCESS:
      return state.merge({
        posts: action.posts,
        loadingPosts: false,
      });
    case types.LOAD_LATEST_POSTS_ERROR:
      return state.merge({
        loadingPostsError: action.error,
        loadingPosts: false,
      });
    case types.UPDATE_DRAFT_POST:
      return state.merge({
        draftPost: { ...state.draftPost, ...action.fields },
      });
    case types.PUBLISH_POST:
      return state.merge({
        latestPost: {},
        publishingPost: true,
      });
    case types.PUBLISH_POST_SUCCESS:
      return state.merge({
        latestPost: action.latestPost,
        draftPost: { type: 1 },
        publishingPost: false,
        publishingPostError: false,
      });
    case types.PUBLISH_POST_ERROR:
      return state.merge({
        publishingPostError: action.error,
      });
    case types.UPDATE_DRAFT_MEDIA:
      return state.merge({
        draftMedia: [action.content], //state.draftMedia.concat(action.content),
      });
    case types.GET_POST_MEDIA_SUCCESS:
      indx = _.findIndex(state.posts, { _id: action.postId });
      if (indx === -1) {
        return state;
      }
      return state.updateIn(['posts'], e =>
        e.set(indx, { ...e[indx], media: action.media })
      );
    case types.GET_POST_AUTHOR_SUCCESS:
      indx = _.findIndex(state.posts, { _id: action.postId });
      if (indx === -1) {
        return state;
      }
      return state.updateIn(['posts'], e =>
        e.set(indx, { ...e[indx], authorObj: action.author })
      );
    case types.PUBLISH_DRAFT_MEDIA:
      return state.merge({
        uploadingDraftMedia: true,
      });
    case types.PUBLISH_DRAFT_MEDIA_SUCCESS:
      return state.merge({
        uploadingDraftMedia: false,
        draftMedia: [],
      });
    case types.LIKE_POST:
      return state.merge({
        sendingLike: true,
      });
    case types.POST_LIKE_UPDATE:
      indx = _.findIndex(state.posts, { _id: action.postId });
      if (indx === -1) {
        return state;
      }
      return state.updateIn(['posts'], e =>
        e.set(indx, {
          ...e[indx],
          likes: [...state.posts[indx].likes, action.like],
        })
      );
    case types.LIKE_POST_INSUFFICIENT_FUND:
      return state.merge({
        outOfFund: true,
      });
    case types.MAKE_COMMENT:
      return state.merge({
        sendingComment: true,
      });
    case types.MAKE_COMMENT_SUCCESS:
      return state.merge({
        sendingComment: false,
        tmpComment: null,
      });
    case types.MAKE_COMMENT_ERROR:
      return state.merge({
        sendingComment: false,
      });
    case types.UPDATE_COMMENT_TEXT:
      return state.merge({
        tmpComment: action.text,
      });
    case types.POST_COMMENT_UPDATE:
      indx = _.findIndex(state.posts, { _id: action.postId });
      if (indx === -1) {
        return state;
      }
      return state.updateIn(['posts'], e =>
        e.set(indx, {
          ...e[indx],
          comments: [action.comment, ...state.posts[indx].comments],
        })
      );
    case types.POST_COMMENT_REMOVAL:
      indx = _.findIndex(state.posts, { _id: action.postId });
      if (indx === -1) {
        return state;
      }
      // remove with commentId
      return state.updateIn(['posts'], e =>
        e.set(indx, {
          ...e[indx],
          comments: [
            ...state.posts[indx].comments.filter(
              c => c._id !== action.commentId
            ),
          ],
        })
      );
    default:
      return state;
  }
}
