import { FormEvent, useState } from "react";
import login from "@/hooks/login";

export default function LoginForm() {
    const [error, setError] = useState("");
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    
    const validateUserName = (value: string) => {
        const latinLettersRegex = /^[a-zA-Z0-9_\-\.]+$/;
        return latinLettersRegex.test(value);
    };

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        
        const formData = new FormData(event.currentTarget);
        
        const userName = formData.get("userName") as string;
        const password = formData.get("password") as string;
        
        // Check if username has valid characters
        if (!validateUserName(userName)) {
            setError("Имя пользователя должно содержать только латинские буквы, цифры и специальные символы.");
            return;
        }

        try {
            // The login function returns the token directly
            const token = await login({ userName, password });
            
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
            console.error("Login failed:", error);
            setError("Login failed. Please check your credentials and try again.");
        }
    }

    return (
        <form onSubmit={onSubmit} className="space-y-6">
            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                    {error}
                </div>
            )}
            
            <div>
                <label className="block mb-2">Имя пользователя</label>
                <input
                    type="text"
                    name="userName"
                    placeholder="Введите имя пользователя"
                    required
                    className="w-full p-3 rounded-lg bg-white shadow-sm"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                />
            </div>
            
            <div>
                <label className="block mb-2">Пароль</label>
                <input
                    type="password"
                    name="password"
                    placeholder="Введите пароль"
                    required
                    className="w-full p-3 rounded-lg bg-white shadow-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            
            <button
                type="submit"
                className="w-full bg-orange-300 text-black font-medium p-3 rounded-lg hover:bg-orange-400 mt-4"
            >
                Вход в аккаунт
            </button>
            
            <div className="text-xs text-gray-500 text-center mt-4">
                Нажимая на кнопку &quot;Вход в аккаунт&quot; вы даете свое согласие на обработку персональных данных
            </div>
        </form>
    );
} 