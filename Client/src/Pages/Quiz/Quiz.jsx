import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import Options from "../../Components/Options/Options";
import { useQuiz } from "../../Context/QuizContext";
import "./quiz.css";
import { toast } from "react-toastify";

function Quiz() {
  const {
    selectedQuizId,
    questionIndex,
    questions,
    setQuestions,
    questionOptions,
    setQuestionOptions,
    baseUrl
  } = useQuiz();

  const navigate = useNavigate();

  const randomOptions = (array) => {
    const indexArray = [0, 1, 2, 3];
    const randomizedOptions = [];
    for (let i = 0; i < 4; i++) {
      const randomNumber = Math.floor(Math.random() * indexArray.length);
      randomizedOptions.push(array[indexArray[randomNumber]]);
      indexArray.splice(randomNumber, 1);
    }
    return randomizedOptions;
  };

  const handleNavigateEditQuiz = () => {
    navigate(`/edit_quiz/${selectedQuizId}`);
  };

  const handleDeleteQuiz = async () => {
    try {
      const deletedQuizResponse = await fetch(
        `${baseUrl}/api/quizzes/quiz/${selectedQuizId}`,
        { method: "DELETE", headers: { "Content-Type": "application/json" } }
      );

      if (!deletedQuizResponse.ok) {
        throw new Error("Quiz deleting error");
      }
      toast.success("Quiz deleted successfully");
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch questions
  useEffect(() => {
    fetch(`${baseUrl}/api/quizzes/questions/${selectedQuizId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch questions");
        }
        return response.json();
      })
      .then((data) => {
        setQuestions(data);
      })
      .catch((error) => {
        console.error("Error:", error);
        navigate("/");
      }); // eslint-disable-next-line
  }, [selectedQuizId]);

  // Fetch options if there are questions
  useEffect(() => {
    if (Array.isArray(questions) && questions.length > 0) {
      const questionId = questions[questionIndex]?.question_id;
      if (questionId) {
        fetch(
          `${baseUrl}/api/quizzes/questions/${questionId}/options`
        )
          .then((response) => {
            if (!response.ok) {
              throw new Error("Failed to fetch options");
            }
            return response.json();
          })
          .then((data) => {
            const randomizedOptions = randomOptions(data);
            setQuestionOptions(randomizedOptions);
          })
          .catch((error) => {
            console.error("Error:", error);
            navigate("/");
          });
      }
    } // eslint-disable-next-line
  }, [questions, questionIndex]);

  // Handle the case when questions or options are null or empty
  if (!questions || questions.length === 0) {
    return (
      <div className="quiz__no-question bg--secondary item--shadow">
        <h3 className="no-question__title heading--medium text--secondary">
          There are no questions in this quiz
        </h3>
        <div className="no-question__button-container">
          <button
            className="no-question__button body--medium text--primary bg--primary item--shadow"
            onClick={handleDeleteQuiz}
          >
            Delete Quiz
          </button>
          <button
            className="no-question__button body--medium text--primary bg--primary item--shadow"
            onClick={handleNavigateEditQuiz}
          >
            Edit Quiz
          </button>
        </div>
      </div>
    );
  }

  if (!questionOptions) {
    return <div className="heading--large text--primary">Loading...</div>;
  }

  return (
    <motion.div
      animate={{ opacity: [0, 1], y: [50, 0] }}
      transition={{ duration: 0.5 }}
      className="quiz"
    >
      <div className="quiz-info">
        <div className="quiz-info__container">
          <p className="quiz__question-index body--small text--secondary">
            Question {questionIndex + 1} of {questions.length}
          </p>
          <AnimatePresence mode="wait">
            <motion.h2
              key={questions[questionIndex].question_id}
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.15 }}
              className="quiz__question-title heading--medium text--primary"
            >
              {questions[questionIndex].question_text}
            </motion.h2>
          </AnimatePresence>
        </div>
        <div className="quiz__status-bar bg--secondary">
          <motion.div
            className="quiz__status-bar-progress"
            initial={{ width: 0 }}
            animate={{
              width: `${(100 / questions.length) * (questionIndex + 1)}% `,
            }} // her bir adimdaki hareket = 100/soru sayisi yani 100/questions.length
            transition={{ duration: 0.5 }}
          ></motion.div>
        </div>
      </div>
      <Options options={questionOptions} />
    </motion.div>
  );
}

export default Quiz;
