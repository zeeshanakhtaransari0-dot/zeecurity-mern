import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("zeec_user");
      return raw && raw !== "undefined" ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) localStorage.setItem("zeec_user", JSON.stringify(user));
    else localStorage.removeItem("zeec_user");
  }, [user]);

  const login = (payload) => {
    // payload example: { role: "guard" } or { role: "resident", name, flatNumber }
    setUser(payload);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}