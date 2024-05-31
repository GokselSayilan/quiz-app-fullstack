//core modules
import React from "react";
import { Route, Routes } from "react-router-dom";
//context
import { useTheme } from "../../Context/ThemeContext";
import { useQuiz } from "../../Context/QuizContext";
//components
import ToggleBar from "../ToggleBar/ToggleBar";
//pages
import Welcome from "../../Pages/Welcome/Welcome";
import Quiz from "../../Pages/Quiz/Quiz";
import Score from "../../Pages/Score/Score";
import NotFound from "../../Pages/NotFound/NotFound";
//style
import "./quizApp.css";
import NewQuiz from "../../Pages/NewQuiz/NewQuiz";
import EditQuiz from "../../Pages/EditQuiz/EditQuiz";
import { useScreen } from "../../Context/ScreenContext";

function QuizApp() {
  const { theme } = useTheme();
  const { selectedQuiz } = useQuiz();
  const {currentScreen} = useScreen()

  return (
 
      <div className={theme}>
        <div className="quiz-app bg--primary">
          <img
            src={`assets/pattern-background-${currentScreen}-${theme}.svg`}
            alt="background shape"
            className="bg__shape"
          />
          <header className="quiz__header">
            {selectedQuiz !== null ? (
              <div className="header-test">
                <img
                  src={selectedQuiz.icon}
                  alt="quiz icon"
                  className="header-test__img"
                />
                <h5 className="header-test__title heading--small text--primary">
                  {selectedQuiz.title}
                </h5>
              </div>
            ) : (
              <div></div>
            )}

            <ToggleBar />
          </header>

          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/new_quiz" element={<NewQuiz />} />
            <Route path="/score" element={<Score />} />
            <Route path="/quiz/:quizId" element={<Quiz />} />
            <Route path="/edit_quiz/:quiz_id" element={<EditQuiz/>}/>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
  );
}

export default QuizApp;
