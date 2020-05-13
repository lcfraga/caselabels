import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LayoutComponent from './components/layout.component';
import NotFoundComponent from './components/notfound.component';
import UserContextProvider, { UserContext } from './contexts/user.context';
import LoginComponent from './components/login.component';
import PrivateRoute from './routing/private.route';
import AuthRoute from './routing/auth.route';

export default class App extends Component {
  render() {
    return (
      <div className="container">
        <UserContextProvider>
          <Router>
            <Switch>
              <PrivateRoute exact path="/" component={LayoutComponent} />
              <AuthRoute path="/login" component={LoginComponent} />
              <Route path="*" component={NotFoundComponent} />
            </Switch>
          </Router>
        </UserContextProvider>
      </div>
    );
  }
}
