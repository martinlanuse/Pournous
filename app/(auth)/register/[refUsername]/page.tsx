"use client";

import Register from "@/components/auth/Register";
import { useParams } from "next/navigation";
import React from "react";

const Page = () => {
  const refUsername = useParams().refUsername;
  return <Register refUsername={refUsername} />;
};

export default Page;
