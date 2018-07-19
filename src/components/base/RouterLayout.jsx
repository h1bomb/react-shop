import React from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { Layout } from 'antd';
import { ApolloProvider } from 'react-apollo';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import AuthCompont from './AuthCompont';
import reducer from '../../reducers';
import rootSaga from '../../sagas';
import client from '../../util/client';

const { Footer } = Layout;
const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  reducer,
  applyMiddleware(sagaMiddleware),
);
sagaMiddleware.run(rootSaga);

export default ({ routes }) => (
  <Provider store={store}>
    <ApolloProvider client={client}>
      <Router>
        <Layout className="layout">
          <Switch>
            {routes.map(route => (
              <AuthCompont
                key={route.path}
                isPublic={route.isPublic}
                path={route.path}
                component={route.component}
              />
            ))}
          </Switch>
          <Footer style={{ textAlign: 'center' }}>
          React Shop ©2016 Created by Hbomb
          </Footer>
        </Layout>
      </Router>
    </ApolloProvider>
  </Provider>
);
