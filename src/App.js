import React from 'react';
import Game from './components/Game';
import styled from 'styled-components';
import './App.css';


import {Provider} from 'react-redux';
import {createStore} from 'redux';
import { initialState, captureReducer } from './reducers/captureReducer';


const store = createStore(captureReducer, initialState);

const App = () => {
  return (
    <Provider store={store}>
      <Game />
    </Provider>
  );
}

export default styled(App)`
  font-family: Courier New, Courier, monospace;
  margin: 0 auto;
  width: 200px;
`;
 