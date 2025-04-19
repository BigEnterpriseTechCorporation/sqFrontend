import Link from "next/link";
import WaveYellow from "@/assets/icons/wave-yellow.svg"
import serverImage from "@/assets/images/server.png"
import Image from "next/image"
import Button from "@/components/button";

export default function Header(){
    return (
        <header className="bg-bg1 relative">
            <section className="px-25 py-40 flex gap-5 justify-center w-full">
                <div>
                    <h1 className="text-7xl/[90%] font-bold mb-7 text-white font-jura">
                        Раскрой силу <br/>данных
                    </h1>
                    <h2 className="text-xl mb-16">Осваивайте SQL быстрее, умнее и лучше</h2>
                    <Button>
                        <Link href="/auth">
                            Начать
                        </Link>
                    </Button>
                </div>
                <Image src={serverImage} alt={""}/>
            </section>
            <WaveYellow className="absolute bottom-0 w-full" />
        </header>
    )
}