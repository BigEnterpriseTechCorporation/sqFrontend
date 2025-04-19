"use client"
import AuthContainer from "@/components/Auth/AuthContainer";
import LoginForm from "@/components/Auth/LoginForm";

export default function Login() {
    return (
        <AuthContainer activeTab="login">
            <LoginForm />
        </AuthContainer>
    );
}