import React from 'react';
import './player.styles.scss';
import { connect } from 'react-redux';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { playNextTrack, changePlayingState } from 'redux/music/music.actions';

const Player = ({
  src,
  playNextTrack,
  changePlayingState,
  playerRef,
  user,
  suggestedPoints,
}) => {
  const volumeControl = (e) => {
    if (suggestedPoints) {
      const volume = suggestedPoints.reduce((acc, point) => {
        if (
          e.target.currentTime >= point.start &&
          e.target.currentTime < point.end
        )
          return ((point.end - e.target.currentTime) * 0.07 + 0.3).toFixed(2);
        return acc;
      }, 0);
      e.target.volume = volume ? volume : 1;
    }
  };

  const handlePlayingState = (playingState) => () => {
    changePlayingState(playingState);
  };

  return (
    <div className={`player-container${user ? ' opened' : ''}`}>
      {user ? (
        <div className="player">
          <AudioPlayer
            id="audio"
            ref={playerRef}
            src={src}
            loop={false}
            preload="none"
            autoplay="false"
            customVolumeControls={[]}
            customAdditionalControls={[]}
            showJumpControls={false}
            defaultCurrentTime=""
            defaultDuration=""
            onEnded={playNextTrack}
            onPlay={handlePlayingState(true)}
            onPause={handlePlayingState(false)}
            onListen={volumeControl}
            listenInterval={200}
          ></AudioPlayer>
        </div>
      ) : null}
    </div>
  );
};

const mapStateToProps = (state) => ({
  src: state.music.src,
  suggestedPoints: state.music.currentTrack.suggestedPoints,
  isPlaying: state.music.isPlaying,
  user: state.user.user,
});

const mapDispatchToProps = (dispatch) => ({
  playNextTrack: () => dispatch(playNextTrack()),
  changePlayingState: (isPlaying) => dispatch(changePlayingState(isPlaying)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Player);
