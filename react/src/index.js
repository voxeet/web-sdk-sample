import React from 'react';
import ReactDOM from 'react-dom';

import ConferenceContainer from './conference/ConferenceContainer.js';

require('./styles/index.less');

ReactDOM.render(
  <ConferenceContainer />,
  document.getElementById('app')
);
