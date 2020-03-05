import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from '../screens/home/Home';


class Controller extends Component {

    render() {
        return (
            <Router>
                <div className="main-container">
                  <Route exact path='/' component={Home} />                   
                </div>
            </Router>
        )
    }
}

export default Controller;