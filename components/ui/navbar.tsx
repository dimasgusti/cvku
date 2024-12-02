import Link from "next/link";
import LoginButton from "./login-btn";

const Navbar = () => {
    return(
        <div className="flex flex-row justify-between items-center w-full p-4 border-b text-sm">
            <ul>
                <Link href='/'>
                    Home
                </Link>
            </ul>
            <ul>
                <li>
                    <LoginButton />
                </li>
            </ul>
        </div>
    )
}

export default Navbar;