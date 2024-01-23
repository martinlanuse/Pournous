// "use client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
// import { useSession } from "next-auth/react";
// import { useEffect } from "react";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  // const { data: session } = useSession();
  const session = await getServerSession(authOptions);
  if (session?.user) return redirect("/home");

  // useEffect(() => {
  //   if (session?.user) return redirect("/home");
  // }, [session?.user]);

  return <>{children}</>;
};

export default Layout;
