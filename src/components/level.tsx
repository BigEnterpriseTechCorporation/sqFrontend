import Link from 'next/link';

interface CardProps {
    image: string;
    title: string;
    text: string;
}

export default function Level({ image, title, text }: CardProps) {
    return (
        <Link href={'/'} className="flex flex-col items-center p-3 rounded-2xl shadow-md bg-[#FEF8E2] w-full text-[#202020] min-h-[325px] hover:scale-105 transition-all">
            <div className="w-full h-48 mb-5">
                <img 
                    src={image} 
                    alt={title} 
                    className="w-full h-full object-cover rounded-3xl"
                />
            </div>
            <h3 className="text-xl font-bold mb-2 text-center">{title}</h3>
            <p className="text-center">{text}</p>
        </Link>
    );
}
