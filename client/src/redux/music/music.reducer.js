import MusicActionTypes from './music.types';
import {
  addTrackToPlaylistStart,
  addTrackToPlaylistEnd,
  playTrack,
  deleteFromPlaylist,
  playNextTrack,
  playRadio,
  copyTrackFromPlaylistToPrevPlaylist,
} from './music.utils';

const INITIAL_STATE = {
  src: '',
  currentTrack: {},
  playlist: [],
  prevPlaylist: [],
  isPlaying: false,
};

const musicReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case MusicActionTypes.ADD_TRACK_TO_PLAYLIST_START:
      return {
        ...state,
        playlist: addTrackToPlaylistStart(state.playlist, action.payload),
      };

    case MusicActionTypes.ADD_TRACK_TO_PLAYLIST_END:
      return {
        ...state,
        playlist: addTrackToPlaylistEnd(state.playlist, action.payload),
      };

    case MusicActionTypes.PLAY_TRACK:
      return {
        ...state,
        src: playTrack(action.payload.track.id),
        currentTrack: action.payload.track,
        prevPlaylist: [action.payload.track],
        playlist: deleteFromPlaylist(state.playlist, action.payload.index),
      };

    case MusicActionTypes.PLAY_NEXT_TRACK:
      return state.playlist.length > 0
        ? {
            ...state,
            prevPlaylist: copyTrackFromPlaylistToPrevPlaylist(
              state.prevPlaylist,
              state.playlist
            ),
            currentTrack: state.playlist[0],
            src: playNextTrack(state.playlist),
            playlist: deleteFromPlaylist(state.playlist, 0),
          }
        : { ...state };

    case MusicActionTypes.PLAY_RADIO:
      return {
        ...state,
        src: playRadio(),
      };

    case MusicActionTypes.EMPTY_SRC:
      return {
        ...state,
        src: '',
      };

    case MusicActionTypes.CHANGE_PLAYING_STATE:
      return {
        ...state,
        isPlaying: action.payload,
      };

    case MusicActionTypes.DELETE_FROM_PLAYLIST:
      return {
        ...state,
        playlist: deleteFromPlaylist(state.playlist, action.payload),
      };

    default:
      return state;
  }
};

export default musicReducer;
