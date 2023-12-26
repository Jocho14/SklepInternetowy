import React, { createContext, useContext, useState } from "react";
import { USER_TYPES } from "./UserTypes";

const UserContext = createContext(null);

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    type: USER_TYPES.UNAUTHORIZED,
    details: null,
  });

  const loginUser = (userData, userType) => {
    setUser({ type: userType, details: userData });
  };

  const logoutUser = () => {
    setUser({ type: USER_TYPES.UNAUTHORIZED, details: null });
  };

  return (
    <UserContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};
