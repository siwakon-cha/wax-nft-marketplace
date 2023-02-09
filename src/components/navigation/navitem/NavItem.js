import cn from "classnames";
import Link from "next/link";
import React from "react";

const NavItem = ({link, text}) =>
    <div className={cn('my-auto mr-5 hidden md:block')}>
        <Link  href={link}>
            <div className={cn('flex flex-cols items-center cursor-pointer')}>
                <div className={cn('relative w-full text-base font-extralight uppercase text-neutral')}>
                    {text}
                </div>
            </div>
        </Link>
    </div>;

export default NavItem;