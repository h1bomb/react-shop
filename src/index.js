import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import RouterLayout from './components/base/RouterLayout';
import { routes } from './util/config';

ReactDOM.render(<RouterLayout routes={routes} />,
  document.getElementById('root'));
registerServiceWorker();
