import {ComponentPropsWithoutRef} from "react";
import clsx from "clsx";
import Link from "next/link";

export default function Button({children,className, href ,...props}:ComponentPropsWithoutRef<"a">) {
    return (
        <Link href={href!} className={clsx(className, "bg-bg3 hover:bg-orange-400 duration-300 ease-in-out w-[18.4375rem] py-5 rounded-5 font-medium text-3xl shadow-orange flex justify-center text-center")} {...props}>
            {children}
        </Link>
    )
} 