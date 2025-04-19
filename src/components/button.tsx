import {ComponentPropsWithoutRef} from "react";
import clsx from "clsx";

export default function Button({children,className ,...props}:ComponentPropsWithoutRef<"button">) {
    return (
        <button className={clsx(className, "bg-white w-[18.4375rem] py-5 rounded-5 font-medium text-[1.125rem] shadow-orange")} {...props}>
            {children}
        </button>
    )
}