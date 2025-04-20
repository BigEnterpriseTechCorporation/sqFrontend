import React from 'react';

interface ProgressIndicatorProps {
  currentQuestion: number;
  totalQuestions: number;
}

export default function ProgressIndicator({ currentQuestion, totalQuestions }: ProgressIndicatorProps) {
  // Calculate progress percentage
  const progressPercentage = (currentQuestion / totalQuestions) * 100;
  
  return (
    <div className="w-full mb-6">
      <div className="flex justify-between mb-2 text-sm text-gray-600">
        <span>Прогресс</span>
        <span>{currentQuestion} из {totalQuestions}</span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-green-500 rounded-full"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  );
} 