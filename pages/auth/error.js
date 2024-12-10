import { useRouter } from 'next/router';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../../components/ui/card";
import "../../app/globals.css";
import Link from 'next/link';
import { Button } from '../../components/ui/button';

export default function ErrorPage() {
  const router = useRouter();
  const { error } = router.query;  

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
        <Card className="w-[360px]">
            <CardHeader className="w-full flex flex-col justify-center items-center">
                <CardTitle>Error</CardTitle>
            </CardHeader>
            <CardContent className="w-full flex flex-col justify-center items-center gap-2">
                <CardDescription className="text-center">
                    We were unable to sign you in. {error ? error : 'An unknown error occurred.'}
                </CardDescription>
                <Link href="/auth/signin">
                    <Button>Go Back</Button>
                </Link>
            </CardContent>
        </Card>
    </div>
  );
}