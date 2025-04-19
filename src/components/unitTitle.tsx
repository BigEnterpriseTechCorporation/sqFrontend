import WavePink from "@/assets/icons/wave-pink.svg";

interface UnitTitleProps{
    title: string
}

export default function UnitTitle({title,...props}:UnitTitleProps){
    return(
        <div className="bg-[#fcf7e6] pt-12 pb-8 relative" {...props}>
            <div className="max-w-5xl mx-auto px-4">
                <h1 className=" text-9xl text-center font-bold pb-20 pt-4 font-jura">{title}</h1>
            </div>
            {/* Wavy border */}
            <WavePink className={"absolute bottom-0 w-full"}/>
        </div>
    )
}