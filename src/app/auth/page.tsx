"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabaseClient";
import Navbar from "../../../components/Navbar";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [session, setSession] = useState<any>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleSignup = async () => {
    setMessage("Signing up...");
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) setMessage(error.message);
    else setMessage("✅ Signup successful! Check your email for confirmation.");
  };

  const handleLogin = async () => {
    setMessage("Logging in...");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMessage(error.message);
    else setMessage("✅ Login successful!");
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) setMessage(error.message);
    else setMessage("✅ Logged out!");
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-slate-50 px-4">
        <div className="w-full max-w-md p-8 bg-slate-50 border border-slate-300 rounded-xl shadow-sm">
          {/* Branding */}
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4 text-center">
            StudyShare.AI
          </h1>
          <p className="text-slate-500 text-center mb-6">
            Study Smarter. Share Better. Together with AI.
          </p>

          {session ? (
            <div className="text-center space-y-4">
              <p className="text-slate-800 font-medium">Logged in as {session.user.email}</p>
              <button
                onClick={handleLogout}
                className="w-full px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 hover:border-slate-400 transition"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 hover:border-slate-400 transition"
              />
              <div className="flex gap-3">
                <button
                  onClick={handleSignup}
                  className="flex-1 px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  Signup
                </button>
                <button
                  onClick={handleLogin}
                  className="flex-1 px-5 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition"
                >
                  Login
                </button>
              </div>
            </div>
          )}

          {message && (
            <p className="mt-4 text-center text-rose-600 font-medium">{message}</p>
          )}
        </div>
      </main>
    </>
  );
}
