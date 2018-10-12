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
        scores: [0,0],
        players: ['Joueur 1', 'Joueur 2'],
        currentPlayer: 0,
    };

    generateWord() {
        const word = words.words[Math.floor(Math.random() * 811)];

        return word.split('');
    }

    handleLetterClick = index => {
        const { letters, selectedLetters, matchedWord, guesses, scores, currentPlayer } = this.state;
        const letter = letters[index];
        let newScores = this.state.scores.slice();

        if (matchedWord.indexOf(letter) !== -1) {
            if (selectedLetters.indexOf(letter) === -1) {
                this.updateMatchedLetters(letter);
                newScores[currentPlayer] = scores[currentPlayer] + 2;
                this.setState({ scores: newScores });
            }
            else {
                newScores[currentPlayer] = scores[currentPlayer] - 2;
                this.setState({ scores: newScores });
                this.changePlayer();
            }
        }
        else {
            newScores[currentPlayer] = scores[currentPlayer] - 1;
            this.setState({ scores: newScores });
            this.changePlayer();
        }

        if (selectedLetters.indexOf(letter) === -1) {
            this.setState({ selectedLetters: [...selectedLetters, ...letter] });
        }

        this.setState({ guesses: guesses + 1 });
    };

    changePlayer = event => {
        const { currentPlayer } = this.state;

        this.setState({ currentPlayer: currentPlayer === 0 ? 1 : 0 });
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
            scores: [0,0],
            players: ['Joueur 1', 'Joueur 2'],
            currentPlayer: 0,
        });
    };

    handleKeyDown = (event) => {
        const {letters} = this.state;
        const index = letters.indexOf(event.key.toUpperCase());

        if (index !== -1) {
            this.handleLetterClick(index);
        }
    };

    componentDidMount() {
        document.addEventListener("keydown", this.handleKeyDown, false);
    };

    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleKeyDown, false);
    };

    render() {
        const { letters, matchedWord, matchedIndex, guesses, scores, players, currentPlayer } = this.state;
        const won = matchedWord.length === matchedIndex.length;
        const winner = scores[0] > scores[1] ? players[0] : players[1];

        return (
          <div className="pendu">
              <p>Nombre d'essais effectués : {guesses}</p>
              <p>{players[currentPlayer]} à vous de jouer !</p>
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
                          <p>Le gagnant est <b>{winner}</b>! Voici les scores :</p>
                          <p>{players[0]} : {scores[0]}</p>
                          <p>{players[1]} : {scores[1]}</p>
                          <button className="remake-button" onClick={this.remakeGame}>Redémarrer une partie</button>
                      </div>
                    :
                      <div>
                          <p>Cliquez sur une lettre ou tapez une lettre sur votre clavier !</p>
                          {letters.map((letter, index) => (
                              <Letter
                                  letter={letter}
                                  feedback={this.getFeedbackForLetter(index)}
                                  index={index}
                                  key={index}
                                  onClick={this.handleLetterClick}
                              />
                          ))}
                      </div>
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
