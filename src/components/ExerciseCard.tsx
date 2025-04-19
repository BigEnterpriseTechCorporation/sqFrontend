import React from 'react';
import Link from 'next/link';
import { Exercise } from '@/types';

interface ExerciseCardProps {
  exercise: Exercise;
}

export default function ExerciseCard({ exercise }: ExerciseCardProps) {
  // Map difficulty number to text
  const difficultyText = ["Easy", "Medium", "Hard", "Expert"][exercise.difficulty] || "Unknown";
  
  // Determine difficulty color
  const difficultyColor = {
    0: 'bg-green-100 text-green-800', // Easy
    1: 'bg-blue-100 text-blue-800',   // Medium
    2: 'bg-orange-100 text-orange-800', // Hard
    3: 'bg-red-100 text-red-800',     // Expert
  }[exercise.difficulty] || 'bg-gray-100 text-gray-800';

  return (
    <div className="bg-bg2 rounded-5 overflow-hidden transition-shadow duration-300 shadow-orange">

      {/* Card content */}
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-gray-800">{exercise.title}</h3>
        <p className="text-gray-700 mb-4 line-clamp-3">{exercise.description}</p>
        
        {/* Difficulty badge */}
        <div className="mb-4">
          <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${difficultyColor}`}>
            {difficultyText}
          </span>
        </div>
        
        {/* Action button */}
        <Link 
          href={`/exercises/${exercise.id}`}
          className="inline-block bg-bg1 shadow-orange py-2 px-4 rounded-lg hover:bg-blue-200 transition-colors duration-200"
        >
          Open Exercise
        </Link>
      </div>
    </div>
  );
} 