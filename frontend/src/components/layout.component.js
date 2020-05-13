import React, { useContext } from 'react';
import CaseLabelComponent from './caselabel.component';
import { UserContext } from '../contexts/user.context';

const LayoutComponent = () => {
  const { name, logOut } = useContext(UserContext);

  return (
    <div className="container">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <span className="navbar-text">Logged in as: {name}</span>
          </li>
          <li className="nav-item">
            <button
              type="button"
              className="btn btn-link nav-link"
              onClick={logOut}
            >
              Log out
            </button>
          </li>
        </ul>
      </nav>
      <CaseLabelComponent />
    </div>
  );
};

export default LayoutComponent;
