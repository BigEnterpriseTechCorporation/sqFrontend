"use client"
import Logo from "@/assets/icons/logo.svg";
import WaveDark from "@/assets/icons/wave-dark.svg";
import Link from "next/link";
import {useToken} from "@/hooks";
import {useEffect, useState} from "react";

export default function Footer(){
    const { hasToken } = useToken();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    
    // Only check token status after component mounts on client
    useEffect(() => {
        setIsAuthenticated(hasToken());
    }, [hasToken]);

return (
        <footer className="text-xl font-jura bg-[#202020] text-white w-full mt-auto relative">
            {/* Wave at the top of footer */}
            <div className="absolute left-0 w-full top-1 -translate-y-full overflow-hidden">
                <WaveDark className="w-full"/>
            </div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Navigation */}


                {/* Main footer content */}
                <div className="py-10">
                    {/* Logo and description */}
                    <div className="flex flex-col md:flex-row justify-between">
                        <div className="mb-8 md:mb-0">
                            <div className={"flex flex-col md:gap-4 gap-16 mb-6"}>
                                <div className="flex items-center ">
                                    <Logo className="w-10 h-10 mr-3" />
                                    <span className="text-4xl font-jura">super query</span>
                                </div>

                                    <nav className="flex md:flex-row flex-col gap-10 font-normal">
                                        <Link className="hover:text-gray-300 text-3xl" href="/">Главная</Link>
                                        <Link className="hover:text-gray-300 text-3xl" href="/units">Юниты</Link>
                                        <Link className="hover:text-gray-300 text-3xl" href="/exercises">Задания</Link>
                                        {/* Default to the auth path for initial render to match SSR */}
                                        <Link 
                                            className="hover:text-gray-300 text-3xl" 
                                            href={isAuthenticated ? "/profile" : "/auth"}
                                        >
                                            {isAuthenticated ? "Профиль" : "Регистация"}
                                        </Link>
                                    </nav>
                            </div>

                            <p className="max-w-xl text-sm text-gray-300 font-normal">
                                Присоединяйтесь к нам и начните свое путешествие в мир SQL уже сегодня! С нашим тренажером 
                                вы сможете уверенно работать с данными и открывать новые горизонты в своей карьере.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="py-4 border-t border-gray-700 flex flex-col sm:flex-row justify-between text-sm">
                    <div className="mb-2 sm:mb-0">© Кветкі. All rights are not reserved</div>
                    <div>
                        <Link href="/" className="text-gray-300 hover:text-white">
                            Здесь могла быть политика конфиденциальности
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
} 