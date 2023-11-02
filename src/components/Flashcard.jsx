import React, { useState, useEffect, useRef } from 'react'

export default function Flashcard({flashcard})
{
  const [isFlipped, setIsFlipped] = useState(false);
  const [height, setHeight] = useState('initial');
  const frontElement = useRef();
  const backElement = useRef();

  function setMaxHeight()
  {
    const frontElementHeight = frontElement.current.getBoundingClientRect().height;
    const backElementHeight = backElement.current.getBoundingClientRect().height;
    setHeight(Math.max(frontElementHeight, backElementHeight, 200));
  }

  useEffect(setMaxHeight, [flashcard.question, flashcard.answer, flashcard.options]);

  return (
    <div className={`card ${isFlipped ? 'flip' : ''}`} onClick={() => setIsFlipped(!isFlipped)}>
      <div className='front' ref={frontElement}>
        {flashcard.question}
        {flashcard.options.map(option => <div className='flashcard-option'>{option}</div>)}
      </div>
      <div className='back' ref={backElement}>
        {flashcard.answer}
      </div>
    </div>
  )
}