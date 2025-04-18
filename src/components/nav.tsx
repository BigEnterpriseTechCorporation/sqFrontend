import Link from "next/link";

export default function Nav(){
    return <header className="w-full">
        <nav className="flex justify-between items-center px-6 text-base text-white bg-[#202020] h-16">   
            <Link href={"/"} className="flex items-center gap-2">
                <img src="logo.svg" alt="logo" className="w-7 h-7"/>
                <span className="font-medium text-2xl">кветкі</span>
            </Link>
            <div className="flex items-center gap-8">
                <Link href={"/"} className="text-white text-xl">Главная</Link>
                <Link href={"/"} className="text-white text-xl">О тренажере</Link>
                <Link href={"/"} className="text-white text-xl">Мой прогресс</Link>
                <Link href={"/"} className="bg-[#FEF8E2] text-[#202020] px-10 py-1.5 rounded-md font-medium">Вход</Link>
            </div>
        </nav>
        <div className="flex justify-between bg-[#FFBCF6] p-13">
            <div className="flex flex-col justify-center">
                <p className="text-8xl text-white font-bold">Раскрой силу данных</p>
                <p className="text-2xl text-black font-bold mt-5">Осваивайте SQL быстрее, умнее и лучше</p>
                <Link href={"/"} className="text-[#202020] bg-white w-[286px] font-medium text-xl text-center py-4 rounded-[32px] shadow-lg mt-8 hover:scale-105 transition-all">Начать</Link>
            </div>
            <img src="pngwing.com 1.png" alt="png" width={'45%'}/>
        </div>
    </header>
}