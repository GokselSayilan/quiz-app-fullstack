import React, { useState, useEffect, useRef } from "react";
import "./editQuestion.css";
import { toast } from "react-toastify";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

import { motion } from "framer-motion";
import { useScreen } from "../../Context/ScreenContext";
import { useQuiz } from "../../Context/QuizContext";

function EditQuestion({
  questionNumber,
  questionData,
  questions,
  setQuestions,
}) {
  // İlk render kontrolü için ref
  const firstRender = useRef(true);

  const { currentScreen } = useScreen();
  const {baseUrl} = useQuiz()

  const [questionText, setQuestionText] = useState(questionData.question_text);
  const [options, setOptions] = useState(questionData.options);
  const [correctOptionIndex, setCorrectOptionIndex] = useState(
    options.findIndex((option) => option.is_correct)
  );
  const [isSubmited, setIsSubmited] = useState(true);

  const optionChars = ["A", "B", "C", "D"];

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index].option_text = value; // Güncel metni sakla
    setOptions(updatedOptions);
    setIsSubmited(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newOptions = options.map((option, index) => ({
      ...option,
      is_correct: index === correctOptionIndex,
    }));

    const emptyOptions = newOptions.filter((option) => !option.option_text);

    if (questionText === "" || emptyOptions.length > 0) {
      toast.warning("Please complete all fields", { autoClose: 1500 });
      return;
    }

    // Soru güncelleme işlemleri
    setIsSubmited(true);
    setOptions(newOptions);
  };

  const updateQuestionAndOptions = async () => {
    try {
      const updatedQuestionResponse = await fetch(
        `${baseUrl}/api/quizzes/question/${questionData.question_id}`,
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
        `${baseUrl}/api/quizzes/options/${questionData.question_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ options: options }),
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
        `${baseUrl}/api/quizzes/question/${questionData.question_id}`,
        { method: "DELETE", headers: { "Content-Type": "application/json" } }
      );
      if (!deletedQuestionResponse.ok) {
        toast.error("Error occurred while deleting the question.");
        throw new Error("Question deleting error");
      }
      //
      toast.success("Question deleted successfully", { autoClose: 1500 });
      let tempQuestions = [...questions];
      let targetIndex = tempQuestions.findIndex(
        (element) => element.question_id === questionData.question_id
      );
      tempQuestions.splice(targetIndex, 1);
      setQuestions(tempQuestions);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isSubmited && !firstRender.current) updateQuestionAndOptions(); // eslint-disable-next-line
  }, [isSubmited]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false; // İlk render'ı atla
    } else {
      setIsSubmited(false); // İkinci ve sonrası render'da false yap
    }
  }, [correctOptionIndex, questionText]);

  return (
    <motion.div
      animate={{ opacity: [0, 1], y: [50, 0] }}
      transition={{ duration: 0.5 }}
      className="edit-question"
    >
      <div className="edit-question__text-container">
        <h3 className="edit-question__text-title text--primary heading--small">
          Question {questionNumber}
        </h3>
        <input
          className="edit-question__text text--primary body--medium text--light item--shadow bg--secondary"
          placeholder="Exp: What is the capital of Italy?"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
        />
      </div>
      <form
        className="edit-question__options-container"
        onSubmit={handleSubmit}
      >
        {options.map((option, index) => (
          <div key={index} className="edit-question__option-container">
            <p className="edit-question__option-char text--primary body--medium">
              {`${optionChars[index]})`}
            </p>
            <input
              className="edit-question__option text--primary bg--secondary item--shadow body--small"
              value={option.option_text} // Burada düzeltildi
              onChange={(e) => handleOptionChange(index, e.target.value)}
            />
            <div
              className={`edit-question__option-checkbox ${
                correctOptionIndex === index
                  ? "checkbox--correctly"
                  : "checkbox--incorrectly"
              }`}
              onClick={() => setCorrectOptionIndex(index)}
            >
              {correctOptionIndex === index ? (
                <CheckIcon
                  className="edit-question__check-icon"
                  fontSize={currentScreen === "mobile" ? "small" : "medium"}
                />
              ) : (
                <CloseIcon
                  className="edit-question__check-icon"
                  fontSize={currentScreen === "mobile" ? "small" : "medium"}
                />
              )}
            </div>
          </div>
        ))}
        <div className="edit-question__button-container">
          <button
            type="button"
            className="add-question__button body--medium button--delete"
            onClick={handleDeleteQuestion}
          >
            Delete
          </button>
          <button
            type="submit"
            className={`edit-question__button body--medium button--save ${
              isSubmited ? "button--disabled" : ""
            }`}
            disabled={isSubmited}
          >
            Save
          </button>
        </div>
      </form>
    </motion.div>
  );
}

export default EditQuestion;
