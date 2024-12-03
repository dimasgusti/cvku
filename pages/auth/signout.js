import { signOut } from "next-auth/react";
import { Button } from '../../components/ui/button';

export default function SignOut(){
    return(
        <div>
            <h1>Sign Out</h1>
            <Button onClick={() => signOut({callbackUrl: '/goodbye'})}>Sign out</Button>           
        </div>
    )
}