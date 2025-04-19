"use client"
import Link from "next/link";
import { FormEvent, useState } from "react";
import login from "@/hooks/login";

export default function Login() {
    const [error, setError] = useState("");

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        
        const formData = new FormData(event.currentTarget);
        
        const userName = formData.get("userName") as string;
        const password = formData.get("password") as string;

        try {
            // The login function returns the token directly
            const token = await login({ userName, password });
            
            // Store the token in localStorage
            if (token) {
                localStorage.setItem('token', token);
                console.log('Token saved to localStorage:', token);
                
                // Redirect to home page on success
                window.location.href = "/";
            } else {
                setError("Authentication failed. No token received.");
            }
        } catch (error) {
            console.error("Login failed:", error);
            setError("Login failed. Please check your credentials and try again.");
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center">
            <form onSubmit={onSubmit} className="space-y-4 w-full max-w-md p-8">
                <h1 className="text-2xl font-bold text-center">Login</h1>
                
                {error && (
                    <div className="p-3 bg-red-100 text-red-700 rounded">
                        {error}
                    </div>
                )}
                
                <div className="space-y-2">
                    <input
                        type="text"
                        name="userName"
                        placeholder="Username"
                        required
                        className="w-full p-2 border rounded"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        required
                        className="w-full p-2 border rounded"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                    Login
                </button>
                <div className="flex justify-center gap-4 mt-4">
                    <Link href="/" className="text-blue-500 hover:underline">Home</Link>
                    <Link href="/auth" className="text-blue-500 hover:underline">Register</Link>
                </div>
            </form>
        </main>
    )
}