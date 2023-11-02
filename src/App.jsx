import { useState, useEffect, useRef } from 'react'
import FlashcardList from './components/FlashcardList';
import axios from 'axios';
import QuestionList from './components/QuestionList';

export default function App()
{
  const catRef = useRef();
  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [points, setPoints] = useState(0);
  useEffect(() => {
    axios.get('https://opentdb.com/api_category.php').then(response => setCategories(response.data.trivia_categories));
  });

  const [flashcards, setFlashcards] = useState([]);
  useEffect(() => {
    const apiUrl = window.sessionStorage.getItem('apiUrl');
    axios.get(apiUrl === null ? '' : apiUrl)
    .then(response => {
      if (window.sessionStorage.getItem('submitted') == null)
      {
        setQuestions(response.data.results.map((item, id) => {
          const answer = item.correct_answer;
          const answers = [...item.incorrect_answers, answer];
          return {
            id: `${id}-${Date.now()}`, // This is done to ensure that every question has a unique ID
            text: decodeString(item.question),
            answer: decodeString(answer),
            options: answers.sort(() => Math.random() - 0.5).map(op => decodeString(op)),
            selectedOption: ""
          };
        }));
        return;
      }

      const questionArray = JSON.parse(window.sessionStorage.getItem('questions'));
      setFlashcards(questionArray.map((item, id) => {
        return {
          id: `${id}-${Date.now()}`,
          question: decodeString(item.text),
          answer: decodeString(item.answer),
          options: item.options.sort(() => Math.random() - 0.5).map(op => decodeString(op))
        };
      })
    );
    });  
  }, []);

  return elementsToBeRendered(catRef, categories, flashcards, questions, points, setPoints);
}

function generateQuestions()
{
  const categoryList = document.getElementById('category');

  const difficultyList = document.getElementById('difficulty');
  const difficulty = difficultyList.options[difficultyList.selectedIndex].value;

  const typeList = document.getElementById('type');
  const type = typeList.options[typeList.selectedIndex].value;
  const data = {
    amount: 'amount=' + document.getElementById('amount').value,
    category: '&category=' + categoryList.options[categoryList.selectedIndex].value,
    difficulty: difficulty === 'any' ? '' : '&difficulty=' + difficulty,
    type: type === 'any' ? '' : '&type=' + type
  };

  window.sessionStorage.setItem('apiUrl', `https://opentdb.com/api.php?${data.amount}${data.category}${data.difficulty}${data.type}`);
  window.sessionStorage.setItem('generated', true);
}

function elementsToBeRendered(catRef, categories, flashcards, questions, points, setPoints)
{
  if (window.sessionStorage.getItem('submitted') !== null)
  {
    return (
      <div>
        <h1>Your score is: {window.sessionStorage.getItem('points')}/{questions.length}</h1>
        <FlashcardList flashcards={flashcards}/>
      </div>
    );
  }
  
  const isGeneratedItem = window.sessionStorage.getItem('generated');
  let isGenerated = isGeneratedItem === null ? false : isGeneratedItem;
  return (
    <div>
      <form className='category-header'>
        <div className='category-form'>
          <label htmlFor='category'>Category: </label>
          <select id='category' ref={catRef}>
            {categories.map(category => <option value={category.id} key={category.id}>{category.name}</option>)}
          </select>
        </div>
      </form>
      <form className='amount-header'>
        <div className='amount-form'>
          <label htmlFor='amount'>Number of questions: </label>
          <input type='number' id='amount' min={1} max={50} defaultValue={10}/>
        </div>
      </form>
      <form className='difficulty-header'>
        <div className='difficulty-form'>
          <label htmlFor='difficulty'>Difficulty: </label>
          <select id='difficulty'>
            {[['any', 'Any'], ['easy', 'Easy'], ['medium', 'Medium'], ['hard', 'Hard']].map(diff => {
              return <option value={diff[0]} key={diff[0]}>{diff[1]}</option>;
            })}
          </select>
        </div>
      </form>
      <form className='type-header'>
        <div className='type-form'>
          <label htmlFor='type'>Type: </label>
          <select id='type'>
            {[['any', 'Any'], ['boolean', 'True/False'], ['multiple', 'Multiple choice']].map(type => {
              return <option value={type[0]} key={type[0]}>{type[1]}</option>;
            })}
          </select>
        </div>
      </form>
      <form>
        <button disabled={isGenerated} onClick={generateQuestions}>Generate</button>
      </form>
      <QuestionList questions={questions} points={points} setPointsCallback={setPoints}/>
    </div>
  );
}

function decodeString(string)
{
  const textArea = document.createElement('textarea');
  textArea.innerHTML = string;
  return textArea.value;
}