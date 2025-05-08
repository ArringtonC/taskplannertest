import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from 'react';

interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>(null!);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    const savedToken = localStorage.getItem('token');
    console.log(
      'AuthProvider initialized. Token from localStorage:',
      savedToken ? 'present' : 'missing'
    );
    return savedToken;
  });

  // Debug when token changes
  useEffect(() => {
    console.log('Auth token changed:', token ? 'present' : 'missing');
  }, [token]);

  const login = (newToken: string) => {
    console.log('Logging in with new token');
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    console.log('Logging out, removing token');
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
