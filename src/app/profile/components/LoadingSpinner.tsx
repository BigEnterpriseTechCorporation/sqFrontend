interface LoadingSpinnerProps {
  fullScreen?: boolean;
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

export default function LoadingSpinner({ 
  fullScreen = false, 
  size = 'medium', 
  color = 'border-purple-600' 
}: LoadingSpinnerProps) {
  
  // Size mapping
  const sizeClasses = {
    small: 'h-6 w-6 border-t-1 border-b-1',
    medium: 'h-10 w-10 border-t-2 border-b-2',
    large: 'h-12 w-12 border-t-2 border-b-2'
  };
  
  const spinner = (
    <div className={`animate-spin rounded-full ${sizeClasses[size]} ${color}`}></div>
  );
  
  if (fullScreen) {
    return (
      <div className="min-h-screen bg-pink-200 flex justify-center items-center">
        {spinner}
      </div>
    );
  }
  
  return (
    <div className="flex justify-center items-center py-10">
      {spinner}
    </div>
  );
} 