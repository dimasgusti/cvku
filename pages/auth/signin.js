import { signIn } from "next-auth/react";
import { Button } from '../../components/ui/button';

export default function SignIn(){
    return(
        <div>
            <h1>Sign In</h1>
            <Button onClick={() => signIn('github')}>Sign in with Github</Button>           
        </div>
    )
}