const express = require("express");
const router = express.Router();
const {
  getQuiz,
  getQuizzes,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  getQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getOptions,
  addOptionsToQuestion,
  updateOptionsToQuestion,
  getAllQuestionsOfQuiz,
} = require("../models/quizModel");

// quiz

// get
router.get("/quiz/:quiz_id", async (req,res) => {
  try {
    const {quiz_id} = req.params;
    const quiz = await getQuiz(quiz_id)
    res.status(200).json(quiz)
  }

  catch (err)  {
    console.error(err)
    res.status(500).send("Interval server error")
  }
})

// get
router.get("/all", async (req, res) => {
  try {
    const allQuizzes = await getQuizzes();
    res.json(allQuizzes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Internal server error");
  }
});

// post
router.post("/quiz", async (req, res) => {
  try {
    const { title } = req.body;
    const newQuizId = await createQuiz(title);
    res
      .status(201)
      .json({ quiz_id: newQuizId, message: "Quiz added successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Internal server error");
  }
});

// put
router.put("/quiz/:quiz_id", async (req, res) => {
  const { quiz_id } = req.params;
  const { title } = req.body;

  try {
    const updatedQuiz = await updateQuiz(quiz_id, title);
    res.json(updatedQuiz);
  } catch (error) {
    console.error("Error updating quiz:", error);
    res.status(500).send("Internal server error");
  }
});

// delete
router.delete("/quiz/:quiz_id", async (req, res) => {
  const { quiz_id } = req.params;

  try {
    const deletedQuiz = await deleteQuiz(quiz_id);
    res.json(deleteQuiz);
  } catch (err) {
    console.error("Error deleting quiz:", err);
    res.status(500).send("Internal server error");
  }
});

// question

// get
router.get("/questions/:quiz_id", async (req, res) => {
  try {
    const { quiz_id } = req.params;
    const quiz = await getQuestion(quiz_id);
    res.json(quiz);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Internal server error");
  }
});

// post
router.post("/question", async (req, res) => {
  try {
    const { quiz_id, question_text } = req.body;
    const questionId = await createQuestion(quiz_id, question_text);
    res.status(201).json({
      question_id: questionId,
      message: "Question added successfully",
    });
  } catch (error) {
    console.error(err.message);
    res.status(500).send("Internal server error", error);
  }
});

// put
router.put("/question/:question_id", async (req, res) => {
  try {
    const { question_id } = req.params;
    const { question_text } = req.body;
    const updatedQuestionId = await updateQuestion(question_id, question_text);
    res.status(201).json({
      question_id: updatedQuestionId,
      message: "Question updated successfully",
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Internal server error");
  }
});

// delete
router.delete("/question/:question_id", async (req, res) => {
  const { question_id } = req.params;
  try {
    const deletedQuestion = await deleteQuestion(question_id);
    res.json(deletedQuestion);
  } catch (error) {
    console.error("Deleting question error", error);
    res.status(500).send("Internal server error");
  }
});

//option

// get
router.get("/questions/:question_id/options", async (req, res) => {
  try {
    const { question_id } = req.params;
    const optionsIds = await getOptions(question_id);
    res.json(optionsIds);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Internal server error");
  }
});

// post
router.post("/options", async (req, res) => {
  try {
    const { question_id, options } = req.body;
    const optionIds = await addOptionsToQuestion(question_id, options);
    res
      .status(201)
      .json({ option_ids: optionIds, message: "Options added successfully" });
  } catch (error) {
    console.error("Error adding options:", error);
    res.status(500).send("Internal server error");
  }
});

// put
router.put("/options/:question_id", async (req, res) => {
  try {
    const { question_id } = req.params;
    const { options } = req.body;
    const optionIds = await updateOptionsToQuestion(options);
    res
      .status(201)
      .json({ option_ids: optionIds, message: "Options updated successfully" });
  } catch (error) {
    console.error("Error updating options", error);
    res.status(500).send("Internal Server Error");
  }
});

// custom

// get all questions and options of quiz -- by quiz-id
router.get("/all/:quiz_id", async (req, res) => {
  try {
    const { quiz_id } = req.params;
    const data = await getAllQuestionsOfQuiz(quiz_id);
    res
      .status(200)
      .json({
        data,
        message: "Get all questions and options of quiz -- successfully",
      });
  } catch (err) {
    console.error("Error get all questions and options of quiz -- error", err);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
