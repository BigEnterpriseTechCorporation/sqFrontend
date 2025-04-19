interface ErrorStateProps {
  error: string;
}

export default function ErrorState({ error }: ErrorStateProps) {
  return (
    <div className="min-h-screen bg-bg1 bg-stripes flex justify-center items-center">
      <div className="bg-bg3 p-6 rounded-lg border-2 border-black text-center">
        <p className="text-xl font-bold">Error</p>
        <p>{error}</p>
      </div>
    </div>
  );
} 