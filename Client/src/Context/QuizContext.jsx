import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const QuizContext = createContext();

export const QuizProvider = ({ children }) => {

  const baseUrl = process.env.REACT_APP_API_BASE_URL;

  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [isSubmit, setIsSubmit] = useState(false);
  const [isFinish, setIsFinish] = useState(false);
  const [selectedOption, setSelectedOption] = useState("idle");
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState(null);
  const [questionOptions, setQuestionOptions] = useState(null);
  const [score, setScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [numberOfQuestions, setNumberOfQuestions] = useState(0);
  const [questionNumbers, setQuestionNumbers] = useState([]);
  const [editMode, setEditMode] = useState(false);

  const navigate = useNavigate();

  const handleRestart = () => {
    navigate("/");
    setQuestions(null);
    setQuestionOptions(null);
    setQuestionIndex(0);
    setScore(0);
    setSelectedOptionId(null);
    setSelectedQuizId(null);
    setSelectedOption("idle");
    setIsSubmit(false);
    setIsFinish(false);
    setIsCorrect(null);
    setIsAnswered(null);
    setSelectedQuiz(null);
    setEditMode(false);
  };

  return (
    <QuizContext.Provider
      value={{
        isSubmit,
        setIsSubmit,
        selectedOption,
        setSelectedOption,
        selectedOptionId,
        setSelectedOptionId,
        selectedQuizId,
        setSelectedQuizId,
        questionIndex,
        setQuestionIndex,
        questions,
        setQuestions,
        isFinish,
        setIsFinish,
        questionOptions,
        setQuestionOptions,
        score,
        setScore,
        isAnswered,
        setIsAnswered,
        isCorrect,
        setIsCorrect,
        quizzes,
        setQuizzes,
        selectedQuiz,
        setSelectedQuiz,
        handleRestart,
        numberOfQuestions,
        setNumberOfQuestions,
        questionNumbers,
        setQuestionNumbers,
        editMode,
        setEditMode,
        baseUrl
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => useContext(QuizContext);
