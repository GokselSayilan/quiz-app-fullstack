import React, { useEffect, useState } from "react";
import { useTheme } from "../../Context/ThemeContext";
import { motion } from "framer-motion";

import "./toggleBar.css";

function ToggleBar() {
  const { theme, setTheme } = useTheme();
  const [keyPosition, setKeyPosition] = useState("left");

  const changeTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    if (theme === "light") {
      setKeyPosition("left");
    } else setKeyPosition("right");
  }, [theme]);


  return (
    <div className="toggle-bar">
      <img
        src={`assets/icon-sun-${theme}.svg`}
        alt="Sun"
        className="toggle-bar__img"
      />
      <div className="toggle-bar__switch" onClick={changeTheme}>
        <motion.div
          layout
          className={`toggle-bar__key toggle-bar__key--${keyPosition}`}
        ></motion.div>
      </div>
      <img
        src={`assets/icon-moon-${theme}.svg`}
        alt="Moon"
        className="toggle-bar__img"
      />
    </div>
  );
}

export default ToggleBar;
