import React, { Component } from 'react';
import './App.css';

import WordLetter from './WordLetter';
import Letter from './Letter';
import words from './words_list.json';

const LETTERS = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

class App extends Component {

    state = {
        letters: LETTERS,
        selectedLetters: [],
        matchedIndex: [],
        matchedWord: this.generateWord(),
        guesses: 0,
        score: 0,
    };

    generateWord() {
        const word = words.words[Math.floor(Math.random() * 811)];

        return word.split('');
    }

    handleLetterClick = index => {
        const { letters, selectedLetters, matchedWord, guesses, score } = this.state;
        const letter = letters[index];

        if (matchedWord.indexOf(letter) !== -1) {
            if (selectedLetters.indexOf(letter) === -1) {
                this.updateMatchedLetters(letter);
                this.setState({ score: score + 2 });
            }
            else {
                this.setState({ score: score - 2 });
            }
        }
        else {
            this.setState({ score: score - 1 });
        }

        if (selectedLetters.indexOf(letter) === -1) {
            this.setState({ selectedLetters: [...selectedLetters, ...letter] });
        }

        this.setState({ guesses: guesses + 1 });
    };

    updateMatchedLetters = letter => {
        const { matchedWord, matchedIndex } = this.state;

        var indexOfLetter = matchedWord.indexOf(letter);
        var indexToAdd = [indexOfLetter];

        while ( indexOfLetter !== -1 ) {
            indexOfLetter = matchedWord.indexOf( letter, indexOfLetter + 1 );
            if (indexOfLetter !== -1) {
                indexToAdd.push(indexOfLetter);
            }
        }

        this.setState({matchedIndex: [...matchedIndex, ...indexToAdd] });
    };

    getFeedbackForLetter = index => {
        const { letters, selectedLetters } = this.state;
        const letter = letters[index];

        return selectedLetters.indexOf(letter) !== -1 ? 'used' : 'unused';
    };

    getFeedbackForWordLetter = index => {
        const { matchedIndex } = this.state;

        for (var i = 0; i < matchedIndex.length; i++) {
            if (matchedIndex[i] === index) {
                return 'visible';
            }
        }

        return 'hidden';
    };

    remakeGame = event => {
        this.setState({
            letters: LETTERS,
            selectedLetters: [],
            matchedIndex: [],
            matchedWord: this.generateWord(),
            guesses: 0,
        });
    };

    render() {
        const { letters, matchedWord, matchedIndex, guesses, score } = this.state;
        const won = matchedWord.length === matchedIndex.length;

        return (
          <div className="pendu">
              <p>Nombre d'essais effectués : {guesses}</p>
              <div className="word">
                  {matchedWord.map((letter, index) => (
                      <WordLetter
                          letter={letter}
                          index={index}
                          key={index}
                          feedback={this.getFeedbackForWordLetter(index)}
                      />
                  ))}
              </div>
              <div className="letters">
                  {won ?
                      <div className="remake">
                          <p>Fin de partie ! Voici votre score : {score}</p>
                          <button className="remake-button" onClick={this.remakeGame}>Redémarrer une partie</button>
                      </div>
                    : letters.map((letter, index) => (
                          <Letter
                              letter={letter}
                              feedback={this.getFeedbackForLetter(index)}
                              index={index}
                              key={index}
                              onClick={this.handleLetterClick}
                          />
                    ))
                  }
                  <div className="score_calculation">
                        <h2>Calcul du score</h2>
                        <table>
                            <tbody>
                                <tr>
                                    <td>Lettre présente</td>
                                    <td>+2 points</td>
                                </tr>
                                <tr>
                                    <td>Lettre absente</td>
                                    <td>-1 point</td>
                                </tr>
                                <tr>
                                    <td>Lettre retentée</td>
                                    <td>-2 points</td>
                                </tr>
                            </tbody>
                        </table>
                  </div>
              </div>
          </div>
        );
    }
}

export default App;
