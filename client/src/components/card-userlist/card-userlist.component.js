import React, { useState, useEffect } from 'react';
import { handleChangeSingle } from '../../utils/utils';
import './card-userlist.styles.scss';
import { Trans } from '@lingui/macro';

const CardUserList = () => {
  const [query, setQuery] = useState('');
  const [searchbarOnTop, setSearchbarOnTop] = useState(false);
  const [userList, setUserList] = useState([]);
  const [searchType, setSearchType] = useState('all');

  useEffect(() => {
    const getUserList = async () => {
      const response = await fetch(
        `http://localhost:3001/getuserlist?` +
          new URLSearchParams({ type: searchType, query }),
        {
          method: 'get',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const newUserList = await response.json();
      setUserList(newUserList);
    };

    getUserList();
  }, [searchType, query]);

  useEffect(() => {
    setSearchbarOnTop(query.length);
  }, [query]);

  const changeRole = (id) => async () => {
    await fetch(`http://localhost:3001/changerole`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
      }),
    });
    setUserList((prevUserList) =>
      prevUserList.map((user) =>
        user.id === id ? { ...user, isadmin: !user.isadmin } : user
      )
    );
  };

  const getNameColor = (isAdmin, subscribed) => {
    if (isAdmin) return 'user admin';
    if (subscribed) return 'user subscribed';
    return 'user';
  };

  return (
    <div className={`card-userlist${searchbarOnTop ? ' searched' : ''}`}>
      <div className="placeholder" />
      <div className="searchbar">
        <div className="searchbar-image">
          <button type="submit" className="searchbar-image-button">
            <img
              src="images/magnifier.svg"
              alt="magnifier"
              width="100%"
              height="100%"
            />
          </button>
        </div>
        <div className="searchbar-query">
          <input type="text" onChange={handleChangeSingle(setQuery)} />
        </div>
      </div>
      <div className={`searchlist${searchbarOnTop ? ' searched' : ''}`}>
        <div className="searchlist-buttons">
          <div
            className={`button${searchType === 'all' ? ' selected' : ''}`}
            onClick={() => setSearchType('all')}
          >
            <Trans>All</Trans>
          </div>
          <div
            className={`button${searchType === 'admin' ? ' selected' : ''}`}
            onClick={() => setSearchType('admin')}
          >
            <Trans>Admins</Trans>
          </div>
          <div
            className={`button${searchType === 'regular' ? ' selected' : ''}`}
            onClick={() => setSearchType('regular')}
          >
            <Trans>Regular</Trans>
          </div>
        </div>
        <div className="searchlist-list">
          <div className="searchlist-users">
            {userList?.map((user, index) => (
              <div className="user-item" key={index}>
                <div>
                  {user.avatar ? (
                    <img
                      src={`http://localhost:3001/getprofileimage/${user.avatar}`}
                      alt="profileimage"
                      width="60px"
                      height="60px"
                    />
                  ) : null}
                </div>
                <div className="user-info">
                  <div className={getNameColor(user.isadmin, user.subscribed)}>
                    {user.first_name} {user.last_name}
                  </div>
                  <div>
                    <i>{user.email}</i>
                  </div>
                </div>
                <div className="user-duration">
                  <div>{user.phone}</div>
                  <div>{user.birth_date}</div>
                </div>
                <div className="user-menu">
                  {user.isadmin ? (
                    <div
                      className="user-menu-item"
                      style={{ backgroundImage: `url('/images/ordinary.svg')` }}
                      onClick={changeRole(user.id)}
                    >
                      <Trans>Make User</Trans>
                    </div>
                  ) : (
                    <div
                      className="user-menu-item"
                      style={{ backgroundImage: `url('/images/admin.svg')` }}
                      onClick={changeRole(user.id)}
                    >
                      <Trans>Make Admin</Trans>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardUserList;
