'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import UnitTitle from "@/components/layout/UnitTitle";
import exerciseFetch from "@/hooks/content/exercise";
import { Exercise, Question } from '@/types';
import { API_URL } from '@/constants';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import type { ComponentPropsWithoutRef } from 'react';
import React from 'react';

export default function MediumExercisePage() {
  const searchParams = useSearchParams();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<{correct: boolean, message: string} | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No authentication token found');
          return;
        }
        
        const id = searchParams.get('id');
        if (!id) {
          console.error('No exercise ID provided');
          return;
        }
        
        const response = await exerciseFetch({ token, id });
        console.log('Exercise response:', response);
        
        // Create default questions if none exist
        if (!response.questions || response.questions.length === 0) {
          const defaultQuestions = createDefaultQuestions(response);
          setGeneratedQuestions(defaultQuestions);
          console.log('Created default questions:', defaultQuestions);
        }
        
        setExercise(response);
        
        // Initialize empty answers array based on questions length
        const questionsCount = response.questions?.length || 
                               (response.description ? 1 : 0);
        if (questionsCount > 0) {
          setAnswers(new Array(questionsCount).fill(''));
        }
      } catch (err) {
        console.error(err instanceof Error ? err.message : 'Failed to fetch exercise');
      } finally {
        setLoading(false);
      }
    };

    fetchExercise();
  }, [searchParams]);

  // Create default questions from exercise description
  const createDefaultQuestions = (exercise: Exercise): Question[] => {
    // Always use the description as the question text
    if (exercise.description) {
      // Extract expected answers from the solution query
      const solutionParts = exercise.solutionQuery ? exercise.solutionQuery.split(' ') : [];
      
      // Look for keywords in the solution query that might be answers
      // Filter out common SQL keywords that are unlikely to be answers
      const commonKeywords = ['select', 'from', 'where', 'and', 'or', 'join', 'on', 'group', 'by', 'having', 'order'];
      const potentialAnswers = solutionParts
        .filter(part => part.length > 2)
        .filter(part => !commonKeywords.includes(part.toLowerCase()))
        .map(part => part.replace(/[.,;()]/g, '').trim());
      
      // Use the cleaned solution query parts or fallback to options if available
      const answers = potentialAnswers.length > 0 
        ? potentialAnswers 
        : (exercise.options || "").split(',').map(s => s.trim());
      
      console.log('Generated answers from solution:', answers);
      
      return [{
        id: '1',
        text: exercise.description,
        answers: answers.length > 0 ? answers : ['SQL'],
        // Store the solution query for later validation
        solutionQuery: exercise.solutionQuery
      }];
    }
    
    // Fallback
    return [{
      id: '1',
      text: 'SQL является стандартным языком для работы с ______ базами данных.',
      answers: ['реляционными'],
      solutionQuery: ''
    }];
  };

  // Reset feedback when changing questions
  useEffect(() => {
    setFeedback(null);
    setShowAnswer(false);
  }, [currentQuestion]);

  // Function to extract SQL code blocks and handle inputs
  const processQuestion = (questionText: string) => {
    // Split the entire text into parts before, inside, and after SQL block
    const sqlBlockRegex = /```sql\s+([\s\S]*?)```/;
    const match = questionText.match(sqlBlockRegex);
    
    if (!match) {
      // No SQL block found - return the original text
      return {
        beforeSql: questionText,
        sqlCode: '',
        afterSql: '',
        hasSqlBlock: false
      };
    }
    
    // Extract parts of the text
    const parts = questionText.split(sqlBlockRegex);
    return {
      beforeSql: parts[0]?.trim() || '',
      sqlCode: match[1]?.trim() || '',
      afterSql: parts[2]?.trim() || '',
      hasSqlBlock: true
    };
  };

  const handleInputChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
    
    // Reset feedback when user changes answer
    setFeedback(null);
    setShowAnswer(false);
  };

  const checkAnswer = async () => {
    const questions = exercise?.questions || generatedQuestions;
    const currentQuestionData = questions[currentQuestion];
    
    if (!currentQuestionData || !exercise?.id) return;
    
    // Get the solution query from the exercise or the question
    const solutionQuery = (currentQuestionData as Question).solutionQuery || exercise?.solutionQuery || '';
    
    // Process question to get SQL code if available
    const { sqlCode, hasSqlBlock } = processQuestion(currentQuestionData.text);
    const textToCheck = hasSqlBlock ? sqlCode : currentQuestionData.text;
    
    // Count gaps in the appropriate text
    const gapCount = (textToCheck.match(/______/g) || []).length;
    
    // Check if all answers are filled (not empty)
    const emptyAnswers = answers.slice(0, gapCount).filter(a => a.trim() === '').length;
    
    if (emptyAnswers > 0) {
      setFeedback({
        correct: false,
        message: 'Пожалуйста, заполните все пропуски'
      });
      return;
    }
    
    // Filter out any extra answers beyond the actual gaps
    const userInputs = answers.slice(0, gapCount);

    // Check against solution query (case insensitive)
    let isCorrect = true;
    
    // Compare each user answer with the solution query
    for (const answer of userInputs) {
      if (!solutionQuery.toLowerCase().includes(answer.toLowerCase())) {
        isCorrect = false;
        break;
      }
    }

    // Get the token for authentication
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token found');
      return;
    }

    try {
      // Prepare user's solution query based on answers
      let userQuery = solutionQuery;
      if (!isCorrect) {
        // If incorrect, construct user's attempted query
        userQuery = currentQuestionData.text;
        userInputs.forEach((answer) => {
          userQuery = userQuery.replace('______', answer);
        });
      }

      // Submit solution to API
      const response = await fetch(`${API_URL}/ExerciseSolutions/${exercise.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          query: userQuery
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit solution');
      }

      const result = await response.json();
      console.log('Solution submission result:', result);
      
      // Use API result to update feedback if available
      if (result.feedback) {
        setFeedback({
          correct: result.isCorrect,
          message: result.feedback
        });
      } else {
        // Otherwise use client-side validation result
        setFeedback({
          correct: isCorrect,
          message: isCorrect 
            ? 'Правильно! Хорошая работа.' 
            : 'Не совсем верно. Попробуйте еще раз или посмотрите подсказку.'
        });
      }
      
      // If this is the last question and correct, mark exercise as completed
      const questionsLength = questions.length;
      if (isCorrect && currentQuestion >= questionsLength - 1) {
        setIsCompleted(true);
      }
    } catch (error) {
      console.error('Error submitting solution:', error);
      
      // Fall back to client-side validation if API fails
      setFeedback({
        correct: isCorrect,
        message: isCorrect 
          ? 'Правильно! Хорошая работа.' 
          : 'Не совсем верно. Попробуйте еще раз или посмотрите подсказку.'
      });
      
      // If this is the last question and correct, mark exercise as completed
      const questionsLength = questions.length;
      if (isCorrect && currentQuestion >= questionsLength - 1) {
        setIsCompleted(true);
      }
    }
  };

  const handleNextQuestion = () => {
    const questions = exercise?.questions || generatedQuestions;
    
    if (!questions || questions.length === 0) return;
    
    // Check if feedback exists and is correct, or if showing answer
    if ((feedback && feedback.correct) || showAnswer) {
      // Move to next question if not the last one
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else if (!isCompleted) {
        setIsCompleted(true);
      }
    } else {
      // Check answer first
      checkAnswer();
    }
  };

  const revealAnswer = () => {
    setShowAnswer(true);
  };

  if (loading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!exercise) {
    return <div className="h-screen flex items-center justify-center">Exercise not found</div>;
  }

  // Use questions from API or generated questions
  const questions = exercise.questions || generatedQuestions;
  const currentQuestionData = questions[currentQuestion];
  const solutionQuery = exercise?.solutionQuery || '';
  
  if (!currentQuestionData) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <p className="mb-4">Нет вопросов для этого упражнения</p>
        <button 
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => window.location.href = '/units'}
        >
          Вернуться к списку заданий
        </button>
      </div>
    );
  }

  // Extract potential answers from solution query for reveal functionality
  const getAnswersFromSolution = () => {
    if (!solutionQuery) return currentQuestionData.answers || [];
    
    // Extract keywords from solution query that might be answers
    const solutionParts = solutionQuery.split(' ');
    const commonKeywords = ['select', 'from', 'where', 'and', 'or', 'join', 'on', 'group', 'by', 'having', 'order'];
    
    return solutionParts
      .filter(part => part.length > 2)
      .filter(part => !commonKeywords.includes(part.toLowerCase()))
      .map(part => part.replace(/[.,;()]/g, '').trim())
      .slice(0, (currentQuestionData.text.match(/______/g) || []).length);
  };
  
  // Use provided answers or extract from solution
  const answerOptions = showAnswer 
    ? (currentQuestionData.answers?.length ? currentQuestionData.answers : getAnswersFromSolution())
    : [];
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      
      <UnitTitle title={exercise.title || 'Название задания'} />
      
      <main className="flex-1 bg-bg1">
        <div className="pt-10 pb-10 mx-auto max-w-4xl px-4">
          {/* Level indicator card */}
          <div className="bg-bg2 rounded-xl shadow-md mb-12">
            <div className="p-5 flex justify-between items-center">
              <div className="text-xl font-medium">Уровень</div>
              <div className="bg-[#FFE15C] text-black px-4 py-1 rounded-full">Средний</div>
            </div>
          </div>
          
          {/* Question counter */}
          <div className="text-center mb-10">
            <h2 className="text-2xl font-medium">Задание {currentQuestion + 1} из {questions.length || 1}</h2>
          </div>
          
          {isCompleted ? (
            <div className="text-center py-10">
              <h2 className="text-2xl font-bold mb-4">Поздравляем!</h2>
              <p className="text-xl mb-6">Вы успешно завершили это задание.</p>
              <button 
                className="bg-[#FCBD71] hover:bg-[#FBA94C] text-black px-8 py-3 rounded-lg text-lg font-medium"
                onClick={() => window.location.href = '/units'}
              >
                Вернуться к списку заданий
              </button>
            </div>
          ) : (
            <>
              {/* Question title */}
              <h3 className="text-2xl mb-5">Задание {currentQuestion + 1}:</h3>
              
              {/* Process the question to extract SQL blocks */}
              {(() => {
                const { beforeSql, sqlCode, afterSql, hasSqlBlock } = processQuestion(currentQuestionData.text);
                
                return (
                  <>
                    {/* Text before SQL block */}
                    {beforeSql && (
                      <div className="mb-6">
                        <ReactMarkdown>
                          {beforeSql}
                        </ReactMarkdown>
                      </div>
                    )}
                    
                    {/* SQL Code Editor */}
                    <div className="bg-[#1e1e1e] rounded-lg p-5 mb-6 font-mono text-sm text-white overflow-x-auto">
                      <div className="leading-relaxed whitespace-pre-wrap">
                        {hasSqlBlock ? (
                          // If there's an SQL block, use that
                          <>
                            {sqlCode.split('______').map((part, index, array) => (
                              <React.Fragment key={index}>
                                {/* Display the part of text */}
                                <span>{part}</span>
                                
                                {/* Add input field if it's not the last part */}
                                {index < array.length - 1 && (
                                  <span className="inline-block mx-1 my-1">
                                    <input
                                      type="text"
                                      className={`font-mono px-2 py-1 border rounded min-w-[120px] ${
                                        showAnswer
                                          ? 'border-yellow-500 bg-yellow-900/20 text-yellow-400'
                                          : feedback?.correct
                                          ? 'border-green-500 bg-green-900/20 text-green-400'
                                          : feedback
                                          ? 'border-red-500 bg-red-900/20 text-red-400'
                                          : 'border-blue-500 bg-blue-900/20 text-blue-400'
                                      }`}
                                      placeholder="..."
                                      value={showAnswer ? answerOptions[index] || '' : answers[index] || ''}
                                      onChange={(e) => handleInputChange(index, e.target.value)}
                                      readOnly={showAnswer}
                                    />
                                  </span>
                                )}
                              </React.Fragment>
                            ))}
                          </>
                        ) : (
                          // Fallback for questions without SQL block
                          <>
                            {currentQuestionData.text.split('______').map((part, index, array) => (
                              <React.Fragment key={index}>
                                <span>{part}</span>
                                {index < array.length - 1 && (
                                  <span className="inline-block mx-1 my-1">
                                    <input
                                      type="text"
                                      className={`font-mono px-2 py-1 border rounded min-w-[120px] ${
                                        showAnswer
                                          ? 'border-yellow-500 bg-yellow-900/20 text-yellow-400'
                                          : feedback?.correct
                                          ? 'border-green-500 bg-green-900/20 text-green-400'
                                          : feedback
                                          ? 'border-red-500 bg-red-900/20 text-red-400'
                                          : 'border-blue-500 bg-blue-900/20 text-blue-400'
                                      }`}
                                      placeholder="..."
                                      value={showAnswer ? answerOptions[index] || '' : answers[index] || ''}
                                      onChange={(e) => handleInputChange(index, e.target.value)}
                                      readOnly={showAnswer}
                                    />
                                  </span>
                                )}
                              </React.Fragment>
                            ))}
                          </>
                        )}
                      </div>
                    </div>
                    
                    {/* Text after SQL block */}
                    {afterSql && (
                      <div className="mb-6">
                        <ReactMarkdown>
                          {afterSql}
                        </ReactMarkdown>
                      </div>
                    )}
                  </>
                );
              })()}
              
              {/* Preview of completed query */}
              {answers.some(a => a.trim() !== '') && !showAnswer && (
                <div className="mb-6">
                  <h4 className="text-lg font-medium mb-2">Предпросмотр запроса:</h4>
                  <div className="bg-[#1e1e1e] rounded-lg p-5 font-mono text-sm text-white overflow-x-auto">
                    <pre className="whitespace-pre-wrap">
                      {(() => {
                        const { sqlCode, hasSqlBlock } = processQuestion(currentQuestionData.text);
                        const textToProcess = hasSqlBlock ? sqlCode : currentQuestionData.text;
                        
                        return textToProcess.split('______').reduce((result, part, idx) => {
                          return idx < answers.length
                            ? result + part + (answers[idx] || '______')
                            : result + part;
                        }, '');
                      })()}
                    </pre>
                  </div>
                </div>
              )}
              
              {feedback && (
                <div className={`mt-4 p-3 rounded ${feedback.correct ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {feedback.message}
                </div>
              )}
              
              {showAnswer && (
                <div className="mt-4 mb-6 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="font-medium">Правильный запрос:</p>
                  <div className="bg-[#1e1e1e] rounded-lg p-5 mt-2 font-mono text-sm text-white overflow-x-auto">
                    <pre className="whitespace-pre-wrap">{solutionQuery}</pre>
                  </div>
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <div className="flex justify-between items-center">
                  {!feedback?.correct && !showAnswer && (
                      <div className="">
                        <button
                            className="bg-bg2  text-black px-8 py-3 rounded-lg font-medium"
                            onClick={revealAnswer}
                        >
                          Показать правильный ответ
                        </button>
                      </div>
                  )}
                </div>
                <button 
                  className="bg-bg3 hover:bg-[#FBA94C] text-black px-8 py-3 rounded-lg font-medium"
                  onClick={handleNextQuestion}
                >
                  {feedback?.correct || showAnswer
                    ? currentQuestion < questions.length - 1
                      ? "Следующее задание"
                      : "Завершить"
                    : "Проверить"}
                </button>
              </div>
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 