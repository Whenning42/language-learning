import React, {useEffect, useContext, useState} from "react"
import { DefaultApi } from '../../analysis_client/api';
import { Configuration } from '../../analysis_client/configuration';
import BlockingSemaphore from "../../lib/blocking_semaphore.mjs";

import "./placement-quiz.css"
import AppContext from "../app-context/app-context";

const config = new Configuration({ basePath: 'http://localhost:8000' }); // TODO: This is for dev
const apiClient = new DefaultApi(config);
const semaphore = new BlockingSemaphore(1);

const kCorrect = "correct";
const kIncorrect = "incorrect";



async function get_question(quiz_id, question_num) {
  const res = await apiClient.sampleWord(quiz_id, question_num - 1);
  return {word: res.data.word, question_num: question_num};
}

function StartQuizPrompt({quizStarted, startQuiz}) {
  if (quizStarted) {
    return (<div/>);
  }

  return (
    <div>
      <button className="quiz-button" onClick={startQuiz}>Start the quiz!</button>
    </div>
  );
}

const hotkeys = {}
function on_keydown(e) {
  if (e.key in hotkeys) {
    hotkeys[e.key]();
  }
}
document.addEventListener('keydown', on_keydown);

function Quiz({quizStarted, quizId}) {
  const num_questions = 100;
  const [curQuestion, setCurQuestion] = useState({
    word: "",
    question_num: 1,
  });

  useEffect(() => {
    async function update() {
      setCurQuestion(await get_question(quizId, curQuestion.question_num));
    }
    if (quizStarted) {
      update();
    }
  }, [quizStarted]);

  const submit_answer = async (answer) => {
    const quiz_answer = {
      quiz_id: quizId,
      question_num: curQuestion.question_num - 1,
      word: curQuestion.word,
      grade: answer
    };

    async function update() {
      console.log("Start Get: ", curQuestion.question_num + 1);
      const new_q = await get_question(quizId, curQuestion.question_num + 1);
      console.log("End Get: ", curQuestion.question_num + 1);
      setCurQuestion(new_q);
      console.log("Start Send: ", quiz_answer.question_num);
      await apiClient.createPlacementQuizAnswer(quiz_answer.quiz_id, quiz_answer.question_num, quiz_answer);
      console.log("End Send: ", quiz_answer.question_num);
    }

    const slot = await semaphore.acquire();
    semaphore.async_call_with_slot(update, slot);
    // TODO: Implement an end to the quiz.
  }
  hotkeys.y = () => {submit_answer(kCorrect); delete hotkeys.y};
  hotkeys.n = () => {submit_answer(kIncorrect); delete hotkeys.n};

  if (!quizStarted) {
    return (<div/>)
  }

  return (
    <div className="quiz-div">
      <div className="quiz-div">
        Question {curQuestion.question_num}/{num_questions}
      </div>
      <div className="quiz-div">
      Do you know the word "{curQuestion.word}"?
      </div>
      <button className="quiz-button" onClick={() => submit_answer(kCorrect)}>Yes</button>
      <button className="quiz-button" onClick={() => submit_answer(kIncorrect)}>No</button>
    </div>
  )
}

function PlacementQuiz () {
  const welcome_blurb = `
Welcome to the placement quiz. We'll ask you a series of questions about the language
you're learning. Answer as best as you can, and we'll use your answers to figure out how
much of your target language you know.`;

  const [quizStarted, setQuizStarted] = useState(false);
  const [quizId, setQuizId] = useState(0);
  const {appState, setAppState} = useContext(AppContext);

  async function startQuiz() {
    console.log("Start quiz!");
    const create_request = {
      user: appState.user_id,
      language: "de_DE",
    };
    const res = await apiClient.createPlacementQuiz(create_request)
    setQuizId(res.data.quiz_id);
    setQuizStarted(true);
  }


  return (
    <div style={{margin: '10px'}}>
      <div className="quiz-div">{welcome_blurb}</div>
      <StartQuizPrompt quizStarted={quizStarted} startQuiz={startQuiz}/>
      <Quiz quizStarted={quizStarted} quizId={quizId}/>
    </div>
  )
}

export default PlacementQuiz;
