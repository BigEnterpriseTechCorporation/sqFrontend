import Link from "next/link";
import {MoveLeft} from "lucide-react";

export default function Back(){
    return (
        <Link href={"/"} className={"absolute top-4 left-4 bg-bg2 text-2xl font-jura font-bold p-4 py-2 rounded-5 hover:text-white duration-300 ease-in-out"}><MoveLeft /></Link>
    )
}