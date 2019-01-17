import * as types from './actionTypes';
import {
  recentPosts,
  publishPost,
  latestPosts,
  sendPostLikes,
  sendComment,
  removeComment,
} from '../../controllers/post';
import { publishMedia, getPosMedia } from '../../controllers/media';
import { getUser } from '../../controllers/user';
import Sound from 'react-native-sound';
import _ from 'lodash';
const POST_PER_PAGE = 20;
const likeSound = new Sound('icon_choose.mp3', Sound.MAIN_BUNDLE, error => {});

export function initialize() {
  return async (dispatch, getState, { socket }) => {
    socket.on('newLikeAnnouncement', ({ postId, like }) => {
      dispatch({ type: types.POST_LIKE_UPDATE, postId, like });
    });
    socket.on('newCommentAnnouncement', ({ postId, comment }) => {
      dispatch({ type: types.POST_COMMENT_UPDATE, postId, comment });
    });
    socket.on('removeCommentAnnouncement', ({ postId, commentId }) => {
      dispatch({ type: types.POST_COMMENT_REMOVAL, postId, commentId });
    });
  };
}

export function getRecentPosts() {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: types.LOAD_LATEST_POSTS });
      const posts = await recentPosts({
        limit: POST_PER_PAGE,
        lastDate: '',
      });
      //alert("One:" + JSON.stringify(posts[0]));
      dispatch({ type: types.LOAD_LATEST_POSTS_SUCCESS, posts });
    } catch (error) {
      dispatch({ type: types.LOAD_LATEST_POSTS_ERROR, error });
    }
  };
}

export function getMedia(postId) {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: types.GET_POST_MEDIA, postId });
      const res = await getPosMedia(postId);
      dispatch({ type: types.GET_POST_MEDIA_SUCCESS, media: res, postId });
    } catch (error) {
      dispatch({ type: types.GET_POST_MEDIA_ERROR, error });
    }
  };
}

export function getPostAuthor(postId, authorId) {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: types.GET_POST_AUTHOR, postId, authorId });
      const author = await getUser(authorId);
      dispatch({ type: types.GET_POST_AUTHOR_SUCCESS, author, postId });
    } catch (error) {
      dispatch({ type: types.GET_POST_AUTHOR_ERROR, error });
    }
  };
}

export function sendPost() {
  return async (dispatch, getState) => {
    try {
      const { draftPost, draftMedia } = getState().discover;
      if (draftMedia.length > 0) {
        // CONST 1: text, 2: pictues, 3: video, 4: audio
        draftPost.type = Array.isArray(draftMedia) ? 2 : 3;
      }
      dispatch({ type: types.PUBLISH_POST });
      const res = await publishPost({
        ...draftPost,
        hasMedia: draftMedia.length > 0 ? true : false,
      });
      dispatch({
        type: types.PUBLISH_POST_SUCCESS,
        latestPost: res.post,
      });
      if (draftMedia.length > 0) {
        const erp = {
          ...draftMedia[0],
          myVibe: {
            name: 'file_media',
            filename: draftMedia[0].fileName,
            type: draftMedia[0].fileName.split('.').pop(),
            data: draftMedia[0].file,
          },
        };
        dispatch({
          type: types.PUBLISH_DRAFT_MEDIA,
        });
        const med = await publishMedia(res.post._id, erp);
        dispatch({
          type: types.PUBLISH_DRAFT_MEDIA_SUCCESS,
        });
        //alert(JSON.stringify(med));
        dispatch({
          type: types.PUSH_TO_POSTS,
          post: res.post,
        });
        console.log(res.post);
        //alert("Ret: " + JSON.stringify(res.post));
      }
    } catch (error) {
      alert(error);
      dispatch({ type: types.PUBLISH_POST_ERROR, error });
      //refreshPost();
    }
  };
}

export function updateDraftPost(fields) {
  return { type: types.UPDATE_DRAFT_POST, fields };
}

export function updateDraftMedia(content) {
  return { type: types.UPDATE_DRAFT_MEDIA, content };
}

export function pushToPosts(post) {
  return { type: types.PUSH_TO_POSTS, post };
}

export function refreshPost() {
  return async (dispatch, getState) => {
    if (!getState().discover.loadingPosts) {
      try {
        const { posts } = getState().discover;
        dispatch({ type: types.REFRESH_LATEST_POSTS });
        const fresh = await latestPosts(_.first(posts).createdAt);
        // TODO: put this into consideration when loading more posts
        // avoid duplication on data
        //dispatch({ type: types.DECREMENT_POST_PAGE });
        dispatch({
          type: types.REFRESH_LATEST_POSTS_SUCCESS,
          posts: fresh.posts,
        });
      } catch (error) {
        dispatch({ type: types.REFRESH_LATEST_POSTS_ERROR, error });
      }
    }
  };
}

export function loadMorePosts() {
  return async (dispatch, getState) => {
    if (!getState().discover.loadingPosts) {
      try {
        const { posts } = getState().discover;
        dispatch({ type: types.LOAD_MORE_POSTS });
        const resp = await recentPosts({
          limit: POST_PER_PAGE,
          lastDate: _.last(posts).createdAt,
        });
        dispatch({ type: types.LOAD_MORE_POSTS_SUCCESS, posts: resp });
      } catch (error) {
        dispatch({ type: types.LOAD_LATEST_POSTS_ERROR, error });
      }
    }
  };
}

export function likePost(postId) {
  return async (dispatch, getState, { socket }) => {
    try {
      dispatch({ type: types.LIKE_POST });
      likeSound.play();
      const like = await sendPostLikes({ postId });
      if (!like.code) {
        socket.emit('newPostLike', { postId, like });
        dispatch({ type: types.LIKE_POST_SUCCESS, like });
      } else {
        alert(like.error);
        dispatch({ type: types.LIKE_POST_INSUFFICIENT_FUND });
      }
    } catch (error) {
      dispatch({ type: types.LIKE_POST_ERROR, error });
    }
  };
}

export function updateTmpComment(text) {
  return { type: types.UPDATE_COMMENT_TEXT, text };
}

export function makeComment(postId) {
  return async (dispatch, getState, { socket }) => {
    try {
      const text = getState().discover.tmpComment;
      dispatch({ type: types.MAKE_COMMENT });
      const comment = await sendComment({ text, postId });
      dispatch({ type: types.MAKE_COMMENT_SUCCESS, comment });
      socket.emit('newPostComment', { postId, comment });
    } catch (error) {
      dispatch({ type: types.MAKE_COMMENT_ERROR, error });
    }
  };
}

export function deleteComment(commentId, postId) {
  return async (dispatch, getState, { socket }) => {
    try {
      await removeComment({ commentId });
      dispatch({ type: types.DELETE_COMMENT_SUCCESS, commentId, postId });
      socket.emit('removePostComment', { commentId, postId });
    } catch (error) {
      dispatch({ type: types.DELETE_COMMENT_ERROR, error });
    }
  };
}
