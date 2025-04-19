import React from 'react';

interface FormSubmitButtonProps {
  loading: boolean;
  loadingText?: string;
  text: string;
  className?: string;
}

/**
 * Reusable form submit button with loading state
 */
export default function FormSubmitButton({
  loading,
  loadingText = 'Processing...',
  text,
  className = ''
}: FormSubmitButtonProps) {
  const baseClasses = "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50";
  
  return (
    <button
      type="submit"
      disabled={loading}
      className={`${baseClasses} ${className}`}
    >
      {loading ? loadingText : text}
    </button>
  );
} 