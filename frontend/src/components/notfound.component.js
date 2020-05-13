import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundComponent = () => {
  return (
    <div class="alert alert-warning" role="alert">
      The page was not found. Please return{' '}
      <Link to="/" className="alert-link">
        home
      </Link>
      .
    </div>
  );
};

export default NotFoundComponent;
