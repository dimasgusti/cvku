import { signOut } from "next-auth/react";
import { Button } from '../../components/ui/button';

export default function SignOut(){
    return <Button onClick={() => signOut({callbackUrl: '/'})} size='sm' variant='outline'>Sign out</Button>           
}