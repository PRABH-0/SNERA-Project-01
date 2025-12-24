"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import Searchbar from "../Searchbar/Searchbar";
import HamBurger from "../Hamburger/Hamburger";
import {ThemeToggle} from "../Theme/ThemeToggle";
import logodark from "@/assets/snera-dark-remove-bg.png";
import logolight from "@/assets/Snera-canva-2__1_-crop-removebg-light.png";
import { CreatePostIcon } from "../Sidebar/icons";
import { getAvatarName } from "@/utils/getAvatarName"; 
import { useUser } from "@/hooks/useUser";
import { logout } from "@/lib/auth";

const Navbar = () => {
  const router = useRouter(); 
  const { user, setUser, loadingUser } = useUser();
  const { theme } = useTheme();
  

  return (
    <div>
      <div className="fixed top-0 left-0 w-full bg-[var(--bg-secondary)] border-b border-[var(--border-color)]  flex items-center justify-between  z-50 h-16 px-2">
        <HamBurger />
        <div className=" text-[#f2ffff] mx-6 text-lg font-medium md:absolute left-0   ">
          <Image
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
              onClick={() => router.push("/CreatePost")}
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
                  <div className="w-9 h-9 rounded-full bg-[var(--accent-color)] text-[var(--text-forth)] flex items-center justify-center font-semibold text-lg cursor-pointer">
                    {getAvatarName(user?.userName)}
                  </div>
                </div>

                {/* Hover Box */}

                <div
                  className="absolute right-2 top-12 border-[.5px] border-[var(--border-color)] w-65 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded    opacity-0 invisible 
                                group-hover:opacity-100 group-hover:visible
                                 transition-all duration-200 z-10"
                >
                  <div>
                    <div className="flex gap-5 h-16  p-2  m-3 border-b border-[var(--border-color)]">
                      <div className="w-10 h-10 rounded-full bg-[var(--accent-color)] text-[var(--text-forth)] flex items-center justify-center font-semibold text-lg">
                        {getAvatarName(user?.userName)}
                      </div>

                      <div className="flex flex-col">
                        <div className=" font-semibold">
                          {!loadingUser &&
                            (user?.userName || user?.email || "")}{" "}
                        </div>
                        <div className="text-[12px] text-[var(--text-secondary)]">
                          {" "}
                          {!loadingUser && (user?.email || "")}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 m-3   border-b border-[var(--border-color)]">
                      <div className="flex justify-between">
                        <div className=" text-[var(--text-secondary)] text-sm">
                          Projects
                        </div>
                        <div className=" text-[14px] text-[var(--text-primary)]  font-bold">
                          12
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <div className=" text-[var(--text-secondary)]  text-sm">
                          Connections
                        </div>
                        <div className=" text-[14px] text-[var(--text-primary)]  font-bold">
                          24
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
                      <div className="flex gap-3 items-center h-10 hover:bg-[var(--bg-secondary)] transition-[.2s] p-3 mt-1.5 text-[var(--text-primary)]">
                        <svg
                          className="size-4 fill-[var(--text-secondary)]"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                        <p>My Profile</p>
                      </div>
 
                      <Link
                        href="/CreatePost"
                        className="flex gap-3 items-center h-10 hover:bg-[var(--bg-tertiary)] transition-[.2s] p-3 text-[var(--text-primary)]"
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
                      <div className=" btn box-shadow-none bg-black hover:bg-[#404040] border-none outline-none text-white p-3 m-3">
                        View Full Profile
                      </div>
                      <button
                        className="w-full text-center px-2 py-2 rounded hover:bg-[var(--bg-tertiary)] text-red-500 "
                        onClick={() => {
                          localStorage.removeItem("token");
                          localStorage.removeItem("user");

                          setUser(null);
                           
                          window.location.href = "/";
                        }}
                      >
                        Logout
                      </button>
                    </div>
                  </div>
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
