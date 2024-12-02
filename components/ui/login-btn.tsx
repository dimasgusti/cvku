import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "./button";

export default function LoginButton(){
    const { data: session } = useSession()
    if(session){
        return(
            <>
                <Button onClick={() => signOut()} size='sm'>Sign out</Button>
            </>
        )
    }
    return(
        <>
            <Button onClick={() => signIn()} size='sm'>Sign in</Button>
        </>
    )
}