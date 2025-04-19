import Logo from "@/assets/icons/logo.svg";
import Link from "next/link";


export default function Footer(){
    return (
        <footer className="text-xl font-jura font-bold pb-32 pt-10 px-20 relative bg-[#202020] text-white relative">
            {/* Navigation Column */}
            <div>
                <h2 className="text-4xl font-jura mb-8">Навигация</h2>
                <nav className="flex flex-col space-y-4 font-raleway hover:text-gray-300 text-xl font-normal">
                    <Link href="/auth">Регистрация</Link>
                    <Link href="/login">Log in</Link>
                    <Link href="/units">Темы</Link>
                    <Link href="/">Профиль</Link>
                </nav>
            </div>
            {/* Logo Column */}
            <div className="flex items-end justify-end absolute right-16 bottom-4">
                <div className="flex items-center gap-4">
                    <Logo className="w-10 h-10" />
                    <span className="text-4xl font-jura">кветкі</span>
                </div>
            </div>
        </footer>
    )
}