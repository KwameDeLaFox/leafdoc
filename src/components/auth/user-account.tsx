"use client";

import { signOut } from "next-auth/react";
import { LogOut, User } from "lucide-react";

interface UserAccountProps {
    user: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
    };
}

export default function UserAccount({ user }: UserAccountProps) {
    return (
        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-1.5 pr-4 rounded-full border border-white/20">
            {user.image ? (
                <img
                    src={user.image}
                    alt={user.name || "User"}
                    className="w-8 h-8 rounded-full border border-white/40"
                />
            ) : (
                <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center text-white">
                    <User size={16} />
                </div>
            )}
            <div className="flex flex-col">
                <span className="text-sm font-medium text-white leading-none mb-0.5">
                    {user.name}
                </span>
                <button
                    onClick={() => signOut()}
                    className="text-[10px] text-emerald-200 hover:text-white flex items-center gap-1 transition-colors"
                >
                    <LogOut size={10} />
                    Sign Out
                </button>
            </div>
        </div>
    );
}
