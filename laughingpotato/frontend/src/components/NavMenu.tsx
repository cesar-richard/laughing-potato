import React, {lazy} from 'react';
import {Menu} from 'semantic-ui-react';
import {useNavigate} from 'react-router';
import SessionContext from '@sparkle/utils/SessionContext';

const UserInfo = lazy(() => import('@sparkle/components/UserInfo'));

const NavMenu = () => {
  const [activeItem, setActiveItem] = React.useState('Home');
  const navigate = useNavigate();
  const {user} = React.useContext(SessionContext);
  const handleItemClick = (e, {name, url}) => {
    setActiveItem(name);
    navigate(`/${url}`.replace('//', '/'));
  };
  return (
    <Menu stackable>
      <Menu.Item
        name="Home"
        url="/"
        icon="home"
        active={activeItem === 'Home'}
        onClick={handleItemClick}
      />
      {user !== null && (
        <Menu.Item
          name="Mes commandes"
          url="/orders"
          icon="cart"
          active={activeItem === 'Mes commandes'}
          onClick={handleItemClick}
        />
      )}
      {user !== null && (user.is_staff || user.is_superuser) && (
        <Menu.Item
          name="Admin"
          url="/admin/"
          icon="wrench"
          onClick={() => {
            window.location.href = `${process.env.LAUGHINGPOTATO_BASE_URL}/admin/`;
          }}
        />
      )}
      <Menu.Menu position="right">
        <UserInfo />
      </Menu.Menu>
    </Menu>
  );
};

export default NavMenu;
