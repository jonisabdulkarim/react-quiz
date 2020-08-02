import React, { useState } from 'react';
import { fetchQuizQuestions } from './API';
// Components
import QuestionCard from './components/QuestionCard';
// Types
import { QuestionState, Difficulty } from './API';
// Styles
import { GlobalStyle, Wrapper } from './App.styles';

export type AnswerObject = {
    question: string;
    answer: string;
    correct: boolean;
    correctAnswer: string;
}

const TOTAL_QUESTIONS = 10;

const App = () => {
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState<QuestionState[]>([]);
    const [number, setNumber] = useState(0);
    const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(true);

    // console.log(fetchQuizQuestions(TOTAL_QUESTIONS, Difficulty.EASY));
    // console.log(questions);

    // listener for start game button, sets all states to default,
    // fetches questions, and sets loading state to false when done
    const startTriva = async () => {
        setLoading(true); // game is loading
        setGameOver(false); // game is not over when started

        // fetch questions from API
        const newQuestions = await fetchQuizQuestions(
            TOTAL_QUESTIONS,
            Difficulty.EASY
        );

        setQuestions(newQuestions);
        setScore(0);
        setUserAnswers([]);
        setNumber(0);

        setLoading(false); // game finished loading (hopefully!)
    }

    // listener for the answer buttons
    const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!gameOver) {
            // retrieve user's answer from clicked button
            const answer = e.currentTarget.value; // gets button value
            // check user's answer against correct answer
            const correct = questions[number].correct_answer === answer;
            // add score if answer is correct
            if (correct) {
                setScore(prev => prev + 1);
            }
            // save answer in array of all user's answers so far
            const answerObject = {
                question: questions[number].question,
                answer,
                correct,
                correctAnswer: questions[number].correct_answer,
            };
            setUserAnswers(prev => [...prev, answerObject]);
        }
    }

    const nextQuestion = () => {
        // move on to the next question if not last question
        const nextQuestion = number + 1;
        
        if (nextQuestion === TOTAL_QUESTIONS) {
            setGameOver(true);
        } else {
            setNumber(nextQuestion);
        }
    }

    return (
        <>
            <GlobalStyle />
            <Wrapper>
                <h1>REACT QUIZ</h1>

                {
                    // Show start button if gameOver OR total answers = total questions
                    // else null
                    gameOver || userAnswers.length === TOTAL_QUESTIONS ? (
                        <button className="start" onClick={startTriva}>
                            Start
                        </button>
                    ) :  null
                }
                {
                    // Show score if not gameOver else null
                    !gameOver ? <p className="score">Score: {score}</p> : null
                }
                {
                    // Show Loading text when loading game
                    loading && <p>Loading Questions...</p>
                }
                {
                    // Show question card when neither loading/gameOver
                    !loading && !gameOver && (
                    <QuestionCard 
                        questionNr={number + 1}
                        totalQuestions={TOTAL_QUESTIONS}
                        question={questions[number].question}
                        answers={questions[number].answers}
                        userAnswer={userAnswers ? userAnswers[number] : undefined}
                        callback={checkAnswer}
                    />
                )}
                {
                    // Show next button when NOT loading/gameover
                    // and user HAS selected an answer
                    // and current question is NOT last question
                    !gameOver && !loading && 
                    userAnswers.length === number + 1 && 
                    number !== TOTAL_QUESTIONS - 1 ? (
                        <button className="next" onClick={nextQuestion}>
                            Next Question
                        </button>
                    ) : null
                }
            </Wrapper>
        </>
    );
}

export default App;
