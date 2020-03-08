import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from '../screens/home/Home';
import Profile from '../screens/profile/Profile';
import Details from '../screens/details/Details';
import Checkout from '../screens/checkout/Checkout';

class Controller extends Component {

    render() {
        return (
            <Router>
                <div className="main-container">
                    <Route exact path='/' component={Home} />
                    <Route path='/profile' component={Profile} />
                    <Route path='/restaurant/:id' component={Details} />
                    <Route path='/checkout' component={Checkout} />
                </div>
            </Router>
        )
    }
}

export default Controller;