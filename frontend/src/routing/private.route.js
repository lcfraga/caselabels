import React, { Component, useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { UserContext } from '../contexts/user.context';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { loggedIn } = useContext(UserContext);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (loggedIn) {
          return <Component {...props} />;
        } else {
          return <Redirect to="/login" />;
        }
      }}
    />
  );
};

export default PrivateRoute;
