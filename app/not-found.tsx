import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <Image src="/illustrations/404.svg" alt="Page not found" width={300} height={200} className="mb-8" />

      {/* <h1 className="text-6xl font-bold">404</h1> */}

      <h2 className="mt-4 text-2xl font-semibold">Page not found</h2>

      <p className="mt-2 max-w-md text-muted-foreground">The page you're looking for doesn't exist or may have been moved.</p>

      <Button className="mt-6 cursor-pointer">
        <Link href="/">Back to Home</Link>
      </Button>
    </div>
  );
}
