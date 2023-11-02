import React from 'react'
import Question from './Question'

export default function QuestionList({questions, points, setPointsCallback})
{
  return (
    <div>
      {questions.map(question => <Question question={question} id={question.id}/>)}
      <button
        onClick={e => submit(questions, points, setPointsCallback)}
        disabled={window.sessionStorage.getItem('generated') === null}>Submit</button>
    </div>
  );
}

function submit(questions, points, setPointsCallback)
{
  window.sessionStorage.setItem('questions', JSON.stringify(questions));

  questions.map(q => setPointsCallback(points += q.selectedOption === q.answer ? 1 : 0));
  
  window.sessionStorage.setItem('submitted', true);
  window.sessionStorage.setItem('points', points);
  window.sessionStorage.setItem('highscore', points);
}