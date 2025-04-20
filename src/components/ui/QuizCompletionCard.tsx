import React from 'react';

interface QuizCompletionCardProps {
  score: number;
  totalQuestions: number;
  timeSpent: number;
  onShare: () => void;
  onReturn: () => void;
}

export default function QuizCompletionCard({ 
  score, 
  totalQuestions, 
  timeSpent, 
  onShare, 
  onReturn 
}: QuizCompletionCardProps) {
  return (
    <div className="w-full max-w-4xl bg-[#b3d0ff] rounded-lg shadow-lg p-8 mb-8">
      {/* Level indicator */}
      <div className="flex justify-between items-center mb-8 border-b border-dotted border-blue-300 pb-4">
        <div className="text-gray-700">Уровень</div>
        <div className="px-4 py-1 bg-green-400 text-white text-sm rounded-full">Легкий</div>
      </div>
      
      {/* Results content */}
      <div className="mb-8 border border-blue-300 rounded-lg p-6 bg-[#f0f5ff]">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Поздравляем, вы завершили викторину!
        </h2>
        
        <p className="text-lg text-center mb-4">
          Вы набрали {score} балла из {totalQuestions}. Так держать!
        </p>
        
        <p className="text-md text-center mb-8">
          Время выполнения: {timeSpent} минут
        </p>
        
        <div className="flex justify-center">
          <button
            onClick={onShare}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Поделиться результатом
          </button>
        </div>
      </div>
      
      {/* Navigation button */}
      <div className="flex justify-center">
        <button
          onClick={onReturn}
          className="px-8 py-3 bg-[#ffd699] rounded-md text-gray-800 font-medium hover:bg-[#ffc266]"
        >
          Вернуться к списку заданий
        </button>
      </div>
    </div>
  );
} 