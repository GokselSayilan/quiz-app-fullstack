import React, { useEffect, useState } from "react";
import { useQuiz } from "../../Context/QuizContext";
import { AnimatePresence, motion } from "framer-motion";

import "./option.css";

function Option({ char, option }) {
  const {
    selectedOption,
    setSelectedOption,
    setSelectedOptionId,
    isSubmit,
    isCorrect,
  } = useQuiz();

  const [isHover, setIsHover] = useState(false);
  const [optionClass, setOptionClass] = useState("idle");

  // handleHover
  useEffect(() => {
    if (isHover) setOptionClass((prev) => (prev === "idle" ? "hover" : prev));
    else setOptionClass((prev) => (prev === "hover" ? "idle" : prev));
  }, [isHover]);

  // handleSelectedOption
  useEffect(() => {
    setOptionClass(() => (selectedOption === char ? "active" : "idle")); // eslint-disable-next-line
  }, [selectedOption]);

  useEffect(() => {
    if (isSubmit && selectedOption === char && isCorrect)
      setOptionClass("correctly");
    if (isSubmit && selectedOption === char && !isCorrect)
      setOptionClass("incorrectly"); // eslint-disable-next-line
  }, [isSubmit]);

  const handleOptionClick = () => {
    setSelectedOption(char);
    setSelectedOptionId(option.option_id);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`option option--${optionClass} bg--secondary item--shadow`}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onClick={isSubmit ? null : handleOptionClick}
    >
      <div className={`option__label label--${optionClass} heading--small`}>
        {char}
      </div>
      <AnimatePresence mode="wait">
        <motion.h5
          key={option.option_id}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 30 }}
          transition={{ duration: 0.15 }}
          className="option__text body--small text--medium text--primary"
        >
          <span>{option.option_text}</span>
          {isSubmit && selectedOption === char && !isCorrect && (
            <img src="assets/icon-error.svg" alt="wrong" className="option__icon"/>
          )}
          {isSubmit && option.is_correct && (
            <img src="assets/icon-correct.svg" alt="true" className="option__icon" />
          )}
        </motion.h5>
      </AnimatePresence>
    </motion.div>
  );
}

export default Option;
