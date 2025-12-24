import type { Metadata } from "next";
import { ReactNode } from "react";
import Navbar from "@/components/Navbar/Navbar";

export const metadata: Metadata = {
  title: "Home",
  description: "an project",
};

type Props = {
  children: ReactNode;
};

export default function HomeLayout({ children }: Props) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
