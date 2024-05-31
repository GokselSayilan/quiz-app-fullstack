import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import "./addQuestion.css";
import { useQuiz } from "../../Context/QuizContext";

import { motion } from "framer-motion";
import { useScreen } from "../../Context/ScreenContext";

function AddQuestion({ quizId, questionNumber }) {
  const { setNumberOfQuestions, questionNumbers, setQuestionNumbers,baseUrl } =
    useQuiz();
  const {currentScreen} = useScreen()

  const [question, setQuestion] = useState({
    questionText: "",
    question_id: null,
    options: [
      { option_id: null, option_text: "", is_correct: false },
      { option_id: null, option_text: "", is_correct: false },
      { option_id: null, option_text: "", is_correct: false },
      { option_id: null, option_text: "", is_correct: false },
    ],
  });
  const [questionText, setQuestionText] = useState("");
  const [isSubmited, setIsSubmited] = useState(false);
  const [correctOptionIndex, setCorrectOptionIndex] = useState("");
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const optionChars = ["A", "B", "C", "D"];

  const handleChangeForm = () => {
    setIsSubmited(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const newOptions = [];

    question.options.forEach((option, index) => {
      const updatedOption = {
        ...option,
        option_text: formData.get(`option-${index + 1}`),
        is_correct: index === parseInt(correctOptionIndex),
      };
      newOptions.push(updatedOption);
    });

    const filledInputs = newOptions.filter(
      (option) => option.option_text === ""
    );

    if (
      questionText === "" ||
      filledInputs.length > 0 ||
      correctOptionIndex === ""
    ) {
      toast.warning("You have entered incompletely", { autoClose: 1500 });
    } else {
      setIsSubmited(true);
      setQuestion({ ...question, questionText, options: newOptions });
    }
  };

  const createQuestionAndOptions = async () => {
    try {
      const questionResponse = await fetch(
        `${baseUrl}/api/quizzes/question`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            quiz_id: quizId,
            question_text: question.questionText,
          }),
        }
      );
      if (!questionResponse.ok) {
        throw new Error("Failed to create question");
      }
      const responseQuestion = await questionResponse.json();
      const { question_id } = responseQuestion;

      const optionsResponse = await fetch(
        `${baseUrl}/api/quizzes/options`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question_id: question_id,
            options: question.options,
          }),
        }
      );
      if (!optionsResponse.ok) {
        throw new Error("Failed to create options");
      }
      const responseOptions = await optionsResponse.json();
      const { option_ids } = responseOptions;

      const copyOptions = [...question.options];
      copyOptions.forEach(
        (option, index) => (option.option_id = option_ids[index])
      );
      setQuestion({ ...question, question_id, options: copyOptions });
      setIsUpdateMode(true);
      toast.success("Question successfully added", { autoClose: 1500 });
    } catch (error) {
      console.error("Error creating question and options:", error);
    }
  };

  const updateQuestionAndOptions = async () => {
    try {
      const updatedQuestionResponse = await fetch(
        `${baseUrl}/api/quizzes/question/${question.question_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question_text: questionText }),
        }
      );

      if (!updatedQuestionResponse.ok) {
        throw new Error("Failed to update question");
      }

      const updatedOptionsResponse = await fetch(
        `${baseUrl}/api/quizzes/options/${question.question_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ options: question.options }),
        }
      );

      if (!updatedOptionsResponse.ok) {
        throw new Error("Options Updating Error");
      }
      toast.success("Question successfully updated", { autoClose: 1500 });
    } catch (err) {
      console.error("Options Updating Error", err);
    }
  };

  const handleDeleteQuestion = async () => {
    try {
      const deletedQuestionResponse = await fetch(
        `${baseUrl}/api/quizzes/question/${question.question_id}`,
        { method: "DELETE", headers: { "Content-Type": "application/json" } }
      );
      if (!deletedQuestionResponse.ok) {
        toast.error("Error occurred while deleting the question.");
        throw new Error("Question deleting error");
      }
      //
      toast.success("Question deleted successfully", { autoClose: 1500 });
      let temp = questionNumbers.map((element) => {
        if (questionNumber < element) {
          return element - 1;
        } else return element;
      });
      temp.sort();
      setQuestionNumbers(temp);
      setNumberOfQuestions((prev) => prev - 1);
      setIsVisible(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    setIsSubmited(false);
  }, [correctOptionIndex, questionText]);

  useEffect(() => {
    if (isSubmited && !isUpdateMode) createQuestionAndOptions();
    if (isSubmited && isUpdateMode) updateQuestionAndOptions(); // eslint-disable-next-line
  }, [isSubmited]);

  if (!isVisible) {
    return <div></div>;
  }

  return (
    <motion.div
      animate={{ opacity: [0, 1], y: [50, 0] }}
      transition={{ duration: 0.5 }}
      className="add-question"
    >
      <div className="add-question__text-container">
        <h3 className="add-question__text-title text--primary heading--small">
          Question {questionNumber < 1 ? 1 : questionNumber}
        </h3>
        <input
          className="add-question__text text--primary body--medium text--light item--shadow bg--secondary"
          placeholder="Exp: What is the capital of Italy?"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
        />
      </div>
      <form
        className="add-question__options-container"
        onSubmit={handleSubmit}
        onChange={handleChangeForm}
      >
        {optionChars.map((char, index) => (
          <div key={char} className="add-question__option-container">
            <p className="add-question__option-char text--primary body--medium">{`${char})`}</p>
            <input
              className="add-question__option text--primary bg--secondary item--shadow body--small"
              placeholder={`Option ${index + 1}`}
              name={`option-${index + 1}`}
            />
            <div
              className={`add-question__option-checkbox ${
                correctOptionIndex === index
                  ? "checkbox--correctly "
                  : "checkbox--incorrectly"
              }`}
              onClick={() => setCorrectOptionIndex(index)}
            >
              {correctOptionIndex === index ? (
                <CheckIcon className="add-question__check-icon" fontSize={currentScreen === 'mobile' ? 'small' : 'medium'} />
              ) : (
                <CloseIcon className="add-question__check-icon"  fontSize={currentScreen ==='mobile' ? 'small' : 'medium'} />
              )}
            </div>
          </div>
        ))}
        <div className="add-question__button-container">
          {isUpdateMode && (
            <button
              type="button"
              onClick={handleDeleteQuestion}
              className="add-question__button body--medium button--delete"
            >
              Delete
            </button>
          )}
          <button
            type="submit"
            className={`add-question__button body--medium button--save ${
              isSubmited && "button--disabled"
            }`}
            disabled={isSubmited}
          >
            {isUpdateMode ? "Update" : "Save"}
          </button>
        </div>
      </form>
    </motion.div>
  );
}

export default AddQuestion;
