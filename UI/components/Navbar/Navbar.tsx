"use client";
import { useState, useEffect, useRef } from "react"; 
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import Searchbar from "../Searchbar/Searchbar";
import HamBurger from "../Hamburger/Hamburger";
import { ThemeToggle } from "../Theme/ThemeToggle";
import logodark from "@/public/assets/snera-dark-remove-bg.png";
import logolight from "@/public/assets/Snera-canva-2__1_-crop-removebg-light.png";
import { getAvatarName } from "@/utils/getAvatarName"; 
import userApi from "@/lib/api/userApi";


const Navbar = () => {
  const router = useRouter(); 
   const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false); 

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await userApi.getMe();
        setUser(res.data);
        console.log("Fetched user data:", res.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);
 const handleLogout = async () => {
  try {
         await userApi.logout();
        } catch (err) {
          console.error("Logout API error:", err);
        } finally {          
          setUser(null);   
    router.replace("/");
  }
};


  if (!mounted) return null;  

  return (
    <div>
      <div className="fixed top-0 left-0 w-full bg-[var(--bg-secondary)] border-b border-[var(--border-color)]  flex items-center justify-between  z-50 h-14 px-2">
        <HamBurger />
        <div className=" text-[#f2ffff] mx-6 text-lg font-medium md:absolute left-0   ">
          <Image
            width={681}
            height={192}
            className="min-w-27 max-w-27"
            src={theme === "dark" ? logolight : logodark}
            alt="SNERA"
            priority
          />
        </div>
        <div className="flex justify-between items-center md:w-[73vw] ">
          <Searchbar />
          <div className="  flex justify-end items-center ">
            <ThemeToggle />

            <div
              className="dropdown curser-pointer "
              onClick={() => router.push("/createProject")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                strokeWidth="2"
                fill="#ffffff"
                stroke="none"
                className="fill-[var(--icon-color)] hover:fill-[var(--icon-hover)] inline-block size-5.5 my-1.5 w-6 mx-2  mr-2 cursor-pointer"
              >
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
              </svg>
            </div>
            <div className="dropdown">
              <div className="relative group w-10">
                {/* Profile Avatar */}
                <div className="btn btn-ghost btn-circle avatar cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-[var(--accent-color)] text-[var(--text-forth)] flex items-center justify-center font-semibold text-md cursor-pointer">
                    {getAvatarName(user?.name)}
                  </div>
                </div>

                {/* Hover Box */}

                <div
                  className="absolute right-2 top-12 border-[.5px] border-[var(--border-color)] w-60 bg-[var(--bg-tertiary)] text-[var(--text-primary)] rounded    opacity-0 invisible 
                                group-hover:opacity-100 group-hover:visible
                                 transition-all duration-200 z-10"
                >
                  { user &&  <div>
                    <div className="flex gap-5 h-16  p-2  m-3 border-b border-[var(--border-color)]">
                      <div className="w-12 h-12 rounded-full bg-[var(--accent-color)] text-[var(--text-forth)] flex items-center justify-center font-semibold text-lg">
                        {getAvatarName(user.name)}
                      </div>

                      <div className="flex flex-col">
                        <div className=" font-semibold text-sm" >
                          {loading ? "please wait..." :
                            user.name}
                        </div>
                        <div className="text-[12px] text-[var(--text-secondary)]">
                          {" "}
                          {loading ? "please wait..." : user.email}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 mx-3  pb-4 border-b border-[var(--border-color)]">
                      <div className="flex justify-between">
                        <div className=" text-[var(--text-secondary)] text-sm">
                          Projects
                        </div>
                        <div className=" text-[14px] text-[var(--text-primary)]  font-bold">
                         {loading ? "please wait..." : user.projectsCount}
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <div className=" text-[var(--text-secondary)]  text-sm">
                          Connections
                        </div>
                        <div className=" text-[14px] text-[var(--text-primary)]  font-bold">
                         {loading ? "please wait..." : user.connectionsCount}
                         
                        </div>
                      </div>
                      <div className="flex justify-between ">
                        <div className=" text-[var(--text-secondary)] text-sm ">
                          Teams
                        </div>
                        <div className=" text-[14px] text-[var(--text-primary)]  font-bold">
                          8
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col  ">
                      <Link
                        href="/createProject"
                        className="flex gap-3 items-center h-10 hover:bg-[var(--bg-secondary)] transition-[.2s] p-3 text-[var(--text-primary)]"
                      >
                        <svg
                          className="size-4 fill-[var(--text-secondary)]"
                          viewBox="0 0 24 24"
                        >
                          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                        </svg>
                        <p>Create New</p>
                      </Link>

                      <div className="flex gap-3 items-center h-10 hover:bg-[var(--bg-secondary)] transition-[.2s] p-3 text-[var(--text-primary)]">
                        <svg
                          className="size-4 fill-[var(--text-secondary)]"
                          viewBox="0 0 24 24"
                        >
                          {" "}
                          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
                        </svg>
                        <p>Settings</p>
                      </div>

                      <Link href="/Profile">
                        <div className="btn box-shadow-none underline text-sm bg-black hover:bg-[#404040] border-none outline-none text-white p-3 m-3 cursor-pointer rounded text-center">
                          My Profile
                        </div>
                      </Link>

                      <button
                        className="  flex flex-row justify-center items-center  px-2 py-2 rounded-md text-[var(--text-primary)] border font-medium m-3 border-[var(--border-color)] bg-transparent transition-[.3s] hover:bg-[var(--error2-color)] hover:border-[var(--error-color)] hover:text-[var(--error-color)]  "
                        onClick= {handleLogout}
                      >
                        <svg
                          className="size-4 fill-[var(--text-secondary)] mx-2"
                          viewBox="0 0 24 24"
                        >
                          <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
                        </svg>
                        Sign Out
                      </button>
                    </div>
                  </div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
