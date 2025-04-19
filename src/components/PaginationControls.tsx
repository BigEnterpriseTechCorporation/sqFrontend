import Link from 'next/link';
import React from 'react';

interface PaginationControlsProps {
  currentPage: string;
  previousPage?: {
    name: string;
    href: string;
  };
  nextPage?: {
    name: string;
    href: string;
  };
}

/**
 * Reusable pagination controls component for admin pages
 */
export default function PaginationControls({ 
  currentPage,
  previousPage,
  nextPage 
}: PaginationControlsProps) {
  return (
    <div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-200">
      <div className="flex space-x-2">
        {previousPage ? (
          <>
            <Link href={previousPage.href} className="text-indigo-600 hover:text-indigo-800">
              ← {previousPage.name}
            </Link>
            <span className="text-gray-400 mx-2">•</span>
          </>
        ) : null}
        
        <span className="text-gray-500">{currentPage}</span>
        
        {nextPage ? (
          <>
            <span className="text-gray-400 mx-2">•</span>
            <Link href={nextPage.href} className="text-indigo-600 hover:text-indigo-800">
              {nextPage.name} →
            </Link>
          </>
        ) : null}
      </div>
      
      <div className="text-sm text-gray-500">
        {currentPage} Page
      </div>
    </div>
  );
} 