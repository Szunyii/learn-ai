import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function Home() {
  const { userId } = auth();

  console.log(userId);

  if (userId) redirect("/notes");
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-24">
      <div className="flex items-center gap-4 ">
        <Image src={"/logo.png"} alt="logo" width={100} height={100} />
        <span className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Flow brain
        </span>
      </div>
      <p className="text-center max-w-prose">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima, iusto
        ducimus nesciunt eos, eligendi omnis reiciendis sit distinctio molestias
        aliquid ab voluptates voluptas sapiente dolorem eius, odio doloribus
        maxime voluptatibus.
      </p>

      <Button asChild>
        <Link href={"/notes"}>Open</Link>
      </Button>
    </main>
  );
}
