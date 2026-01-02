"use client";

import { signIn } from "next-auth/react";
import { LogIn } from "lucide-react";

export default function LoginButton() {
    return (
        <button
            onClick={() => signIn("google")}
            className="flex items-center gap-2 px-6 py-2.5 bg-white text-emerald-900 font-semibold rounded-full shadow-lg hover:shadow-xl hover:bg-emerald-50 transition-all active:scale-95 border border-emerald-100"
        >
            <LogIn size={18} />
            <span>Sign In with Google</span>
        </button>
    );
}
