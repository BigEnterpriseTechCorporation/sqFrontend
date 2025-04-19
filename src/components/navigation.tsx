import Link from "next/link";
import Logo from "@/assets/icons/logo.svg";

export default function Navigation(){
    return <header className="w-full">
        <nav className="flex justify-between items-center px-6 text-base text-white bg-[#202020] h-16">   
            <Link href={"/"} className="flex items-center gap-2">
                <Logo alt="logo" className="w-7 h-7"/>
                <span className="font-medium text-2xl">super query</span>
            </Link>
            <div className="flex items-center gap-8 text-white text-xl">
                <Link className={"underline-parent"} href={"/"} >Главная</Link>
                <Link className={"underline-parent"} href={"/units"} >Units</Link>
                <Link className={"underline-parent"} href={"/profile"} >Profile</Link>
                <Link className={"underline-parent"} href={"/auth"} >auth</Link>
                <Link href={"/login"} className="bg-bg1 hover:bg-bg2 duration-300 ease-in-out text-[#202020] px-10 py-1.5 rounded-md font-medium">Вход</Link>
            </div>
        </nav>

    </header>
}