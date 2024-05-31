import React, { useEffect, useState } from "react";

import AddQuestion from "../../Components/AddQuestion/AddQuestion";

import { toast } from "react-toastify";
import { motion } from "framer-motion";
//icons
import CheckIcon from "@mui/icons-material/Check";
import AddIcon from "@mui/icons-material/Add";
import HomeIcon from "@mui/icons-material/Home";

import "./newQuiz.css";
import { useQuiz } from "../../Context/QuizContext";
import { Link } from "react-router-dom";
import { useScreen } from "../../Context/ScreenContext";

function NewQuiz() {
  const {
    questionNumbers,
    setQuestionNumbers,
    numberOfQuestions,
    setNumberOfQuestions,
    baseUrl
  } = useQuiz();

  const { currentScreen } = useScreen();

  const [quizId, setQuizId] = useState(null);
  const [titleInputValue, setTitleInputValue] = useState("");
  const [quizTitle, setQuizTitle] = useState("");
  const [isCheck, setIsCheck] = useState(false);
  const [isQuizUpdateMode, setIsQuizUpdateMode] = useState(false);

  const handleFetchQuiz = async () => {
    if (isQuizUpdateMode) { // eslint-disable-next-line
      const quizResponse = await fetch(
        `${baseUrl}/api/quizzes/quiz/${quizId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title: quizTitle }),
        }
      );
      toast.success("Quiz title has been changed", { autoClose: 1500 });
    } else {
      const quizResponse = await fetch(
        `${baseUrl}/api/quizzes/quiz`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: quizTitle }),
        }
      );
      const { quiz_id } = await quizResponse.json();
      setQuizId(quiz_id);
      setIsQuizUpdateMode(true);
      toast.success("New quiz created", { autoClose: 1500 });
    }
  };

  const handleSaveTitle = () => {
    setQuizTitle(titleInputValue);
    setIsCheck(false);
  };

  const handleNewQuestion = () => {
    let temp = [...questionNumbers];
    temp.push(numberOfQuestions + 1);
    setNumberOfQuestions((prev) => prev + 1);
    setQuestionNumbers(temp);
  };

  const restartNewQuiz = () => {
    setQuizId(null);
    setTitleInputValue("");
    setQuizTitle("");
    setIsCheck(false);
    setIsQuizUpdateMode(false);
    setQuestionNumbers([]);
    setNumberOfQuestions(0);
  };

  useEffect(() => {
    restartNewQuiz(); // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!isCheck && quizTitle !== "") {
      handleFetchQuiz();
    } // eslint-disable-next-line
  }, [isCheck]);

  useEffect(() => {
    setIsCheck(true); // eslint-disable-next-line
  }, [titleInputValue]);

  return (
    <motion.div
      className="new-quiz"
      animate={{ opacity: [0, 1] }}
      transition={{ duration: 0.5 }}
    >
      <div className="new-quiz__title-container">
        <h4 className="new-quiz__title-label heading--small text--primary">
          Quiz Title
        </h4>
        <input
          type="text"
          value={titleInputValue}
          onChange={(e) => setTitleInputValue(e.target.value)}
          className="new-quiz__title-input body--small bg--secondary text--primary item--shadow"
        />

        <CheckIcon
          id="check-icon"
          fontSize="medium"
          className={
            isCheck && titleInputValue !== ""
              ? "new-quiz__title-icon text--secondary"
              : "item--none"
          }
          onClick={handleSaveTitle}
        />
      </div>
      <div className="new-quiz__questions-container">
        {questionNumbers.length > 0 &&
          questionNumbers.map((questionNumber, index) => (
            <AddQuestion
              key={index}
              quizId={quizId}
              questionNumber={questionNumber}
            />
          ))}
      </div>
      {quizTitle !== "" && (
        <button
          type="button"
          className="new-quiz__add-button bg--secondary item--shadow"
          onClick={handleNewQuestion}
        >
          <AddIcon
            fontSize={currentScreen === "mobile" ? "small" : "large"}
            className="text--primary"
          />
          <p className="body--medium text--primary">New Question</p>
        </button>
      )}
      <Link to="/">
        {currentScreen !== "mobile" ? (
          <button className="new-quiz__home-button body--medium bg--primary text--primary item--shadow">
            Return to Homepage
          </button>
        ) : (
          <button className="new-quiz__mobile-home-button bg--secondary text--primary item--shadow body--small">
            <HomeIcon />
            <p>Home</p>
          </button>
        )}
      </Link>
    </motion.div>
  );
}

export default NewQuiz;
