"use client"
import Link from "next/link";
import Logo from "@/assets/icons/logo.svg";
import { useEffect, useState } from "react";
import { useToken } from "@/hooks/auth";

export default function Navigation(){
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { getToken, hasToken } = useToken();
    
    // Check if user is admin on component mount
    useEffect(() => {
        if (hasToken()) {
            setIsLoggedIn(true);
            
            try {
                // Get token from hook
                const token = getToken();
                
                // Parse the JWT token (assuming it's a standard JWT with payload in the middle section)
                const payload = JSON.parse(atob(token!.split('.')[1]));
                
                // Check if user role is "Admin"
                if (payload && payload.role === "Admin") {
                    setIsAdmin(true);
                }
            } catch (error) {
                console.error("Error parsing token:", error);
            }
        } else {
            setIsLoggedIn(false);
            setIsAdmin(false);
        }
    }, [hasToken, getToken]);

    // Close mobile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            if (isMenuOpen) setIsMenuOpen(false);
        };
        
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isMenuOpen]);
    
    const toggleMenu = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsMenuOpen(!isMenuOpen);
    };

    return <header className="w-full">
        <nav className="flex justify-between items-center px-6 py-5 text-base text-white bg-[#202020]">
            <Link href={"/"} className="flex items-center gap-2 z-10">
                <Logo alt="logo" className="w-7 h-7"/>
                <span className="font-medium text-2xl">super query</span>
            </Link>
            
            {/* Mobile hamburger button */}
            <button 
                className="md:hidden z-20 relative"
                onClick={toggleMenu}
                aria-label="Toggle menu"
            >
                <div className={`w-6 h-0.5 bg-white mb-1.5 transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
                <div className={`w-6 h-0.5 bg-white mb-1.5 transition-all ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></div>
                <div className={`w-6 h-0.5 bg-white transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
            </button>
            
            {/* Desktop navigation */}
            <div className="hidden md:flex items-center gap-8 text-white text-xl">
                <Link className={"underline-parent"} href={"/"} >Главная</Link>
                <Link className={"underline-parent"} href={"/units"} >Юниты</Link>
                
                {isAdmin && (
                    <Link className={"underline-parent"} href={"/admin"} >Панель админа</Link>
                )}

                {isLoggedIn && (
                    <Link className={"px-16 py-3.5 border-bg1 border-2 rounded-xl hover:bg-bg1 hover:text-black duration-300 ease-in-out"} href={"/profile"} >Профиль</Link>
                )}
                
                {!isLoggedIn && (
                    <>
                        <Link className={"underline-parent"} href={"/auth"} >Регистрация</Link>
                        <Link href={"/login"} className="px-16 py-3.5 border-bg1 border-2 rounded-xl hover:bg-bg1 hover:text-black duration-300 ease-in-out font-medium">Вход</Link>
                    </>
                )}
            </div>
            
            {/* Mobile navigation overlay */}
            <div 
                className={`fixed inset-0 bg-[#202020] z-10 flex flex-col items-center justify-center md:hidden transition-opacity duration-300 ${
                    isMenuOpen ? 'opacity-95 visible' : 'opacity-0 invisible'
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex flex-col items-center gap-8 text-white text-2xl">
                    <Link 
                        className="py-3 px-6 w-full text-center" 
                        href="/" 
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Главная
                    </Link>
                    <Link 
                        className="py-3 px-6 w-full text-center" 
                        href="/units" 
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Юниты
                    </Link>
                    
                    {isAdmin && (
                        <Link 
                            className="py-3 px-6 w-full text-center" 
                            href="/admin" 
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Панель админа
                        </Link>
                    )}

                    {isLoggedIn && (
                        <Link 
                            className="px-16 py-3.5 border-bg1 border-2 rounded-xl hover:bg-bg1 hover:text-black text-center"
                            href="/profile"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Профиль
                        </Link>
                    )}
                    
                    {!isLoggedIn && (
                        <>
                            <Link 
                                className="py-3 px-6 w-full text-center" 
                                href="/auth"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Регистрация
                            </Link>
                            <Link 
                                className="px-16 py-3.5 border-bg1 border-2 rounded-xl hover:bg-bg1 hover:text-black duration-300 ease-in-out font-medium"
                                href="/login"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Вход
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    </header>
} 