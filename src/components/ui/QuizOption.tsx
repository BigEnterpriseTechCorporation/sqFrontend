import React from 'react';

interface QuizOptionProps {
  id: string;
  text: string;
  isSelected: boolean;
  onSelect: () => void;
}

export default function QuizOption({ id, text, isSelected, onSelect }: QuizOptionProps) {
  return (
    <div className="flex items-center mb-3">
      <input
        type="radio"
        id={id}
        name="quiz-option"
        className="mr-3 h-5 w-5 text-blue-500"
        checked={isSelected}
        onChange={onSelect}
      />
      <label 
        htmlFor={id}
        className={`flex-1 py-2 px-3 border rounded-md cursor-pointer ${
          isSelected 
            ? 'bg-blue-100 border-blue-400' 
            : 'bg-white border-gray-300'
        }`}
      >
        {text}
      </label>
    </div>
  );
} 