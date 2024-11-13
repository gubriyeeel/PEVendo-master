import Link from "next/link";

const page = async () => {
  return (
    <div className="flex h-[75vh] w-full flex-col items-center justify-center gap-y-4 text-center text-5xl">
      Access Denied. You are not an admin
      {/* Button to return to home page */}
      <Link href="/" className="text-2xl text-blue-500 underline">
        Return to Home
      </Link>
    </div>
  );
};

export default page;
