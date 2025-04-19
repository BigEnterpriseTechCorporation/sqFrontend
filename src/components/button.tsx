import {ComponentPropsWithoutRef} from "react";
import clsx from "clsx";
import Link from "next/link";

export default function Button({children,className, href ,...props}:ComponentPropsWithoutRef<"a">) {
    return (
        <Link href={href!} className={clsx(className, "bg-bg3 w-[18.4375rem] py-5 rounded-5 font-medium text-[1.125rem] shadow-orange flex justify-center text-center")} {...props}>
            {children}
        </Link>
    )
}