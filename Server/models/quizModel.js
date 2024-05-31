const pool = require("../config/dbConfig");

// quiz

// (get) quiz by quiz_id
const getQuiz = async(quiz_id) => {
  const results = await pool.query("SELECT * FROM quizzes WHERE quiz_id = $1",[quiz_id])
  return results.rows[0];
}

// (get) all quiz
const getQuizzes = async () => {
  const results = await pool.query("SELECT * FROM quizzes ORDER BY quiz_id");
  return results.rows;
};

// (post) new quiz
const createQuiz = async (title) => {
  const results = await pool.query(
    "INSERT INTO quizzes (title,icon) VALUES ($1,'assets/icon-question.png') RETURNING quiz_id",
    [title]
  );
  return results.rows[0].quiz_id;
};

// (put) update quiz by quiz_id
const updateQuiz = async (quiz_id, quiz_title) => {
  const results = await pool.query(
    "UPDATE quizzes SET title = ($1) WHERE quiz_id = ($2) RETURNING *",
    [quiz_title, quiz_id]
  );
  return results.rows[0];
};

// (delete) remove to quiz by quiz_id
const deleteQuiz = async (quiz_id) => {
  const results = await pool.query(
    "DELETE FROM quizzes WHERE quiz_id = $1 RETURNING *",
    [quiz_id]
  );
  return results.rows[0];
};

// question

// (get) question by quizId
const getQuestion = async (id) => {
  const results = await pool.query(
    "SELECT * FROM questions WHERE quiz_id = $1",
    [id]
  );
  return results.rows;
};

// (post) create a new question
const createQuestion = async (quiz_id, question_text) => {
  const results = await pool.query(
    "INSERT INTO questions (quiz_id,question_text) VALUES ($1,$2) RETURNING question_id",
    [quiz_id, question_text]
  );
  const question_id = results.rows[0].question_id;
  return question_id;
};

// (put) update question by questionId
const updateQuestion = async (question_id, question_text) => {
  const results = await pool.query(
    "UPDATE questions SET question_text = $1 WHERE question_id = $2 RETURNING *",
    [question_text, question_id]
  );

  return results.rows[0];
};

// (delete) remove question by questionId
const deleteQuestion = async (question_id) => {
  const results = await pool.query(
    "DELETE FROM questions WHERE question_id = $1 RETURNING *",
    [question_id]
  );

  return results.rows[0];
};

// option

// get options by questionId
const getOptions = async (id) => {
  const results = await pool.query(
    "SELECT * FROM options WHERE question_id = $1",
    [id]
  );
  return results.rows;
};

// (post) new options
const addOptionsToQuestion = async (question_id, options) => {
  const optionValues = options
    .map(
      (option) =>
        `(${question_id}, '${option.option_text}', ${option.is_correct})`
    )
    .join(","); //
  const query = `INSERT INTO options (question_id, option_text, is_correct) VALUES ${optionValues} RETURNING option_id`;
  const result = await pool.query(query);
  const optionIds = result.rows.map((row) => row.option_id);
  return optionIds;
};

// (put) update options by optionId
const updateOptionsToQuestion = async (options) => {
  try {
    // options objesindeki her bir seçenek için güncelleme yap
    for (const option of options) {
      // Seçeneği güncelle
      await pool.query(
        "UPDATE options SET option_text = $1, is_correct = $2 WHERE option_id = $3",
        [option.option_text, option.is_correct, option.option_id]
      );
    }
    console.log("Options updated successfully");
  } catch (error) {
    console.error("Error updating options:", error);
    throw error;
  }
};

// custom

// (get) all questions of quiz by quiz-id
const getAllQuestionsOfQuiz = async (quiz_id) => {
  try {
    const query = await pool.query(
      "SELECT * FROM quizzes INNER JOIN questions ON quizzes.quiz_id = questions.quiz_id INNER JOIN options  ON questions.question_id = options.question_id WHERE quizzes.quiz_id = $1",
      [quiz_id]
    );
    return query.rows;
  } catch (err) {
    console.error("get all questions of quiz -- error", err);
    throw err;
  }
};

module.exports = {
  getQuiz,
  getQuizzes,
  createQuiz,
  updateQuiz,
  deleteQuiz, //
  getQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion, //
  getOptions,
  addOptionsToQuestion,
  updateOptionsToQuestion, //
  getAllQuestionsOfQuiz,
};
