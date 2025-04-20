import WavePink from "@/assets/icons/wave-pink.svg";
import clsx from "clsx";

interface UnitTitleProps{
    title: React.ReactNode
    className?:string
}

export default function UnitTitle({title,className,...props}:UnitTitleProps){
    return(
        <div className="bg-bg2 pt-12 pb-8 relative" {...props}>
            <div className="mx-auto px-4">
                <h1 className={clsx(className,"text-5xl text-center font-bold pb-20 pt-4 font-jura")}>{title}</h1>
            </div>
            {/* Wavy border */}
            <WavePink className={"absolute -bottom-1 w-full"}/>
        </div>
    )
} 