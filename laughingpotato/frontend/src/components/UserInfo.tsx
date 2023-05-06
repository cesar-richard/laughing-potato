import React, {useContext, useEffect, useState} from 'react';
import {Menu} from 'semantic-ui-react';
import SessionContext from '@sparkle/utils/SessionContext';
import {useLocation, useNavigate} from 'react-router';

const UserInfo = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [authLink, setAuthLink] = useState('');
  const {updateUser, user} = useContext(SessionContext);
  const authlinkUrl = `${process.env.LAUGHINGPOTATO_BASE_URL}/oauth/authlink`;
  const userInfosUrl = `${process.env.LAUGHINGPOTATO_BASE_URL}/api/me/`;
  const location = useLocation();
  useEffect(() => {
    fetch(userInfosUrl)
      .then((response) => {
        if (response.status === 200) {
          response.json().then((validResponse) => {
            updateUser(validResponse.results[0]);
            if (localStorage.getItem('redirect') !== null) {
              const url = localStorage.getItem('redirect');
              localStorage.removeItem('redirect');
              navigate(url);
            }
            setLoading(false);
          });
        } else {
          if (location.pathname !== '/') {
            localStorage.setItem('redirect', location.pathname);
            navigate('/');
          }
          fetch(authlinkUrl)
            .then((response2) => response2.json())
            .then((response2) => {
              setAuthLink(response2.link);
              setLoading(false);
            });
        }
      });
  }, []);

  if (loading) {
    return <Menu.Item>Loading...</Menu.Item>;
  }

  if (user !== null) {
    return (
      <>
        <Menu.Item
          onClick={() => {
          }}
          icon="user"
          name={user.full_name}
        />
        <Menu.Item
          name="Déconnexion"
          icon="sign out"
          onClick={() => {
            window.location.href = `${process.env.LAUGHINGPOTATO_BASE_URL}/oauth/logout`;
          }}
        />
      </>
    );
  }

  return (
    <Menu.Item
      name="Connexion"
      icon="sign in"
      onClick={() => {
        window.location.href = authLink;
      }}
    />
  );
};

export default UserInfo;
