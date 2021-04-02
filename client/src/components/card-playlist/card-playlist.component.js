import React, { useEffect } from 'react';
import Track from '../track/track.component';
import './card-playlist.styles.scss';

const CardPlaylist = ({ changedCards, setSrc, playlist, setPlaylist }) => {
  const playTrack = (id, index) => {
    setSrc(`http://localhost:3001/tracks/${id}`);
    deleteFromPlaylist(index);
  };

  const deleteFromPlaylist = (index) => {
    setPlaylist(
      playlist.filter((el, ind) => {
        return ind !== index;
      })
    );
  };
  /*
  useEffect(() => {
    const getTrackList = async () => {
      try {
        const res = await fetch(`http://localhost:3001/gettracklist`);
        const data = await res.json();
        setTrackList(data);
      } catch (error) {
        console.log(error);
      }
    };

    getTrackList();
  }, []);*/

  return (
    <div className="card-playlist">
      <div className="card-big-table">
        {playlist?.map((track, index) => (
          <Track
            track={track}
            index={index}
            playTrack={playTrack}
            deleteFromPlaylist={deleteFromPlaylist}
          />
        ))}
      </div>
      <div className={`card-big-blur${changedCards ? ' disabled' : ''}`} />
    </div>
  );
};

export default CardPlaylist;
