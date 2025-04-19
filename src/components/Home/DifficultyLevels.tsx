import Image from "next/image";
import WaveYellow from "@/assets/icons/wave-yellow.svg";
import easyLevel from "@/assets/images/easy.png";
import mediumLevel from "@/assets/images/medium.png";
import hardLevel from "@/assets/images/hard.png";
import ultraHardLevel from "@/assets/images/ultra-hard.png";

export default function DifficultyLevels() {
  return (
    <div className="bg-bg1 min-h-[400px] relative overflow-hidden">
      <div className="mx-auto px-4 pt-20 pb-48 flex flex-col items-center">
        <h2 className="text-4xl font-jura mb-16 font-bold text-center">Уровни сложности</h2>
        <div className="w-fit grid grid-cols-4 gap-8">
          <div className="bg-bg2 rounded-2xl p-6 px-6 flex flex-col items-center shadow-orange">
            <div className="w-60 h-48 rounded-2xl overflow-hidden mb-6">
              <Image 
                src={easyLevel}
                alt="Easy level" 
                width={250}
                height={200}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-2xl font-jura font-bold mb-3">Лёгкий</h3>
            <p className="text-center font-raleway">Выберите правильный<br/> вариант из перечня</p>
          </div>

          <div className="bg-bg2 rounded-2xl p-6 flex flex-col items-center shadow-orange">
            <div className="w-60 h-48 rounded-2xl overflow-hidden mb-6">
              <Image 
                src={mediumLevel}
                alt="Medium level" 
                width={250}
                height={200}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-2xl font-jura font-bold mb-3">Средний</h3>
            <p className="text-center font-raleway">Вставьте часть команды в<br/>  текст</p>
          </div>

          <div className="bg-bg2 rounded-2xl p-6 flex flex-col items-center shadow-orange">
            <div className="w-60 h-48 rounded-2xl overflow-hidden mb-6">
              <Image 
                src={hardLevel}
                alt="Hard level" 
                width={250}
                height={200}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-2xl font-jura font-bold mb-3">Сложный</h3>
            <p className="text-center font-raleway">Напишите простой запрос<br/>  полностью</p>
          </div>

          <div className="bg-bg2 rounded-2xl p-6 flex flex-col items-center shadow-orange">
            <div className="w-60 h-48 rounded-2xl overflow-hidden mb-6">
              <Image 
                src={ultraHardLevel}
                alt="Ultra hard level" 
                width={250}
                height={200}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-2xl font-jura font-bold mb-3">Очень сложный</h3>
            <p className="text-center font-raleway">Напишите комплексный<br/>  запрос из множества команд</p>
          </div>
        </div>
      </div>
      <WaveYellow className="absolute bottom-0 w-full"/>
    </div>
  );
} 