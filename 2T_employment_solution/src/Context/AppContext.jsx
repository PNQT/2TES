import { createContext, useEffect, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext();

// eslint-disable-next-line react/prop-types
export default function AppProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [user_id, setUser_id] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Trạng thái tải

  useEffect(() => {
    async function getUser() {
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:8000/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
          setUser_id(data.user_id);
        } else {
          setUser(null);
          localStorage.removeItem("token");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    getUser();
  }, [token]);

  return (
    <AppContext.Provider value={{ token, setToken, user, setUser, isLoading ,user_id }}>
      {children}
    </AppContext.Provider>
  );
}
