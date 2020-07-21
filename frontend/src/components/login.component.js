import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../contexts/user.context';

class LoginComponent extends Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = { email: '', password: '' };
  }

  componentDidMount() {
    this.context.resetError();
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
        <div className="mx-auto text-center ">
          <h1>Case labels (React)</h1>
        </div>
        <div className="row pt-5">
          <div className="col-6 mx-auto text-center form">
            <form>
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                id="email"
                name="email"
                onChange={this.handleChange}
              />

              <input
                type="password"
                className="form-control"
                placeholder="Password"
                id="password"
                name="password"
                onChange={this.handleChange}
              />

              <button
                type="submit"
                className="btn btn-primary btn-block"
                onClick={this.handleSubmit}
              >
                Log in
                </button>

              <hr />

              <Link to="/register" className="btn btn-secondary btn-block">
                Register
              </Link>
            </form>
          </div>
        </div>

        {this.context.error &&
          <div className="row pt-4">
            <div className="col-6 mx-auto text-center form">
              <div className="alert alert-danger" role="alert">
                {this.context.error}
              </div>
            </div>
          </div>
        }

        {this.context.registered &&
          <div className="row pt-4">
            <div className="col-6 mx-auto text-center form">
              <div className="alert alert-success" role="alert">
                Registration succeeded. Please log in.
              </div>
            </div>
          </div>
        }

      </div>
    );
  }
}

export default LoginComponent;
