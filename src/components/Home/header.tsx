import WaveYellow from "@/assets/icons/wave-yellow.svg"
import serverImage from "@/assets/images/server.png"
import Image from "next/image"
import Button from "@/components/ui/Button";

export default function Header(){
    return (
        <header className="bg-bg1 relative flex justify-center">
            <section className="px-25 py-40 grid lg:grid-cols-2 lg:grid-rows-1 grid-rows-2 items-center gap-5 justify-center w-full lg:max-w-[100rem]">
                <div className="flex flex-col lg:items-start lg:text-start items-center text-center">
                    <h1 className="md:text-9xl/[90%] text-7xl/[90%] font-bold mb-7 font-jura">
                        Раскрой силу <br/>данных
                    </h1>
                    <h2 className="text-2xl mb-16">Осваивайте SQL быстрее, умнее и лучше</h2>
                    <Button href="/auth" className={"text-2xl"}>
                        Начать
                    </Button>
                </div>
                <Image src={serverImage} alt={""} className={"justify-self-end h-full object-contain"} />
            </section>
            <WaveYellow className="absolute bottom-0 w-full" />
        </header>
    )
}