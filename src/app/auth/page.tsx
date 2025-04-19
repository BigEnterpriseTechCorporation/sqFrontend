"use client"
import Link from "next/link";
import { FormEvent, useState } from "react";
import register from "@/hooks/auth/register";
import Logo from "@/assets/icons/logo.svg";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import catThumsUp from "@/assets/images/cat-thumsUp.png"

export default function Auth() {
    const [fullName, setFullName] = useState("");
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    
    // Password strength checks
    const isWeakPassword = password.length > 0 && password.length < 8;
    const containsUsername = userName && password.includes(userName);
    const hasMinLength = password.length >= 8;
    
    // Username validation check
    const isLatinUsername = () => {
        if (!userName) return true;
        const latinLettersRegex = /^[a-zA-Z0-9_\-\.]+$/;
        return latinLettersRegex.test(userName);
    };

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        
        // Check if username is valid
        if (!isLatinUsername()) {
            setError("Имя пользователя должно содержать только латинские буквы, цифры и спец. символы");
            return;
        }
        
        const formData = new FormData(event.currentTarget);
        
        const fullName = formData.get("fullName") as string;
        const userName = formData.get("userName") as string;
        const password = formData.get("password") as string;

        try {
            // The register function returns the token directly based on the hook implementation
            const token = await register({fullName, userName, password});
            
            // Store the token in localStorage
            if (token) {
                localStorage.setItem('token', token);
                console.log('Token saved to localStorage:', token);
                
                // Redirect to home page on success
                window.location.href = "/units";
            } else {
                setError("Authentication failed. No token received.");
            }
        } catch (error) {
            console.error("Registration failed:", error);
            setError("Registration failed. Please try again.");
        }
    }

    return (
        <main className="h-screen bg-bg1 px-20 py-16 grid grid-cols-5 items-center">
            {/* Left Column */}

                <div className="bg-white col-span-2 rounded-5 self-stretch px-12 grid grid-rows-[min-content_auto] w-full">
                    <div>
                        <h1 className="text-5xl font-bold mb-6 text-center pt-16">Раскрой силу данных</h1>
                        <p className="text-lg mb-12 text-center">
                            Осваивайте SQL быстрее, умнее и лучше. Интерактивный 
                            тренажер, который поможет вам быстро и эффективно
                            научиться работать с базами данных.
                        </p>
                    </div>

                    <Image 
                        src={catThumsUp} 
                        alt="Cat giving thumbs up" 
                        priority
                        className="object-contain object-bottom w-fit h-full justify-self-center"
                    />
                </div>

            
            {/* Right Column */}
            <div className="p-16 flex justify-center items-center self-stretch h-full col-span-3">
                <div className="w-[min(50rem,100%)]">
                    <div className="flex mb-8">
                        <div className="flex items-center">
                            <Logo className="w-8 h-8 mr-2" fill={"black"}/>
                            <span className="text-2xl font-bold">кветкі</span>
                        </div>
                    </div>

                    <div className="w-full">
                        {/* Tabs */}
                        <div className="flex mb-8">
                            <Link
                                href="/login"
                                className="w-1/2 py-3 text-center bg-white rounded-l-lg text-gray-500 hover:text-gray-700"
                            >
                                Вход
                            </Link>
                            <Link
                                href="/auth"
                                className="w-1/2 py-3 text-center bg-orange-300 rounded-r-lg font-medium"
                            >
                                Регистрация
                            </Link>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                                {error}
                            </div>
                        )}

                        <form onSubmit={onSubmit} className="space-y-6">
                            <div>
                                <label className="block mb-2">Полное имя</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    placeholder="Введите ваше полное имя"
                                    required
                                    className="w-full p-3 rounded-lg bg-white shadow-orange"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block mb-2">Имя пользователя</label>
                                <input
                                    type="text"
                                    name="userName"
                                    placeholder="Введите имя пользователя"
                                    required
                                    className={`w-full p-3 rounded-lg bg-white shadow-orange ${!isLatinUsername() && userName ? 'border-red-500' : ''}`}
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block mb-2">Пароль</label>
                                <div className="relative mb-10">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="Введите пароль"
                                        required
                                        className="w-full p-3 rounded-lg bg-white shadow-orange"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>

                                {/* Password requirements */}
                                <div className="mt-2 space-y-1 text-sm">
                                    <div className="flex items-center text-gray-500">
                                        <div className={`w-3 h-3 rounded-full mr-2 ${isWeakPassword ? 'bg-red-500' : 'bg-gray-300'}`}></div>
                                        Слабый пароль
                                    </div>
                                    <div className="flex items-center text-gray-500">
                                        <div className={`w-3 h-3 rounded-full mr-2 ${containsUsername ? 'bg-red-500' : 'bg-gray-300'}`}></div>
                                        Не может состоять из вашего имени пользователя
                                    </div>
                                    <div className="flex items-center text-gray-500">
                                        <div className={`w-3 h-3 rounded-full mr-2 ${!hasMinLength ? 'bg-red-500' : 'bg-gray-300'}`}></div>
                                        Минимум 8 символов
                                    </div>
                                    <div className="flex items-center text-gray-500">
                                        <div className={`w-3 h-3 rounded-full mr-2 ${!isLatinUsername() ? 'bg-red-500' : 'bg-gray-300'}`}></div>
                                        Имя пользователя должно содержать только латинские буквы и цифры
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-orange-300 text-black font-medium p-3 rounded-lg hover:bg-orange-400 mt-4"
                                disabled={!isLatinUsername()}
                            >
                                Создать аккаунт
                            </button>

                            <div className="text-xs text-gray-500 text-center mt-4">
                                Нажимая на кнопку &quot;Создать аккаунт&quot; вы даете свое согласие на обработку персональных данных
                            </div>
                        </form>
                    </div>

                </div>

            </div>

            <Link href={"/"} className={"absolute top-4 left-4"}>back</Link>
        </main>
    );
}