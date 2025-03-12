import React, {useEffect, useRef} from "react"

function PlacementQuiz () {
  const welcome_blurb = `
We'll ask you a series of questions about the language you're learning. Answer as
best as you can, and we'll use your answers to figure out how much of your target
language that you know. (Enter to continue)`

  const blurb_div_ref = useRef(null);

  useEffect(() => {
    if (blurb_div_ref.current) {
      blurb_div_ref.current.focus();
    }
  }, []);

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      console.log("Enter");
    }
  }

  return (
    <div onKeyDown={onKeyDown} tabIndex={0} ref={blurb_div_ref}>
      {welcome_blurb}
    </div>
  )
}

export default PlacementQuiz;
