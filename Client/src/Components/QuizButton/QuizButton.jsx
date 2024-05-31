import React from "react";
import { motion } from "framer-motion";
import "./quizButton.css";

function QuizButton({ label, onClick }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="quiz-button heading--small"
      onClick={onClick}
    >
      {label}
    </motion.button>
  );
}

export default QuizButton;
