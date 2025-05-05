import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { getSession } from "@/features/users/actions/session";
import DashboardComponent from "@/components/DashboardLayout";
import { UserRole } from "@/types";
import { Toaster } from "react-hot-toast";

const prisma = new PrismaClient();

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get session and user role
  const session = await getSession();
  console.log("Session retrieved:", session);
  if (!session || !session.userId) {
    console.log("No session or userId, redirecting to /login");
    redirect("/login"); // Redirect to login if no session
  }

  const user = await prisma.user.findUnique({
    where: { userId: session.userId as string },
    select: { role: true },
  });
  console.log("User lookup result:", user);

  if (!user) {
    console.log("User not found, redirecting to /login");
    redirect("/login"); // Redirect if user not found
  }

  return (
    <DashboardComponent userRole={user.role as UserRole}>
      {children}
      <Toaster />
    </DashboardComponent>
  );
}
