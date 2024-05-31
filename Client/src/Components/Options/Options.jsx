import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {motion} from 'framer-motion'

import QuizButton from "../QuizButton/QuizButton";
import Option from "../Option/Option";

import "./options.css";
import { useQuiz } from "../../Context/QuizContext";

function Options({ options }) {
  const {
    isSubmit,
    setIsSubmit,
    questionIndex,
    setQuestionIndex,
    questions,
    isFinish,
    setIsFinish,
    selectedOption,
    setSelectedOption,
    selectedOptionId,
    setSelectedOptionId,
    setScore,
    isAnswered,
    setIsAnswered,
    setIsCorrect,
  } = useQuiz();

  const navigate = useNavigate();
  // Restart ile puanlama durumlari, options durumlari vs. tum state ler eski haline cevrilecek ve path base urle yonlendirilecek.

  const optionChars = ["A", "B", "C", "D"];

  const handleNextQuestion = () => {
    if (questions.length === questionIndex + 1)
      setIsFinish(true); // if last question, render finish case
    else {
      setIsSubmit(false);
      setQuestionIndex((prev) => parseInt(prev) + 1); // next question
    }
    setSelectedOption(null);
    setSelectedOptionId(null);
    setIsAnswered(null);
  };

  const handleSubmit = () => {
    if (selectedOptionId === null) {
      setIsAnswered(false);
      return false;
    }
    setIsSubmit(true);
    setIsAnswered(true);
    let submitedOption = options.filter(
      (option) => option.option_id === selectedOptionId
    );
    if (submitedOption[0].is_correct) {
      setScore((prev) => prev + 1);
      setIsCorrect(true);
    }
    else {
      setIsCorrect(false)
    }
  };

  useEffect(() => {
    if (isFinish) navigate("/score"); // eslint-disable-next-line 
  }, [isFinish]);

  useEffect(() => {
    setIsAnswered(null); // eslint-disable-next-line 
  }, [selectedOption]);


  return (
    <div className="options">
      <div className="options__container">
        {options.map((option, index) => (
          <Option
            key={option.option_id}
            char={optionChars[index]}
            option={option}
          />
        ))}
      </div>
      {isSubmit ? (
        <QuizButton
          label={
            questions.length === questionIndex + 1
              ? "Finish Test"
              : "Next Question"
          }
          onClick={handleNextQuestion}
        />
      ) : (
        <QuizButton label="Submit Answer" onClick={handleSubmit} />
      )}
      {isAnswered === false && (
        <motion.div animate={{y:[20,0],opacity:[0,1]}} className="options__error-message">
          <img
            src="assets/icon-incorrect.svg"
            alt="incorrect"
            className="error-message__icon"
          />
          <p className="error-message__text body--medium">
            Please select an answer
          </p>
        </motion.div>
      )}
    </div>
  );
}

export default Options;
