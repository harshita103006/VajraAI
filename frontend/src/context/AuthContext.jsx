import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('vajra_api_key') || '');
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('vajra_user') || 'null'); }
    catch { return null; }
  });

  const login = (key, userData) => {
    localStorage.setItem('vajra_api_key', key);
    localStorage.setItem('vajra_user', JSON.stringify(userData));
    setApiKey(key);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('vajra_api_key');
    localStorage.removeItem('vajra_user');
    setApiKey('');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ apiKey, user, login, logout, isAuthed: !!apiKey }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
