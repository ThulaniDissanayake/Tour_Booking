import React, { createContext, useContext, useState, useEffect } from 'react';


const DarkModeContext = createContext();


export const DarkModeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    
    const saved = localStorage.getItem('darkMode');
    return saved === 'true';
  });

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  return (
    <DarkModeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};


export const useDarkMode = () => useContext(DarkModeContext);
