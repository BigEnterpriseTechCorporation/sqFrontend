import Image from "next/image";
import catWithGlasses from "@/assets/images/cat-with-glasses.png";
import WavePink from "@/assets/icons/wave-pink.svg";

export default function AboutTrainer() {
  return (
    <div className="bg-bg2 min-h-[400px] relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 pt-20 pb-48 flex items-center justify-between">
        <div className="max-w-xl">
          <h2 className="text-4xl font-jura mb-6 font-bold">О тренажере</h2>
          <p className="text-md/[170%] font-raleway leading-relaxed">
            Наш тренажер по SQL — это интерактивная платформа, созданная для того, чтобы сделать обучение базам данных простым и увлекательным. Мы понимаем, что изучение SQL может быть сложным, особенно для новичков. Поэтому мы разработали уникальный подход, который сочетает теорию и практику, позволяя вам быстро освоить язык запросов.
          </p>
        </div>
        <div className="rounded-2xl overflow-hidden shadow-lg">
          <Image 
            src={catWithGlasses}
            alt="Smart cat with glasses" 
            width={400} 
            height={400}
            className="border-2 border-black rounded-5"
          />
        </div>
      </div>
      <WavePink className="absolute bottom-0 w-full"/>
    </div>
  );
} 