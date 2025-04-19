import WavePink from "@/assets/icons/wave-pink.svg";

interface UnitTitleProps{
    title: React.ReactNode;
}

export default function UnitTitle({title,...props}:UnitTitleProps){
    return(
        <div className="bg-bg2 pt-12 pb-2 relative" {...props}>
            <div className="mx-auto px-4">
                <h1 className=" text-5xl text-center font-bold pb-20 pt-4 font-jura">{title}</h1>
            </div>
            {/* Wavy border */}
            <WavePink className={"absolute -bottom-1 w-full"}/>
        </div>
    )
} 