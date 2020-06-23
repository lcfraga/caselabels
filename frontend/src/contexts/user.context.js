import React, { createContext, Component } from 'react';
import axios from 'axios';
import CONFIG from '../config';

export const UserContext = createContext();

class UserContextProvider extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loggedIn: false,
      id: null,
      name: null,
      error: '',
    };

    axios.defaults.withCredentials = true
    axios.defaults.headers.common['Accept'] = 'application/json'
    axios.defaults.headers.post['Content-Type'] = 'application/json'
  }

  logIn(email, password) {
    axios
      .post(`${CONFIG.BACKEND_API_URL}/users/login`, { email, password })
      .then((response) => {
        this.setState({
          loggedIn: true,
          id: response.data.id,
          name: response.data.name,
          error: '',
        });
      })
      .catch(() => {
        this.setState({
          loggedIn: false,
          id: null,
          name: null,
          error: 'Login failed. Please try again.',
        });
      });
  }

  logOut() {
    axios
      .post(`${CONFIG.BACKEND_API_URL}/users/logout`, {})
      .then(() => {
        this.setState({
          loggedIn: false,
          id: null,
          name: null,
          error: '',
        });
      })
      .catch(() => {
        this.setState({
          loggedIn: false,
          id: null,
          name: null,
          error: 'Logout failed.',
        });
      });
  }

  render() {
    return (
      <UserContext.Provider
        value={{
          ...this.state,
          logIn: (email, password) => this.logIn(email, password),
          logOut: () => this.logOut(),
        }}
      >
        {this.props.children}
      </UserContext.Provider>
    );
  }
}

export default UserContextProvider;
