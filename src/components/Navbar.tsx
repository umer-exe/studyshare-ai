"use client";

import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, loading } = useAuth();  // ✅ destructure correctly
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/");
  };

  return (
    <nav className="flex items-center justify-between bg-white px-6 py-3 shadow">
      <span className="font-bold text-purple-700">StudyShare.AI</span>

      {!loading && (
        <>
          {user ? (
            <div className="flex items-center gap-3">
              {/* ✅ Safe access with optional chaining */}
              <span className="text-sm text-slate-700">{user.email}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 px-3 py-1 rounded text-white hover:bg-red-600 transition"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => router.push("/")}
              className="bg-purple-600 px-3 py-1 rounded text-white hover:bg-purple-700 transition"
            >
              Login
            </button>
          )}
        </>
      )}
    </nav>
  );
}
