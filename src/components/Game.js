import React, { Component } from 'react';
import { connect } from 'react-redux';
import ScoreBoard from './ScoreBoard';
import Board from "./Board";
import ButtonBar from './ButtonBar';

class Game extends Component {

    render() {
        return <div className="captureGame" align="center">          
            <ScoreBoard/>
            <Board/>
            <ButtonBar/>
        </div>
    }

}

export default connect()(Game);