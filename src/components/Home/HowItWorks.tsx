import Image from "next/image";
import WaveDark from "@/assets/icons/wave-dark.svg";
import catWorker from "@/assets/images/car-worker.png";

export default function HowItWorks() {
  return (
    <div className="lg:bg-bg2 bg-bg1 min-h-[400px] relative overflow-hidden">
      <div className="w-fit mx-auto px-4 pt-20">
        <h2 className="text-4xl font-jura mb-16 font-bold">Как это работает?</h2>
        
        <div className="lg:grid lg:grid-cols-3 lg:grid-rows-2 flex flex-col gap-x-8 lg:gap-y-4 gap-y-12 h-full">
          <div className={"lg:col-start-1 lg:row-start-1"}>
            <h3 className="text-2xl font-jura font-bold mb-4">Интерактивные задания</h3>
            <p className="font-raleway text-md/[170%]">
              Погружайтесь в реальные сценарии работы с<br/> базами данных. Наши задания охватывают все<br/> аспекты SQL — от простых запросов до сложных<br/> операций с несколькими таблицами.
            </p>
          </div>

          <div className={"lg:col-start-1 lg:row-start-2 lg:pb-20"}>
            <h3 className="text-2xl font-jura font-bold mb-4">Пошаговые уроки</h3>
            <p className="font-raleway text-md/[170%]">
              Каждый модуль построен так, чтобы вы могли<br/> учиться в удобном темпе. Мы начинаем с<br/> основ и постепенно переходим к более<br/> сложным темам
            </p>
          </div>

          <div className={"lg:col-start-3 lg:row-start-1 justify-self-end"}>
            <h3 className="text-2xl font-jura font-bold mb-4">Автоматические проверки</h3>
            <p className="font-raleway text-md/[170%]">
              Получайте мгновенную обратную связь на<br/> ваши решения. Вы сможете сразу увидеть<br/> свои ошибки и понять, как их исправить
            </p>
          </div>

          <div className={"lg:col-start-3 lg:row-start-2 lg:pb-20 justify-self-end"}>
            <h3 className="text-2xl font-jura font-bold mb-4">Доступ с любого устройства</h3>
            <p className="font-raleway text-md/[170%]">
              Учитесь где угодно и когда угодно!<br/> Наш тренажер доступен на компьютерах,<br/> планшетах и смартфонах.
            </p>
          </div>

          <Image
              src={catWorker}
              alt="Cat worker"
              width={400}
              height={600}
              className="object-contain w-full lg:w-auto lg:col-start-2 lg:row-span-2 col-start-3 self-end justify-self-center relative -bottom-4"
          />


        </div>
      </div>
      <WaveDark className="absolute bottom-0 w-full"/>
    </div>
  );
} 