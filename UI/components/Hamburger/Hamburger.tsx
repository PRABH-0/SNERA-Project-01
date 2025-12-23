"use client"
import { useState } from "react"
import Sidebar from "../Sidebar/Sidebar"
const HamBurger: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div>
      <svg
        onClick={() => setShowSidebar(!showSidebar)}
        xmlns="http://www.w3.org/2000/svg"
        height="28"
        viewBox="0 0 24 24"
        width="28"
        className="inline-block md:hidden mx-2 cursor-pointer"
      >
        <path
          d="M20 5H4a1 1 0 000 2h16a1 1 0 100-2Zm0 6H4a1 1 0 000 2h16a1 1 0 000-2Zm0 6H4a1 1 0 000 2h16a1 1 0 000-2Z" 
          className="fill-[var(--accent-hover)]"
        ></path>
      </svg>

      {/* Sidebar show/hide */}
      <Sidebar show={showSidebar} setShowSidebar={setShowSidebar} />
    </div>
  );
};

export default HamBurger;