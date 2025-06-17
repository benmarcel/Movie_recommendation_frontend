// src/components/Layout/Layout.jsx
import React, {  useMemo } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header'; 
// import useTheme from '../hooks/useTheme'; 
// import Alert from '../components/Alert'; 

const Layout = () => {
 
  // const { theme } = useTheme();

  // // Theme toggling using document.documentElement
  // useEffect(() => {
  //   document.documentElement.classList.toggle('dark', theme === 'dark');
  // }, [theme]);



  const mainContentClasses = useMemo(() => `
    pt-20 min-h-screen transition-colors duration-300
    bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white
  `, []);

  

  return (
    <div>
      <Header />
    
      <main className={mainContentClasses}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
