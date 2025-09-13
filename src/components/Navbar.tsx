"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabaseClient";

export default function Navbar() {
  const user = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // user state updates automatically via useAuth
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <Link href="/" className="text-xl font-bold">StudyShare.AI</Link>
      <div>
        {user ? (
          <>
            <span className="mr-4">{user.email}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            href="/auth"
            className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600 transition"
          >
            Login / Signup
          </Link>
        )}
      </div>
    </nav>
  );
}
