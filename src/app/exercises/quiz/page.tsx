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

interface QuizOption {
  text: string;
  isCorrect: boolean;
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

  const handleNextQuestion = () => {
    if (selectedOption !== null) {
      // Check if the selected option is correct
      const selectedText = options[selectedOption]?.text || '';
      
      // Award point if this matches the solution query
      let pointAwarded = false;
      
      // Check if the exercise has a solution query to compare with
      if (exercise?.solutionQuery) {
        // Check if the selected option matches or is part of the solution
        const solutionQuery = exercise.solutionQuery.toLowerCase().trim();
        const selectedTextLower = selectedText.toLowerCase().trim();
        
        // Check if the selection is correct by comparing with solution
        // This can be customized based on exact requirements
        if (solutionQuery.includes(selectedTextLower) || 
            selectedTextLower.includes('where') || 
            options[selectedOption]?.isCorrect) {
          setScore(score + 1);
          pointAwarded = true;
          console.log("Correct answer! +1 point awarded.");
        }
      } else if (options[selectedOption]?.isCorrect) {
        // Fallback to using the isCorrect flag if no solution query is available
        setScore(score + 1);
        pointAwarded = true;
        console.log("Correct answer! +1 point awarded.");
      }
      
      console.log(`Selected: "${selectedText}", Point awarded: ${pointAwarded}`);
    }
    
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
    } else {
      setIsQuizCompleted(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedOption(null);
    }
  };

  const handleShareResults = () => {
    // Implementation for sharing results
    alert("Поделиться результатом");
  };

  const handleReturnToList = () => {
    router.push('/units');
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
      <UnitTitle title={`${exercise?.type === 1}`}/>

      
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
                disabled={selectedOption === null}
                className="px-8 py-3 bg-[#ffd699] rounded-md text-gray-800 font-medium hover:bg-[#ffc266] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentQuestionIndex === totalQuestions - 1 ? 'Завершить викторину' : 'Следующий вопрос'}
              </button>
            </div>
          </div>
        ) : (
          <QuizCompletionCard
            score={score}
            totalQuestions={totalQuestions}
            timeSpent={timeSpent}
            onShare={handleShareResults}
            onReturn={handleReturnToList}
          />
        )}
      </div>
      
      {/* Footer with wavy border and logo */}
      <Footer/>
    </main>
  );
} 