import React from 'react'
import Flashcard from './Flashcard';

export default function FlashcardList({flashcards})
{
  return (
    <div className='card-grid'>
      {flashcards.map(flashcard => <Flashcard flashcard={flashcard} key={flashcard.id}/>)}
    </div>
  );
}
