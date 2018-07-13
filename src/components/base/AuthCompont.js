import React, {Component} from "react";
import { Route, Redirect, Link } from "react-router-dom";
import { menu } from "../../util/config";
import Logout from "../passport/Logout";
import { Layout, Menu } from "antd";
import NProgress from 'nprogress';
import {REQ_CURUSER} from '../../actions'
import { connect } from 'react-redux'


const { Header, Content } = Layout;

class AuthCompont extends Component {
  componentWillMount() {
    this.props.dispatch({type: REQ_CURUSER});
  }
  render() {
    const { component: Component, authState,curUser,...rest} = this.props;
    console.log(rest)

    return (
      <Route
        
        render={() => (
          <RenderCompont {...rest} authState={authState} curUser={curUser}>
            <Component {...rest} />
          </RenderCompont>
        )}
      />
    );
  }
}

// const AuthCompont = ({ component: Component, ...rest, authState,curUser, dispatch  }) => {
//   if(authState === 0) {
//     dispatch({type: REQ_CURUSER});
//   }
//   return (
//     <Route
//       {...rest}
//       render={() => (
//         <RenderCompont {...rest} authState={authState} curUser={curUser}>
//           <Component {...rest} />
//         </RenderCompont>
//       )}
//     />
//   );
// };

const MainMenu = ({ menus, curMenus }) => (
  <Menu
    theme="dark"
    mode="horizontal"
    defaultSelectedKeys={[curMenus]}
    style={{ lineHeight: "64px", float: "left" }}
  >
    {menus.map(menu => (
      <Menu.Item key={menu.path}>
        <Link to={menu.path}>{menu.title}</Link>
      </Menu.Item>
    ))}
  </Menu>
);

const RenderCompont = ({location,isPublic,authState,path,curUser,children}) => {
    NProgress.start();
    if(authState !== 0) {
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
                float: "left",
                margin: "16px 24px 16px 0"
              }}
              src="/img/shop.png"
            />
            <MainMenu menus={menu} curMenus={path} />
            <Logout curUser={curUser} />
          </Header>
          <Content
            style={{
              background: "#fff",
              padding: 24,
              margin: 50
            }}
          >
            {children}
          </Content>
        </div>
      );
    } else if (authState === -1) {
      return (
        <Redirect
          to={{
            pathname: "/login",
            state: { from: location }
          }}
        />
      );
    } else {
      return <p>Loading...</p>;
    }
  }

export default connect(state=>state)(AuthCompont);
