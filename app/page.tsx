"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { LoadingScreen } from "@/components/ui";

export default function Home() {
  const { ready, currentUser } = useStore();
  const router = useRouter();
  useEffect(() => {
    if (ready) router.replace(currentUser ? "/dashboard" : "/login");
  }, [ready, currentUser, router]);
  return <LoadingScreen />;
}
