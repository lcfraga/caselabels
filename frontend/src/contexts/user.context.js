import React, { createContext, Component } from 'react';
import axios from 'axios';
import CONFIG from '../config';

export const UserContext = createContext();

class UserContextProvider extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loggedIn: false,
      registered: false,
      id: null,
      name: null,
      error: ''
    };

    axios.defaults.withCredentials = true
    axios.defaults.headers.common['Accept'] = 'application/json'
    axios.defaults.headers.post['Content-Type'] = 'application/json'
  }

  resetError() {
    this.setState({ error: '' });
  }

  register(name, email, password) {
    axios
      .post(`${CONFIG.BACKEND_API_URL}/users`, { name, email, password })
      .then((response) => {
        this.setState({
          registered: true,
          error: ''
        });

        setTimeout(() => {
          this.setState({
            registered: false
          })
        }, 3000)
      })
      .catch(() => {
        this.setState({
          registered: false,
          error: 'Registration failed. Please try again.'
        });
      });
  }

  logIn(email, password) {
    axios
      .post(`${CONFIG.BACKEND_API_URL}/sessions`, { email, password })
      .then((response) => {
        this.setState({
          loggedIn: true,
          registered: false,
          id: response.data.data.id,
          name: response.data.data.name,
          error: ''
        });
      })
      .catch(() => {
        this.setState({
          loggedIn: false,
          registered: false,
          id: null,
          name: null,
          error: 'Login failed. Please try again.'
        });
      });
  }

  logOut() {
    axios
      .delete(`${CONFIG.BACKEND_API_URL}/sessions`, {})
      .then(() => {
        this.setState({
          loggedIn: false,
          registered: false,
          id: null,
          name: null,
          error: ''
        });
      })
      .catch(() => {
        this.setState({
          loggedIn: false,
          registered: false,
          id: null,
          name: null,
          error: '',
        });
      });
  }

  render() {
    return (
      <UserContext.Provider
        value={{
          ...this.state,
          resetError: () => this.resetError(),
          register: (name, email, password) => this.register(name, email, password),
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
