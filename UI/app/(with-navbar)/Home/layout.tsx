import type { Metadata } from "next";
import { ReactNode } from "react"; 

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
      {children}
    </>
  );
}
