import React, {useEffect, useState, useRef} from "react"

import "./placement-quiz.css"
import {authedHttp} from "../../lib/auth-service"

function randint(max) {
  return Math.floor(Math.random() * max);
}

async function get_question(question_num, question_offset) {
    const question_id = question_num + question_offset;
    var new_word = ""
    try {
      var res = await authedHttp().get(`/placement-quiz/sample-word/${question_id}`)
      new_word = res.word;
    } catch (e) {
      new_word = "mock_q_" + question_num;
    }
    return {word: new_word, question_num: question_num};
}

function PlacementQuiz () {
  const welcome_blurb = `
Welcome to the placement quiz. We'll ask you a series of questions about the language
you're learning. Answer as best as you can, and we'll use your answers to figure out how
much of your target language you know.`;

  const num_questions = 100;
  const questions_offset = useRef(0);
  const [curQuestion, setCurQuestion] = useState({
    word: "",
    question_num: 1,
  });

  useEffect(() => {
    async function update() {
      setCurQuestion(await get_question(1, questions_offset.current));
    }
    questions_offset.current = randint(10_000);
    update();
  }, [questions_offset]);


  const respond = async (answer) => {
    const answer = {
      word: curQuestion['word'],
      answer: answer
    };

    try {
      await authedHttp().put(`/placement-quiz/answers`, answer)
    } catch (e) {}
    var new_q = await get_question(curQuestion['question_num'] + 1, questions_offset.current)
    setCurQuestion(new_q);

    // TODO: Implement an end to the quiz.
  }

  return (
    <div style={{margin: '10px'}}>
      <div className="quiz-div">{welcome_blurb}</div>
      <div className="quiz-div">
        Question {curQuestion['question_num']}/{num_questions}
      </div>
      <div className="quiz-div">
      Do you know the word "{curQuestion['word']}"?
      </div>
      <button className="quiz-button" onClick={() => respond("yes")}>Yes</button>
      <button className="quiz-button" onClick={() => respond("sort of")}>Sort of</button>
      <button className="quiz-button" onClick={() => respond("no")}>No</button>
    </div>
  )
}

export default PlacementQuiz;
