import { Unit } from "@/types";
import Link from "next/link";

interface UnitsListProps {
  visibleUnits: Unit[];
  units: Unit[];
  onLoadMore: () => void;
}

export default function UnitsList({ visibleUnits, units, onLoadMore }: UnitsListProps) {
  return (
    <div className="max-w-5xl mx-auto px-4 pb-10 pt-24 relative mb-52 min-h-[60vh]">
      <div className="space-y-6">
        {visibleUnits.map((unit) => (
          <div 
            key={unit.id} 
            className="bg-bg2 p-6 rounded-lg shadow-orange hover:px-10 ease-in-out duration-300 relative overflow-hidden"
          >
            <Link href={`/unit/${unit.id}`} className="block">
              <h2 className="text-3xl font-bold mb-4">{unit.title}</h2>

              <div className="flex gap-12 text-sm mt-4">
                <p><strong>Created by:</strong> {unit.ownerName}</p>
                <p><strong>Exercises:</strong> {unit.exerciseCount}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {visibleUnits.length < units.length && (
        <div className="flex justify-center mt-12">
          <button 
            onClick={onLoadMore}
            className="bg-bg3 text-gray-800 font-semibold py-3 px-8 rounded-full border-2 border-black shadow-orange hover:bg-gray-100 transition-colors duration-200"
          >
            Загрузить ещё
          </button>
        </div>
      )}
    </div>
  );
} 