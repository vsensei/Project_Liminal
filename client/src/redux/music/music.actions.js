import MusicActionTypes from './music.types';

export const addTrackToPlaylistStart = (track) => ({
  type: MusicActionTypes.ADD_TRACK_TO_PLAYLIST_START,
  payload: track,
});

export const addTrackToPlaylistEnd = (track) => ({
  type: MusicActionTypes.ADD_TRACK_TO_PLAYLIST_END,
  payload: track,
});

export const playTrack = (track, index) => ({
  type: MusicActionTypes.PLAY_TRACK,
  payload: {
    track,
    index,
  },
});

export const changePlayingState = (playingState) => ({
  type: MusicActionTypes.CHANGE_PLAYING_STATE,
  payload: playingState,
});

export const playNextTrack = () => ({
  type: MusicActionTypes.PLAY_NEXT_TRACK,
});

export const playRadio = () => ({
  type: MusicActionTypes.PLAY_RADIO,
});

export const emptySrc = () => ({
  type: MusicActionTypes.EMPTY_SRC,
});

export const deleteFromPlaylist = (index) => ({
  type: MusicActionTypes.DELETE_FROM_PLAYLIST,
  payload: index,
});
