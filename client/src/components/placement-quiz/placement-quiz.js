import React, {useEffect, useRef} from "react"

import "./placement-quiz.css"

function PlacementQuiz () {
  const welcome_blurb = `
Welcome to the placement quiz. We'll ask you a series of questions about the language
you're learning. Answer as best as you can, and we'll use your answers to figure out how
much of your target language you know.`

  return (
    <div style={{margin: '10px'}}>
      <div className="quiz-div">{welcome_blurb}</div>
      <div className="quiz-div">
        Question 0/0
      </div>
      <div className="quiz-div">
      Do you know the word "Omlette"?
      </div>
      <button className="quiz-button">Yes</button>
      <button className="quiz-button">Maybe / Sort of</button>
      <button className="quiz-button">No</button>
    </div>
  )
}

export default PlacementQuiz;
