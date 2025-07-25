import React, { createContext, useContext, useState } from 'react';

// Create the context
export const UserContext = createContext();

// Provider component
export const UserProvider = ({ children }) => {

  const [user, setUser] = useState(() => {
  const storedUser = localStorage.getItem('user');
  return storedUser ? JSON.parse(storedUser) : null;
});

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};


export const useUser = () => useContext(UserContext);