import Link from "next/link";
import { Leaf } from "lucide-react";
import { auth } from "@/auth";
import LoginButton from "./auth/login-button";
import UserAccount from "./auth/user-account";

export async function Navbar() {
  const session = await auth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
            <Leaf className="w-6 h-6 text-primary" />
          </div>
          <span className="font-bold text-xl tracking-tight">LeafDoc</span>
        </Link>
        <div className="flex items-center gap-4">
          {session?.user ? (
            <>
              <Link
                href="/diagnoses"
                className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors hidden sm:block"
              >
                My Collection
              </Link>
              <UserAccount user={session.user} />
            </>
          ) : (
            <LoginButton />
          )}
        </div>
      </div>
    </nav>
  );
}
