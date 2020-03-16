import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Checkout from '../screens/checkout/Checkout';
import Details from '../screens/details/Details';
import Home from '../screens/home/Home';
import Profile from '../screens/profile/Profile';
import { Redirect } from 'react-router';

class Controller extends Component {
  /*baseUrl to pass it on to other components in router*/
  constructor() {
    super();
    this.baseUrl = "http://localhost:8080/api";
  }

  render() {
    return (
      <Router>
        <div className="main-container">
          <Route exact path='/' render={(props) => <Home {...props} baseUrl={this.baseUrl} />} />
          <Route exact path='/profile' render={(props) => <Profile {...props} baseUrl={this.baseUrl} />} />
          <Route exact path='/restaurant/:restaurantID' render={(props) => <Details {...props} baseUrl={this.baseUrl} />} />
          <Route exact path='/checkout' render={(props) => (sessionStorage.getItem('access-token') !== null
            && props.location.state ? <Checkout {...props} baseUrl={this.baseUrl} /> : <Redirect to='/' />)} />
        </div>
      </Router>
    )
  }
}

export default Controller;
