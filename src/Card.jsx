import React from 'react';
import { WORDS } from './words';
import windowSize from 'react-window-size';
import Confetti from 'react-confetti';
import clock from './clock.svg';
import buzzer from './buzzer.mp3';

class WordCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      words: WORDS,
      currentWord: '',
      showConfetti: false,
      currentTeam: 1,
      teamOneScore: 0,
      teamTwoScore: 0,
      seconds: 60,
      gameOver: false,
    };
    this.timer = 0;
    this.audio = new Audio();

    this.countDown = this.countDown.bind(this);
  }

  correct() {
    this.getNewWord();
    if (this.state.currentTeam === 1) {
      this.setState({
        teamOneScore: this.state.teamOneScore + 1,
        showConfetti: true
      })
    } else {
      this.setState({
        teamTwoScore: this.state.teamTwoScore + 1,
        showConfetti: true
      })
    }
    setTimeout(() => {
      this.setState({showConfetti: false})
    }, 1500)
  }

  skip() {
    this.getNewWord()
  }

  switchTeams() {
    clearInterval(this.timer);
    this.setState({
      seconds: 60
    })
    this.timer = 0;
    if (this.state.currentTeam === 1) {
      this.setState({
        currentTeam: 2
      })
    } else {
      this.setState({
        currentTeam: 1
      })
    }
  }

  getNewWord() {
    const randomIndex = Math.floor(Math.random() * Math.floor(this.state.words.length));
    // Set the current word to the randomIndex
    // remove the randomIndex from state.words
    let words = [...this.state.words];
    const currentWord = words[randomIndex];
    words.splice(randomIndex, 1);
    this.setState({
      words: words,
      currentWord: currentWord,
    })
    if (this.state.words.length === 0) {
      this.setState({
        gameOver: true
      })
      clearInterval(this.timer);
      this.setState({
        seconds: 60
      })
      this.timer = 0;
    }
  }

  startTimer() {
    this.getNewWord();
    if (this.timer === 0 && this.state.seconds > 0) {
      this.timer = setInterval(this.countDown, 1000);
    }
    this.audio = new Audio();
    this.audio.play()
  }

  countDown() {
    // Remove one second, set state so a re-render happens.
    let seconds = this.state.seconds - 1;
    this.setState({seconds});
    // Check if we're at zero.
    if (seconds === 0) { 
      clearInterval(this.timer);
      this.audio.src = buzzer;
      this.audio.play();
    }
  }

  componentDidMount() {
    this.setState({
      audio: new Audio()
    })
  }

  render() {

    const styles = {
      button: {
        width: '100%',
        height: '4rem',
        color: 'black',
        fontSize: '1.5rem',
        fontWeight: 'bold'
      },
      heading: {
        fontSize: '3rem',
        margin: '3rem 0',
      },
      card: {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxSizing: 'border-box',
        padding: '2rem 2rem 10rem 2rem'
      }
    }
    const outOfWords = (
      <div style={styles.card}>
        <h1>Out of words</h1>
        <button style={styles.button}onClick={() => window.location.reload(false)}>Start over</button>
        <div className="scoreCardRow">
          <div className={this.state.currentTeam === 1 ? 'scoreCard active' : 'scoreCard'}>
            <div className="title">Team One</div>
            <div className="score">{this.state.teamOneScore}</div>
          </div>
          <div className={this.state.currentTeam === 2 ? 'scoreCard active' : 'scoreCard'}>
            <div className="title">Team Two</div>
            <div className="score">{this.state.teamTwoScore}</div>
          </div>
        </div>
      </div>
    );
    const gamePlay = (
      <div style={styles.card}>
        <audio className="buzzer">
          <source></source>
        </audio>
        <Confetti
          className={this.state.showConfetti ? 'confetti on' : 'confetti off'}
          width={this.props.windowWidth}
          height={this.props.windowHeight}
        />
        <div className="header">
          {
            this.timer === 0 ? (
              <button style={styles.button} onClick={this.startTimer.bind(this)}>Start</button>
            ) : (
              <h1 style={styles.heading}>{this.state.currentWord}</h1>
            )
          }
        </div>
        <div className="timerRow">
          <img src={clock} alt="clock"/>{this.state.seconds}
        </div>
        <div className="scoreCardRow">
          <div className={this.state.currentTeam === 1 ? 'scoreCard active' : 'scoreCard'}>
            <div className="title">Team One</div>
            <div className="score">{this.state.teamOneScore}</div>
          </div>
          <div className={this.state.currentTeam === 2 ? 'scoreCard active' : 'scoreCard'}>
            <div className="title">Team Two</div>
            <div className="score">{this.state.teamTwoScore}</div>
          </div>
        </div>
        {
          this.state.seconds === 0 ? (
            <button style={styles.button} onClick={this.switchTeams.bind(this)}>Switch Teams</button>
          ) : (
            <div className="buttonRow">
              <button disabled={this.state.seconds === 0 || this.timer === 0} style={styles.button} className="correct" onClick={this.correct.bind(this)}>Correct</button>
              <button disabled={this.state.seconds === 0 || this.timer === 0} style={styles.button} className="skip" onClick={this.skip.bind(this)}>Skip</button>
            </div>
          )
        }
      </div>
    );
    if (this.state.gameOver) {
      return outOfWords
    } else {
      return gamePlay
    }
  } 
}

export default windowSize(WordCard);