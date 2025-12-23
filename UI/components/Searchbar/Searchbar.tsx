"use client";

import { useState } from "react";
import { Search } from "lucide-react";

const Searchbar: React.FC = () => {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <div className="flex items-center relative">
      {/* Desktop Search */}
      <input
        type="text"
        placeholder="Search resources..."
        className="hidden md:flex text-[var(--text-primary)] bg-[var(--bg-tertiary)] border border-[var(--border-color)] w-120 p-[6px] pl-3 rounded-lg placeholder:text-[var(--text-secondary)] text-[16px]"
      />

      {/* Mobile Icon */}
      <button
        className="block md:hidden p-2 rounded transition"
        onClick={() => setShowSearch((prev) => !prev)}
      >
        <Search className="text-[var(--accent-color)] size-5.5 mx-2" />
      </button>

      {/* Mobile Search */}
      {showSearch && (
        <input
          type="text"
          placeholder="Search..."
          autoFocus
          className="absolute top-14 right-2 text-[var(--text-primary)] bg-[var(--bg-tertiary)]
            border border-[var(--border-color)] px-3 py-2 rounded
            placeholder:text-[var(--text-secondary)] md:hidden"
        />
      )}
    </div>
  );
};

export default Searchbar;
