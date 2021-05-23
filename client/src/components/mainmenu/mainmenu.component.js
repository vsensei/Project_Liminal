import React from 'react';
import './mainmenu.styles.scss';
import SmallButton from '../shared/small-button/small-button.component';
import { connect } from 'react-redux';

const MainMenu = ({ profile, FlipCard, openAdminCard, isOpened }) => {
  return (
    <div className="mainmenu-cards-container">
      <div className="cards top">
        <div
          className="card lt"
          id="ai"
          onClick={FlipCard}
          style={{ backgroundImage: `url('/images/ai.svg')` }}
        ></div>
        <div
          className="card rt"
          id="broadcast"
          onClick={FlipCard}
          style={{ backgroundImage: `url('/images/broadcast.svg')` }}
        ></div>
        {profile.isadmin ? (
          <SmallButton
            onClick={() => openAdminCard('playlist')}
            isHidden={isOpened}
          />
        ) : null}
      </div>
      <div className="card-center">
        <div className="card-center-icon" />
      </div>
      <div className="cards bottom">
        <div
          className="card lb"
          id="playlist"
          onClick={FlipCard}
          style={{ backgroundImage: `url('/images/playlist.svg')` }}
        ></div>
        <div
          className="card rb"
          id="music"
          onClick={FlipCard}
          style={{ backgroundImage: `url('/images/music.svg')` }}
        ></div>
        {profile.isadmin ? (
          <SmallButton
            onClick={() => openAdminCard('track')}
            isHidden={isOpened}
          />
        ) : null}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  profile: state.user.profile,
});

export default connect(mapStateToProps)(MainMenu);
