import Navigation from "@/components/navigation";
import Header from "@/components/Home/header";
import Image from "next/image";
import catWithGlasses from "@/assets/images/cat-with-glasses.png"
import WavePink from "@/assets/icons/wave-pink.svg"
import WaveYellow from "@/assets/icons/wave-yellow.svg"
import WaveDark from "@/assets/icons/wave-dark.svg"
import Logo from "@/assets/icons/logo.svg"
import easyLevel from "@/assets/images/easy.png"
import mediumLevel from "@/assets/images/medium.png"
import hardLevel from "@/assets/images/hard.png"
import ultraHardLevel from "@/assets/images/ultra-hard.png"
import catWorker from "@/assets/images/car-worker.png"
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div>
      <Navigation/>
      <Header/>
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

      <div className="bg-bg2 min-h-[400px] relative overflow-hidden">
        <div className="w-fit mx-auto px-4 pt-20">
          <h2 className="text-4xl font-jura mb-16 font-bold">Как это работает?</h2>
          
          <div className="grid grid-cols-3 grid-rows-2 gap-x-8 gap-y-4 h-full">
            <div className={"col-start-1 row-start-1"}>
              <h3 className="text-2xl font-jura font-bold mb-4">Интерактивные задания</h3>
              <p className="font-raleway text-md/[170%]">
                Погружайтесь в реальные сценарии работы с<br/> базами данных. Наши задания охватывают все<br/> аспекты SQL — от простых запросов до сложных<br/> операций с несколькими таблицами.
              </p>
            </div>

            <div className={"col-start-1 row-start-2 pb-20"}>
              <h3 className="text-2xl font-jura font-bold mb-4">Пошаговые уроки</h3>
              <p className="font-raleway text-md/[170%]">
                Каждый модуль построен так, чтобы вы могли<br/> учиться в удобном темпе. Мы начинаем с<br/> основ и постепенно переходим к более<br/> сложным темам
              </p>
            </div>

            <Image
                src={catWorker}
                alt="Cat worker"
                width={400}
                height={600}
                className="object-contain col-start-2 row-span-2 self-end justify-self-center relative -bottom-1"
            />

            <div className={"col-start-3 row-start-1 justify-self-end"}>
              <h3 className="text-2xl font-jura font-bold mb-4">Автоматические проверки</h3>
              <p className="font-raleway text-md/[170%]">
                Получайте мгновенную обратную связь на<br/> ваши решения. Вы сможете сразу увидеть<br/> свои ошибки и понять, как их исправить
              </p>
            </div>

            <div className={"col-start-3 row-start-2 pb-20 justify-self-end"}>
              <h3 className="text-2xl font-jura font-bold mb-4">Доступ с любого устройства</h3>
              <p className="font-raleway text-md/[170%]">
                Учитесь где угодно и когда угодно!<br/> Наш тренажер доступен на компьютерах,<br/> планшетах и смартфонах.
              </p>
            </div>
          </div>
        </div>
        <WaveDark className="absolute bottom-0 w-full"/>
      </div>

      {/* Footer section */}
      <Footer/>
    </div>
  ) 
}
