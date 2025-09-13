"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient"; // adjust path if needed
import { User } from "@supabase/supabase-js";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Fetch initial user
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    // Subscribe to auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return user;
}
