import React from 'react';

export default function Question({question})
{
    return (
        <div className='question-form'>
            {question.text}
            <form className='options'>
                {question.options.map(option => {
                    return (
                        <label>
                            <input
                                type="radio"
                                value={option}
                                checked={question.selectedOption === option}
                                onChange={event => question.selectedOption = event.target.value}/>
                                {option}
                        </label>
                    );
                })}
            </form>
        </div>
    );
}