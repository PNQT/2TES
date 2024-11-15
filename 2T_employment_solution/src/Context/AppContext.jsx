import { createContext, useEffect, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext();

// eslint-disable-next-line react/prop-types
export default function AppProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);

  // Fetch user data if token exists
  useEffect(() => {
    // If there is a token, try to fetch user data
    async function getUser() {
      try {
        const res = await fetch("http://localhost:8000/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          setUser(null); // Reset user if token is invalid
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null); // Reset user if there's an error
      }
    }

    // Only fetch user data if there's a token
    if (token) {
      getUser();
    } else {
      setUser(null); // Reset user if token is absent
    }
  }, [token]); // Runs when the token changes

  return (
    <AppContext.Provider value={{ token, setToken, user, setUser }}>
      {children}
    </AppContext.Provider>
  );
}
