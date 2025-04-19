import Link from "next/link";
import Logo from "@/assets/icons/logo.svg";
import { ReactNode } from "react";

interface AuthContainerProps {
  activeTab: "login" | "register";
  children: ReactNode;
}

export default function AuthContainer({ activeTab, children }: AuthContainerProps) {
  return (
    <main className="h-screen bg-bg1 flex items-center justify-center">
      <div className="max-w-md w-full p-8 mx-auto bg-bg2 rounded-5">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center">
            <Logo className="w-8 h-8 mr-2" fill={"black"} />
            <span className="text-2xl font-bold">кветкі</span>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex mb-8">
          <Link 
            href="/login" 
            className={`w-1/2 py-3 text-center ${activeTab === 'login' ? 'bg-orange-300 rounded-l-lg font-medium' : 'bg-white rounded-l-lg text-gray-500 hover:text-gray-700'}`}
          >
            Вход
          </Link>
          <Link 
            href="/auth" 
            className={`w-1/2 py-3 text-center ${activeTab === 'register' ? 'bg-orange-300 rounded-r-lg font-medium' : 'bg-white rounded-r-lg text-gray-500 hover:text-gray-700'}`}
          >
            Регистрация
          </Link>
        </div>
        
        {children}
      </div>

      <Link href={"/"} className={"absolute top-4 left-4"}>back</Link>
    </main>
  );
} 