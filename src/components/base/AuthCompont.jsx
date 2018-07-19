import React, { Component } from 'react';
import { Route, Redirect, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Layout, Menu } from 'antd';
import NProgress from 'nprogress';
import { connect } from 'react-redux';
import { menu } from '../../util/config';
import Logout from '../passport/Logout';
import { REQ_CURUSER } from '../../actions';


const { Header, Content } = Layout;

class AuthCompont extends Component {
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({ type: REQ_CURUSER });
  }

  render() {
    const {
      component: Com, authState, curUser, ...rest
    } = this.props;
    return (
      <Route
        {...rest}
        render={() => (
          <RenderCompont {...rest} authState={authState} curUser={curUser}>
            <Com {...rest} />
          </RenderCompont>
        )}
      />
    );
  }
}
AuthCompont.propTypes = {
  dispatch: PropTypes.func.isRequired,
  component: PropTypes.func.isRequired,
  authState: PropTypes.number.isRequired,
  curUser: PropTypes.instanceOf(Object).isRequired,
};

const MainMenu = ({ menus, curMenus }) => (
  <Menu
    theme="dark"
    mode="horizontal"
    defaultSelectedKeys={[curMenus]}
    style={{ lineHeight: '64px', float: 'left' }}
  >
    {menus.map(menuItem => (
      <Menu.Item key={menuItem.path}>
        <Link to={menuItem.path}>
          {menuItem.title}
        </Link>
      </Menu.Item>
    ))}
  </Menu>
);

MainMenu.propTypes = {
  menus: PropTypes.instanceOf(Array).isRequired,
  curMenus: PropTypes.string.isRequired,
};

const RenderCompont = ({
  location, isPublic, authState, path, curUser, children,
}) => {
  NProgress.start();
  if (authState !== 0) {
    NProgress.done();
  }
  if (isPublic || authState === 1) {
    return (
      <div>
        <Header>
          <img
            alt="logo"
            style={{
              width: 31,
              height: 31,
              float: 'left',
              margin: '16px 24px 16px 0',
            }}
            src="/img/shop.png"
          />
          <MainMenu menus={menu} curMenus={path} />
          <Logout curUser={curUser} />
        </Header>
        <Content
          style={{
            background: '#fff',
            padding: 24,
            margin: 50,
          }}
        >
          {children}
        </Content>
      </div>
    );
  } if (authState === -1) {
    return (
      <Redirect
        to={{
          pathname: '/login',
          state: { from: location },
        }}
      />
    );
  }
  return (
    <p>
Loading...
    </p>
  );
};

RenderCompont.propTypes = {
  location: PropTypes.instanceOf(Object).isRequired,
  isPublic: PropTypes.bool,
  authState: PropTypes.number.isRequired,
  path: PropTypes.string.isRequired,
  curUser: PropTypes.instanceOf(Object).isRequired,
  children: PropTypes.instanceOf(Object).isRequired,
};
RenderCompont.defaultProps = {
  isPublic: false,
};

export default connect(state => state)(AuthCompont);
