import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { UserContext } from '../contexts/user.context';

class RegisterComponent extends Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = { name: '', email: '', password: '' };
  }

  componentDidMount() {
    this.context.resetError();
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.context.register(this.state.name, this.state.email, this.state.password);
  };

  render() {
    if (this.context.registered) {
      return <Redirect to="/login" />
    } else {
      return (
        <div className="container">
          <div className="mx-auto text-center ">
            <h1>Case labels (React)</h1>
          </div>
          <div className="row pt-5">
            <div className="col-6 mx-auto text-center form">
              <form>
                <input
                  type="name"
                  className="form-control"
                  placeholder="Name"
                  id="name"
                  name="name"
                  onChange={this.handleChange}
                />

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
                  Register
                </button>

                <hr />

                <Link to="/login" className="btn btn-secondary btn-block">
                  Log in
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
        </div>
      );
    }
  }
}

export default RegisterComponent;
