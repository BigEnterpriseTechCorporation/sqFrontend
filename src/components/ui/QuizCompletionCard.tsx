import React from 'react';

interface QuizCompletionCardProps {
  score: number;
  totalQuestions: number;
  onReturn: () => void;
}

export default function QuizCompletionCard({ 
  score, 
  totalQuestions,
  onReturn 
}: QuizCompletionCardProps) {
  return (
    <div className="w-full max-w-4xl bg-[#b3d0ff] rounded-5 shadow-lg p-8 mb-8">
      {/* Level indicator */}
      <div className="flex justify-between items-center mb-2 border-b border-dotted border-blue-300 pb-4">
        <div className="text-gray-700">Уровень</div>
        <div className="px-4 py-1 bg-green-400 text-white text-sm rounded-full">Легкий</div>
      </div>
      
      {/* Results content */}
      <div className="mb-10 bg-white py-20 rounded-2xl">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Поздравляем, вы завершили викторину!
        </h2>
        
        <p className="text-lg text-center mb-4">
          Вы набрали {score} балла из {totalQuestions}. Так держать!
        </p>
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