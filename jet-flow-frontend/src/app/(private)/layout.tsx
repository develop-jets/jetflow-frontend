'use client';

import { ReactNode, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import FlowLoader from '../../components/loader/FlowLoader';

export default function PrivateLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (!data?.session) {
        router.replace("/"); // redirect if not logged in
      } else {
        setLoading(false);
      }
    };
    checkSession();
  }, [router]);

  if (loading) return <FlowLoader />; // You can replace with a spinner

  return <>{children}</>;
}