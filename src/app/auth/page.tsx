"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useAuth();
  const router = useRouter();

  // Redirect logged-in users to home
  useEffect(() => {
    if (user) router.push("/");
  }, [user]);

  const handleAuth = async () => {
    setError(null);

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return setError(error.message);
      router.push("/");
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) return setError(error.message);
      router.push("/");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white text-black">
      <h1 className="text-3xl font-bold mb-6">{isLogin ? "Login" : "Sign Up"}</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-4 p-2 border rounded w-64 bg-gray-100 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-4 p-2 border rounded w-64 bg-gray-100 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <button
        onClick={handleAuth}
        className="bg-blue-500 text-white px-6 py-2 rounded mb-2 hover:bg-blue-600 transition"
      >
        {isLogin ? "Login" : "Sign Up"}
      </button>

      <button
        onClick={() => setIsLogin(!isLogin)}
        className="text-blue-500 underline"
      >
        {isLogin ? "Create an account" : "Already have an account?"}
      </button>
    </div>
  );
}
