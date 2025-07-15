// This pattern is called a Protected Route Wrapper in React. It ensures that only logged-in users can access certain pages/components in your app. Let's go step by step through what your code is doing and why it's useful.
// This code is a React component that acts as a wrapper for user authentication. It checks if a user is logged in before allowing access to the children components. If the user is not logged in, it redirects them to the login page.
// This is useful for protecting routes in your application, ensuring that only authenticated users can access certain parts of your app, such as user profiles or dashboards.

import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/user.context';

const UserAuth = ({ children }) => {
  const { user: loginUser } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token || !loginUser) {
      navigate('/login');
    } else {
      setLoading(false);
    }
  }, [loginUser, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default UserAuth;
