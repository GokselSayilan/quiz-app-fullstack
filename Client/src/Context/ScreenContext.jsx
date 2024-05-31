import React, { createContext, useContext, useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";

const ScreenContext = createContext();

export const ScreenProvider = ({ children }) => {
  const isMobile = useMediaQuery({ maxWidth: 500 });
  const isTablet = useMediaQuery({ minWidth: 501, maxWidth: 1200 });
  const isDesktop = useMediaQuery({ minWidth: 1201 });

  const [currentScreen, setCurrentScreen] = useState("desktop");

  useEffect(() => {
    if (isMobile) {
      setCurrentScreen("mobile");
    } else if (isTablet) {
      setCurrentScreen("tablet");
    } else if (isDesktop) {
      setCurrentScreen("desktop");
    }
  }, [isMobile, isTablet, isDesktop]);

  return (
    <ScreenContext.Provider value={{ currentScreen }}>
      {children}
    </ScreenContext.Provider>
  );
};

export const useScreen = () => useContext(ScreenContext);
