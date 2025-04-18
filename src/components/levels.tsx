import Level from './level';

export default function Levels(){
    return <div className="flex flex-col px-20 bg-[#FFBCF6]">
        <p className="text-left text-2xl font-bold my-8 text-[#202020]">Уровни сложности</p>
        <div className='grid grid-cols-4 gap-8 w-full'>
            <Level image={"easy level.png"} title={"Лёгкий"} text={"Выберите правильный вариант из перечня"} />
            <Level image={"easy level.png"} title={"Средний"} text={"Вставьте часть команды в текст"} />
            <Level image={"hard.png"} title={"Сложный"} text={"Напишите простой запрос полностью"} />
            <Level image={"easy level.png"} title={"Очень сложный"} text={"Напишите комплексный запрос из множества компанд"} />
        </div>
    </div>
}
