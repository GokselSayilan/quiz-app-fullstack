import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import "./welcome.css";
import { useQuiz } from "../../Context/QuizContext";
import { useScreen } from "../../Context/ScreenContext";
import { toast } from "react-toastify";

function Welcome() {
  const {
    quizzes,
    setQuizzes,
    setSelectedQuiz,
    setSelectedQuizId,
    handleRestart,
    editMode,
    setEditMode,
    baseUrl,
  } = useQuiz();

  const { currentScreen } = useScreen();

  const navigate = useNavigate();

  const handleClickQuiz = (quiz) => {
    if (!editMode) {
      setSelectedQuiz(quiz);
      setSelectedQuizId(quiz.quiz_id);
      navigate(`quiz/${quiz.quiz_id}`);
    }
  };

  const handleDeleteQuiz = async (quiz_id) => {
    if (quiz_id < 9) {
      toast.error("Demo quizzes cannot be deleted");
    } else {
      try {
        const deletedQuizResponse = await fetch(
          `${baseUrl}/api/quizzes/quiz/${quiz_id}`,
          { method: "DELETE", headers: { "Content-Type": "application/json" } }
        );

        if (!deletedQuizResponse.ok) {
          throw new Error("Quiz deleting error");
        }
        // ui dan burada kaldiracagiz
        toast.success("Quiz deleted successfully");
        let tempQuizzes = [...quizzes];
        let targetIndex = tempQuizzes.findIndex(
          (quiz) => quiz.quiz_id === quiz_id
        );
        tempQuizzes.splice(targetIndex, 1);
        setQuizzes(tempQuizzes);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleNavigateEdit = (quiz_id) => {
    if (quiz_id < 9) {
      toast.error("Demo quizzes cannot be edited");
    } else {
      navigate(`/edit_quiz/${quiz_id}`);
    }
  };

  // get all quiz for list
  useEffect(() => {
    handleRestart();
    fetch(`${baseUrl}/api/quizzes/all`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Veri yüklenirken bir hata oluştu.");
        }
        return response.json();
      })
      .then((data) => setQuizzes(data))
      .catch((error) => console.error("Hata:", error)); // eslint-disable-next-line
  }, []);

  // If there is no test input, render loading
  if (!quizzes) {
    return <div>Loading...</div>;
  }

  return (
    <motion.div
      animate={{ opacity: [0, 1], y: [50, 0] }}
      transition={{ duration: 0.5 }}
      className="welcome"
    >
      <div className="welcome-text">
        <h2 className="welcome-test__title heading--large text-light text--primary">
          Welcome to the <br />
          <span className="text--medium"> Frontend Quiz!</span>
        </h2>
        <p className="welcome-test__desc body--small text--secondary">
          Pick a subject to get started.
        </p>
      </div>
      <div className="welcome-test">
        <ul className="welcome-test__items">
          {quizzes.map(
            (
              quiz // quiz mapping
            ) => (
              <div
                key={quiz.quiz_id}
                onClick={() => handleClickQuiz(quiz)}
                className="welcome-test__link"
              >
                <motion.li
                  whileHover={{ scale: 1.04 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="welcome-test__item bg--secondary item--shadow"
                >
                  <img
                    src={quiz.icon}
                    alt={`${quiz.title} icon`}
                    className="welcome-test__image"
                  />
                  <h6 className="welcome-test__title heading--small text--primary">
                    {quiz.title}
                  </h6>
                  <AnimatePresence mode="wait">
                    {editMode && (
                      <motion.div
                        animate={{ opacity: 1, y: 0 }}
                        initial={{ opacity: 0, y: 20 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.25 }}
                        className="welcome-test__edit-panel"
                      >
                        <motion.div
                          whileHover={{ scale: 1.4 }}
                          whileTap={{ scale: 0.96 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                          }}
                        >
                          <div
                            to="#"
                            onClick={() => handleNavigateEdit(quiz.quiz_id)}
                          >
                            <EditIcon
                              fontSize={
                                currentScreen === "mobile" ? "small" : "medium"
                              }
                              className="text--secondary"
                            />
                          </div>
                        </motion.div>

                        <motion.div
                          whileHover={{ scale: 1.4 }}
                          whileTap={{ scale: 0.96 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                          }}
                        >
                          <DeleteIcon
                            fontSize={
                              currentScreen === "mobile" ? "small" : "medium"
                            }
                            className="text--secondary"
                            onClick={() => handleDeleteQuiz(quiz.quiz_id)}
                          />
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.li>
              </div>
            )
          )}
        </ul>
        <div className="welcome__button-container">
          <Link className="welcome__button-link">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="welcome__button bg--secondary item--shadow"
              onClick={() => setEditMode((prev) => !prev)}
            >
              <EditIcon
                fontSize={currentScreen === "mobile" ? "small" : "medium"}
                className="text--secondary"
              />
              <p
                className={`welcome-button__text  text--secondary ${
                  currentScreen === "mobile"
                    ? "body--small text--medium"
                    : "heading--small"
                }`}
              >
                Edit Mode: {editMode ? "ON" : "OFF"}
              </p>
            </motion.button>
          </Link>
          <Link to="/new_quiz" className="welcome__button-link">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="welcome__button bg--secondary item--shadow"
            >
              <AddIcon
                fontSize={currentScreen === "mobile" ? "small" : "large"}
                className="text--secondary"
              />
              <p className="welcome-button__text heading--small text--secondary">
                New Quiz
              </p>
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default Welcome;
