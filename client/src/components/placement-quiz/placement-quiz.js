import React, {useEffect, useState} from "react"

import "./placement-quiz.css"
import http from "../../http-common"

function PlacementQuiz () {
  const welcome_blurb = `
Welcome to the placement quiz. We'll ask you a series of questions about the language
you're learning. Answer as best as you can, and we'll use your answers to figure out how
much of your target language you know.`;

  const [randomOffset, setRandomOffset] = useState(Math.floor(Math.random() * 10_000));
  const [curQuestion, setCurQuestion] = useState(0);
  const [word, setWord] = useState("");

  const num_questions = 100;
  const user = "demo-user";

  useEffect(() => {
    getNextQuestion();
  }, []);

  const getNextQuestion = (random_offset=null) => {
    var offset = randomOffset;
    if (random_offset) {
      offset = Math.floor(Math.random() * 10_000)
      setRandomOffset(offset);
    }
    const qn = curQuestion + 1;
    const q_id = randomOffset + qn;
    setWord("omlette_" + qn);
    setCurQuestion(qn);

    http.get(`/placement-quiz/sample-word/${user}/${q_id}`)
      .then(res => {
        setWord(res.word);
      })
      .catch(e => {
        console.error(e);
      });
  }

  const respond = (answer) => {
    const question_answer = {
      word: word,
      answer: answer
    };

    http.put(`/placement-quiz/answers/${user}`, question_answer)
      .then(res => { getNextQuestion(); })
      .catch(e => { 
        console.log(e);
        getNextQuestion();
      });

    // TODO: Implement an end to the quiz.
  }

  return (
    <div style={{margin: '10px'}}>
      <div className="quiz-div">{welcome_blurb}</div>
      <div className="quiz-div">
        Question {curQuestion}/{num_questions}
      </div>
      <div className="quiz-div">
      Do you know the word "{word}"?
      </div>
      <button className="quiz-button" onClick={() => respond("yes")}>Yes</button>
      <button className="quiz-button" onClick={() => respond("sort of")}>Sort of</button>
      <button className="quiz-button" onClick={() => respond("no")}>No</button>
    </div>
  )
}

export default PlacementQuiz;
