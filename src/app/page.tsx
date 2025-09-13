"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function Home() {
  const [message, setMessage] = useState("🔄 Checking Supabase...");
  const [sampleData, setSampleData] = useState<string | null>(null);

  useEffect(() => {
    const testSupabase = async () => {
      try {
        const { data, error } = await supabase.from("test_table").select("name").limit(1);
        if (error) throw error;
        setMessage("✅ Connected to Supabase!");
        setSampleData(data?.[0]?.name || "No data found");
      } catch (err) {
        console.error(err);
        setMessage("❌ Supabase connection failed.");
      }
    };

    testSupabase();
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white text-gray-800 px-4">
      {/* Hero Section */}
      <header className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4">StudyShare.AI</h1>
        <p className="text-xl text-gray-600">
          Study Smarter. Share Better. Together with AI.
        </p>
      </header>

      {/* Core Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
        {/* Supabase Status */}
        <section className="p-6 border rounded-lg shadow-sm bg-gray-50">
          <h2 className="text-2xl font-semibold mb-2">📡 Supabase Connection</h2>
          <p>{message}</p>
          {sampleData && (
            <p className="mt-2 text-gray-600">Sample name: {sampleData}</p>
          )}
        </section>

        {/* AI Study Assistant (Placeholder) */}
        <section className="p-6 border rounded-lg shadow-sm bg-gray-50">
          <h2 className="text-2xl font-semibold mb-2">🤖 AI Study Assistant</h2>
          <p className="text-gray-600">
            Coming soon: Ask questions, summarize notes, and boost your learning
            with free AI integrations.
          </p>
        </section>

        {/* Shared Resources: Majors → Courses → Resources */}
        <section className="p-6 border rounded-lg shadow-sm bg-gray-50 md:col-span-2">
          <h2 className="text-2xl font-semibold mb-4">📚 Shared Resources</h2>

          {/* Majors */}
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2">Major</h3>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full cursor-pointer">
              Computer Science
            </span>
          </div>

          {/* Courses */}
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2">Courses</h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full cursor-pointer">
                Data Structures
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full cursor-pointer">
                Algorithms
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full cursor-pointer">
                Operating Systems
              </span>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-xl font-semibold mb-2">Resources</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li>Introduction to Arrays (PDF)</li>
              <li>Linked List Notes (Text)</li>
              <li>Sorting Algorithms Summary (PDF)</li>
            </ul>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="mt-12 text-sm text-gray-500 flex flex-col items-center space-y-2">
        <p>© {new Date().getFullYear()} StudyShare.AI — Study Smarter. Share Better. Together with AI.</p>
        <div className="flex space-x-4">
          <a
            href="https://github.com/umer-exe"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 hover:text-gray-900"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/umer-malik28"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 hover:text-gray-900"
          >
            LinkedIn
          </a>
        </div>
      </footer>
    </main>
  );
}
