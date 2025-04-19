import Logo from "@/assets/icons/logo.svg";
import WaveDark from "@/assets/icons/wave-dark.svg";
import Link from "next/link";
import { Mail } from "lucide-react";

export default function Footer(){
    return (
        <footer className="text-xl font-jura bg-[#202020] text-white relative">
            {/* Wave at the top of footer */}
            <WaveDark className="absolute left-0 w-full top-1 -translate-y-full"/>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Navigation */}


                {/* Main footer content */}
                <div className="py-10">
                    {/* Logo and description */}
                    <div className="flex flex-col md:flex-row justify-between">
                        <div className="mb-8 md:mb-0">
                            <div className={"flex items-center gap-20 mb-6"}>
                                <div className="flex items-center ">
                                    <Logo className="w-10 h-10 mr-3" />
                                    <span className="text-4xl font-jura">super query</span>
                                </div>

                                    <nav className="flex space-x-8 font-normal">
                                        <Link className="hover:text-gray-300" href="/about">О тренажере</Link>
                                        <Link className="hover:text-gray-300" href="/units">Темы</Link>
                                        <Link className="hover:text-gray-300" href="/exercises">Задания</Link>
                                        <Link className="hover:text-gray-300" href="/profile">Мой прогресс</Link>
                                    </nav>
                            </div>

                            <p className="max-w-xl text-sm text-gray-300 font-normal">
                                Присоединяйтесь к нам и начните свое путешествие в мир SQL уже сегодня! С нашим тренажером 
                                вы сможете уверенно работать с данными и открывать новые горизонты в своей карьере.
                            </p>
                        </div>

                        {/* Social links */}
                        <div className="flex space-x-6 items-start">
                            <a href="mailto:contact@kvetki.com" className="text-white hover:text-gray-300">
                                <Mail className="w-6 h-6" />
                            </a>
                            <a href="https://t.me/kvetki" className="text-white hover:text-gray-300">
                                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-1.634 7.627c-.123.547-.448.68-.908.424l-2.513-1.81-1.213 1.143c-.134.134-.247.247-.505.247l.18-2.513 4.58-4.069c.2-.179-.043-.275-.309-.097l-5.66 3.497-2.439-.752c-.53-.165-.54-.53.11-.785l9.52-3.615c.441-.159.83.106.79.702z" />
                                </svg>
                            </a>
                            <a href="https://vk.com/kvetki" className="text-white hover:text-gray-300">
                                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12.785 16.241s.288-.032.436-.194c.136-.148.132-.427.132-.427s-.02-1.304.576-1.496c.588-.19 1.341 1.26 2.14 1.818.605.422 1.064.33 1.064.33l2.137-.03s1.117-.071.587-.964c-.043-.073-.308-.661-1.588-1.87-1.34-1.264-1.16-1.059.453-3.246.983-1.332 1.376-2.145 1.253-2.493-.117-.332-.84-.244-.84-.244l-2.406.015s-.178-.025-.31.056c-.13.079-.212.262-.212.262s-.382 1.03-.89 1.907c-1.07 1.85-1.499 1.948-1.674 1.832-.407-.267-.305-1.075-.305-1.648 0-1.793.267-2.54-.521-2.733-.262-.065-.454-.107-1.123-.114-.858-.009-1.585.003-1.996.208-.274.135-.485.437-.356.454.159.022.519.099.71.363.246.341.237 1.107.237 1.107s.142 2.11-.33 2.371c-.325.18-.77-.187-1.725-1.865-.489-.859-.858-1.81-.858-1.81s-.07-.176-.198-.272c-.154-.115-.37-.152-.37-.152l-2.286.015s-.343.01-.469.162c-.112.136-.01.417-.01.417s1.802 4.258 3.835 6.403c1.87 1.967 3.983 1.838 3.983 1.838h.956z"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="py-4 border-t border-gray-700 flex flex-col sm:flex-row justify-between text-sm">
                    <div className="mb-2 sm:mb-0">© Кветкі. All rights reserved</div>
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