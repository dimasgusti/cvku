// import { useRouter } from 'next/router';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../../components/ui/card";
import "../../app/globals.css";
import Link from 'next/link';
import { Button } from '../../components/ui/button';

export default function ErrorPage() {
  return (
    <div className='w-full h-screen flex flex-col justify-center items-center'>
        <Card className='w-[360px]'>
            <CardHeader className='w-full flex flex-col justify-center items-center'>
                <CardTitle>Error</CardTitle>
            </CardHeader>
            <CardContent className="w-full flex flex-col justify-center items-center gap-2">
                <CardDescription className="text-center">
                    We were unable to sign you in. Please ensure your account is valid, or try using different provider.
                </CardDescription>
                <Link href='/auth/signin'>
                    <Button>
                        Go Back
                    </Button>
                </Link>
            </CardContent>
        </Card>

    </div>
  );
}