import Navbar from "@/components/Navbar";

export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen">
            <div className="">
                <Navbar />
                <main className="flex-1 p-4">
                    {children}
                </main>
            </div>
        </div>
    )
}