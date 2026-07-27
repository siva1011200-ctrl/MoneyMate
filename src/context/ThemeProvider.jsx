import { useState, useEffect } from "react";
import ThemeContext from "./ThemeContext";


function ThemeProvider({ children }) {

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(prev => !prev);
  };


  return (
    <ThemeContext.Provider
      value={{
        darkMode,
        toggleTheme
      }}
    >
      {children}
    </ThemeContext.Provider>
  );

}


export default ThemeProvider;