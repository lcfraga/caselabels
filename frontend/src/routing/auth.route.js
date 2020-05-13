import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { UserContext } from '../contexts/user.context';

const AuthRoute = ({ component: Component, ...rest }) => {
  const { loggedIn } = useContext(UserContext);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (loggedIn) {
          return <Redirect to="/" />;
        } else {
          return <Component {...props} />;
        }
      }}
    />
  );
};

export default AuthRoute;
