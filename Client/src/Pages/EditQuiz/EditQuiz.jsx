import React, { useEffect, useState } from "react";
import "./editQuiz.css";
import { Link, useParams } from "react-router-dom";

import EditQuestion from "../../Components/EditQuestion/EditQuestion";

//icons
import CheckIcon from "@mui/icons-material/Check";
import AddIcon from "@mui/icons-material/Add";
import HomeIcon from '@mui/icons-material/Home';

import { toast } from "react-toastify";
import AddQuestion from "../../Components/AddQuestion/AddQuestion";

import { motion } from "framer-motion";
import { useScreen } from "../../Context/ScreenContext";
import { useQuiz } from "../../Context/QuizContext";

function EditQuiz() {
  const { quiz_id } = useParams();
  const { currentScreen } = useScreen();
  const {baseUrl} = useQuiz()
  const [questions, setQuestions] = useState([]);
  const [quizTitle, setQuizTitle] = useState("");
  const [isCheck, setIsCheck] = useState(false);
  const [newQuestions, setNewQuestions] = useState([]);

  const fetchQuiz = async () => {
    try {
      const response = await fetch(
        `${baseUrl}/api/quizzes/quiz/${quiz_id}`
      );
      if (!response.ok) {
        throw new Error("Get quiz -- error");
      }
      const data = await response.json();
      setQuizTitle(data.title);
    } catch (err) {
      toast.error("Error");
      console.error(err);
    }
  };

  const fetchAllQuestions = async () => {
    try {
      const response = await fetch(
        `${baseUrl}/api/quizzes/all/${quiz_id}`
      );
      if (!response.ok) {
        throw new Error("Get all questions and options -- error");
      }
      const data = await response.json();
      if (data.data.length > 0) {
        const groupedQuestions = groupQuestions(data.data);
        setQuestions(groupedQuestions);
      }
    } catch (error) {
      toast.error("Error");
      console.error(error);
    }
  };

  const saveTitle = async () => {
    try {
      const response = await fetch(
        `${baseUrl}/api/quizzes/quiz/${quiz_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title: quizTitle }),
        }
      );
      if (!response.ok) {
        throw new Error("Quiz title updating error");
      }
      toast.success("Quiz title changed successfully", { autoClose: 1500 });
      setIsCheck(false);
    } catch (err) {
      toast.error("Quiz title updating error");
      console.error(err);
    }
  };

  const groupQuestions = (data) => {
    const grouped = {};
    data.forEach((item) => {
      const { question_id, question_text, option_text, is_correct, option_id } =
        item;

      // Eğer bu question_id'de bir grup yoksa, yeni bir grup oluştur
      if (!grouped[question_id]) {
        grouped[question_id] = {
          question_id,
          question_text,
          options: [],
        };
      }

      // Option'u ilgili question_id'nin gruplanmış listesine ekle
      grouped[question_id].options.push({
        option_text,
        is_correct,
        option_id,
      });
    });

    return Object.values(grouped);
  };

  const handleQuizTitle = (e) => {
    setIsCheck(true);
    setQuizTitle(e.target.value);
  };

  const handleNewQuestion = () => {
    let tempQuestions = [...newQuestions];
    tempQuestions.push(tempQuestions.length + 1);
    setNewQuestions(tempQuestions);
  };

  useEffect(() => {
    fetchQuiz(); // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchAllQuestions(); // eslint-disable-next-line
  }, [quizTitle]);

  return (
    <motion.div
      className="edit-quiz"
      animate={{ opacity: [0, 1] }}
      transition={{ duration: 0.5 }}
    >
      <div className="edit-quiz__title-container">
        <h4 className="edit-quiz__title-label heading--small text--primary">
          Quiz Title
        </h4>
        <input
          type="text"
          className="edit-quiz__title-input body--small bg--secondary text--primary item--shadow"
          value={quizTitle}
          onChange={handleQuizTitle}
        />
        <CheckIcon
          id="check-icon"
          fontSize="medium"
          className={
            isCheck && quizTitle !== ""
              ? "new-quiz__title-icon text--secondary"
              : "item--none"
          }
          onClick={saveTitle}
        />
      </div>

      <div className="edit-quiz__questions-container">
        {questions.map((question, index) => (
          <EditQuestion
            key={question.question_id}
            quizId={quiz_id}
            questionNumber={index + 1}
            questionData={question}
            questions={questions}
            setQuestions={setQuestions}
          />
        ))}
        {newQuestions.map((questionNumber, index) => (
          <AddQuestion
            key={index}
            quizId={quiz_id}
            questionNumber={questions.length + questionNumber}
          />
        ))}
      </div>
      <button
        type="button"
        className="edit-quiz__add-button bg--secondary item--shadow"
        onClick={handleNewQuestion}
      >
        <AddIcon
          fontSize={currentScreen === "mobile" ? "small" : "large"}
          className="text--primary"
        />
        <p className="body--medium text--primary">New Question</p>
      </button>
      <Link to="/">
        {currentScreen !== "mobile" ? (
          <button className="edit-quiz__home-button body--medium bg--primary text--primary item--shadow">
            Return to Homepage
          </button>
        ) : (
          <button className="edit-quiz__mobile-home-button bg--secondary text--primary item--shadow body--small">
            <HomeIcon />
            <p>Home</p>
          </button>
        )}
      </Link>
    </motion.div>
  );
}

export default EditQuiz;
