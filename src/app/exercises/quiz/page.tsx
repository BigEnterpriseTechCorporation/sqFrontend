'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navigation from "@/components/layout/Navigation";
import QuizOption from "@/components/ui/QuizOption";
import ProgressIndicator from "@/components/ui/ProgressIndicator";
import QuizCompletionCard from "@/components/ui/QuizCompletionCard";
import { Exercise } from '@/types';
import exerciseFetch from "@/hooks/content/exercise";
import UnitTitle from "@/components/layout/UnitTitle";
import Footer from "@/components/layout/Footer";
import { API_URL } from '@/constants';

interface QuizOption {
  text: string;
  isCorrect: boolean;
}

interface SolutionResponse {
  isCorrect: boolean;
  attemptCount: number;
  exerciseId: string;
  userId: string;
  feedback: string | null;
}

export default function QuizExercisePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const exerciseId = searchParams.get('id');
  
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime] = useState<number>(Date.now());
  const [options, setOptions] = useState<QuizOption[]>([]);
  const [totalQuestions] = useState(1); // Changed from 4 to 1 to match actual question count
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchExerciseData = async () => {
      if (!exerciseId) {
        router.push('/units');
        return;
      }

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        setIsLoading(true);
        const response = await exerciseFetch({ token, id: exerciseId });
        setExercise(response);
        
        // Parse options from exercise data
        console.log("Full exercise response:", response);
        
        // Add options from main options field
        if (response.options) {
          console.log("Options data type:", typeof response.options);
          console.log("Raw options data:", response.options);
          
          try {
            let parsedOptions = [];
            
            // Handle string format (needs parsing)
            if (typeof response.options === 'string') {
              parsedOptions = JSON.parse(response.options);
              console.log("Parsed string options:", parsedOptions);
            } 
            // Handle array format (already parsed)
            else if (Array.isArray(response.options)) {
              parsedOptions = response.options;
              console.log("Using array options directly:", parsedOptions);
            }
            // Handle object format
            else if (typeof response.options === 'object') {
              console.log("Options is an object:", response.options);
              // Try to convert to array if possible
              if (Object.values(response.options).length > 0) {
                parsedOptions = Object.values(response.options);
              }
            }
            
            // Set the options directly
            if (Array.isArray(parsedOptions) && parsedOptions.length > 0) {
              console.log("Final options to use:", parsedOptions);
              
              // Ensure each option has the required structure for QuizOption component
              const formattedOptions = parsedOptions.map(option => {
                // If option is already a proper object with text and isCorrect
                if (typeof option === 'object' && option !== null && 'text' in option) {
                  return {
                    text: option.text,
                    isCorrect: option.isCorrect || false
                  };
                }
                // If option is a string, convert it to the required format
                else if (typeof option === 'string') {
                  return {
                    text: option,
                    isCorrect: false // Default to false
                  };
                }
                // For any other format, try to convert to string
                else {
                  return {
                    text: String(option),
                    isCorrect: false
                  };
                }
              });
              
              console.log("Formatted options for display:", formattedOptions);
              setOptions(formattedOptions);
            } else {
              console.warn("No valid options found in response");
              setOptions([]);
            }
          } catch (error) {
            console.error("Error processing options:", error);
            console.log("Problematic options data:", response.options);
            setOptions([]);
          }
        } else {
          console.warn("No options field found in response");
          setOptions([]);
        }
      } catch (err) {
        console.error(err instanceof Error ? err.message : 'Failed to fetch exercise');
      } finally {
        setIsLoading(false);
      }
    };

    fetchExerciseData();
  }, [exerciseId, router]);

  // Calculate time spent on completion
  useEffect(() => {
    if (isQuizCompleted) {
      const endTime = Date.now();
      const minutes = Math.floor((endTime - startTime) / 60000);
      setTimeSpent(minutes);
    }
  }, [isQuizCompleted, startTime]);

  const handleOptionSelect = (index: number) => {
    setSelectedOption(index);
  };

  const submitSolution = async (query: string): Promise<SolutionResponse> => {
    if (!exerciseId) {
      throw new Error('Exercise ID is required');
    }

    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      throw new Error('Authentication required');
    }

    try {
      const response = await fetch(`${API_URL}/ExerciseSolutions/${exerciseId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ query })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error submitting solution:', error);
      throw error;
    }
  };

  const handleNextQuestion = async () => {
    if (selectedOption !== null) {
      // Get the selected option text
      const selectedText = options[selectedOption]?.text || '';
      
      setIsSubmitting(true);
      try {
        // Submit the solution to the API for validation
        const result = await submitSolution(selectedText);
        
        // Update score based on API response
        if (result.isCorrect) {
          setScore(score + 1);
          console.log("Correct answer! +1 point awarded.");
        }
        
        // Set feedback if provided
        if (result.feedback) {
          setFeedback(result.feedback);
        }
        
        console.log(`Selected: "${selectedText}", API result: ${result.isCorrect ? 'Correct' : 'Incorrect'}`);
        
        // Proceed to next question or complete quiz
        if (currentQuestionIndex < totalQuestions - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setSelectedOption(null);
          setFeedback(null); // Clear feedback for next question
        } else {
          setIsQuizCompleted(true);
        }
      } catch (error) {
        console.error('Failed to validate solution:', error);
        alert('Error validating your answer. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedOption(null);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen flex flex-col bg-[#f0f5ff]">
        <Navigation />
        <div className="flex flex-1 justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-[#f0f5ff]">
      <Navigation />
      
      {/* Header with wavy border */}
      <UnitTitle title={`${exercise?.title}`}/>

      
      {/* Main content */}
      <div className="flex-1 px-4 py-12 flex flex-col items-center">
        {!isQuizCompleted ? (
          <div className="w-full max-w-4xl bg-[#b3d0ff] rounded-lg shadow-lg p-8 mb-8">
            {/* Level indicator */}
            <div className="flex justify-between items-center mb-8 border-b border-dotted border-blue-300 pb-4">
              <div className="text-gray-700">Уровень</div>
              <div className="px-4 py-1 bg-green-400 text-white text-sm rounded-full">Легкий</div>
            </div>

            {/* Progress indicator */}
            <ProgressIndicator
              currentQuestion={currentQuestionIndex + 1}
              totalQuestions={totalQuestions}
            />

            {/* Question content */}
            <div className="mb-8 border border-blue-300 rounded-lg p-6 bg-[#f0f5ff]">
              <h2 className="text-xl font-medium text-gray-800 mb-6">Вопрос {currentQuestionIndex + 1} из {totalQuestions}</h2>

              <h3 className="text-lg font-medium text-gray-800 mb-8">
                {exercise?.description || `Вопрос ${currentQuestionIndex + 1}:`}
              </h3>

              <div className="space-y-3">
                {options.map((option, index) => (
                  <QuizOption
                    key={index}
                    id={`option-${index}`}
                    text={option.text}
                    isSelected={selectedOption === index}
                    onSelect={() => handleOptionSelect(index)}
                  />
                ))}
              </div>
              
              {feedback && (
                <div className="mt-4 p-3 bg-blue-100 border border-blue-300 rounded-md text-blue-800">
                  {feedback}
                </div>
              )}
            </div>
            
            {/* Navigation buttons */}
            <div className="flex justify-between">
              <button
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className="px-8 py-3 bg-[#ffd699] rounded-md text-gray-800 font-medium hover:bg-[#ffc266] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Предыдущий вопрос
              </button>
              
              <button
                onClick={handleNextQuestion}
                disabled={selectedOption === null || isSubmitting}
                className="px-8 py-3 bg-[#ffd699] rounded-md text-gray-800 font-medium hover:bg-[#ffc266] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Проверка...
                  </span>
                ) : (
                  currentQuestionIndex === totalQuestions - 1 ? 'Завершить викторину' : 'Следующий вопрос'
                )}
              </button>
            </div>
          </div>
        ) : (
          <QuizCompletionCard
            score={score}
            totalQuestions={totalQuestions}
            timeSpent={timeSpent}
          />
        )}
      </div>
      
      {/* Footer with wavy border and logo */}
      <Footer/>
    </main>
  );
} 