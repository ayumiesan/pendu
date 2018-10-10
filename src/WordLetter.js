import React from 'react'
import PropTypes from 'prop-types'

import './WordLetter.css'

const HIDDEN_SYMBOL = '_';

const WordLetter = ({ letter, feedback }) => (
    <div className="word-letter">
      {feedback === 'hidden' ? HIDDEN_SYMBOL : letter}
    </div>
);

WordLetter.propTypes = {
    letter: PropTypes.string.isRequired,
    feedback: PropTypes.oneOf([
        'hidden',
        'visible',
    ]).isRequired,
};

export default WordLetter;
