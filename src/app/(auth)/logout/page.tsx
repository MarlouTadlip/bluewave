"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { destroySession } from "@/features/users/actions/session";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    // Simulate logout process
    const logout = async () => {
      await destroySession();
      // Here you would typically make an API call to invalidate the session
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Redirect to home page after logout
      router.push("/");
    };

    logout();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="text-center">
        <LogOut className="mx-auto h-12 w-12 text-indigo-500 mb-4 animate-pulse" />
        <h1 className="text-2xl font-bold mb-2 text-primary">
          Logging you out...
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Thank you for your contribution to BlueWave!
        </p>
      </div>
    </div>
  );
}
