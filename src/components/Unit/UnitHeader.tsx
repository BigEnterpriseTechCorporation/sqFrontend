interface UnitHeaderProps {
  ownerName: string;
  exerciseCount: string | number;
}

export default function UnitHeader({ ownerName, exerciseCount }: UnitHeaderProps) {
  return (
    <div className="bg-bg2 p-6 rounded-lg mb-10 shadow-orange">
      <div className="flex justify-between text-sm opacity-75">
        <p><strong>Created by:</strong> {ownerName}</p>
        <p className={"font-bold"}>Exercises: {exerciseCount}</p>
      </div>
    </div>
  );
} 