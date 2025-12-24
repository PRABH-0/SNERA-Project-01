"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ThemeToggle } from "../Theme/ThemeToggle";
import Sign from "@/components/Sign/Sign";
import { useTheme } from "next-themes";

import logodark from "@/assets/snera-dark-remove-bg.png";
import logolight from "@/assets/Snera-canva-2__1_-crop-removebg-light.png";
const Hero: React.FC = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [defaultTab, setDefaultTab] = useState<"signin" | "getstarted">(
    "signin"
  );

  const openAuth = (tab: "signin" | "getstarted") => {
    setDefaultTab(tab);
    setIsAuthOpen(true);
  };

  return (
    <>
      <div>
        <nav>
          <div className="navbar    sticky top-0 h-22">
            <header className="flex justify-between items-center py-[20px] px-[40px] border-b shadow-lg border-[var(--border-color)] w-full">
              <div className="flex-1 flex justify-between  ">
                <Image
                  src={theme === "dark" ? logolight : logodark}
                  alt="SNERA Logo"
                  width={100}
                  height={38}
                  className="cursor-pointer transition-all duration-300"
                  priority
                />

                <div className="flex gap-4 items-center">
                  <ThemeToggle />
                  <button
                    onClick={() => openAuth("signin")}
                    className="bg-[var(--accent-color)] text-[var(--button-text)] cursor-pointer border-none  h-9 w-20 transition-all duration-300 ease-in-out  hover:bg-[var(--accent-hover)] hover:-translate-y-[2px] hover:shadow-[0_6px_16px_var(--shadow-color)]"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => openAuth("getstarted")}
                    className="bg-[var(--accent-color)] text-[var(--button-text)] cursor-pointer border-none h-9 w-26  transition-all duration-300 ease-in-out hover:bg-[var(--accent-hover)] hover:-translate-y-[2px] hover:shadow-[0_6px_16px_var(--shadow-color)]"
                  >
                    Get Started
                  </button>
                </div>
              </div>
            </header>
          </div>
        </nav>
        <div className="text-center   my-20 mb-40 ">
          <h1 className="text-[var(--text-primary)]  text-[3.50rem]  ">
            Where Skills Find Their Missing Piece
          </h1>
          <p className="text-[var(--text-secondary)] text-2xl mx-60 mb-14 mt-4">
            The collaboration platform where developers and designers unite to
            build real projects, gain experience, and create something greater
            together.
          </p>
          <button
            onClick={() => openAuth("getstarted")}
            className="bg-[var(--accent-color)] text-[var(--button-text)] border-none px-[30px] py-[12px] text-[16px] cursor-pointer transition-all duration-300 ease-in-out hover:bg-[var(--accent-hover)] hover:-translate-y-[2px] hover:shadow-[0_6px_16px_var(--shadow-color)] font-semibold mt-10 "
          >
            Start Building Today
          </button>
          <p className="my-2 text-[var(--text-secondary)] ">
            Join thousands of developers already collaborating
          </p>
        </div>
        <section
          className="relative min-h-screen bg-[var(--bg-section)] text-[var(--text-primary)] py-[50px] px-[40px] pb-0 
              before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 
              before:h-[20px] before:bg-gradient-to-b before:from-[var(--bg-primary)] before:to-[var(--bg-section)]"
        >
          <div className="  w-[94vw] m-auto ">
            <section className="relative  pb-0 p-[40px]  bg-transparent rounded-[12px] border border-[var(--section-border)] shadow-[0_4px_12px_var(--shadow-color)]">
              <h1 className="text-4xl font-bold pt-10 text-center">
                About SNERA
              </h1>
              <p className="text-lg py-10 text-[var(--text-secondary)]">
                SNERA is a revolutionary platform designed to bridge the gap
                between learning and real-world application. We connect talented
                individuals with complementary skills to collaborate on
                meaningful projects that benefit everyone involved.
              </p>
              <h2 className="text-2xl font-bold  ">What SNERA Does</h2>
              <p className="text-lg py-5 text-[var(--text-secondary)]">
                Our platform matches developers, designers, and other tech
                professionals to work together on projects ranging from
                portfolio pieces to real client work. We provide the tools,
                structure, and community support needed to turn ideas into
                finished products while building valuable experience.
              </p>
              <h2 className="text-2xl font-bold">Who Benefits from SNERA</h2>
              <p className="text-lg py-5 text-[var(--text-secondary)]">
                Students and recent graduates can build impressive portfolios
                and gain practical experience. Experienced professionals can
                find collaborators for side projects or explore new
                technologies. Small businesses can access affordable development
                services while supporting emerging talent.
              </p>
              <h2 className="text-2xl font-bold">How It Works</h2>
              <p className="text-lg py-5 text-[var(--text-secondary)]">
                Users create profiles highlighting their skills and interests.
                Our matching algorithm suggests compatible teammates based on
                project requirements and skill compatibility. Teams work
                together using our collaboration tools, with options to
                transition from learning projects to paid client work as they
                gain experience.
              </p>
            </section>
          </div>

          <div
            className="
                            relative h-px my-[60px]
                            bg-[linear-gradient(to_right,transparent,var(--section-border),transparent)]
                            before:content-[''] before:absolute before:top-[-10px] before:left-1/2 before:-translate-x-1/2
                            before:w-[40px] before:h-[20px] before:bg-[var(--bg-section)] before:z-[1]
                            after:content-['✦'] after:absolute after:top-[-18px] after:left-1/2 after:-translate-x-1/2
                            after:text-[24px] after:text-[var(--accent-color)] after:bg-[var(--bg-section)]
                            after:px-[10px] after:z-[2]
                        "
          ></div>
          <div className="grid [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))] gap-[30px] my-[60px] mx-6">
            <div
              className="
                                p-[30px]
                                border border-[var(--border-color)]
                                rounded-[8px]
                                bg-[var(--card-bg)]
                                text-[var(--text-primary)]
                                transition-all duration-300 ease-in-out
                                cursor-pointer
                                hover:-translate-y-[8px]
                                hover:shadow-[0_12px_30px_var(--shadow-color)]
                                hover:border-[var(--text-secondary)]
                            "
            >
              <h4 className="mb-[15px] text-[20px] text-[var(--text-primary) font-extrabold ]">
                For Students & Freshers
              </h4>
              <p>
                Find technical partners, build standout portfolio projects, and
                gain the teamwork experience employers crave. Work on real-world
                challenges and develop the soft skills that are essential in
                today's workplace.
              </p>
            </div>
            <div
              className="
                            p-[30px]
                            border border-[var(--border-color)]
                            rounded-[8px]
                            bg-[var(--card-bg)]
                            text-[var(--text-primary)]
                            transition-all duration-300 ease-in-out
                            cursor-pointer
                            hover:-translate-y-[8px]
                            hover:shadow-[0_12px_30px_var(--shadow-color)]
                            hover:border-[var(--text-secondary)]
                        "
            >
              <h4 className="mb-[15px] text-[20px] text-[var(--text-primary) font-extrabold ]">
                For Small Businesses
              </h4>
              <p>
                Get your app or website developed by skilled teams at affordable
                rates while supporting emerging talent. Access a diverse pool of
                creative minds ready to bring your vision to life with fresh
                perspectives.
              </p>
            </div>
            <div
              className="
                            p-[30px]
                            border border-[var(--border-color)]
                            rounded-[8px]
                            bg-[var(--card-bg)]
                            text-[var(--text-primary)]
                            transition-all duration-300 ease-in-out
                            cursor-pointer
                            hover:-translate-y-[8px]
                            hover:shadow-[0_12px_30px_var(--shadow-color)]
                            hover:border-[var(--text-secondary)]
                        "
            >
              <h4 className="mb-[15px] text-[20px] text-[var(--text-primary) font-extrabold ]">
                Learn & Earn
              </h4>
              <p>
                Start with learning collaborations, then progress to paid client
                projects as your team gains experience. Build your reputation
                and transition from learning to earning in a supportive
                environment.
              </p>
            </div>
          </div>
          <div className="text-center pt-[60px] px-[40px] pb-[40px] ">
            <h2 className="mb-[20px] text-[var(--text-primary)] text-[32px] font-bold ">
              Ready to Start Your Journey?
            </h2>
            <p className="mb-[30px] text-[var(--text-secondary)] text-[18px] ">
              Join SNERA today and discover the power of collaborative
              development.
            </p>
            <button
              onClick={() => openAuth("getstarted")}
              className="px-[45px] py-[16px] text-[18px] bg-[var(--accent-color)] text-[var(--button-text)] border-2 border-[var(--accent-color)] transition-all duration-300 ease-in-out hover:bg-transparent hover:text-[var(--accent-color)] hover:border-[var(--accent-color)] hover:-translate-y-0.5 "
            >
              Join Now - It's Free
            </button>
          </div>
          <footer className="text-center py-[20px] px-[40px] text-[var(--text-tertiary)] border-t border-[var(--border-color)] mt-[10px]">
            <p className="mb-[10px] text-[14px]">
              SNERA - From the Greek "Synergy": Creating together what we cannot
              create alone.
            </p>
            <div className="footer-links">
              <a
                href="#"
                className="mx-[10px] text-[14px] text-[var(--text-tertiary)] no-underline transition-colors duration-300 ease-in-out hover:text-[var(--text-primary)]"
              >
                About
              </a>
              <a
                href="#"
                className="mx-[10px] text-[14px] text-[var(--text-tertiary)] no-underline transition-colors duration-300 ease-in-out hover:text-[var(--text-primary)]"
              >
                Contact
              </a>
              <a
                href="#"
                className="mx-[10px] text-[14px] text-[var(--text-tertiary)] no-underline transition-colors duration-300 ease-in-out hover:text-[var(--text-primary)]"
              >
                Privacy
              </a>
              <a
                href="#"
                className="mx-[10px] text-[14px] text-[var(--text-tertiary)] no-underline transition-colors duration-300 ease-in-out hover:text-[var(--text-primary)]"
              >
                Terms
              </a>
              <a
                href="#"
                className="mx-[10px] text-[14px] text-[var(--text-tertiary)] no-underline transition-colors duration-300 ease-in-out hover:text-[var(--text-primary)]"
              >
                blog
              </a>
            </div>
          </footer>
        </section>

        {/* <Sign
                isOpen={isAuthOpen}
                onClose={() => setIsAuthOpen(false)}
                defaultTab={defaultTab}
            /> */}
      </div>
    </>
  );
};

export default Hero;
