"use client"
import Link from "next/link";
import Logo from "@/assets/icons/logo.svg";
import { useEffect, useState } from "react";
import { useToken } from "@/hooks/auth";

export default function Navigation(){
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
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

    return <header className="w-full">
        <nav className="flex justify-between items-center px-6 py-5 text-base text-white bg-[#202020]">
            <Link href={"/"} className="flex items-center gap-2">
                <Logo alt="logo" className="w-7 h-7"/>
                <span className="font-medium text-2xl">super query</span>
            </Link>
            <div className="flex items-center gap-8 text-white text-xl">
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
                        <Link href={"/login"} className="px-16 py-3.5 border-bg1 border-2 rounded-xl hover:bg-bg1 hover:text-black duration-300 ease-in-out duration-300 ease-in-out font-medium">Вход</Link>
                    </>
                )}

            </div>
        </nav>
    </header>
} 