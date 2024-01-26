import React, { useEffect, useState } from "react";
import axios from "axios";

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);

  const decodeEntities = (html) => {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = html;
    return textarea.value;
  };

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const response = await axios.get(
          "https://opentdb.com/api.php?amount=10&category=18"
        );
        const formattedQuestion = response.data.results.map((question) => ({
          ...question,
          question: decodeEntities(question.question),
          incorrect_answers: question.incorrect_answers.map(decodeEntities),
          correct_answers: decodeEntities(question.correct_answers),
        }));
        setQuestions(formattedQuestion);
      } catch (error) {
        console.error("error fetcing data:", error);
      }
    }
    fetchQuestions();
  }, []);

  const handleClick = (answer) => {
    if (answer === questions[currentQuestion].correct_answers) {
      setScore(score + 1);
    }
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowScore(true);
    }
  };
  return (
    <div className="h-screen w-screen text-center bg-gradient-to-r from-pink-200 to-blue-500">
      <div className="min-h-screen flex flex-col justify-center">
        <h1 className="text-4xl font-bold mb-4">Quiz App</h1>
        {questions.length > 0 ? (
          showScore ? (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Your score : {score} / {questions.length}
              </h2>
              <button
                className="bg-blue-500 textwhite py-2 px-4 rounded-md hover:bg-blue-600"
                onClick={() => window.location.reload()}
              >
                Restart Quiz
              </button>
            </div>
          ) : (
            <div className="bg-white items-center justify-center md:mx-52 mx-0 rounded-md p-5">
              <h2 className="text-xl font-semibold mb-4">
                Question {currentQuestion + 1} / {questions.length}
              </h2>
              <p className="text-lg mb-4 font-semibold">{questions[currentQuestion].question}</p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {questions[currentQuestion].incorrect_answers.map(
                  (option, index) => (
                    <button className="bg-blue-500 text-centertext-black py-2 px-4 rounded-md hover:bg-blue-600" key={index} onClick={() => handleClick(option)}>
                      {option}
                    </button>
                  )
                )}
                <button className="bg-blue-500 py-2 px-4 rounded-md hover:bg-blue-600"
                  onClick={() =>
                    handleClick(questions[currentQuestion].correct_answers)
                  }
                >
                  {questions[currentQuestion].correct_answers}
                </button>
              </div>
            </div>
          )
        ) : (
          <p>Loading ...</p>
        )}
      </div>
    </div>
  );
};

export default Quiz;
