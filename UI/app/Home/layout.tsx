import type { Metadata } from "next";  
import Navbar from "@/components/Navbar/Navbar"; 

 

export const metadata: Metadata = {
  title: "Home",
  description: "an project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light-mode">
      <body      
      >
        <Navbar/>
         
        {children}
      </body>
    </html>
  );
}
