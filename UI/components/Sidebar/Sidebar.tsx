"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  MatchIcon,
  ChatIcon,
  ProfileIcon,
  ProjectsIcon,
  TeamsIcon,
  FeedbackIcon,
  AboutIcon,
} from "./icons";

interface SidebarProps {
  show: boolean;
  setShowSidebar: (show: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ show, setShowSidebar }) => {
  const pathname = usePathname();

  const navItems = [
    { href: "/Home", label: "Home", icon: HomeIcon },
    { href: "/Match", label: "Match", icon: MatchIcon },
    { href: "/Chat", label: "Chat", icon: ChatIcon },
    { href: "/Profile", label: "Profile", icon: ProfileIcon },
    { href: "/Projects", label: "Projects", icon: ProjectsIcon },
    { href: "/Teams", label: "Teams", icon: TeamsIcon },
    { href: "/Feedback", label: "Feedback", icon: FeedbackIcon },
    { href: "/About", label: "About", icon: AboutIcon },
  ];

  return (
    <>
      {show && (
        <div
          onClick={() => setShowSidebar(false)}
          className="fixed inset-0 md:hidden z-40"
        />
      )}

      <div
        className={`fixed top-14 bottom-0 left-0 w-12 bg-[var(--bg-secondary)] z-50
        border-r border-[var(--border-color)] transition-transform duration-300
        ${show ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:w-12`}
      >
        <ul className="flex flex-col gap-3 mt-4">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;

            return (
              <li key={href}>
                <Link
                  href={href}
                  className="tooltip tooltip-right mx-3 my-1"
                  data-tip={label}
                  onClick={() => setShowSidebar(false)}
                >
                  <Icon active={active} />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
