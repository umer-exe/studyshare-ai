"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function Home() {
  const [message, setMessage] = useState("Connecting...");

  useEffect(() => {
    const testSupabase = async () => {
      try {
        const { data, error } = await supabase
          .from("test_table")
          .select("*");

        if (error) throw error;

        console.log("Supabase data:", data); // 👈 will show in console
        setMessage("✅ Connected! Data: " + JSON.stringify(data));
      } catch (err) {
        console.error(err);
        setMessage("❌ Supabase connection failed. Check console.");
      }
    };

    testSupabase();
  }, []);

  return <main className="p-6">{message}</main>;
}
