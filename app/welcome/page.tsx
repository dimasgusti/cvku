import Text from "@/components/ui/text";
import Link from "next/link";

export default function WelcomePage() {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <Text variant="subheading">Hi there! 👋</Text>
      <Text variant="caption">
        We&apos;re so happy to have you here! What would you like to do today?
      </Text>
      <div className="grid grid-cols-1 md:grid-cols-2 content-center gap-4 mt-4">
        <Link
          href="/"
          className="w-[15rem] h-[15rem] flex flex-col justify-center items-center bg-[#7971EA] hover:bg-[#7971EA]/75"
        >
          <div className="p-2 text-center">
            <Text variant="body" className="text-white font-bold">
              Build my CV
            </Text>
            <Text variant="small" className="text-white">
              Create a stunning CV in minutes.
            </Text>
          </div>
        </Link>
        <Link
          href="/"
          className="w-[15rem] h-[15rem] flex flex-col justify-center items-center bg-[#F05454] hover:bg-[#F05454]/75"
        >
          <div className="p-2 text-center">
            <Text variant="body" className="text-white font-bold">
              Build Portfolio
            </Text>
            <Text variant="small" className="text-white">
              Showcase your work beautifully.
            </Text>
          </div>
        </Link>
      </div>
      <div className="flex flex-row justify-center items-center mt-4">
        <Link
          href="/dashboard"
          className="w-[15rem] h-[15rem] flex flex-col justify-center items-center bg-[#2196F3] hover:bg-[#2196F3]/75"
        >
          <div className="p-2 text-center">
            <Text variant="body" className="text-white font-bold">
              Skip and Explore
            </Text>
          </div>
        </Link>
      </div>
    </div>
  );
}
