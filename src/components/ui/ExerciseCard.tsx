import React from 'react';
import Link from 'next/link';
import { ExerciseCardProps } from '@/types/components';

export default function ExerciseCard({ exercise, progress }: ExerciseCardProps) {
  // Map difficulty number to text
  const difficultyText = ["Easy", "Medium", "Hard", "Expert"][exercise.difficulty] || "Unknown";
  
  // Determine difficulty color
  const difficultyColor = {
    0: 'bg-green-100 text-green-800', // Easy
    1: 'bg-blue-100 text-blue-800',   // Medium
    2: 'bg-orange-100 text-orange-800', // Hard
    3: 'bg-red-100 text-red-800',     // Expert
  }[exercise.difficulty] || 'bg-gray-100 text-gray-800';

  // Determine link based on difficulty level
  const links = {
    0:`/exercises/quiz?id=${exercise.id}`,
    1:`/exercises/medium?id=${exercise.id}`,
    2:`/exercises/${exercise.id}`,
    3:`/exercises/${exercise.id}`,
    4:`/exercises/${exercise.id}`,
  }

  const exerciseLink = links[exercise.type];

  return (
    <div className={`bg-bg2 rounded-5 overflow-hidden transition-shadow duration-300 ${progress?.isCompleted ? 'shadow-green-300' : 'shadow-orange'}`}>
      {/* Completion marker */}
      {progress?.isCompleted && (
        <div className="bg-green-500 text-white text-xs font-bold py-1 px-3 text-center">
          COMPLETED
        </div>
      )}
      
      {/* Card content */}
      <div className="p-6 flex flex-col justify-between h-full">
        <div>
          <h3 className="text-xl font-bold mb-2 text-gray-800">{exercise.title}</h3>
          {/* Difficulty badge */}
          <div className={`w-fit px-3 py-1 text-xs font-semibold rounded-full mb-3 ${difficultyColor}`}>
            {difficultyText}
          </div>
          <p className="text-gray-700 mb-4 line-clamp-3">{exercise.description}</p>
        </div>
        
        {/* Action button */}
        <Link 
          href={exerciseLink}
          className={`inline-block py-2 px-4 rounded-lg transition-colors duration-200 w-fit ${
            progress?.isCompleted 
              ? 'bg-green-500 hover:bg-green-600 text-white' 
              : 'bg-bg1 shadow-orange hover:bg-blue-200'
          }`}
        >
          {progress?.isCompleted ? 'Review Exercise' : 'Open Exercise'}
        </Link>
      </div>
    </div>
  );
} 