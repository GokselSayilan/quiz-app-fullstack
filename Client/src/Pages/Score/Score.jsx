import React from "react";
import QuizButton from "../../Components/QuizButton/QuizButton";
import {motion} from 'framer-motion'

import "./score.css";
import { useQuiz } from "../../Context/QuizContext";

function Score() {
  const {
    score,
    questions,
    selectedQuiz,
    handleRestart
  } = useQuiz();


  if (score === null || questions === null) {
    return <div className="heading--large text--primary">Loading...</div>;
  }

  return (
    <motion.div animate={{opacity:[0,1],y:[50,0]}}  transition={{duration:0.5}} className="score">
      <h2 className="score__text heading--large text--primary text--light">
        Quiz completed
        <br />
        <span className="text--medium">You scored...</span>
      </h2>
      <div>
        <div className="score-value__container bg--secondary item--shadow">
          <div className="score__test">
            <img
              src={selectedQuiz.icon}
              alt="test icon"
              className="score__test-icon"
            />
            <h5 className="score__test-name heading--small text--primary">
              {selectedQuiz.title}
            </h5>
          </div>
          <h1 className="score__value heading--xlarge text--primary">
            {score}
          </h1>
          <p className="score__value-label body--medium text--secondary">
            out of {questions.length}
          </p>
        </div>
        <QuizButton label="Play Again" onClick={handleRestart} />
      </div>
    </motion.div>
  );
}

export default Score;
