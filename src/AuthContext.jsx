import PropTypes from 'prop-types';
import React, { useMemo, useState, useContext, createContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  const contextValue = useMemo(() => {
    const login = (jwtToken) => {
      setToken(jwtToken);
    };

    const logout = () => {
      setToken(null);
    };

    return { token, login, logout };
  }, [token]);

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
