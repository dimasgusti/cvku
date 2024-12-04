import Link from "next/link";
import LoginButton from "./login-btn";
import { Button } from "./button";

const Navbar = () => {
    return(
        <div className="flex flex-row justify-between items-center w-full p-4 border-b text-sm h-[5rem]">
            <ul>
                <Link href='/'>
                    Home
                </Link>
            </ul>
            <ul className="flex flex-row gap-2">
                <li>
                    <Link href='/dashboard'>
                        <Button size="sm">Dashboard</Button>
                    </Link>
                </li>
                <li>
                    <LoginButton />
                </li>
            </ul>
        </div>
    )
}

export default Navbar;