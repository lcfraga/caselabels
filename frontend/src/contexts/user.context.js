import React, { createContext, Component } from 'react';
import axios from 'axios';
import CONFIG from '../config';

export const UserContext = createContext();

class UserContextProvider extends Component {
  state = {
    loggedIn: false,
    id: null,
    name: null,
  };

  setAuthorizationHeader(token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  componentDidMount() {
    const token = localStorage.getItem('token');
    const userJson = localStorage.getItem('user');
    const user = JSON.parse(userJson);

    if (!!token && !!user) {
      this.setState({
        loggedIn: true,
        id: user.id,
        name: user.name,
        error: '',
      });
    }

    this.setAuthorizationHeader(token);
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

        localStorage.setItem('token', response.data.token);

        const userJson = JSON.stringify({
          id: response.data.id,
          name: response.data.name,
        });

        localStorage.setItem('user', userJson);

        this.setAuthorizationHeader(response.data.token);
      })
      .catch((error) => {
        this.setState({
          loggedIn: false,
          id: null,
          name: null,
          error: 'Login failed. Please try again.',
        });
      });
  }

  logOut() {
    this.setState({
      loggedIn: false,
      id: null,
      name: null,
      error: '',
    });

    localStorage.removeItem('token');
    localStorage.removeItem('user');

    this.setAuthorizationHeader('');
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
