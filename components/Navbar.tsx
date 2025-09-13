"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data }) => setUser(data.session?.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    return () => listener?.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="w-full bg-gray-100 p-4 flex justify-between items-center">
      <h1 className="font-bold text-xl">StudyShare.AI</h1>
      <div>
        {user ? (
          <>
            <span className="mr-4">Hello, {user.email}</span>
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-red-500 text-white rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <a
            href="/auth"
            className="px-3 py-1 bg-blue-500 text-white rounded"
          >
            Login / Signup
          </a>
        )}
      </div>
    </nav>
  );
}
