import React, { Component } from 'react';
import { UserContext } from '../contexts/user.context';

class LoginComponent extends Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = { email: '', password: '' };
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.context.logIn(this.state.email, this.state.password);
  };

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-xl-5 col-lg-6 col-md-8 col-sm-10 mx-auto text-center form p-4">
            <h1>Case labels (React)</h1>
            <div className="px-2">
              <form>
                <div className="form-group">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    id="email"
                    name="email"
                    onChange={this.handleChange}
                  />
                </div>

                <div className="form-group">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    id="password"
                    name="password"
                    onChange={this.handleChange}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  onClick={this.handleSubmit}
                >
                  Log in
                </button>
              </form>
            </div>
          </div>
        </div>

        {this.context.error ? (
          <div className="row">
            <div className="col-xl-5 col-lg-6 col-md-8 col-sm-10 mx-auto text-center form p-4">
              <div className="px-2">
                <div className="alert alert-danger" role="alert">
                  {this.context.error}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    );
  }
}

export default LoginComponent;
